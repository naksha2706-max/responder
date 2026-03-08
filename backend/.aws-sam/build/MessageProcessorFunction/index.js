const { v4: uuidv4 } = require('uuid');
const { createSession, getSession, updateSession, saveMessage, getRecentMessages } = require('../shared/dynamo');
const { classifyCrisis, requiresSafetyOverride, getSafetyOverrideResponse } = require('./bedrock');
const { getResourcesForCrisis } = require('../shared/resources');

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body);
    const { message, sessionId, language = 'en' } = body;

    // Validate input
    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Get or create session
    let session;
    if (sessionId) {
      session = await getSession(sessionId);
    }

    if (!session) {
      const newSessionId = uuidv4();
      session = await createSession(newSessionId, language);
    }

    // Save user message
    await saveMessage(session.sessionId, 'student', message, language);

    // Get conversation history for context
    const conversationHistory = await getRecentMessages(session.sessionId, 5);

    // Call Bedrock for crisis classification and response
    let bedrockResponse;
    try {
      bedrockResponse = await classifyCrisis(message, language, conversationHistory);
    } catch (bedrockError) {
      console.error('Bedrock error:', bedrockError);
      
      // Fallback response if Bedrock fails
      bedrockResponse = {
        language: language,
        crisisType: 'mental_health',
        severityLevel: 2,
        response: language === 'en'
          ? 'Thank you for reaching out. I\'m here to help. Can you tell me more about what\'s happening?'
          : 'संपर्क करने के लिए धन्यवाद। मैं मदद के लिए यहां हूं। क्या आप मुझे और बता सकते हैं कि क्या हो रहा है?',
        immediateSteps: [
          language === 'en' ? 'Take a deep breath' : 'एक गहरी सांस लें',
          language === 'en' ? 'You\'re not alone' : 'आप अकेले नहीं हैं',
          language === 'en' ? 'Help is available' : 'मदद उपलब्ध है'
        ],
        recommendedResource: 'counselor',
        reasoning: 'Fallback response due to service error'
      };
    }

    // Check if safety override is needed
    if (requiresSafetyOverride(bedrockResponse.crisisType, bedrockResponse.severityLevel)) {
      const overrideResponse = getSafetyOverrideResponse(bedrockResponse.crisisType, language);
      if (overrideResponse) {
        bedrockResponse.response = overrideResponse;
      }
    }

    // Get recommended resources
    const resources = getResourcesForCrisis(bedrockResponse.crisisType, bedrockResponse.severityLevel);

    // Update session with crisis info
    await updateSession(session.sessionId, {
      crisisType: bedrockResponse.crisisType,
      severityLevel: bedrockResponse.severityLevel,
      language: bedrockResponse.language
    });

    // Save system response
    await saveMessage(
      session.sessionId,
      'system',
      bedrockResponse.response,
      bedrockResponse.language,
      {
        crisisType: bedrockResponse.crisisType,
        severityLevel: bedrockResponse.severityLevel,
        immediateSteps: bedrockResponse.immediateSteps
      }
    );

    // Prepare response
    const response = {
      sessionId: session.sessionId,
      response: bedrockResponse.response,
      crisisType: bedrockResponse.crisisType,
      severityLevel: bedrockResponse.severityLevel,
      immediateSteps: bedrockResponse.immediateSteps,
      resources: resources,
      language: bedrockResponse.language
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
