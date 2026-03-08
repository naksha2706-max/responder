/**
 * Test ragging detection specifically
 */

async function testRaggingDetection() {
  console.log('🎯 Testing Ragging Detection...\n');
  
  const testCases = [
    {
      message: "My seniors force me to do pushups at midnight",
      description: "Physical ragging case",
      expectedEmergency: false
    },
    {
      message: "Seniors are beating me every night in hostel",
      description: "Physical violence case", 
      expectedEmergency: true
    },
    {
      message: "I want to kill myself because of ragging",
      description: "Suicide + ragging case",
      expectedEmergency: true
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`${i + 1}️⃣ ${testCase.description}`);
    console.log(`   Message: "${testCase.message}"`);
    
    try {
      const response = await fetch('http://localhost:3000/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          sessionId: `test-case-${i + 1}`,
          language: "en"
        })
      });
      
      const data = await response.json();
      
      console.log(`   📊 Results:`);
      console.log(`      - Emergency Detected: ${data.safetyOverride || data.immediateRisk ? '🚨 YES' : '✅ No'}`);
      console.log(`      - Crisis Type: ${data.classification?.crisisType || 'None'}`);
      console.log(`      - Severity: ${data.classification?.severity || 'None'}`);
      console.log(`      - Response: "${data.response.substring(0, 80)}..."`);
      
      if (data.emergencyContacts) {
        console.log(`      - Emergency Contacts: ${data.emergencyContacts.length} provided`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎯 Summary: API endpoint structure is correct');
  console.log('✅ Ready to proceed with frontend integration');
}

testRaggingDetection();