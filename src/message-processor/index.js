import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const SESSIONS_TABLE = process.env.SESSIONS_TABLE;
const MESSAGES_TABLE = process.env.MESSAGES_TABLE;
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID;

// Hardcoded resources for MVP
const RESOURCES = {
  harassment: {
    type: 'icc',
    name: 'Internal Complaints Committee (ICC)',
    phone: '1800-XXX-XXXX',
    email: 'icc@college.edu.in',
    availability: 'Monday-Friday, 9 AM - 5 PM',
    description: 'For harassment and POSH-related complaints'
  },
  ragging: {
    type: 'anti_ragging_cell',
    name: 'Anti-Ragging Cell',
    phone: '1800-180-5522',
    email: 'antiragging@college.edu.in',
    availability: '24x7',
    description: 'For ragging incidents and complaints'
  },
  cyberbullying: {
    type: 'counselor',
    name: 'College Counselor',
    phone: '1800-XXX-YYYY',
    email: 'counselor@college.edu.in',
    availability: 'Monday-Friday, 10 AM - 4 PM',
    description: 'For cyberbullying and online harassment support'
  },
  mental_health: {
    type: 'counselor',
    name: 'Mental Health Counselor',
    phone: '1800-XXX-YYYY',
    email: 'counselor@college.edu.in',
    availability: 'Monday-Friday, 10 AM - 4 PM',
    description: 'For mental health support and counseling'
  },
  self_harm: {
    type: 'helpline',
    name: 'National Suicide Prevention Helpline',
    phone: '9152987821',
    email: null,
    availability: '24x7',
    description: 'Immediate crisis support for self-harm and suicidal thoughts'
  },
  physical_threat: {
    type: 'police',
    name: 'Police Emergency Services',
    phone: '112',
    email: null,
    availability: '24x7',
    description: 'For immediate physical danger and emergencies'
  }
};

const SYSTEM_PROMPT = `You are a compassionate crisis support AI assistant for Indian students. Your role is to help students facing harassment, ragging, cyberbullying, mental health issues, self-harm thoughts, or physical threats.

CRITICAL INSTRUCTIONS:
1. Detect the language of the student's message (English or Hindi)
2. Classify the crisis type from: harassment, ragging, cyberbullying, mental_health, self_harm, physical_threat
3. Assign severity level (1-4):
   - Level 1: Informational query, no immediate danger
   - Level 2: Moderate concern, needs attention
   - Level 3: High risk, urgent attention needed
   - Level 4: EMERGENCY - self-harm, immediate danger, violence
4. Provide empathetic, supportive response in the SAME language as the student
5. Give immediate safety steps appropriate to the crisis
6. NEVER suggest actions that could escalate danger
7. For severity 4, ALWAYS recommend immediate emergency contact

SAFETY RULES:
- If student mentions self-harm, suicide, or immediate danger → severity 4
- If student is in physical danger right now → severity 4
- Always be empathetic, non-judgmental, and supportive
- Validate their feelings and courage to reach out
- Provide clear, actionable next steps

RESPONSE FORMAT (JSON only, no other text):
{
  "language": "en" or "hi",
  "crisisType": "one of the 6 types",
  "severityLevel": 1-4,
  "response": "Your empathetic response in the detected language",
  "immediateSteps": ["Step 1", "Step 2", "Step 3"],
  "recommendedResource": "harassment" or "ragging" or "cyberbullying" or "mental_health" or "self_harm" or "physical_threat"
}`;

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { message, sessionId, language } = body;

    if (!message || message.trim().length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Get or create session
    const currentSessionId = sessionId || uuidv4();
    let session = await getSession(currentSessionId);
    
    if (!session) {
      session = await createSession(currentSessionId, language || 'en');
    }

    // Get recent conversation history
    const recentMessages = await getRecentMessages(currentSessionId, 5);
    const conversationHistory = recentMessages.map(msg => 
      `${msg.sender === 'student' ? 'Student' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Call Bedrock for AI response
    const aiResponse = await invokeBedrockModel(message, conversationHistory);

    // Save student message
    await saveMessage(currentSessionId, 'student', message, aiResponse.language);

    // Save AI response
    await saveMessage(currentSessionId, 'system', aiResponse.response, aiResponse.language);

    // Update session with crisis info
    await updateSession(currentSessionId, {
      crisisType: aiResponse.crisisType,
      severityLevel: aiResponse.severityLevel,
      language: aiResponse.language,
      lastMessage: message.substring(0, 100)
    });

    // Get recommended resources
    const resources = getResources(aiResponse.recommendedResource, aiResponse.severityLevel);

    // Return response
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        sessionId: currentSessionId,
        response: aiResponse.response,
        language: aiResponse.language,
        crisisType: aiResponse.crisisType,
        severityLevel: aiResponse.severityLevel,
        immediateSteps: aiResponse.immediateSteps,
        resources: resources,
        timestamp: Date.now()
      })
    };

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

async function invokeBedrockModel(message, conversationHistory) {
  const prompt = `${SYSTEM_PROMPT}

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}
Current student message: ${message}

Respond with JSON only:`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  });

  try {
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract JSON from response
    const content = responseBody.content[0].text;
    
    // Try to parse JSON from the response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const aiResponse = JSON.parse(jsonMatch[0]);
    
    // Validate response structure
    if (!aiResponse.language || !aiResponse.crisisType || !aiResponse.severityLevel || !aiResponse.response) {
      throw new Error('Invalid response structure from Bedrock');
    }

    return aiResponse;

  } catch (error) {
    console.error('Bedrock invocation error:', error);
    
    // Fallback response if Bedrock fails
    return {
      language: 'en',
      crisisType: 'mental_health',
      severityLevel: 2,
      response: 'I understand you\'re reaching out for help. While I\'m having technical difficulties, please know that support is available. You can contact the counseling services or emergency helpline listed below.',
      immediateSteps: [
        'Take a deep breath',
        'You are not alone',
        'Contact one of the resources below for immediate support'
      ],
      recommendedResource: 'mental_health'
    };
  }
}

async function getSession(sessionId) {
  try {
    const result = await dynamoClient.send(new GetCommand({
      TableName: SESSIONS_TABLE,
      Key: { sessionId }
    }));
    return result.Item;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

async function createSession(sessionId, language) {
  const now = Date.now();
  const session = {
    sessionId,
    createdAt: now,
    lastActivityAt: now,
    language,
    isAnonymous: true,
    ttl: Math.floor(now / 1000) + (7 * 24 * 60 * 60) // 7 days for MVP
  };

  await dynamoClient.send(new PutCommand({
    TableName: SESSIONS_TABLE,
    Item: session
  }));

  return session;
}

async function updateSession(sessionId, updates) {
  const session = await getSession(sessionId);
  if (!session) return;

  const updatedSession = {
    ...session,
    ...updates,
    lastActivityAt: Date.now()
  };

  await dynamoClient.send(new PutCommand({
    TableName: SESSIONS_TABLE,
    Item: updatedSession
  }));
}

async function saveMessage(sessionId, sender, content, language) {
  const now = Date.now();
  const message = {
    sessionId,
    timestamp: now,
    messageId: uuidv4(),
    sender,
    content,
    language,
    ttl: Math.floor(now / 1000) + (7 * 24 * 60 * 60) // 7 days
  };

  await dynamoClient.send(new PutCommand({
    TableName: MESSAGES_TABLE,
    Item: message
  }));
}

async function getRecentMessages(sessionId, limit = 5) {
  try {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: MESSAGES_TABLE,
      KeyConditionExpression: 'sessionId = :sessionId',
      ExpressionAttributeValues: {
        ':sessionId': sessionId
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit
    }));

    return (result.Items || []).reverse(); // Reverse to chronological order
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

function getResources(crisisType, severityLevel) {
  const primaryResource = RESOURCES[crisisType];
  const resources = [primaryResource];

  // For severity 4, always add emergency contacts
  if (severityLevel === 4) {
    if (crisisType !== 'self_harm') {
      resources.push(RESOURCES.self_harm);
    }
    if (crisisType !== 'physical_threat') {
      resources.push(RESOURCES.physical_threat);
    }
  }

  // Add counselor as alternative for most cases
  if (crisisType !== 'mental_health' && crisisType !== 'self_harm') {
    resources.push(RESOURCES.mental_health);
  }

  return resources;
}
