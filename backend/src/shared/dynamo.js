const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

const SESSIONS_TABLE = process.env.SESSIONS_TABLE || 'responder-sessions';
const MESSAGES_TABLE = process.env.MESSAGES_TABLE || 'responder-messages';

/**
 * Create or update a session
 */
async function saveSession(sessionData) {
  const params = {
    TableName: SESSIONS_TABLE,
    Item: {
      sessionId: sessionData.sessionId,
      createdAt: sessionData.createdAt || Date.now(),
      lastActivityAt: Date.now(),
      language: sessionData.language || 'en',
      crisisType: sessionData.crisisType || null,
      severityLevel: sessionData.severityLevel || null,
      ttl: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
    }
  };

  try {
    await docClient.send(new PutCommand(params));
    console.log('Session saved:', sessionData.sessionId);
    return params.Item;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
}

/**
 * Get session by ID
 */
async function getSession(sessionId) {
  const params = {
    TableName: SESSIONS_TABLE,
    Key: { sessionId }
  };

  try {
    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
}

/**
 * Delete a session
 */
async function deleteSession(sessionId) {
  const params = {
    TableName: SESSIONS_TABLE,
    Key: { sessionId }
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log('Session deleted:', sessionId);
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
}

/**
 * Save a message to the messages table
 */
async function saveMessage(messageData) {
  const params = {
    TableName: MESSAGES_TABLE,
    Item: {
      sessionId: messageData.sessionId,
      timestamp: messageData.timestamp || Date.now(),
      messageId: messageData.messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: messageData.sender, // 'user' or 'system'
      content: messageData.content,
      language: messageData.language || 'en',
      crisisType: messageData.crisisType || null,
      severityLevel: messageData.severityLevel || null,
      ttl: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
    }
  };

  try {
    await docClient.send(new PutCommand(params));
    console.log('Message saved:', params.Item.messageId);
    return params.Item;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

/**
 * Get messages for a session
 */
async function getMessages(sessionId, limit = 50) {
  const params = {
    TableName: MESSAGES_TABLE,
    KeyConditionExpression: 'sessionId = :sessionId',
    ExpressionAttributeValues: {
      ':sessionId': sessionId
    },
    ScanIndexForward: true, // Sort by timestamp ascending
    Limit: limit
  };

  try {
    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

/**
 * Delete all messages for a session
 */
async function deleteMessages(sessionId) {
  try {
    // First, get all messages for the session
    const messages = await getMessages(sessionId, 1000);
    
    // Delete each message
    const deletePromises = messages.map(message => {
      const params = {
        TableName: MESSAGES_TABLE,
        Key: {
          sessionId: message.sessionId,
          timestamp: message.timestamp
        }
      };
      return docClient.send(new DeleteCommand(params));
    });

    await Promise.all(deletePromises);
    console.log(`Deleted ${messages.length} messages for session:`, sessionId);
    return messages.length;
  } catch (error) {
    console.error('Error deleting messages:', error);
    throw error;
  }
}

/**
 * Get session with recent messages (for context)
 */
async function getSessionWithMessages(sessionId, messageLimit = 10) {
  try {
    const [session, messages] = await Promise.all([
      getSession(sessionId),
      getMessages(sessionId, messageLimit)
    ]);

    return {
      session,
      messages: messages.slice(-messageLimit) // Get last N messages
    };
  } catch (error) {
    console.error('Error getting session with messages:', error);
    throw error;
  }
}

module.exports = {
  saveSession,
  getSession,
  deleteSession,
  saveMessage,
  getMessages,
  deleteMessages,
  getSessionWithMessages
};
