// Activate Claude 3 Haiku by making first API call
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
  },
});

async function activateClaude() {
  try {
    console.log('🚀 Activating Claude 3 Haiku with AI for Bharat credits...');
    console.log('📡 Making first API call to auto-enable model...');
    
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 50,
      temperature: 0.3,
      system: 'You are a helpful AI assistant.',
      messages: [
        {
          role: 'user',
          content: 'Hello! Please respond with "AI for Bharat credits activated successfully!"'
        }
      ]
    };
    
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });
    
    console.log('⏳ Sending request to Claude...');
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ SUCCESS! Claude 3 Haiku is now activated!');
    console.log('🎉 Response:', responseBody.content[0].text);
    console.log('\n💰 Your AI for Bharat credits are working perfectly!');
    console.log('🔥 Real Claude AI is now enabled for your Sahayak AI platform!');
    
  } catch (error) {
    console.error('❌ Activation Error:', error.message);
    
    if (error.message.includes('INVALID_PAYMENT_INSTRUMENT')) {
      console.log('\n💡 Next Steps:');
      console.log('1. Go to AWS Console → Bedrock → Playgrounds');
      console.log('2. Select Claude 3 Haiku and send a test message');
      console.log('3. This will auto-enable the model for your account');
      console.log('4. Then try this script again');
    }
  }
}

activateClaude();