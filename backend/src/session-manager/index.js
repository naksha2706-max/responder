const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, DeleteCommand, QueryCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const SESSIONS_TABLE = process.env.SESSIONS_TABLE;
const MESSAGES_TABLE = process.env.MESSAGES_TABLE;

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod, pathParameters } = event;
  const sessionId = pathParameters?.sessionId;

  try {
    if (httpMethod === 'GET') {
      return await getSession(sessionId);
    } else if (httpMethod === 'DELETE') {
      return await deleteSession(sessionId);
    } else {
      return {
        statusCode: 405,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

async function getSession(sessionId) {
  if (!sessionId) {
    return {
      statusCode: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Session ID is required' })
    };
  }

  try {
    // Get session metadata
    const sessionResult = await dynamoClient.send(new GetCommand({
      TableName: SESSIONS_TABLE,
      Key: { sessionId }
    }));

    if (!sessionResult.Item) {
      return {
        statusCode: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Session not found' })
      };
    }

    // Get all messages for this session
    const messagesResult = await dynamoClient.send(new QueryCommand({
      TableName: MESSAGES_TABLE,
      KeyConditionExpression: 'sessionId = :sessionId',
      ExpressionAttributeValues: {
        ':sessionId': sessionId
      },
      ScanIndexForward: true // Chronological order
    }));

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        session: sessionResult.Item,
        messages: messagesResult.Items || [],
        messageCount: messagesResult.Count || 0
      })
    };

  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
}

async function deleteSession(sessionId) {
  if (!sessionId) {
    return {
      statusCode: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Session ID is required' })
    };
  }

  try {
    // Get all messages for this session
    const messagesResult = await dynamoClient.send(new QueryCommand({
      TableName: MESSAGES_TABLE,
      KeyConditionExpression: 'sessionId = :sessionId',
      ExpressionAttributeValues: {
        ':sessionId': sessionId
      }
    }));

    // Delete all messages in batches
    const messages = messagesResult.Items || [];
    if (messages.length > 0) {
      const deleteRequests = messages.map(msg => ({
        DeleteRequest: {
          Key: {
            sessionId: msg.sessionId,
            timestamp: msg.timestamp
          }
        }
      }));

      // DynamoDB BatchWrite can handle max 25 items at a time
      for (let i = 0; i < deleteRequests.length; i += 25) {
        const batch = deleteRequests.slice(i, i + 25);
        await dynamoClient.send(new BatchWriteCommand({
          RequestItems: {
            [MESSAGES_TABLE]: batch
          }
        }));
      }
    }

    // Delete session
    await dynamoClient.send(new DeleteCommand({
      TableName: SESSIONS_TABLE,
      Key: { sessionId }
    }));

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Session and all associated data deleted successfully',
        sessionId,
        deletedMessages: messages.length
      })
    };

  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
}