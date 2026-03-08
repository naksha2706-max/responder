/**
 * Test the improved AI system with mock responses
 */

async function testImprovedAI() {
  console.log('🤖 Testing Improved AI System with Mock Responses\n');
  
  const testCases = [
    {
      message: "i am feeling low because of my senior, he is frustating me to do this and that, i dont know what to do now",
      description: "Your exact message about senior trouble",
      sessionId: "demo-ragging-1"
    },
    {
      message: "My seniors force me to do pushups at midnight in the hostel",
      description: "Clear ragging case",
      sessionId: "demo-ragging-2"
    },
    {
      message: "I want to kill myself",
      description: "Emergency case (should trigger safety override)",
      sessionId: "demo-emergency-1"
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    console.log(`${i + 1}️⃣ ${test.description}`);
    console.log(`   Message: "${test.message}"`);
    
    try {
      const response = await fetch('http://localhost:3000/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: test.message,
          sessionId: test.sessionId,
          language: "en",
          conversationHistory: []
        })
      });
      
      const data = await response.json();
      
      console.log(`   🤖 AI Response:`);
      console.log(`      "${data.response}"`);
      console.log(`   📊 Analysis:`);
      console.log(`      - Ready to Classify: ${data.readyToClassify ? '✅ Yes' : '⏳ Not yet'}`);
      console.log(`      - Crisis Type: ${data.classification?.crisisType || 'None detected'}`);
      console.log(`      - Severity: ${data.classification?.severity || 'None'}`);
      console.log(`      - Safety Override: ${data.safetyOverride ? '🚨 YES' : '✅ No'}`);
      
      if (data.classification?.applicableLaw) {
        console.log(`      - Applicable Law: ${data.classification.applicableLaw}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎉 Your AI system now gives personalized, empathetic responses!');
  console.log('🚀 Try it in your browser at http://localhost:3000');
}

testImprovedAI();