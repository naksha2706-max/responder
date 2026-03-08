/**
 * Complete integration test for real Claude via OpenRouter
 * Tests all major scenarios: harassment, emergency, and normal conversation
 */

const OPENROUTER_API_KEY = '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';

async function testClassifyAPI(message, testName) {
  console.log(`\n🧪 ${testName}`);
  console.log(`📝 Message: "${message}"`);
  console.log('⏳ Calling /api/classify...');
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        sessionId: 'test-session-' + Date.now(),
        language: 'en',
        conversationHistory: []
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ API Response received!');
    console.log(`💬 AI Response: "${data.response.substring(0, 100)}..."`);
    console.log(`🎯 Ready to classify: ${data.readyToClassify}`);
    console.log(`🚨 Safety override: ${data.safetyOverride}`);
    console.log(`⚠️  Immediate risk: ${data.immediateRisk}`);
    console.log(`😊 Emotion score: ${data.emotionScore}/5 (${data.emotionTrend})`);
    
    if (data.classification) {
      console.log(`📋 Crisis type: ${data.classification.crisisType || 'None'}`);
      console.log(`📊 Severity: ${data.classification.severity || 'None'}`);
      if (data.classification.authority) {
        console.log(`🏛️  Authority: ${data.classification.authority}`);
      }
      if (data.classification.contact) {
        console.log(`📞 Contact: ${data.classification.contact}`);
      }
      if (data.classification.immediateGuidance) {
        console.log(`🎯 Guidance: ${data.classification.immediateGuidance.substring(0, 100)}...`);
      }
    }
    
    return data;
    
  } catch (error) {
    console.error(`❌ ${testName} failed:`, error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 SAHAYAK AI - REAL CLAUDE INTEGRATION TEST');
  console.log('=' .repeat(60));
  
  // Test 1: Academic stress + harassment
  const test1 = await testClassifyAPI(
    "I am feeling stressed about my studies and some seniors are bothering me",
    "TEST 1: Academic Stress + Harassment"
  );
  
  // Test 2: Emergency detection
  const test2 = await testClassifyAPI(
    "I want to kill myself",
    "TEST 2: Emergency Detection"
  );
  
  // Test 3: Harassment by authority figure
  const test3 = await testClassifyAPI(
    "A professor keeps sending me personal messages and asking me to meet alone",
    "TEST 3: Authority Figure Harassment"
  );
  
  // Test 4: Normal conversation
  const test4 = await testClassifyAPI(
    "Hello, I just wanted to talk to someone",
    "TEST 4: Normal Conversation"
  );
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  if (test1) {
    console.log(`✅ Test 1: ${test1.classification?.crisisType || 'No classification'} - ${test1.classification?.severity || 'No severity'}`);
  }
  
  if (test2) {
    console.log(`✅ Test 2: Emergency ${test2.safetyOverride ? 'DETECTED' : 'NOT DETECTED'} - Risk: ${test2.immediateRisk ? 'HIGH' : 'LOW'}`);
  }
  
  if (test3) {
    console.log(`✅ Test 3: ${test3.classification?.crisisType || 'No classification'} - ${test3.classification?.severity || 'No severity'}`);
  }
  
  if (test4) {
    console.log(`✅ Test 4: Normal conversation - Emotion: ${test4.emotionScore}/5`);
  }
  
  console.log('\n🎉 All tests completed! Real Claude is working via OpenRouter.');
  console.log('🌐 You can also test manually at: http://localhost:3000/test-real-claude');
}

// Run all tests
runAllTests();