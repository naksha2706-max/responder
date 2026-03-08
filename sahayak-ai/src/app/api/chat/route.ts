import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let language = 'en';
  let sessionId = '';
  
  try {
    const { message, language: reqLanguage = 'en', sessionId: reqSessionId, conversationHistory = [] } = await request.json();
    
    language = reqLanguage;
    sessionId = reqSessionId;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Forward to classification API for AI processing
    const classifyResponse = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
        sessionId,
        conversationHistory
      }),
    });

    if (!classifyResponse.ok) {
      throw new Error(`Classification API error: ${classifyResponse.status}`);
    }

    const classificationResult = await classifyResponse.json();
    
    // Transform response to match expected chat format
    const chatResponse = {
      response: classificationResult.response,
      crisisType: classificationResult.classification?.crisisType?.toLowerCase() || null,
      severityLevel: getSeverityLevel(classificationResult.classification?.severity),
      emotionScore: classificationResult.emotionScore,
      emotionTrend: classificationResult.emotionTrend,
      safetyOverride: classificationResult.safetyOverride,
      immediateRisk: classificationResult.immediateRisk,
      resources: classificationResult.emergencyContacts || [],
      classification: classificationResult.classification,
      readyToClassify: classificationResult.readyToClassify
    };

    return NextResponse.json(chatResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    const fallbackResponse = {
      response: language === 'hi' 
        ? "मुझे खुशी होगी कि मैं आपकी मदद कर सकूं। कृपया मुझे बताएं कि क्या हो रहा है।"
        : "I'm here to help you. Please tell me what's happening and I'll do my best to support you.",
      crisisType: null,
      severityLevel: 2,
      emotionScore: 3,
      emotionTrend: 'stable',
      safetyOverride: false,
      immediateRisk: false,
      resources: [
        {
          name: 'Emergency Services',
          phone: '112',
          available: '24/7'
        },
        {
          name: 'iCall Mental Health',
          phone: '9152987821',
          available: '24/7'
        }
      ],
      readyToClassify: false
    };
    
    return NextResponse.json(fallbackResponse);
  }
}

function getSeverityLevel(severity: string | null): number {
  switch (severity) {
    case 'LOW': return 1;
    case 'MEDIUM': return 2;
    case 'HIGH': return 3;
    case 'EMERGENCY': return 4;
    default: return 2;
  }
}