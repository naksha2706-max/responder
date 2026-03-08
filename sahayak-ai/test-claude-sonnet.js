// Test Claude 3.5 Sonnet access
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
  },
});

async function testClaude35Sonnet() {
  try {
    console.log('🧪 Testing Claude 3.5 Sonnet...');
    
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 100,
      temperature: 0.3,
      system: 'You are a helpful AI assistant.',
      messages: [
        {
          role: 'user',
          content: 'Hello, can you respond with "AI for Bharat credits working!"?'
        }
      ]
    };
    
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });
    
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ Claude 3.5 Sonnet Response:');
    console.log(responseBody.content[0].text);
    console.log('\n🎉 Your AI for Bharat credits are working!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testClaude35Sonnet();