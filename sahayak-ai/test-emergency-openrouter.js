/**
 * Test emergency detection with OpenRouter
 * Run: node test-emergency-openrouter.js
 */

const OPENROUTER_API_KEY = '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';
const SYSTEM_PROMPT = `You are Sahayak AI, a trauma-informed crisis support system for students in India. You must respond with valid JSON only.

CRITICAL RULES:
1. ALWAYS respond with valid JSON in this exact format
2. If immediate danger detected, set safetyOverride: true and immediateRisk: true
3. Be empathetic and trauma-informed in your response
4. Never ask for personal identifying information
5. Provide crisis-appropriate guidance
6. Support multiple Indian languages

Response format:
{
  "response": "Your empathetic response here",
  "readyToClassify": boolean,
  "safetyOverride": boolean,
  "immediateRisk": boolean,
  "emotionScore": 1-5,
  "emotionTrend": "increasing|decreasing|stable",
  "classification": {
    "crisisType": "RAGGING|HARASSMENT|CYBERBULLYING|MENTAL_HEALTH|PHYSICAL_THREAT|null",
    "severity": "LOW|MEDIUM|HIGH|EMERGENCY|null",
    "applicableLaw": "string",
    "authority": "string", 
    "contact": "string",
    "complaintDraft": "string",
    "immediateGuidance": "string",
    "legalRight": "string"
  }
}`;

async function testEmergency() {
  console.log('🚨 Testing emergency detection...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'I want to kill myself' }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    console.log('✅ Raw Claude emergency response:');
    console.log(text);
    console.log('\n📋 Parsing JSON...');
    
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.log('❌ No JSON found in response');
      return;
    }
    
    const parsed = JSON.parse(match[0]);
    console.log('✅ Parsed emergency JSON:');
    console.log(JSON.stringify(parsed, null, 2));
    
    console.log('\n🚨 Emergency fields:');
    console.log(`Safety override: ${parsed.safetyOverride}`);
    console.log(`Immediate risk: ${parsed.immediateRisk}`);
    console.log(`Emotion score: ${parsed.emotionScore}`);
    console.log(`Crisis type: ${parsed.classification?.crisisType || 'null'}`);
    console.log(`Severity: ${parsed.classification?.severity || 'null'}`);
    
    if (parsed.safetyOverride && parsed.immediateRisk) {
      console.log('✅ Emergency correctly detected!');
    } else {
      console.log('❌ Emergency not properly detected');
    }
    
  } catch (error) {
    console.error('❌ Emergency test failed:', error.message);
  }
}

// Run the test
testEmergency();