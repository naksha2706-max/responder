// Try different Claude models to see which one works with AI for Bharat credits
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
  },
});

const models = [
  'anthropic.claude-3-haiku-20240307-v1:0',
  'anthropic.claude-3-sonnet-20240229-v1:0',
  'anthropic.claude-3-5-sonnet-20240620-v1:0'
];

async function tryModel(modelId) {
  try {
    console.log(`🧪 Testing ${modelId}...`);
    
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 50,
      temperature: 0.3,
      system: 'You are a helpful AI assistant.',
      messages: [
        {
          role: 'user',
          content: 'Hello! Say "AI for Bharat credits working!"'
        }
      ]
    };
    
    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });
    
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log(`✅ SUCCESS with ${modelId}!`);
    console.log(`🎉 Response: ${responseBody.content[0].text}`);
    return true;
    
  } catch (error) {
    console.log(`❌ ${modelId} failed: ${error.message.substring(0, 100)}...`);
    return false;
  }
}

async function testAllModels() {
  console.log('🚀 Testing different Claude models with your AI for Bharat credits...\n');
  
  for (const model of models) {
    const success = await tryModel(model);
    if (success) {
      console.log(`\n🎯 FOUND WORKING MODEL: ${model}`);
      console.log('💰 Your AI for Bharat credits are active!');
      break;
    }
    console.log(''); // Empty line between tests
  }
}

testAllModels();