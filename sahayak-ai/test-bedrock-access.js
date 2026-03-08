/**
 * Test Bedrock access with real AWS credentials
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

async function testBedrockAccess() {
  console.log('🔑 Testing Bedrock Access with Real AWS Credentials...\n');
  
  const client = new BedrockRuntimeClient({
    region: 'ap-south-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
    },
  });
  
  const testPayload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 100,
    temperature: 0.3,
    system: 'You are a helpful assistant.',
    messages: [
      {
        role: 'user',
        content: 'Hello, can you respond with "Bedrock is working!"?'
      }
    ]
  };
  
  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(testPayload),
  });
  
  try {
    console.log('📡 Calling Bedrock...');
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const message = responseBody.content[0].text;
    
    console.log('✅ SUCCESS! Bedrock Response:');
    console.log(`   "${message}"`);
    console.log('');
    console.log('🎉 Your AWS credentials are working!');
    console.log('🤖 Claude 3 Haiku is now connected to your Sahayak AI system!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Bedrock Error:', error.message);
    
    if (error.message.includes('UnrecognizedClientException')) {
      console.log('🔧 Issue: Invalid AWS credentials');
    } else if (error.message.includes('AccessDeniedException')) {
      console.log('🔧 Issue: Need to enable Bedrock model access');
      console.log('📋 Solution:');
      console.log('   1. Go to AWS Console → Bedrock');
      console.log('   2. Click "Model access" in left sidebar');
      console.log('   3. Click "Enable specific models"');
      console.log('   4. Enable "Claude 3 Haiku"');
      console.log('   5. Wait 2-3 minutes for activation');
    } else if (error.message.includes('ValidationException')) {
      console.log('🔧 Issue: Model not available in ap-south-1 region');
      console.log('📋 Solution: Try us-east-1 region instead');
    }
    
    return false;
  }
}

testBedrockAccess();