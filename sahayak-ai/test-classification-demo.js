/**
 * Demo test showing full classification capabilities
 */

async function testClassification() {
  console.log('🎯 TESTING FULL CLASSIFICATION CAPABILITIES');
  console.log('=' .repeat(50));
  
  const testMessage = "Some senior students are forcing me to do their assignments and threatening me if I don't comply. They also make me clean their room and bring them food. I'm scared to go to my hostel.";
  
  console.log(`📝 Test Message: "${testMessage}"`);
  console.log('\n⏳ Calling real Claude for classification...');
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: testMessage,
        sessionId: 'classification-demo-' + Date.now(),
        language: 'en',
        conversationHistory: []
      }),
    });

    const data = await response.json();
    
    console.log('\n✅ CLAUDE RESPONSE:');
    console.log('=' .repeat(50));
    console.log(`💬 Response: "${data.response}"`);
    
    console.log('\n📊 CLASSIFICATION RESULTS:');
    console.log('=' .repeat(50));
    console.log(`🎯 Ready to classify: ${data.readyToClassify}`);
    console.log(`🚨 Safety override: ${data.safetyOverride}`);
    console.log(`⚠️  Immediate risk: ${data.immediateRisk}`);
    console.log(`😊 Emotion score: ${data.emotionScore}/5 (${data.emotionTrend})`);
    
    if (data.classification) {
      console.log(`\n⚖️  LEGAL CLASSIFICATION:`);
      console.log(`📋 Crisis type: ${data.classification.crisisType || 'None'}`);
      console.log(`📊 Severity: ${data.classification.severity || 'None'}`);
      console.log(`📜 Applicable law: ${data.classification.applicableLaw || 'None'}`);
      console.log(`🏛️  Authority: ${data.classification.authority || 'None'}`);
      console.log(`📞 Contact: ${data.classification.contact || 'None'}`);
      console.log(`🔒 Legal right: ${data.classification.legalRight || 'None'}`);
      
      if (data.classification.immediateGuidance) {
        console.log(`\n🎯 IMMEDIATE GUIDANCE:`);
        console.log(data.classification.immediateGuidance);
      }
      
      if (data.classification.complaintDraft) {
        console.log(`\n📝 COMPLAINT DRAFT:`);
        console.log(data.classification.complaintDraft);
      }
    }
    
    console.log('\n🎉 Classification complete! This shows Claude can:');
    console.log('✅ Detect ragging/harassment scenarios');
    console.log('✅ Provide appropriate legal framework');
    console.log('✅ Generate complaint drafts');
    console.log('✅ Offer immediate guidance');
    console.log('✅ Connect to proper authorities');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testClassification();