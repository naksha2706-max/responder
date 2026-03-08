const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { getSystemPrompt } = require('../shared/prompts');

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'ap-south-1' });

/**
 * Invoke Amazon Bedrock with Claude 3 Haiku for crisis classification and response
 */
async function invokeBedrock(message, language, sessionHistory = [], turnCount = 1) {
  try {
    // Get system prompt (properly passed as system field)
    const systemPrompt = getSystemPrompt(language);

    // Build conversation messages array (proper Claude multi-turn format)
    const conversationMessages = [];

    // Add previous turns from history (up to last 8 messages)
    const recentHistory = sessionHistory.slice(-8);
    for (const msg of recentHistory) {
      conversationMessages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.text || ''
      });
    }

    // Add the current user message with turn context
    const isEmpathyPhase = turnCount <= 3;
    const userMessageWithContext = `${message}

[SYSTEM CONTEXT - Do not mention this to student]
Current turn: ${turnCount}
Phase: ${isEmpathyPhase ? 'EMPATHY-FIRST (do NOT suggest reporting or Action Center)' : 'CLASSIFICATION-AND-ACTION'}

Respond with ONLY a valid JSON object (no markdown, no extra text):
{
  "language": "${language}",
  "crisisType": "harassment|ragging|cyberbullying|mental_health|self_harm|physical_threat",
  "severityLevel": 1,
  "response": "your empathetic response here in ${language === 'en' ? 'English' : 'Hindi'}",
  "immediateSteps": ["step1", "step2"],
  "recommendedResource": "icc|anti_ragging_cell|counselor|police|helpline"
}`;

    conversationMessages.push({
      role: 'user',
      content: userMessageWithContext
    });

    // Prepare request for Claude 3 Haiku with proper system field
    const requestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      temperature: 0.3, // Lower temp for more consistent JSON output
      system: systemPrompt,
      messages: conversationMessages
    };

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    });

    console.log(`Invoking Bedrock | Turn: ${turnCount} | Phase: ${isEmpathyPhase ? 'Empathy' : 'Action'}`);

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    console.log('Bedrock response received');

    // Extract the response text
    const responseText = responseBody.content[0].text;

    // Robust JSON extraction
    let parsedResponse;
    try {
      // Try direct parse first
      parsedResponse = JSON.parse(responseText.trim());
    } catch {
      try {
        // Try extracting from markdown code blocks
        const jsonMatch =
          responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
          responseText.match(/```\s*([\s\S]*?)\s*```/) ||
          responseText.match(/(\{[\s\S]*\})/);

        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[1].trim());
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse Bedrock response as JSON:', parseError.message);
        console.error('Raw response:', responseText.substring(0, 300));

        // Fallback: use the raw text as the response with keyword-based classification
        parsedResponse = {
          language: language,
          crisisType: detectCrisisType(message),
          severityLevel: detectSeverityLevel(message),
          response: extractReadableText(responseText),
          immediateSteps: generateImmediateSteps(detectCrisisType(message), language),
          recommendedResource: 'counselor'
        };
      }
    }

    // Validate and sanitize response
    return validateResponse(parsedResponse, language);

  } catch (error) {
    console.error('Error invoking Bedrock:', error);
    throw new Error(`Bedrock invocation failed: ${error.message}`, { cause: error });
  }
}

/**
 * Extract readable text from a messy AI response
 */
function extractReadableText(text) {
  // Remove JSON artifacts and code blocks
  return text
    .replace(/```(?:json)?/g, '')
    .replace(/\{[\s\S]*\}/g, '')
    .replace(/^\s*[\[\]{},"]+\s*/gm, '')
    .trim()
    .split('\n')
    .filter(line => line.trim().length > 10)
    .slice(0, 4)
    .join(' ')
    .trim() || 'I am here with you. You are not alone in this. Please tell me more about what happened.';
}

/**
 * Generate context-appropriate immediate steps
 */
function generateImmediateSteps(crisisType, language) {
  const steps = {
    en: {
      harassment: ['Document the incidents with dates and details', 'Contact the ICC (Internal Complaints Committee)', 'Speak to a trusted faculty member'],
      ragging: ['Report to the Anti-Ragging Cell immediately', 'Call the UGC helpline: 1800-180-5522', 'Document all incidents'],
      cyberbullying: ['Screenshot all evidence before blocking', 'Report to the platform and cyber cell', 'Contact a counselor for emotional support'],
      mental_health: ['Speak to your college counselor today', 'Reach out to iCall: 9152987821', 'Talk to a trusted friend or family member'],
      self_harm: ['Call iCall immediately: 9152987821', 'Reach emergency services: 112', 'Stay with someone you trust right now'],
      physical_threat: ['Move to a safe location immediately', 'Call emergency services: 112', 'Contact campus security']
    },
    hi: {
      harassment: ['तारीखों और विवरण के साथ घटनाओं का दस्तावेजीकरण करें', 'ICC (आंतरिक शिकायत समिति) से संपर्क करें', 'किसी भरोसेमंद फैकल्टी सदस्य से बात करें'],
      ragging: ['तुरंत एंटी-रैगिंग सेल को रिपोर्ट करें', 'UGC हेल्पलाइन पर कॉल करें: 1800-180-5522', 'सभी घटनाओं का दस्तावेजीकरण करें'],
      cyberbullying: ['ब्लॉक करने से पहले सभी सबूतों का स्क्रीनशॉट लें', 'प्लेटफॉर्म और साइबर सेल को रिपोर्ट करें', 'भावनात्मक समर्थन के लिए काउंसलर से संपर्क करें'],
      mental_health: ['आज ही अपने कॉलेज काउंसलर से बात करें', 'iCall से संपर्क करें: 9152987821', 'किसी भरोसेमंद दोस्त या परिवार से बात करें'],
      self_harm: ['तुरंत iCall पर कॉल करें: 9152987821', 'आपातकालीन सेवाओं पर कॉल करें: 112', 'अभी किसी भरोसेमंद के साथ रहें'],
      physical_threat: ['तुरंत सुरक्षित स्थान पर जाएं', 'आपातकालीन सेवाओं पर कॉल करें: 112', 'परिसर सुरक्षा से संपर्क करें']
    }
  };

  const langSteps = steps[language] || steps.en;
  return langSteps[crisisType] || langSteps.mental_health;
}

/**
 * Validate and sanitize Bedrock response
 */
function validateResponse(response, language) {
  const validCrisisTypes = ['harassment', 'ragging', 'cyberbullying', 'mental_health', 'self_harm', 'physical_threat'];
  const validResources = ['icc', 'anti_ragging_cell', 'counselor', 'police', 'helpline'];

  const crisisType = validCrisisTypes.includes(response.crisisType) ? response.crisisType : 'mental_health';

  return {
    language: response.language || language,
    crisisType,
    severityLevel: Math.min(Math.max(parseInt(response.severityLevel) || 2, 1), 4),
    response: response.response || (language === 'en'
      ? 'I understand you\'re going through a difficult time. You are not alone — I am here with you.'
      : 'मैं समझता हूं कि आप एक कठिन समय से गुजर रहे हैं। आप अकेले नहीं हैं — मैं आपके साथ हूं।'),
    immediateSteps: Array.isArray(response.immediateSteps) && response.immediateSteps.length > 0
      ? response.immediateSteps
      : generateImmediateSteps(crisisType, language),
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

  if (lowerMessage.match(/suicide|kill myself|end my life|self.?harm|hurt myself|आत्महत्या|खुद को मार/)) {
    return 'self_harm';
  }
  if (lowerMessage.match(/threat|violence|attack|beat|hit me|weapon|assault|धमकी|हिंसा|मारपीट/)) {
    return 'physical_threat';
  }
  if (lowerMessage.match(/harass|sexual|inappropriate|touch|molest|उत्पीड़न|यौन/)) {
    return 'harassment';
  }
  if (lowerMessage.match(/ragging|senior|bully|humiliate|force|रैगिंग|धमकाना|सीनियर/)) {
    return 'ragging';
  }
  if (lowerMessage.match(/online|social media|cyber|troll|post|message|साइबर|ऑनलाइन/)) {
    return 'cyberbullying';
  }

  return 'mental_health';
}

/**
 * Fallback severity level detection
 */
function detectSeverityLevel(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.match(/suicide|kill|die|dying|emergency|now|immediately|आत्महत्या|मरना|तुरंत/)) {
    return 4;
  }
  if (lowerMessage.match(/threat|danger|scared|afraid|help me|hurting|डर|खतरा|मदद/)) {
    return 3;
  }
  if (lowerMessage.match(/worried|concerned|anxious|stressed|confused|upset|चिंतित|परेशान/)) {
    return 2;
  }

  return 1;
}

module.exports = {
  invokeBedrock,
  validateResponse,
  detectCrisisType,
  detectSeverityLevel
};
