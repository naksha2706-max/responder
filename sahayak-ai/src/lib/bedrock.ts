/**
 * OpenRouter client for Claude 3 Haiku integration
 * Handles AI model invocation with timeout and error handling
 */

import { SYSTEM_PROMPT } from './prompts';

// OpenRouter Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const CLAUDE_MODEL = 'anthropic/claude-3-haiku';
const BEDROCK_REGION = process.env.AWS_REGION || 'ap-south-1';
const BEDROCK_MODEL = 'anthropic.claude-3-haiku-20240307-v1:0';

export interface BedrockRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  language?: string;
  sessionId: string;
}

export interface BedrockResponse {
  response: string;
  readyToClassify: boolean;
  safetyOverride: boolean;
  immediateRisk: boolean;
  emotionScore: number;
  emotionTrend: 'increasing' | 'decreasing' | 'stable';
  classification: {
    crisisType: 'RAGGING' | 'HARASSMENT' | 'CYBERBULLYING' | 'MENTAL_HEALTH' | 'PHYSICAL_THREAT' | null;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' | null;
    applicableLaw: string;
    authority: string;
    contact: string;
    complaintDraft: string;
    immediateGuidance: string;
    legalRight: string;
  };
  emergencyContacts?: Array<{name: string, phone: string, available: string}>;
}

// Fallback response for errors
const FALLBACK = {
  response: "I am here with you. If you are in immediate danger please call 112.",
  readyToClassify: false,
  safetyOverride: false,
  immediateRisk: false,
  emotionScore: 3,
  emotionTrend: "stable" as const,
  classification: {
    crisisType: null,
    severity: null,
    applicableLaw: "",
    authority: "",
    contact: "",
    complaintDraft: "",
    immediateGuidance: "",
    legalRight: ""
  }
};

/**
 * Invokes Claude 3 Haiku model via OpenRouter with timeout handling
 */
export async function invokeClaude(request: BedrockRequest): Promise<BedrockResponse> {
  const { message, conversationHistory = [], language = 'en', sessionId } = request;
  
  // Build conversation context
  const messages = [
    ...conversationHistory,
    {
      role: 'user' as const,
      content: message
    }
  ];
  
  try {
    console.log('🚀 Calling real Claude via OpenRouter...');
    
    // Set up timeout promise (8 seconds)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('OpenRouter request timeout after 8 seconds'));
      }, 8000);
    });
    
    // OpenRouter API call
    const apiCall = fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Model-Region': BEDROCK_REGION,
        'X-Model-Id': BEDROCK_MODEL
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });
    
    // Race between API call and timeout
    const response = await Promise.race([apiCall, timeoutPromise]);
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const text = data.choices[0].message.content;
    
    console.log('✅ Real Claude response received:', text.substring(0, 100) + '...');
    console.log('🔍 Full response length:', text.length);
    
    // Parse the JSON response from Claude - handle multiline JSON
    let match = text.match(/\{[\s\S]*\}/);
    console.log('🔍 Regex match found:', !!match);
    
    if (!match) {
      // Try to find JSON in the response more aggressively
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      console.log('🔍 JSON start/end positions:', jsonStart, jsonEnd);
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        match = [text.substring(jsonStart, jsonEnd + 1)];
        console.log('🔍 Extracted JSON manually');
      }
    }
    
    if (!match) {
      console.log('❌ No JSON found in Claude response, using fallback');
      console.log('Full Claude response:', text);
      
      // Import and use mock AI for demo
      const { generateMockAIResponse } = await import('./mockAI');
      const mockResponse = generateMockAIResponse(message, conversationHistory);
      
      // Convert mock response to BedrockResponse format
      const fallbackResponse: BedrockResponse = {
        response: mockResponse.response,
        readyToClassify: mockResponse.readyToClassify,
        safetyOverride: mockResponse.safetyOverride,
        immediateRisk: mockResponse.immediateRisk,
        emotionScore: mockResponse.emotionScore,
        emotionTrend: mockResponse.emotionTrend,
        classification: mockResponse.classification
      };
      
      return fallbackResponse;
    }
    
    let parsedResponse;
    try {
      // Clean up the JSON string - remove any extra whitespace and normalize
      const cleanJson = match[0].replace(/\s+/g, ' ').trim();
      parsedResponse = JSON.parse(match[0]); // Use original match, not cleaned version
      console.log('✅ Successfully parsed Claude JSON response');
    } catch (parseError) {
      console.log('❌ JSON parse error, using fallback');
      console.log('Parse error:', parseError);
      console.log('Attempted to parse first 200 chars:', match[0].substring(0, 200) + '...');
      
      // Import and use mock AI for demo
      const { generateMockAIResponse } = await import('./mockAI');
      const mockResponse = generateMockAIResponse(message, conversationHistory);
      
      // Convert mock response to BedrockResponse format
      const fallbackResponse: BedrockResponse = {
        response: mockResponse.response,
        readyToClassify: mockResponse.readyToClassify,
        safetyOverride: mockResponse.safetyOverride,
        immediateRisk: mockResponse.immediateRisk,
        emotionScore: mockResponse.emotionScore,
        emotionTrend: mockResponse.emotionTrend,
        classification: mockResponse.classification
      };
      
      return fallbackResponse;
    }
    
    // Validate required fields
    if (!parsedResponse.response) {
      parsedResponse.response = "I'm here to listen and help. Can you share more about what you're experiencing?";
    }
    
    return parsedResponse;
    
  } catch (error) {
    console.error('❌ OpenRouter invocation error:', error);
    console.log('🔄 Falling back to mock AI response...');
    
    // Import and use mock AI for demo
    const { generateMockAIResponse } = await import('./mockAI');
    const mockResponse = generateMockAIResponse(message, conversationHistory);
    
    // Convert mock response to BedrockResponse format
    const fallbackResponse: BedrockResponse = {
      response: mockResponse.response,
      readyToClassify: mockResponse.readyToClassify,
      safetyOverride: mockResponse.safetyOverride,
      immediateRisk: mockResponse.immediateRisk,
      emotionScore: mockResponse.emotionScore,
      emotionTrend: mockResponse.emotionTrend,
      classification: mockResponse.classification
    };
    
    return fallbackResponse;
  }
}

/**
 * Legacy function name for backward compatibility
 */
export async function callBedrock(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>) {
  return invokeClaude({
    message,
    conversationHistory: history,
    sessionId: 'legacy-call'
  });
}

/**
 * Validates Bedrock response structure
 */
export function validateBedrockResponse(response: any): response is BedrockResponse {
  return (
    typeof response === 'object' &&
    typeof response.response === 'string' &&
    typeof response.readyToClassify === 'boolean' &&
    typeof response.safetyOverride === 'boolean' &&
    typeof response.immediateRisk === 'boolean' &&
    typeof response.emotionScore === 'number' &&
    typeof response.emotionTrend === 'string' &&
    typeof response.classification === 'object'
  );
}

/**
 * Gets emergency contact information based on crisis type and location
 */
export function getEmergencyContacts(crisisType: string, state: string = 'MH'): Array<{name: string, phone: string, available: string}> {
  const contacts = {
    MENTAL_HEALTH: [
      { name: 'iCall Psychosocial Helpline', phone: '9152987821', available: '24/7' },
      { name: 'Vandrevala Foundation', phone: '9999666555', available: '24/7' },
      { name: 'AASRA', phone: '9820466726', available: '24/7' }
    ],
    PHYSICAL_THREAT: [
      { name: 'Police Emergency', phone: '112', available: '24/7' },
      { name: 'Women Helpline', phone: '1091', available: '24/7' },
      { name: 'Student Safety Helpline', phone: '1800-180-1253', available: '24/7' }
    ],
    HARASSMENT: [
      { name: 'Women Helpline', phone: '1091', available: '24/7' },
      { name: 'NCW Helpline', phone: '7827170170', available: '24/7' },
      { name: 'Legal Aid Helpline', phone: '15100', available: '9 AM - 6 PM' }
    ],
    RAGGING: [
      { name: 'UGC Anti-Ragging Helpline', phone: '1800-180-5522', available: '24/7' },
      { name: 'Student Grievance Portal', phone: '1800-111-656', available: '9 AM - 6 PM' }
    ],
    CYBERBULLYING: [
      { name: 'Cyber Crime Helpline', phone: '1930', available: '24/7' },
      { name: 'National Cyber Security Helpline', phone: '1800-11-4949', available: '24/7' }
    ]
  };
  
  return contacts[crisisType as keyof typeof contacts] || contacts.MENTAL_HEALTH;
}