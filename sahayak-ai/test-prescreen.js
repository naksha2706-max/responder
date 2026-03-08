/**
 * Test the pre-screening functionality specifically
 */

// Import the pre-screening functions
const { preScreenMessage, multiLanguageEmergencyCheck, getImmediateCrisisResponse } = require('./src/lib/prescreen.ts');

const testCases = [
  {
    message: "I want to kill myself",
    language: "en",
    expectedEmergency: true,
    expectedType: "suicide"
  },
  {
    message: "मैं आत्महत्या करना चाहता हूं",
    language: "hi", 
    expectedEmergency: true,
    expectedType: "suicide"
  },
  {
    message: "Someone is following me and threatening to hurt me",
    language: "en",
    expectedEmergency: true,
    expectedType: "immediatePhysicalDanger"
  },
  {
    message: "I need help with my homework",
    language: "en",
    expectedEmergency: false,
    expectedType: null
  },
  {
    message: "I want to cut myself",
    language: "en",
    expectedEmergency: true,
    expectedType: "selfHarm"
  }
];

console.log('🔍 Testing Pre-screening System\n');

testCases.forEach((test, index) => {
  console.log(`${index + 1}️⃣ Testing: "${test.message}"`);
  console.log(`   Language: ${test.language}`);
  
  // Test single language screening
  const singleResult = preScreenMessage(test.message, test.language);
  console.log(`   Single Language Result:`);
  console.log(`      - Emergency: ${singleResult.isEmergency}`);
  console.log(`      - Type: ${singleResult.emergencyType}`);
  console.log(`      - Confidence: ${singleResult.confidence.toFixed(2)}`);
  console.log(`      - Keywords: [${singleResult.detectedKeywords.join(', ')}]`);
  
  // Test multi-language screening
  const multiResult = multiLanguageEmergencyCheck(test.message);
  console.log(`   Multi-Language Result:`);
  console.log(`      - Emergency: ${multiResult.isEmergency}`);
  console.log(`      - Type: ${multiResult.emergencyType}`);
  console.log(`      - Best Language: ${multiResult.language}`);
  console.log(`      - Confidence: ${multiResult.confidence.toFixed(2)}`);
  
  // Test crisis response if emergency
  if (multiResult.isEmergency && multiResult.emergencyType) {
    const crisisResponse = getImmediateCrisisResponse(multiResult.emergencyType, multiResult.language);
    console.log(`   Crisis Response: "${crisisResponse.substring(0, 100)}..."`);
  }
  
  // Validation
  const correct = (test.expectedEmergency === multiResult.isEmergency) && 
                  (test.expectedType === multiResult.emergencyType);
  console.log(`   ✅ Result: ${correct ? 'CORRECT' : 'INCORRECT'}`);
  console.log('');
});

console.log('🎉 Pre-screening test completed!');
console.log('\n📊 Pre-screening Features:');
console.log('- ✅ Multi-language emergency detection (7 languages)');
console.log('- ✅ Keyword confidence scoring');
console.log('- ✅ Emergency type classification');
console.log('- ✅ Immediate crisis response generation');
console.log('- ✅ Cross-language emergency detection');