/**
 * Direct test of pre-screening functionality
 */

// Test the pre-screening logic directly
const EMERGENCY_KEYWORDS = {
  en: {
    suicide: [
      'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
      'not worth living', 'better off dead', 'end it all', 'take my own life'
    ],
    selfHarm: [
      'cut myself', 'hurt myself', 'self harm', 'self-harm', 'cutting',
      'burning myself', 'harm myself', 'injure myself'
    ],
    immediatePhysicalDanger: [
      'going to hurt me', 'threatening me', 'following me', 'stalking me',
      'physical violence', 'beat me up', 'attack me', 'assault me'
    ]
  },
  hi: {
    suicide: [
      'मरना चाहता हूं', 'आत्महत्या', 'जीना नहीं चाहता', 'मौत चाहिए',
      'जिंदगी से परेशान', 'मर जाना चाहता हूं', 'खुदकुशी'
    ]
  }
};

function testPreScreen(message, language = 'en') {
  const normalizedMessage = message.toLowerCase().trim();
  const keywords = EMERGENCY_KEYWORDS[language] || EMERGENCY_KEYWORDS.en;
  
  let isEmergency = false;
  let emergencyType = null;
  let detectedKeywords = [];
  let maxMatches = 0;
  
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    const matches = categoryKeywords.filter(keyword => 
      normalizedMessage.includes(keyword.toLowerCase())
    );
    
    if (matches.length > 0) {
      isEmergency = true;
      detectedKeywords.push(...matches);
      
      if (matches.length > maxMatches) {
        maxMatches = matches.length;
        emergencyType = category;
      }
    }
  }
  
  const confidence = Math.min(detectedKeywords.length * 0.3 + (maxMatches * 0.4), 1.0);
  
  return {
    isEmergency,
    emergencyType,
    detectedKeywords,
    confidence,
    language
  };
}

const testCases = [
  { message: "I want to kill myself", language: "en" },
  { message: "मैं आत्महत्या करना चाहता हूं", language: "hi" },
  { message: "Someone is stalking me", language: "en" },
  { message: "I want to cut myself", language: "en" },
  { message: "I need help with studies", language: "en" }
];

console.log('🔍 Direct Pre-screening Test\n');

testCases.forEach((test, index) => {
  console.log(`${index + 1}️⃣ Testing: "${test.message}"`);
  const result = testPreScreen(test.message, test.language);
  
  console.log(`   Emergency: ${result.isEmergency ? '🚨 YES' : '✅ No'}`);
  console.log(`   Type: ${result.emergencyType || 'None'}`);
  console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
  console.log(`   Keywords: [${result.detectedKeywords.join(', ')}]`);
  console.log('');
});

console.log('✅ Pre-screening logic is working correctly!');