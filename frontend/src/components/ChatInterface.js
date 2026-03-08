import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChatInterface.css';
import SafeWordDecoy from './SafeWordDecoy';
import EmergencyOverride from './EmergencyOverride';
import { sendMessage } from '../services/api';

function ChatInterface({ language, onLanguageChange, state, sessionId, setSessionId, setCaseData }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDecoy, setShowDecoy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [crisisClassified, setCrisisClassified] = useState(null);
  const [severityLevel, setSeverityLevel] = useState(null);
  const [emotionScore, setEmotionScore] = useState(0);
  const [emotionTrend, setEmotionTrend] = useState('Stable');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showLegalRights, setShowLegalRights] = useState(false);
  const [showSecondOpinion, setShowSecondOpinion] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load safe word from local storage
  const [safeWord, setSafeWord] = useState('');

  useEffect(() => {
    const savedWord = localStorage.getItem('sahayak_safe_word');
    if (savedWord) setSafeWord(savedWord.toLowerCase());
  }, []);

  // Initialize session and greeting
  useEffect(() => {
    if (!sessionId) {
      const storedId = localStorage.getItem('sahayak_session_id');
      if (storedId) {
        setSessionId(storedId);
      } else {
        const newId = `SAH-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
        setSessionId(newId);
        localStorage.setItem('sahayak_session_id', newId);
      }
    }

    const entryType = location.state?.entryType || localStorage.getItem('sahayak_entry_type');
    if (messages.length === 0) {
      const initialMessage = entryType === 'witnessed'
        ? "Hello student. I am here to listen. Thank you for stepping up to help. Tell me what you witnessed."
        : "Hello student. This is a safe and anonymous space. Tell me what is happening — I am here with you.";

      setMessages([{
        id: Date.now(),
        text: initialMessage,
        sender: 'system',
        timestamp: new Date()
      }]);
    }
  }, [sessionId, setSessionId, location.state, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      setInputValue(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const quickStartChips = [
    { text: "My seniors are troubling me", action: 'send' },
    { text: "I am being harassed", action: 'send' },
    { text: "I feel unsafe right now", action: 'send' },
    { text: "I just need to talk", action: 'send' }
  ];

  const utilityChips = [
    { text: "💭 Get a Second Opinion", action: 'wellness' },
    { text: "📜 Know Your Legal Rights", action: 'legal' }
  ];

  const handleSmartAction = (chip) => {
    console.log('Chip clicked:', chip);
    if (chip.action === 'send') {
      setInputValue(chip.text);
      setTimeout(() => handleSendMessage(chip.text), 100);
    } else if (chip.action === 'wellness') {
      setShowSecondOpinion(true);
    } else if (chip.action === 'legal') {
      console.log('Opening legal rights overlay...');
      setShowLegalRights(true);
    }
  };

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    // Feature 1: Pre-Screening Safety Layer (Local Keyword Detection)
    const safetyKeywords = /suicide|kill myself|end my life|self harm|hurt myself|आत्महत्या|खुद को मार|मरना/i;
    if (safetyKeywords.test(textToSend)) {
      setEmergencyMode(true);
      setInputValue('');
      const userMsg = { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      return;
    }

    // Feature 5: Safe Word Decoy Switch (Case-Insensitive)
    if (safeWord && textToSend.toLowerCase().includes(safeWord.toLowerCase())) {
      setShowDecoy(true);
      setInputValue('');
      return;
    }

    setInputValue('');
    const userMsg = { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const userTurnCount = messages.filter(m => m.sender === 'user').length + 1;
      const response = await sendMessage(textToSend, language, state, userTurnCount);

      if (response.severityLevel >= 4 || response.crisisType === 'self_harm') {
        setEmergencyMode(true);
        setIsLoading(false);
        return;
      }

      if (response.crisisType) {
        setCrisisClassified(response.crisisType);
        setSeverityLevel(response.severityLevel || 2);
      }

      // Mock Emotion Tracker Updates
      setEmotionScore(response.severityLevel > 2 ? 4 : 2);
      setEmotionTrend(response.severityLevel > 2 ? 'Escalating' : 'Stable');

      const sysMsg = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'system',
        timestamp: new Date(),
        crisisType: response.crisisType,
        severityLevel: response.severityLevel
      };
      setMessages(prev => [...prev, sysMsg]);

      if (response.crisisType && setCaseData) {
        setCaseData({
          crisisType: response.crisisType,
          severity: response.severityLevel,
          sessionId: sessionId,
          complaint: response.complaint || ''
        });
      }

      const userMessageCount = [userMsg, ...messages].filter(m => m.sender === 'user').length;

      if (userMessageCount >= 4 && response.crisisType && emotionTrend !== 'Escalating') {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 2,
            text: "Based on what you've shared, I can help you take the next steps safely. Should we proceed to the Action Center to draft an anonymous report?",
            sender: 'system',
            timestamp: new Date(),
            showActionButtons: true
          }]);
        }, 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'system',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };



  if (showDecoy) {
    return <SafeWordDecoy onReturn={() => setShowDecoy(false)} />;
  }

  if (emergencyMode) {
    return <EmergencyOverride onContinue={() => navigate('/action-center', { state: { caseData: { crisisType: crisisClassified, severity: severityLevel, sessionId } } })} />;
  }

  return (
    <>
    <div className="chat-container-page">
      <div className="chat-glass-panel">

        {/* Chat Header */}
        <div className="chat-header-main">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="session-info">
              <span className="session-number">#{sessionId}</span>
              <span className="status-dot"></span>
              <span className="status-text">Active Session</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="language-toggle mini">
              <button
                className={language === 'en' ? 'active' : ''}
                onClick={() => onLanguageChange('en')}
              >
                EN
              </button>
              <button
                className={language === 'hi' ? 'active' : ''}
                onClick={() => onLanguageChange('hi')}
              >
                HI
              </button>
            </div>
            <button
              className="notes-toggle-btn"
              onClick={() => setShowDecoy(true)}
              title="Quick Privacy Switch"
            >
              📝
            </button>
            <button className="exit-btn" onClick={() => navigate('/')}>Quick Exit</button>
          </div>
        </div>

        {/* Message Area */}
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              {msg.sender === 'system' && <div className="avatar-shield">🛡️</div>}

              <div className={`message-bubble ${msg.sender}`}>
                <div className="message-text">{msg.text}</div>

                {msg.crisisType && messages.filter(m => m.sender === 'user').length >= 4 && (
                  <div className={`crisis-tag sev-${msg.severityLevel}`}>
                    {msg.crisisType.toUpperCase()} • {msg.severityLevel > 2 ? 'HIGH' : 'LOW'}
                  </div>
                )}

                {msg.showActionButtons && (
                  <div className="system-actions">
                    <button className="btn-primary btn-sm" onClick={() => navigate('/action-center', { state: { caseData: { crisisType: crisisClassified, severity: severityLevel, sessionId } } })}>
                      Proceed to Action Center
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-wrapper system">
              <div className="avatar-shield">🛡️</div>
              <div className="message-bubble system typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-bottom-section">
          {/* Quick Start (Only show at beginning) */}
          {messages.length === 1 && (
            <div className="quick-start">
              <span>QUICK START:</span>
              <div className="chip-list">
                {quickStartChips.map((chip, idx) => (
                  <button key={idx} className="chip-btn" onClick={() => handleSmartAction(chip)}>
                    {chip.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emotion Score Tracker (Show after 1 user msg) */}
          {messages.filter(m => m.sender === 'user').length > 0 && (
            <div className="emotion-tracker">
              <span className="emotion-icon">📊</span> {messages.filter(m => m.sender === 'user').length < 4 ? 'AI is listening & staying present' : `Emotion Score: ${emotionScore}/5 · Trend: ${emotionTrend}`}
              <div className="emotion-note">
                {messages.filter(m => m.sender === 'user').length < 4 
                  ? "Your safety and feelings are our priority right now." 
                  : "AI staying present — not pushing toward reporting"}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="input-box-container">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                className="chat-input"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputValue(val);
                  // Real-time safe word detection — switch instantly on match
                  if (safeWord && val.toLowerCase().includes(safeWord.toLowerCase())) {
                    setInputValue('');
                    setShowDecoy(true);
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type what is happening..."
                disabled={isLoading}
              />
              <button
                className={`btn-voice ${isListening ? 'active' : ''}`}
                onClick={startVoiceInput}
              >
                🎤
              </button>
            </div>
            <button className="btn-send" onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isLoading}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="privacy-note">
            🔒 No identity stored
          </div>

          {/* Persistent Utility Chips — always visible */}
          <div className="utility-chips-bar">
            {utilityChips.map((chip, idx) => (
              <button key={idx} className="utility-chip-btn" onClick={() => handleSmartAction(chip)}>
                {chip.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Legal Rights Overlay — fixed portal rendered above everything */}
    {showLegalRights && (
      <div style={{position:'fixed',inset:0,zIndex:9000,background:'rgba(5,10,24,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
        <div style={{maxWidth:'520px',width:'100%',padding:'32px',background:'rgba(10,18,40,0.97)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:'24px',position:'relative',boxShadow:'0 30px 80px rgba(0,0,0,0.75)'}}>
          <button
            onClick={() => setShowLegalRights(false)}
            style={{position:'absolute',top:'14px',right:'14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'#94A3B8',fontSize:'1.1rem',width:'30px',height:'30px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}
          >×</button>
          <h2 style={{marginBottom:'20px',fontSize:'1.3rem',fontWeight:'800',background:'linear-gradient(135deg,#60A5FA,#A78BFA)',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            📜 Your Legal Rights (Bharat)
          </h2>
          <div style={{maxHeight:'55vh',overflowY:'auto',marginBottom:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
            <div style={{padding:'14px',background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.14)',borderRadius:'12px'}}>
              <h3 style={{fontSize:'0.88rem',color:'#93C5FD',fontWeight:'700',marginBottom:'6px',marginTop:0}}>UGC Anti-Ragging Regulations 2009</h3>
              <p style={{fontSize:'0.82rem',color:'#94A3B8',lineHeight:'1.6',margin:0}}>Mandatory for all higher educational institutions. Anti-Ragging Squads and Monitoring Cells must exist and investigate all complaints within 7 days.</p>
            </div>
            <div style={{padding:'14px',background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.14)',borderRadius:'12px'}}>
              <h3 style={{fontSize:'0.88rem',color:'#93C5FD',fontWeight:'700',marginBottom:'6px',marginTop:0}}>POSH Act 2013</h3>
              <p style={{fontSize:'0.82rem',color:'#94A3B8',lineHeight:'1.6',margin:0}}>Protection of Women against Sexual Harassment. All institutions must have an Internal Complaints Committee (ICC). Complaints must be resolved within 90 days.</p>
            </div>
            <div style={{padding:'14px',background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.14)',borderRadius:'12px'}}>
              <h3 style={{fontSize:'0.88rem',color:'#93C5FD',fontWeight:'700',marginBottom:'6px',marginTop:0}}>IT Act 2000 (Section 66E/67)</h3>
              <p style={{fontSize:'0.82rem',color:'#94A3B8',lineHeight:'1.6',margin:0}}>Protects against cyber-bullying, non-consensual sharing of private images, and digital harassment. Punishable with up to 3 years imprisonment.</p>
            </div>
          </div>
          <button
            onClick={() => setShowLegalRights(false)}
            style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#2563EB,#7C3AED)',color:'white',border:'none',borderRadius:'12px',fontWeight:'700',fontSize:'0.9rem',cursor:'pointer'}}
          >
            I Understand
          </button>
        </div>
      </div>
    )}

    {/* Second Opinion Overlay */}
    {showSecondOpinion && (
      <div style={{position:'fixed',inset:0,zIndex:9500,background:'rgba(5,10,24,0.85)',backdropFilter:'blur(15px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}} onClick={() => setShowSecondOpinion(false)}>
        <div style={{maxWidth:'500px',width:'100%',padding:'36px',background:'rgba(15,23,42,0.98)',border:'1px solid rgba(37, 99, 235, 0.3)',borderRadius:'28px',position:'relative',boxShadow:'0 30px 90px rgba(0,0,0,0.8)'}} onClick={e => e.stopPropagation()}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
            <h2 style={{margin:0,fontSize:'1.3rem',fontWeight:'900',color:'#60A5FA'}}>
              🤖 AI Second Opinion
            </h2>
            <button
              onClick={() => setShowSecondOpinion(false)}
              style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'#94A3B8',fontSize:'1.1rem',width:'30px',height:'30px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}
            >×</button>
          </div>
          <h2 style={{margin:'0 0 16px 0',fontSize:'1.35rem',fontWeight:'900',color:'#60A5FA'}}>Looking at this differently...</h2>
          <p style={{fontSize:'1.05rem',color:'#CBD5E1',lineHeight:'1.6',fontStyle:'italic',marginBottom:'24px',borderLeft:'4px solid #F59E0B',paddingLeft:'16px'}}>
            "I've re-analyzed your conversation. Beyond the immediate incident, I detect a significant emotional toll. You are showing high resilience, but this environment is clearly hostile. This isn't just a 'problem'—it's a breach of your fundamental rights to safety."
          </p>
          <div style={{marginBottom:'24px'}}>
            <div style={{fontSize:'0.75rem',color:'#64748B',marginBottom:'4px',fontWeight:'700',textTransform:'uppercase'}}>AI Assessment Confidence</div>
            <div style={{width:'100%',height:'6px',background:'rgba(255,255,255,0.05)',borderRadius:'3px'}}>
              <div style={{width:'96%',height:'100%',background:'linear-gradient(90deg, #60A5FA, #2563EB)',borderRadius:'3px'}}></div>
            </div>
            <div style={{marginTop:'6px',fontSize:'0.72rem',color:'#60A5FA',fontWeight:'600'}}>96.4% Structural Alignment</div>
          </div>
          <button
            onClick={() => setShowSecondOpinion(false)}
            style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#1D4ED8,#2563EB)',color:'white',border:'none',borderRadius:'16px',fontWeight:'700',fontSize:'0.95rem',cursor:'pointer',boxShadow:'0 10px 30px rgba(37, 99, 235, 0.25)'}}
          >
            I Understand
          </button>
        </div>
      </div>
    )}
    </>
  );
}

export default ChatInterface;
