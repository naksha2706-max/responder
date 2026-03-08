/**
 * Pre-screening layer for emergency keyword detection in multiple languages
 * Detects immediate crisis situations before sending to Bedrock
 */

interface EmergencyKeywords {
  [language: string]: {
    suicide: string[];
    selfHarm: string[];
    immediatePhysicalDanger: string[];
    violentThreats: string[];
  };
}

const EMERGENCY_KEYWORDS: EmergencyKeywords = {
  // English - ONLY very specific suicide/self-harm phrases (removed generic words)
  en: {
    suicide: [
      'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
      'not worth living', 'better off dead', 'end it all', 'take my own life',
      'commit suicide', 'planning to die', 'ready to die', 'going to kill myself'
    ],
    selfHarm: [
      'cut myself', 'cutting myself', 'self harm', 'self-harm', 
      'burning myself', 'injure myself', 'cutting my wrists', 'harm myself'
    ],
    immediatePhysicalDanger: [
      'going to kill me right now', 'has a weapon pointed at me', 'pointing a gun at me',
      'knife at my throat', 'bomb threat', 'murder threat right now'
    ],
    violentThreats: [
      'kill you right now', 'murder you today', 'bomb threat', 'shoot you dead',
      'stab you to death', 'weapon pointed at you'
    ]
  },
  
  // Hindi
  hi: {
    suicide: [
      'मरना चाहता हूं', 'आत्महत्या', 'जीना नहीं चाहता', 'मौत चाहिए',
      'जिंदगी से परेशान', 'मर जाना चाहता हूं', 'खुदकुशी'
    ],
    selfHarm: [
      'खुद को नुकसान', 'काटना चाहता हूं', 'खुद को चोट', 'आत्म हानि'
    ],
    immediatePhysicalDanger: [
      'मारने की धमकी', 'पीछा कर रहा', 'हिंसा की धमकी', 'मारपीट'
    ],
    violentThreats: [
      'मार दूंगा', 'हत्या', 'हिंसा', 'हथियार', 'चाकू', 'बंदूक'
    ]
  },
  
  // Tamil
  ta: {
    suicide: [
      'சாக வேண்டும்', 'தற்கொலை', 'வாழ விருப்பமில்லை', 'மரணம் வேண்டும்'
    ],
    selfHarm: [
      'என்னை வெட்ட', 'தன்னை காயப்படுத்த', 'சுய தீங்கு'
    ],
    immediatePhysicalDanger: [
      'அடிக்க போகிறான்', 'பின்தொடர்கிறான்', 'வன்முறை அச்சுறுத்தல்'
    ],
    violentThreats: [
      'கொல்வேன்', 'வன்முறை', 'ஆயுதம்', 'கத்தி'
    ]
  },
  
  // Telugu
  te: {
    suicide: [
      'చావాలని అనిపిస్తుంది', 'ఆత్మహత్య', 'బ్రతకాలని అనిపించడం లేదు'
    ],
    selfHarm: [
      'నన్ను కోయాలని', 'స్వీయ హాని', 'నన్ను గాయపరచుకోవాలని'
    ],
    immediatePhysicalDanger: [
      'కొట్టబోతున్నాడు', 'వెంబడిస్తున్నాడు', 'హింస బెదిరింపు'
    ],
    violentThreats: [
      'చంపేస్తాను', 'హింస', 'ఆయుధం', 'కత్తి'
    ]
  },
  
  // Bengali
  bn: {
    suicide: [
      'মরতে চাই', 'আত্mahত্যা', 'বাঁচতে ইচ্ছে করে না', 'মৃত্যু চাই'
    ],
    selfHarm: [
      'নিজেকে কাটতে', 'আত্ম ক্ষতি', 'নিজের ক্ষতি'
    ],
    immediatePhysicalDanger: [
      'মারার হুমকি', 'পিছু নিচ্ছে', 'সহিংসতার হুমকি'
    ],
    violentThreats: [
      'মেরে ফেলব', 'সহিংসতা', 'অস্ত্র', 'ছুরি'
    ]
  },
  
  // Kannada
  kn: {
    suicide: [
      'ಸಾಯಬೇಕು ಅನಿಸುತ್ತಿದೆ', 'ಆತ್ಮಹತ್ಯೆ', 'ಬದುಕಲು ಇಷ್ಟವಿಲ್ಲ'
    ],
    selfHarm: [
      'ನನ್ನನ್ನು ಕತ್ತರಿಸಿಕೊಳ್ಳಬೇಕು', 'ಸ್ವಯಂ ಹಾನಿ'
    ],
    immediatePhysicalDanger: [
      'ಹೊಡೆಯುವ ಬೆದರಿಕೆ', 'ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾನೆ', 'ಹಿಂಸಾಚಾರದ ಬೆದರಿಕೆ'
    ],
    violentThreats: [
      'ಕೊಲ್ಲುತ್ತೇನೆ', 'ಹಿಂಸಾಚಾರ', 'ಆಯುಧ', 'ಚಾಕು'
    ]
  },
  
  // Marathi
  mr: {
    suicide: [
      'मरायचे आहे', 'आत्महत्या', 'जगायचे नाही', 'मृत्यू हवा'
    ],
    selfHarm: [
      'स्वतःला कापायचे', 'स्वयं हानी', 'स्वतःला दुखापत'
    ],
    immediatePhysicalDanger: [
      'मारण्याची धमकी', 'मागे लागला आहे', 'हिंसाचाराची धमकी'
    ],
    violentThreats: [
      'मारून टाकीन', 'हिंसाचार', 'शस्त्र', 'चाकू'
    ]
  }
};

export interface PreScreenResult {
  isEmergency: boolean;
  emergencyType: 'suicide' | 'selfHarm' | 'immediatePhysicalDanger' | 'violentThreats' | null;
  detectedKeywords: string[];
  confidence: number;
  language: string;
}

/**
 * Pre-screens message for emergency keywords across multiple languages
 */
export function preScreenMessage(message: string, language: string = 'en'): PreScreenResult {
  const normalizedMessage = message.toLowerCase().trim();
  const keywords = EMERGENCY_KEYWORDS[language] || EMERGENCY_KEYWORDS.en;
  
  let isEmergency = false;
  let emergencyType: PreScreenResult['emergencyType'] = null;
  let detectedKeywords: string[] = [];
  let maxMatches = 0;
  
  // Check each emergency category
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    const matches = categoryKeywords.filter(keyword => 
      normalizedMessage.includes(keyword.toLowerCase())
    );
    
    if (matches.length > 0) {
      isEmergency = true;
      detectedKeywords.push(...matches);
      
      // Set emergency type to the category with most matches
      if (matches.length > maxMatches) {
        maxMatches = matches.length;
        emergencyType = category as PreScreenResult['emergencyType'];
      }
    }
  }
  
  // Calculate confidence based on number of matches and keyword specificity
  // Require very specific matches for emergency classification
  // Only trigger for genuine suicide/self-harm situations, not general complaints
  let confidence = 0;
  
  if (detectedKeywords.length > 0) {
    // Base confidence from keyword matches
    const keywordConfidence = Math.min(detectedKeywords.length * 0.3, 0.7);
    
    // Bonus for multiple matches in same category (indicates genuine emergency)
    const categoryBonus = maxMatches > 1 ? 0.3 : 0;
    
    // Only very specific suicide/self-harm keywords get high confidence
    const hasSpecificEmergencyKeywords = detectedKeywords.some(keyword => 
      ['kill myself', 'suicide', 'cut myself', 'end my life', 'want to die'].includes(keyword.toLowerCase())
    );
    
    confidence = keywordConfidence + categoryBonus + (hasSpecificEmergencyKeywords ? 0.2 : 0);
  }
  
  // CRITICAL: Only consider it emergency if confidence is high (0.5+) 
  // This prevents normal complaints from triggering emergency responses
  // but still catches genuine suicide/self-harm situations
  const finalIsEmergency = isEmergency && confidence >= 0.5;
  
  return {
    isEmergency: finalIsEmergency,
    emergencyType: finalIsEmergency ? emergencyType : null,
    detectedKeywords,
    confidence,
    language
  };
}

/**
 * Checks if message contains any emergency indicators across all supported languages
 */
export function multiLanguageEmergencyCheck(message: string): PreScreenResult {
  const supportedLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'kn', 'mr'];
  
  let bestResult: PreScreenResult = {
    isEmergency: false,
    emergencyType: null,
    detectedKeywords: [],
    confidence: 0,
    language: 'en'
  };
  
  // Check against all languages and return the result with highest confidence
  for (const lang of supportedLanguages) {
    const result = preScreenMessage(message, lang);
    if (result.confidence > bestResult.confidence) {
      bestResult = result;
    }
  }
  
  return bestResult;
}

/**
 * Gets immediate crisis response based on emergency type
 */
export function getImmediateCrisisResponse(emergencyType: string, language: string = 'en'): string {
  const responses: { [key: string]: { [lang: string]: string } } = {
    suicide: {
      en: "I'm very concerned about you right now. Please reach out to someone immediately: National Suicide Prevention Helpline: 9152987821 or iCall: 9152987821. You don't have to go through this alone.",
      hi: "मैं आपके बारे में बहुत चिंतित हूं। कृपया तुरंत किसी से संपर्क करें: राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन: 9152987821 या iCall: 9152987821। आपको अकेले इससे नहीं गुजरना है।",
      ta: "நான் உங்களைப் பற்றி மிகவும் கவலைப்படுகிறேன். தயவுசெய்து உடனே யாரையாவது தொடர்பு கொள்ளுங்கள்: தேசிய தற்கொலை தடுப்பு ஹெல்ப்லைன்: 9152987821 அல்லது iCall: 9152987821।"
    },
    selfHarm: {
      en: "I can see you're in pain. Please don't hurt yourself. Reach out for support: iCall: 9152987821 or your campus counselor. You deserve care and support.",
      hi: "मैं देख सकता हूं कि आप दर्द में हैं। कृपया खुद को नुकसान न पहुंचाएं। सहायता के लिए संपर्क करें: iCall: 9152987821 या अपने कैंपस काउंसलर से।",
      ta: "நீங்கள் வலியில் இருப்பதை என்னால் பார்க்க முடிகிறது। தயவுசெய்து உங்களை காயப்படுத்திக் கொள்ளாதீர்கள். ஆதரவிற்காக தொடர்பு கொள்ளுங்கள்: iCall: 9152987821।"
    },
    immediatePhysicalDanger: {
      en: "Your safety is the priority. If you're in immediate danger, call Police: 112 or Women Helpline: 1091. Find a safe place and trusted person immediately.",
      hi: "आपकी सुरक्षा प्राथमिकता है। यदि आप तत्काल खतरे में हैं, तो पुलिस को कॉल करें: 112 या महिला हेल्पलाइन: 1091। तुरंत एक सुरक्षित स्थान और विश्वसनीय व्यक्ति खोजें।",
      ta: "உங்கள் பாதுகாப்பு முன்னுரிமை. நீங்கள் உடனடி ஆபத்தில் இருந்தால், காவல்துறையை அழைக்கவும்: 112 அல்லது பெண்கள் ஹெல்ப்லைன்: 1091।"
    }
  };
  
  const typeResponses = responses[emergencyType];
  if (!typeResponses) {
    return responses.suicide[language] || responses.suicide.en;
  }
  
  return typeResponses[language] || typeResponses.en;
}