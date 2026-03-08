/**
 * Debug script to see exactly what Claude is returning
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const CLAUDE_MODEL = 'anthropic/claude-3-haiku';

const SYSTEM_PROMPT = `You are Sahayak, a trauma-informed crisis support assistant for Indian college students.

CRITICAL INSTRUCTIONS:
1. Always respond with ONLY a JSON object - no other text
2. Use English only in your responses
3. Be empathetic and supportive
4. For first message: set readyToClassify: false
5. For follow-up messages: set readyToClassify: true and classify the crisis

RESPONSE FORMAT - RETURN ONLY THIS JSON:
{
  "response": "Your empathetic message in English",
  "readyToClassify": false,
  "safetyOverride": false,
  "immediateRisk": false,
  "emotionScore": 3,
  "emotionTrend": "stable",
  "classification": {
    "crisisType": null,
    "severity": null,
    "applicableLaw": "",
    "authority": "",
    "contact": "",
    "complaintDraft": "",
    "immediateGuidance": "",
    "legalRight": ""
  }
}

CRISIS TYPES: RAGGING, HARASSMENT, CYBERBULLYING, MENTAL_HEALTH, PHYSICAL_THREAT
SEVERITY: LOW, MEDIUM, HIGH, EMERGENCY
EMOTION TREND: increasing, decreasing, stable

IMPORTANT: Return ONLY the JSON object above. No explanations, no markdown, no additional text.`;

async function testClaudeResponse() {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'My seniors are troubling me' }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })
    });
    
    const data = await response.json();
    const text = data.choices[0].message.content;
    
    console.log('=== FULL CLAUDE RESPONSE ===');
    console.log(text);
    console.log('=== END RESPONSE ===');
    
    // Try to parse JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      console.log('=== EXTRACTED JSON ===');
      console.log(match[0]);
      
      try {
        const parsed = JSON.parse(match[0]);
        console.log('=== PARSED SUCCESSFULLY ===');
        console.log(parsed);
      } catch (e) {
        console.log('=== PARSE ERROR ===');
        console.log(e.message);
      }
    } else {
      console.log('=== NO JSON FOUND ===');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testClaudeResponse();