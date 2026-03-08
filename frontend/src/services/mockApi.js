/**
 * Mock API for local development without backend
 * Simulates Bedrock responses for testing UI
 */

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock crisis classification logic
function classifyCrisis(message) {
  const lowerMessage = message.toLowerCase();

  // Self-harm detection
  if (lowerMessage.match(/suicide|kill myself|end my life|self harm|hurt myself|आत्महत्या/)) {
    return {
      crisisType: 'self_harm',
      severityLevel: 4
    };
  }

  // Physical threat
  if (lowerMessage.match(/threat|violence|attack|hurt me|beat|धमकी|हिंसा/)) {
    return {
      crisisType: 'physical_threat',
      severityLevel: 3
    };
  }

  // Harassment
  if (lowerMessage.match(/harass|sexual|inappropriate|उत्पीड़न|यौन/)) {
    return {
      crisisType: 'harassment',
      severityLevel: 3
    };
  }

  // Ragging
  if (lowerMessage.match(/ragging|senior|bully|रैगिंग|धमकाना/)) {
    return {
      crisisType: 'ragging',
      severityLevel: 2
    };
  }

  // Cyberbullying
  if (lowerMessage.match(/online|social media|cyber|troll|साइबर/)) {
    return {
      crisisType: 'cyberbullying',
      severityLevel: 2
    };
  }

  // Mental health (default)
  return {
    crisisType: 'mental_health',
    severityLevel: 2
  };
}

// Mock responses by crisis type
const mockResponses = {
  en: {
    harassment: "I understand you're experiencing harassment, and I want you to know that what you're going through is not okay. Your safety and well-being are important. Let me help you find the right support.",
    ragging: "I'm sorry you're facing ragging. This is a serious issue and you deserve to feel safe at your institution. Let me connect you with resources that can help.",
    cyberbullying: "I hear you about the online harassment you're experiencing. Cyberbullying can be very distressing. Let me guide you to the right support services.",
    mental_health: "Thank you for reaching out. It takes courage to talk about what you're going through. I'm here to listen and help you find the support you need.",
    self_harm: "I'm very concerned about your safety right now. Please know that you're not alone, and help is available immediately. Your life matters, and there are people who want to help you through this.",
    physical_threat: "Your safety is the top priority. If you're in immediate danger, please call 112 right away. Let me also connect you with campus security and support resources."
  },
  hi: {
    harassment: "मैं समझता हूं कि आप उत्पीड़न का सामना कर रहे हैं, और मैं चाहता हूं कि आप जानें कि आप जो कुछ भी कर रहे हैं वह ठीक नहीं है। आपकी सुरक्षा और कल्याण महत्वपूर्ण हैं। मुझे आपको सही सहायता खोजने में मदद करने दें।",
    ragging: "मुझे खेद है कि आप रैगिंग का सामना कर रहे हैं। यह एक गंभीर मुद्दा है और आप अपनी संस्था में सुरक्षित महसूस करने के योग्य हैं। मुझे आपको उन संसाधनों से जोड़ने दें जो मदद कर सकते हैं।",
    cyberbullying: "मैं आपके द्वारा अनुभव किए जा रहे ऑनलाइन उत्पीड़न के बारे में सुनता हूं। साइबरबुलिंग बहुत परेशान करने वाली हो सकती है। मुझे आपको सही सहायता सेवाओं के लिए मार्गदर्शन करने दें।",
    mental_health: "संपर्क करने के लिए धन्यवाद। आप जो कुछ भी कर रहे हैं उसके बारे में बात करने के लिए साहस की आवश्यकता होती है। मैं सुनने और आपको आवश्यक सहायता खोजने में मदद करने के लिए यहां हूं।",
    self_harm: "मैं अभी आपकी सुरक्षा के बारे में बहुत चिंतित हूं। कृपया जानें कि आप अकेले नहीं हैं, और मदद तुरंत उपलब्ध है। आपका जीवन मायने रखता है, और ऐसे लोग हैं जो इस समय आपकी मदद करना चाहते हैं।",
    physical_threat: "आपकी सुरक्षा सर्वोच्च प्राथमिकता है। यदि आप तत्काल खतरे में हैं, तो कृपया तुरंत 112 पर कॉल करें। मुझे आपको परिसर सुरक्षा और सहायता संसाधनों से भी जोड़ने दें।"
  }
};

// Mock resources by crisis type
const mockResources = {
  harassment: [
    {
      type: 'icc',
      name: 'Internal Complaints Committee (ICC)',
      description: 'Handles sexual harassment and POSH-related complaints',
      phone: '1800-XXX-XXXX',
      email: 'icc@college.edu.in',
      availability: 'Monday-Friday, 9:00 AM - 5:00 PM',
      isEmergency: false
    },
    {
      type: 'helpline',
      name: "Women's Helpline",
      description: 'Support for women facing violence or harassment',
      phone: '1091',
      availability: '24/7 Helpline',
      isEmergency: true
    }
  ],
  ragging: [
    {
      type: 'anti_ragging_cell',
      name: 'Anti-Ragging Cell',
      description: 'Dedicated team to prevent and address ragging incidents',
      phone: '1800-180-5522',
      email: 'antiragging@college.edu.in',
      availability: '24/7 Helpline',
      isEmergency: true
    },
    {
      type: 'counselor',
      name: 'College Counseling Services',
      description: 'Professional mental health support and counseling',
      phone: '1800-XXX-YYYY',
      availability: 'Monday-Friday, 10:00 AM - 4:00 PM',
      isEmergency: false
    }
  ],
  cyberbullying: [
    {
      type: 'police',
      name: 'Cyber Crime Helpline',
      description: 'Report cyberbullying and online harassment',
      phone: '1930',
      email: 'complaints@cybercrime.gov.in',
      availability: '24/7 Helpline',
      isEmergency: false
    },
    {
      type: 'counselor',
      name: 'College Counseling Services',
      description: 'Professional mental health support and counseling',
      phone: '1800-XXX-YYYY',
      availability: 'Monday-Friday, 10:00 AM - 4:00 PM',
      isEmergency: false
    }
  ],
  mental_health: [
    {
      type: 'counselor',
      name: 'College Counseling Services',
      description: 'Professional mental health support and counseling',
      phone: '1800-XXX-YYYY',
      email: 'counselor@college.edu.in',
      availability: 'Monday-Friday, 10:00 AM - 4:00 PM',
      isEmergency: false
    }
  ],
  self_harm: [
    {
      type: 'helpline',
      name: 'National Suicide Prevention Helpline',
      description: 'Confidential crisis support and suicide prevention',
      phone: '9152987821',
      availability: '24/7 Crisis Helpline',
      isEmergency: true
    },
    {
      type: 'counselor',
      name: 'College Counseling Services',
      description: 'Professional mental health support and counseling',
      phone: '1800-XXX-YYYY',
      availability: 'Monday-Friday, 10:00 AM - 4:00 PM',
      isEmergency: false
    }
  ],
  physical_threat: [
    {
      type: 'police',
      name: 'Police Emergency Services',
      description: 'Immediate police assistance for emergencies',
      phone: '112',
      availability: '24/7 Emergency Hotline',
      isEmergency: true
    },
    {
      type: 'anti_ragging_cell',
      name: 'Anti-Ragging Cell',
      description: 'Campus security and safety support',
      phone: '1800-180-5522',
      availability: '24/7 Helpline',
      isEmergency: true
    }
  ]
};

// Empathy-first responses for turns 1-3
const empathyResponses = {
  en: [
    "I hear you, and I want you to know — you are not alone in this. It takes real courage to reach out. Can you tell me a little more about what's been happening?",
    "Thank you for trusting me with this. What you're feeling makes complete sense. I'm here with you, and there is no rush. Tell me more about how this has been affecting you.",
    "I want you to know that what happened to you is not your fault. You are in a safe space here. Before we talk about any next steps, I just want to stay present with you. How are you feeling right now?"
  ],
  hi: [
    "मैं आपकी बात सुन रहा हूं, और मैं चाहता हूं कि आप जानें — आप इसमें अकेले नहीं हैं। मदद माँगने में बहुत साहस लगता है। क्या आप मुझे थोड़ा और बता सकते हैं कि क्या हो रहा है?",
    "मुझ पर भरोसा करने के लिए धन्यवाद। आप जो महसूस कर रहे हैं वह बिल्कुल समझ में आता है। मैं आपके साथ हूं, कोई जल्दी नहीं है। मुझे बताएं कि इसका आप पर क्या असर हुआ है।",
    "मैं चाहता हूं कि आप जानें कि जो हुआ वह आपकी गलती नहीं है। यह एक सुरक्षित जगह है। अभी आप कैसा महसूस कर रहे हैं?"
  ]
};

/**
 * Mock sendMessage function with empathy-first phase support
 */
export async function sendMessage(message, language = 'en', turnCount = 1) {
  // Simulate network delay (800ms - 1.5s)
  await delay(800 + Math.random() * 700);

  // Classify the crisis type
  const { crisisType, severityLevel } = classifyCrisis(message);

  // EMPATHY-FIRST PHASE: turns 1-3 → warm, non-classifying responses
  if (turnCount <= 3 && severityLevel < 4) {
    const empathyPool = empathyResponses[language] || empathyResponses.en;
    const empathyMsg = empathyPool[Math.min(turnCount - 1, empathyPool.length - 1)];

    return {
      response: empathyMsg,
      crisisType,        // classify silently but don't surface it to actions
      severityLevel,
      resources: [],
      sessionId: 'mock-session-' + Date.now(),
      empathyPhase: true
    };
  }

  // CLASSIFICATION PHASE: turn 4+ → full classified response with resources
  const responses = mockResponses[language] || mockResponses.en;
  const response = responses[crisisType] || responses.mental_health;
  const resources = mockResources[crisisType] || mockResources.mental_health;

  return {
    response,
    crisisType,
    severityLevel,
    resources,
    sessionId: 'mock-session-' + Date.now()
  };
}

/**
 * Mock getSession function
 */
export async function getSession(sessionId) {
  await delay(500);

  return {
    sessionId,
    messages: [],
    createdAt: Date.now()
  };
}

/**
 * Mock deleteSession function
 */
export async function deleteSession(sessionId) {
  await delay(500);

  return {
    success: true,
    message: 'Session deleted successfully'
  };
}

const mockApi = {
  sendMessage,
  getSession,
  deleteSession
};

export default mockApi;
