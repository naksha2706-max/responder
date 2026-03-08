/**
 * Test a single emergency message to debug the pre-screening
 */

async function testSingleEmergency() {
  const testMessage = {
    message: "I want to kill myself right now",
    language: "en",
    sessionId: "debug-emergency-test"
  };
  
  console.log('🚨 Testing Single Emergency Message');
  console.log(`Message: "${testMessage.message}"`);
  console.log('');
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    const data = await response.json();
    
    console.log('📊 Full Response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSingleEmergency();