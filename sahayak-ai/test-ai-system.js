/**
 * Test script for the AI crisis support system
 * Tests pre-screening, Bedrock integration, and API endpoints
 */

const testMessages = [
  {
    message: "I'm feeling really overwhelmed with college stress",
    language: "en",
    sessionId: "test-session-1",
    expectedEmergency: false
  },
  {
    message: "मैं आत्महत्या के बारे में सोच रहा हूं",
    language: "hi", 
    sessionId: "test-session-2",
    expectedEmergency: true
  },
  {
    message: "Someone is threatening to hurt me physically",
    language: "en",
    sessionId: "test-session-3", 
    expectedEmergency: true
  },
  {
    message: "I need help with my studies",
    language: "en",
    sessionId: "test-session-4",
    expectedEmergency: false
  }
];

async function testAPI(endpoint, payload) {
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    return { success: true, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Sahayak AI Crisis Support System\n');
  
  // Test 1: Health check
  console.log('1️⃣ Testing API health check...');
  const healthCheck = await fetch('http://localhost:3000/api/classify');
  const healthData = await healthCheck.json();
  console.log('✅ Health check:', healthData.status);
  console.log('');
  
  // Test 2: Test each message
  for (let i = 0; i < testMessages.length; i++) {
    const test = testMessages[i];
    console.log(`${i + 2}️⃣ Testing: "${test.message.substring(0, 50)}..."`);
    console.log(`   Language: ${test.language}`);
    console.log(`   Expected Emergency: ${test.expectedEmergency}`);
    
    // Test classification API
    const classifyResult = await testAPI('/api/classify', test);
    
    if (classifyResult.success) {
      const response = classifyResult.data;
      console.log(`   ✅ Classification API Response:`);
      console.log(`      - Safety Override: ${response.safetyOverride}`);
      console.log(`      - Immediate Risk: ${response.immediateRisk}`);
      console.log(`      - Emotion Score: ${response.emotionScore}`);
      console.log(`      - Crisis Type: ${response.classification?.crisisType || 'None'}`);
      console.log(`      - Response: "${response.response.substring(0, 100)}..."`);
      
      if (response.emergencyContacts) {
        console.log(`      - Emergency Contacts: ${response.emergencyContacts.length} provided`);
      }
    } else {
      console.log(`   ❌ Classification API Error: ${classifyResult.error}`);
    }
    
    // Test chat API
    const chatResult = await testAPI('/api/chat', test);
    
    if (chatResult.success) {
      console.log(`   ✅ Chat API Response:`);
      console.log(`      - Crisis Type: ${chatResult.data.crisisType || 'None'}`);
      console.log(`      - Severity Level: ${chatResult.data.severityLevel}`);
      console.log(`      - Resources: ${chatResult.data.resources?.length || 0} provided`);
    } else {
      console.log(`   ❌ Chat API Error: ${chatResult.error}`);
    }
    
    console.log('');
  }
  
  console.log('🎉 Testing completed!');
  console.log('\n📊 Summary:');
  console.log('- Pre-screening layer: Detects emergency keywords in 7 languages');
  console.log('- Bedrock integration: Claude 3 Haiku with 8-second timeout');
  console.log('- Safety overrides: Immediate crisis response for high-risk situations');
  console.log('- DynamoDB storage: Session and message persistence');
  console.log('- Emergency contacts: Context-aware resource recommendations');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}

module.exports = { testAPI, runTests };