/**
 * Test complaint draft generation
 */

async function testComplaintDraft() {
  console.log('📝 TESTING COMPLAINT DRAFT GENERATION');
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Yes, they force me to do pushups every night and threaten me. I want to file a complaint.",
        sessionId: "COMPLAINT-TEST-" + Date.now(),
        language: "en",
        conversationHistory: [
          { role: "user", content: "My seniors force me to do pushups at midnight and threaten me every night in the hostel" },
          { role: "assistant", content: "I'm so sorry you're going through this. That sounds like a very difficult situation. Can you tell me more about what exactly they are making you do?" }
        ]
      })
    });
    
    const data = await response.json();
    
    console.log('✅ Response received');
    console.log(`📊 Ready to classify: ${data.readyToClassify}`);
    console.log(`🏷️  Crisis type: ${data.classification?.crisisType || 'None'}`);
    console.log(`⚖️  Severity: ${data.classification?.severity || 'None'}`);
    
    if (data.classification?.complaintDraft) {
      console.log('\n✅ COMPLAINT DRAFT GENERATED:');
      console.log('=' .repeat(30));
      console.log(data.classification.complaintDraft);
      console.log('=' .repeat(30));
    } else {
      console.log('\n❌ No complaint draft generated');
    }
    
    if (data.classification?.applicableLaw) {
      console.log(`\n⚖️  Applicable Law: ${data.classification.applicableLaw}`);
    }
    
    if (data.classification?.authority) {
      console.log(`🏛️  Authority: ${data.classification.authority}`);
    }
    
    if (data.classification?.immediateGuidance) {
      console.log(`\n🎯 Immediate Guidance:`);
      console.log(data.classification.immediateGuidance);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testComplaintDraft();