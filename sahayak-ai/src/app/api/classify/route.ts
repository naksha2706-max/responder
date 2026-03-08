/**
 * Crisis classification API route with pre-screening and mock AI
 * Handles trauma-informed crisis support with instant emergency detection
 */

import { NextRequest, NextResponse } from 'next/server';
import { multiLanguageEmergencyCheck, getImmediateCrisisResponse } from '@/lib/prescreen';
import { generateMockAIResponse } from '@/lib/mockAI';

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en', sessionId, conversationHistory = [] } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    console.log(`Processing message for session ${sessionId} in language ${language}`);

    // STEP 1: Pre-screening for emergency keywords (MUST RUN FIRST)
    const preScreenResult = multiLanguageEmergencyCheck(message);
    
    console.log('Pre-screen result:', preScreenResult);

    // STEP 2: Handle immediate emergencies (bypass AI for critical situations)
    // Only trigger for high confidence (0.5+) and very specific suicide/self-harm keywords
    if (preScreenResult.isEmergency && preScreenResult.confidence >= 0.5) {
      console.log(`EMERGENCY DETECTED: ${preScreenResult.emergencyType} (confidence: ${preScreenResult.confidence})`);
      
      const immediateResponse = getImmediateCrisisResponse(
        preScreenResult.emergencyType!,
        preScreenResult.language
      );
      
      // Return immediately - no AI call needed
      return NextResponse.json({
        response: immediateResponse,
        readyToClassify: false,
        safetyOverride: true,
        immediateRisk: true,
        emotionScore: 5,
        emotionTrend: 'increasing',
        classification: {
          crisisType: "MENTAL_HEALTH_EMERGENCY",
          severity: "EMERGENCY",
          applicableLaw: "",
          authority: "iCall Crisis Helpline",
          contact: "9152987821",
          complaintDraft: "",
          immediateGuidance: "Call iCall on 9152987821 immediately. Free and confidential.",
          legalRight: ""
        }
      });
    }

    // STEP 3: Try real Claude first, fall back to mock AI
    console.log('Attempting real Claude via Bedrock...');
    
    try {
      // Import Bedrock function
      const { callBedrock } = await import('@/lib/bedrock');
      
      // Try real Claude
      const realResponse = await callBedrock(message, conversationHistory);
      console.log('✅ Real Claude response received');
      
      return NextResponse.json(realResponse);
      
    } catch (bedrockError: any) {
      console.log('❌ Bedrock failed, using mock AI:', bedrockError?.message || bedrockError);
      
      // Fall back to mock AI
      const mockResponse = generateMockAIResponse(message, conversationHistory);
      
      console.log('Mock AI response generated:', {
        readyToClassify: mockResponse.readyToClassify,
        safetyOverride: mockResponse.safetyOverride,
        immediateRisk: mockResponse.immediateRisk,
        emotionScore: mockResponse.emotionScore
      });

      return NextResponse.json(mockResponse);
    }

  } catch (error) {
    console.error('Classification API error:', error);
    
    // Return safe fallback response
    const fallbackResponse = {
      response: "I'm here to help you. There seems to be a technical issue, but please know that support is available. If this is urgent, please contact emergency services at 112 or mental health support at 9152987821.",
      readyToClassify: false,
      safetyOverride: false,
      immediateRisk: false,
      emotionScore: 3,
      emotionTrend: 'stable',
      classification: {
        crisisType: null,
        severity: null,
        applicableLaw: '',
        authority: '',
        contact: '',
        complaintDraft: '',
        immediateGuidance: '',
        legalRight: ''
      }
    };
    
    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    service: 'crisis-classification-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}