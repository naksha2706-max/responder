/**
 * Mock AI responses for demo purposes when Bedrock is not available
 */

export interface MockAIResponse {
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
}

const RAGGING_KEYWORDS = [
  'senior', 'seniors', 'pushups', 'push ups', 'hostel', 'ragging', 'rag', 'bully', 'bullying',
  'force', 'forced', 'make me do', 'humiliate', 'humiliation', 'junior', 'fresher'
];

const HARASSMENT_KEYWORDS = [
  'harass', 'harassment', 'inappropriate', 'uncomfortable', 'touch', 'comment', 'stare',
  'follow', 'message', 'text', 'photo', 'picture'
];

const MENTAL_HEALTH_KEYWORDS = [
  'depressed', 'depression', 'anxiety', 'anxious', 'stress', 'stressed', 'overwhelmed',
  'low', 'feeling low', 'sad', 'lonely', 'hopeless'
];

export function generateMockAIResponse(message: string, conversationHistory: any[] = []): MockAIResponse {
  const lowerMessage = message.toLowerCase();
  const messageCount = conversationHistory.length + 1; // +1 for current message
  
  // Check for ragging indicators
  const raggingMatches = RAGGING_KEYWORDS.filter(keyword => lowerMessage.includes(keyword));
  const harassmentMatches = HARASSMENT_KEYWORDS.filter(keyword => lowerMessage.includes(keyword));
  const mentalHealthMatches = MENTAL_HEALTH_KEYWORDS.filter(keyword => lowerMessage.includes(keyword));
  
  // Check conversation history for context
  const historyText = conversationHistory.map(msg => msg.content).join(' ').toLowerCase();
  const hasRaggingContext = RAGGING_KEYWORDS.some(keyword => historyText.includes(keyword));
  const hasHarassmentContext = HARASSMENT_KEYWORDS.some(keyword => historyText.includes(keyword));
  
  // CRITICAL: Classify after 2nd message (messageCount >= 2)
  const shouldClassify = messageCount >= 2;
  
  // Determine crisis type and response
  if (raggingMatches.length > 0 || hasRaggingContext) {
    if (!shouldClassify) {
      return {
        response: "I can hear that you're dealing with something difficult involving your seniors. That sounds really challenging and I want you to know that what you're experiencing isn't okay. Can you tell me more about what's been happening?",
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
    } else {
      return {
        response: "Thank you for sharing more details with me. What you're describing sounds like ragging, which is a serious issue and is actually illegal under UGC regulations. You have the right to be safe in your educational environment. I can help you understand your options for reporting this.",
        readyToClassify: true,
        safetyOverride: false,
        immediateRisk: false,
        emotionScore: 4,
        emotionTrend: 'increasing',
        classification: {
          crisisType: 'RAGGING',
          severity: 'HIGH',
          applicableLaw: 'UGC Anti-Ragging Regulations 2009',
          authority: 'Anti-Ragging Cell',
          contact: '1800-180-5522',
          complaintDraft: 'Subject: Formal Complaint Against Ragging Activities\n\nDear Anti-Ragging Committee,\n\nI am writing to formally report incidents of ragging that I have experienced at our institution. The incidents involve seniors forcing juniors to perform humiliating activities including physical exercises and threatening behavior.\n\nUnder the UGC Anti-Ragging Regulations 2009, ragging is a punishable offense. I request immediate investigation and action against the perpetrators.\n\nThe incidents have caused significant mental distress and created a hostile environment for students. I seek protection from further harassment and appropriate disciplinary action.\n\nI am willing to cooperate with the investigation while maintaining my safety and privacy.\n\nRespectfully submitted,\nA Concerned Student',
          immediateGuidance: 'You can file a complaint with your institution\'s Anti-Ragging Cell. You also have the right to contact the UGC Anti-Ragging Helpline at 1800-180-5522.',
          legalRight: 'Under UGC Anti-Ragging Regulations 2009, you have the right to education in a safe environment free from ragging. Ragging is a punishable offense.'
        }
      };
    }
  }
  
  if (harassmentMatches.length > 0 || hasHarassmentContext) {
    if (!shouldClassify) {
      return {
        response: "I understand you're experiencing harassment, and I want you to know that this is not acceptable. You deserve to feel safe and respected. Can you share more about what's been happening so I can better help you understand your options?",
        readyToClassify: false,
        safetyOverride: false,
        immediateRisk: false,
        emotionScore: 4,
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
    } else {
      return {
        response: "Thank you for sharing more details. What you're describing sounds like harassment, which is unacceptable and against institutional policies. You have the right to feel safe and respected in your educational environment.",
        readyToClassify: true,
        safetyOverride: false,
        immediateRisk: false,
        emotionScore: 4,
        emotionTrend: 'stable',
        classification: {
          crisisType: 'HARASSMENT',
          severity: 'MEDIUM',
          applicableLaw: 'POSH Act 2013',
          authority: 'ICC Committee',
          contact: '1091',
          complaintDraft: 'Subject: Formal Complaint Against Harassment\n\nDear Internal Complaints Committee,\n\nI am filing this complaint to report incidents of harassment that I have been experiencing. The behavior is making me uncomfortable and affecting my well-being and academic performance.\n\nUnder the POSH Act 2013, I have the right to study in an environment free from harassment. I request immediate investigation and appropriate action to address this matter and ensure my safety.\n\nI am willing to cooperate with the investigation process while maintaining my privacy and dignity.\n\nRespectfully submitted,\nA Concerned Student',
          immediateGuidance: 'You can file a complaint with your institution\'s Internal Complaints Committee (ICC) or contact the Women Helpline at 1091.',
          legalRight: 'Under the POSH Act 2013, you have the right to work and study in an environment free from sexual harassment.'
        }
      };
    }
  }
  
  if (mentalHealthMatches.length > 0) {
    if (!shouldClassify) {
      return {
        response: "I can hear that you're going through a really tough time right now. Feeling low and overwhelmed is difficult, and I want you to know that your feelings are valid. You don't have to go through this alone. Can you tell me more about what's been contributing to these feelings?",
        readyToClassify: false,
        safetyOverride: false,
        immediateRisk: false,
        emotionScore: 4,
        emotionTrend: 'increasing',
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
    } else {
      return {
        response: "Thank you for sharing your feelings with me. Mental health struggles are real and valid. You deserve support and care during this difficult time.",
        readyToClassify: true,
        safetyOverride: false,
        immediateRisk: false,
        emotionScore: 4,
        emotionTrend: 'increasing',
        classification: {
          crisisType: 'MENTAL_HEALTH',
          severity: 'MEDIUM',
          applicableLaw: 'Mental Healthcare Act 2017',
          authority: 'Campus Counseling Center',
          contact: '9152987821',
          complaintDraft: 'Subject: Request for Mental Health Support\n\nDear Counseling Services,\n\nI am reaching out to request mental health support as I have been experiencing emotional difficulties that are affecting my well-being and academic performance.\n\nI would appreciate access to counseling services and any other support resources available to help me through this challenging time.\n\nThank you for your understanding and support.\n\nRespectfully,\nA Student Seeking Help',
          immediateGuidance: 'You can contact your campus counseling center or call iCall at 9152987821 for immediate mental health support.',
          legalRight: 'Under the Mental Healthcare Act 2017, you have the right to access mental health services and support.'
        }
      };
    }
  }
  
  // Default empathetic response
  if (!shouldClassify) {
    return {
      response: "Hello. This is a safe space where you can share what's on your mind. I'm here to listen and support you. Take your time - what would you like to talk about?",
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
  }
  
  return {
    response: "Thank you for sharing that with me. I can hear that this situation is really affecting you. Being made to feel frustrated and controlled is not okay. You have the right to feel safe and respected. Can you tell me more about what specific things are happening?",
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
}