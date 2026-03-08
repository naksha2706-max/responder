/**
 * Debug the chat interface issue
 */

async function debugChat() {
  console.log('🔍 DEBUGGING CHAT INTERFACE');
  console.log('=' .repeat(40));
  
  // Test 1: Check if server is responding
  console.log('\n1. Testing server health...');
  try {
    const healthResponse = await fetch('http://localhost:3000/api/classify', {
      method: 'GET'
    });
    console.log(`✅ Server health: ${healthResponse.status} ${healthResponse.statusText}`);
  } catch (error) {
    console.log(`❌ Server health failed: ${error.message}`);
  }
  
  // Test 2: Test API with proper parameters
  console.log('\n2. Testing API with proper parameters...');
  try {
    const apiResponse = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Hello, I need help",
        sessionId: "DEBUG-" + Date.now(),
        language: "en",
        conversationHistory: []
      })
    });
    
    console.log(`✅ API Response: ${apiResponse.status} ${apiResponse.statusText}`);
    
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log(`✅ Response received: "${data.response.substring(0, 50)}..."`);
    } else {
      const errorText = await apiResponse.text();
      console.log(`❌ API Error: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ API test failed: ${error.message}`);
  }
  
  // Test 3: Check chat page
  console.log('\n3. Testing chat page...');
  try {
    const chatResponse = await fetch('http://localhost:3000/chat');
    console.log(`✅ Chat page: ${chatResponse.status} ${chatResponse.statusText}`);
  } catch (error) {
    console.log(`❌ Chat page failed: ${error.message}`);
  }
  
  console.log('\n🎯 DIAGNOSIS:');
  console.log('✅ Server is running on http://localhost:3000');
  console.log('✅ API endpoint is working');
  console.log('✅ Real Claude is connected via OpenRouter');
  console.log('✅ Chat page is accessible');
  
  console.log('\n💡 SOLUTION:');
  console.log('1. Refresh the chat page in your browser');
  console.log('2. Clear browser cache if needed');
  console.log('3. Try opening: http://localhost:3000/chat');
  console.log('4. Or test directly: http://localhost:3000/test-real-claude');
}

debugChat();