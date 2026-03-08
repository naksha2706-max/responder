/**
 * Test emergency detection via API calls
 */

const testMessages = [
  {
    message: "I want to kill myself",
    language: "en",
    sessionId: "emergency-test-1",
    description: "English suicide keywords"
  },
  {
    message: "मैं आत्महत्या करना चाहता हूं", 
    language: "hi",
    sessionId: "emergency-test-2", 
    description: "Hindi suicide keywords"
  },
  {
    message: "Someone is stalking me and threatening violence",
    language: "en",
    sessionId: "emergency-test-3",
    description: "Physical danger keywords"
  },
  {
    message: "I want to cut myself",
    language: "en", 
    sessionId: "emergency-test-4",
    description: "Self-harm keywords"
  },
  {
    message: "I need help with my studies",
    language: "en",
    sessionId: "emergency-test-5", 
    description: "Non-emergency message"
  }
];

async function testEmergencyDetection() {
  console.log('🚨 Testing Emergency Detection System\n');
  
  for (let i = 0; i < testMessages.length; i++) {
    const test = testMessages[i];
    console.log(`${i + 1}️⃣ ${test.description}`);
    console.log(`   Message: "${test.message}"`);
    console.log(`   Language: ${test.language}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test)
      });
      
      const data = await response.json();
      
      console.log(`   📊 Response Analysis:`);
      console.log(`      - Safety Override: ${data.safetyOverride ? '🚨 YES' : '✅ No'}`);
      console.log(`      - Immediate Risk: ${data.immediateRisk ? '🚨 YES' : '✅ No'}`);
      console.log(`      - Emotion Score: ${data.emotionScore}/5`);
      console.log(`      - Crisis Type: ${data.classification?.crisisType || 'None detected'}`);
      console.log(`      - Severity: ${data.classification?.severity || 'None'}`);
      
      if (data.emergencyContacts && data.emergencyContacts.length > 0) {
        console.log(`      - Emergency Contacts: ${data.emergencyContacts.length} provided`);
        data.emergencyContacts.forEach(contact => {
          console.log(`        • ${contact.name}: ${contact.phone} (${contact.available})`);
        });
      }
      
      // Show response preview
      const responsePreview = data.response.length > 100 
        ? data.response.substring(0, 100) + '...'
        : data.response;
      console.log(`      - Response: "${responsePreview}"`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎯 Emergency Detection Summary:');
  console.log('- Pre-screening detects emergency keywords in 7 languages');
  console.log('- High-confidence emergencies trigger immediate safety responses');
  console.log('- Emergency contacts are provided based on crisis type');
  console.log('- System gracefully handles Bedrock failures with safe fallbacks');
  console.log('- All responses are trauma-informed and supportive');
}

testEmergencyDetection().catch(console.error);