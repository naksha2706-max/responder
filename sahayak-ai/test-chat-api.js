// Test the chat API to verify it's working correctly
const testChatAPI = async () => {
  try {
    console.log('🧪 Testing Chat API...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, I need help with something',
        language: 'en',
        sessionId: 'test-session-' + Date.now()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Chat API Response:');
    console.log('Response:', data.response);
    console.log('Crisis Type:', data.crisisType);
    console.log('Severity Level:', data.severityLevel);
    console.log('Emotion Score:', data.emotionScore);
    console.log('Safety Override:', data.safetyOverride);
    
    console.log('\n🎉 Chat API is working perfectly!');
    
  } catch (error) {
    console.error('❌ Chat API test failed:', error.message);
  }
};

testChatAPI();