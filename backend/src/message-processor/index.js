const { v4: uuidv4 } = require('uuid');
const { createSession, getSession, updateSession, saveMessage, getRecentMessages } = require('../shared/dynamo');
const { invokeBedrock } = require('./bedrock');
const { getSafetyOverrideResponse } = require('../shared/prompts');
const { getResourcesForCrisis } = require('../shared/resources');

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body);
    const { message, sessionId, language = 'en', turnCount = 1 } = body;

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

    // Get conversation history for context (last 8 messages)
    const conversationHistory = await getRecentMessages(session.sessionId, 8);

    // Call Bedrock for crisis classification and response
    let bedrockResponse;
    try {
      bedrockResponse = await invokeBedrock(message, language, conversationHistory, turnCount);
    } catch (bedrockError) {
      console.error('Bedrock error:', bedrockError);

      // Fallback response if Bedrock fails
      bedrockResponse = {
        language: language,
        crisisType: 'mental_health',
        severityLevel: 2,
        response: language === 'en'
          ? 'I hear you, and I want you to know you are not alone. I\'m here with you. Can you tell me a little more about what\'s been happening?'
          : 'मैं आपको सुन रहा हूं, और मैं चाहता हूं कि आप जानें कि आप अकेले नहीं हैं। मैं आपके साथ हूं।',
        immediateSteps: [
          language === 'en' ? 'You are safe here — take your time' : 'आप यहाँ सुरक्षित हैं',
          language === 'en' ? 'You are not alone in this' : 'आप इसमें अकेले नहीं हैं',
          language === 'en' ? 'Help is available when you are ready' : 'जब आप तैयार हों तो मदद उपलब्ध है'
        ],
        recommendedResource: 'counselor'
      };
    }

    // Safety override for severity 4 (self-harm / physical threat)
    if (bedrockResponse.severityLevel === 4 &&
        (bedrockResponse.crisisType === 'self_harm' || bedrockResponse.crisisType === 'physical_threat')) {
      const overrideText = getSafetyOverrideResponse(bedrockResponse.crisisType, language);
      if (overrideText) {
        bedrockResponse.response = overrideText;
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
