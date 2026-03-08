const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { getSystemPrompt } = require('../shared/prompts');

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'ap-south-1' });

/**
 * Invoke Amazon Bedrock with Claude 3 Haiku for crisis classification and response
 */
async function invokeBedrock(message, language, sessionHistory = []) {
  try {
    // Build conversation history for context
    const conversationContext = sessionHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.sender === 'user' ? 'Student' : 'AI'}: ${msg.content}`)
      .join('\n');

    // Get system prompt
    const systemPrompt = getSystemPrompt(language);

    // Build the prompt
    const prompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}Current student message: ${message}

Respond in JSON format with the following structure:
{
  "language": "${language}",
  "crisisType": "harassment|ragging|cyberbullying|mental_health|self_harm|physical_threat",
  "severityLevel": 1-4,
  "response": "Your empathetic response in ${language === 'en' ? 'English' : 'Hindi'}",
  "immediateSteps": ["Step 1", "Step 2", "Step 3"],
  "recommendedResource": "icc|anti_ragging_cell|counselor|police|helpline"
}`;

    // Prepare request for Claude 3 Haiku
    const requestBody = {
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
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    });

    console.log('Invoking Bedrock with model:', process.env.BEDROCK_MODEL_ID);

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    console.log('Bedrock response received');

    // Extract the response text
    const responseText = responseBody.content[0].text;

    // Parse JSON from response
    let parsedResponse;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
        responseText.match(/```\n([\s\S]*?)\n```/) ||
        [null, responseText];

      parsedResponse = JSON.parse(jsonMatch[1] || responseText);
    } catch (parseError) {
      console.error('Failed to parse Bedrock response as JSON:', parseError);

      // Fallback: Create a structured response from unstructured text
      parsedResponse = {
        language: language,
        crisisType: detectCrisisType(message),
        severityLevel: detectSeverityLevel(message),
        response: responseText,
        immediateSteps: ['Contact support resources', 'Stay safe', 'Reach out for help'],
        recommendedResource: 'counselor'
      };
    }

    // Validate and sanitize response
    return validateResponse(parsedResponse, language);

  } catch (error) {
    console.error('Error invoking Bedrock:', error);
    throw new Error(`Bedrock invocation failed: ${error.message}`, { cause: error });
  }
}

/**
 * Validate and sanitize Bedrock response
 */
function validateResponse(response, language) {
  const validCrisisTypes = ['harassment', 'ragging', 'cyberbullying', 'mental_health', 'self_harm', 'physical_threat'];
  const validResources = ['icc', 'anti_ragging_cell', 'counselor', 'police', 'helpline'];

  return {
    language: response.language || language,
    crisisType: validCrisisTypes.includes(response.crisisType) ? response.crisisType : 'mental_health',
    severityLevel: Math.min(Math.max(parseInt(response.severityLevel) || 2, 1), 4),
    response: response.response || (language === 'en'
      ? 'I understand you\'re going through a difficult time. Let me help you find the right support.'
      : 'मैं समझता हूं कि आप एक कठिन समय से गुजर रहे हैं। मुझे आपको सही सहायता खोजने में मदद करने दें।'),
    immediateSteps: Array.isArray(response.immediateSteps) ? response.immediateSteps : [],
    recommendedResource: validResources.includes(response.recommendedResource)
      ? response.recommendedResource
      : 'counselor'
  };
}

/**
 * Fallback crisis type detection using keywords
 */
function detectCrisisType(message) {
  const lowerMessage = message.toLowerCase();

  // Self-harm keywords (highest priority)
  if (lowerMessage.match(/suicide|kill myself|end my life|self harm|hurt myself|आत्महत्या|खुद को मार/)) {
    return 'self_harm';
  }

  // Physical threat keywords
  if (lowerMessage.match(/threat|violence|attack|hurt me|beat|physical|धमकी|हिंसा|मारपीट/)) {
    return 'physical_threat';
  }

  // Harassment keywords
  if (lowerMessage.match(/harass|sexual|inappropriate|touch|उत्पीड़न|यौन/)) {
    return 'harassment';
  }

  // Ragging keywords
  if (lowerMessage.match(/ragging|senior|bully|humiliate|रैगिंग|धमकाना/)) {
    return 'ragging';
  }

  // Cyberbullying keywords
  if (lowerMessage.match(/online|social media|cyber|troll|साइबर|ऑनलाइन/)) {
    return 'cyberbullying';
  }

  // Default to mental health
  return 'mental_health';
}

/**
 * Fallback severity level detection
 */
function detectSeverityLevel(message) {
  const lowerMessage = message.toLowerCase();

  // Level 4: Emergency keywords
  if (lowerMessage.match(/suicide|kill|die|emergency|immediate|now|आत्महत्या|मरना|तुरंत/)) {
    return 4;
  }

  // Level 3: High urgency keywords
  if (lowerMessage.match(/threat|danger|scared|afraid|help me|डर|खतरा|मदद/)) {
    return 3;
  }

  // Level 2: Moderate concern keywords
  if (lowerMessage.match(/worried|concerned|anxious|stressed|चिंतित|परेशान/)) {
    return 2;
  }

  // Level 1: Informational
  return 1;
}

module.exports = {
  invokeBedrock,
  validateResponse,
  detectCrisisType,
  detectSeverityLevel
};
