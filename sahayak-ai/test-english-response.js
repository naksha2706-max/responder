/**
 * Test English-only responses
 */

async function testEnglishResponse() {
  console.log('🇬🇧 Testing English-only responses...');
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "I am feeling low because of my seniors keeps on ragging me",
        sessionId: "ENGLISH-TEST-" + Date.now(),
        language: "en",
        conversationHistory: []
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response received!');
      console.log(`Response: "${data.response}"`);
      
      // Check if response is in English
      const isEnglish = /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(data.response.substring(0, 50));
      if (isEnglish) {
        console.log('✅ Response is in English!');
      } else {
        console.log('❌ Response contains non-English characters');
      }
      
      console.log(`Crisis type: ${data.classification?.crisisType || 'None'}`);
      console.log(`Ready to classify: ${data.readyToClassify}`);
    } else {
      console.log('❌ API Error:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEnglishResponse();