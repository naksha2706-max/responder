/**
 * Test the chat fix
 */

async function testChatFix() {
  console.log('🔧 Testing chat page fix...');
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "I am feeling low because of my seniors keeps on ragging me",
        sessionId: "SAH-TEST123",
        language: "en",
        conversationHistory: []
      }),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Chat API working!');
      console.log(`Response: "${data.response.substring(0, 100)}..."`);
      console.log(`Crisis type: ${data.classification?.crisisType || 'None'}`);
      console.log(`Ready to classify: ${data.readyToClassify}`);
    } else {
      const error = await response.text();
      console.log('❌ API Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testChatFix();