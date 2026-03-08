/**
 * Test Hindi input with English output
 */

async function testHindiInputEnglishOutput() {
  console.log('🇮🇳➡️🇬🇧 Testing Hindi input with English output...');
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "मैं बहुत परेशान हूं क्योंकि मेरे सीनियर मुझे रैगिंग कर रहे हैं",
        sessionId: "HINDI-TEST-" + Date.now(),
        language: "en",
        conversationHistory: []
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response received!');
      console.log(`Response: "${data.response}"`);
      
      // Check if response is in English (allowing basic punctuation)
      const hasHindiChars = /[\u0900-\u097F]/.test(data.response);
      if (!hasHindiChars) {
        console.log('✅ Response is in English (no Hindi characters)!');
      } else {
        console.log('❌ Response contains Hindi characters');
      }
      
      console.log(`Crisis type: ${data.classification?.crisisType || 'None'}`);
    } else {
      console.log('❌ API Error:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHindiInputEnglishOutput();