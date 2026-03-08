import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SafeWordModal from './SafeWordModal';
import './WelcomeScreen.css';

const WelcomeScreen = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('choice'); // 'choice', 'student'
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [isSafeWordModalOpen, setIsSafeWordModalOpen] = useState(false);

  const content = {
    en: {
      title: 'SAHAYAK AI',
      subtitle: 'AI FIRST RESPONDER - BHARAT',
      choiceTitle: 'Welcome to Sahayak AI',
      choiceSubtitle: 'Please select your portal to continue',
      studentPortal: 'Student Portal',
      studentDesc: 'Anonymous reporting & AI support',
      adminPortal: 'Admin Console',
      adminDesc: 'Institutional oversight & analytics',
      quotes: [
        '"What happened to you is not your fault."',
        '"Seeking help is a sign of strength."',
        '"You are not alone in this."',
        '"Your courage can change everything."',
        '"Speaking up is the first step to healing."',
        '"Every voice matters."'
      ],
      experienced: 'I experienced something',
      witnessed: 'I witnessed something',
      safeWordSetup: 'Set a safe word for privacy',
      ugcCompliance: 'UGC Regulations 2009 • POSH Act 2013 • IT Act 2000',
      poweredBy: 'POWERED BY TRUSTED AUTHORITIES',
      updateStatus: 'Update Case Status',
      footer: 'Sahayak AI is a secure initiative for student safety in Bharat.'
    },
    hi: {
      title: 'सहायक AI',
      subtitle: 'एआई फर्स्ट रेस्पोंडर - भारत',
      choiceTitle: 'सहायक AI में आपका स्वागत है',
      choiceSubtitle: 'जारी रखने के लिए कृपया अपना पोर्टल चुनें',
      studentPortal: 'छात्र पोर्टल',
      studentDesc: 'गुमनाम रिपोर्टिंग और AI समर्थन',
      adminPortal: 'प्रशासक कंसोल',
      adminDesc: 'संस्थागत निरीक्षण और विश्लेषण',
      quotes: [
        '"जो आपके साथ हुआ वह आपकी गलती नहीं है।"',
        '"मदद मांगना ताकत का संकेत है।"',
        '"आप इसमें अकेले नहीं हैं।"'
      ],
      experienced: 'मैंने कुछ अनुभव किया',
      witnessed: 'मैंने कुछ देखा',
      safeWordSetup: 'गोपनीयता के लिए एक सुरक्षित शब्द सेट करें',
      ugcCompliance: 'यूजीसी विनियम 2009 • पॉश अधिनियम 2013 • आईटी अधिनियम 2000',
      poweredBy: 'विश्वसनीय अधिकारियों द्वारा संचालित',
      updateStatus: 'केस की स्थिति अपडेट करें',
      footer: 'सहायक AI भारत में छात्र सुरक्षा के लिए एक सुरक्षित पहल है।'
    }
  };

  const text = content[language] || content.en;

  useEffect(() => {
    const generateSessionId = () => {
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const postfix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `SAH-${randomNum}-${postfix}`;
    };
    setSessionId(generateSessionId());
  }, []);

  useEffect(() => {
    if (view === 'student') {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) =>
          (prevIndex + 1) % text.quotes.length
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [view, text.quotes.length]);

  const handleEntryPoint = (type) => {
    localStorage.setItem('sahayak_session_id', sessionId);
    localStorage.setItem('sahayak_entry_type', type);
    navigate('/chat', { state: { entryType: type, sessionId } });
  };

  if (view === 'choice') {
    return (
      <div className="landing-page fade-in">
        <div className="landing-content glass-panel choice-container">
          <div className="app-header">
            <div className="shield-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#1e40af" />
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="app-title">{text.title}</h1>
            <h2 className="choice-title">{text.choiceTitle}</h2>
            <p className="choice-subtitle">{text.choiceSubtitle}</p>
          </div>

          <div className="choice-grid">
            <div className="choice-card premium-card" onClick={() => setView('student')}>
              <div className="choice-icon">🎓</div>
              <h3>{text.studentPortal}</h3>
              <p>{text.studentDesc}</p>
            </div>
            <div className="choice-card premium-card" onClick={() => navigate('/admin')}>
              <div className="choice-icon">🏢</div>
              <h3>{text.adminPortal}</h3>
              <p>{text.adminDesc}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page fade-in">
      <SafeWordModal
        isOpen={isSafeWordModalOpen}
        onClose={() => setIsSafeWordModalOpen(false)}
        onSave={(word) => console.log('Saved safe word:', word)}
      />

      <div className="landing-content glass-panel">
        <div className="main-section">
          <div className="portal-header">
            <button className="back-to-choice" onClick={() => setView('choice')}>
              ← Choose Role
            </button>
            <div className="portal-controls">
              <div className="language-toggle">
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
              <span className="portal-badge student">Student Portal</span>
            </div>
          </div>

          <div className="app-header">
            <div className="shield-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#1e40af" />
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="app-title">{text.title}</h1>
            <p className="app-subtitle">{text.subtitle}</p>
          </div>

          <div className="feature-badges">
            <span className="badge">🔒 Anonymous</span>
            <span className="badge">⏰ 24/7</span>
            <span className="badge">🌐 Multilingual</span>
            <span className="badge bg-blue">✅ Safe</span>
          </div>

          <div className="quote-box">
            <p className="rotating-quote">
              {text.quotes[currentQuoteIndex]}
            </p>
            <span className="rotate-indicator">↻ Rotates every 4 seconds</span>
          </div>

          <div className="entry-buttons">
            <button className="btn-primary" onClick={() => handleEntryPoint('experienced')}>
              <span className="btn-icon">✍️</span> {text.experienced}
            </button>
            <button className="btn-secondary" onClick={() => handleEntryPoint('witnessed')}>
              <span className="btn-icon">👁️</span> {text.witnessed}
            </button>
            <button className="btn-outline-glow" onClick={() => navigate('/progress-update')}>
              <span className="btn-icon">📈</span> {text.updateStatus}
            </button>
          </div>

          <div className="safe-word-section">
            <button className="safe-word-link" onClick={() => setIsSafeWordModalOpen(true)}>
              🔒 {text.safeWordSetup}
            </button>
          </div>

          <div className="branding-section">
            <p className="powered-by-text">{text.poweredBy}</p>
            <div className="logo-strip">
              <div className="brand-logo">🏛️ <span>ICC</span></div>
              <div className="brand-logo">🛡️ <span>Anti-Ragging</span></div>
              <div className="brand-logo">📞 <span>iCall</span></div>
              <div className="brand-logo">🚓 <span>112</span></div>
            </div>
            <p className="legal-compliance">{text.ugcCompliance}</p>
          </div>

          <div className="landing-footer">
            {text.footer}
            <div className="trust-tagline">
              🔒 Every report is time-stamped &amp; sealed — your college cannot delete what you share with Sahayak.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
