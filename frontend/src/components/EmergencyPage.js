import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmergencyPage.css';

const EmergencyPage = ({ language, state }) => {
  const navigate = useNavigate();

  const emergencyContacts = {
    MH: { police: '100', ambulance: '108', women: '1091', childHelpline: '1098' },
    DL: { police: '100', ambulance: '102', women: '1091', childHelpline: '1098' },
    TN: { police: '100', ambulance: '108', women: '1091', childHelpline: '1098' },
    KA: { police: '100', ambulance: '108', women: '1091', childHelpline: '1098' },
    WB: { police: '100', ambulance: '102', women: '1091', childHelpline: '1098' }
  };

  const content = {
    en: {
      title: 'Emergency Help',
      subtitle: 'You are not alone. Help is available immediately.',
      mainButton: 'Call 112 - Emergency Services',
      stateContacts: 'State-Specific Emergency Numbers',
      police: 'Police',
      ambulance: 'Ambulance',
      women: 'Women Helpline',
      childHelpline: 'Child Helpline',
      safetyGuidance: 'Immediate Safety Steps',
      steps: [
        'Move to a safe, public location if possible',
        'Call emergency services (112) if in immediate danger',
        'Contact a trusted friend or family member',
        'Do not confront the person threatening you',
        'Preserve any evidence (messages, photos, recordings)',
        'Seek medical attention if injured'
      ],
      campusResources: 'Campus Emergency Resources',
      icc: 'Internal Complaints Committee (ICC)',
      antiRagging: 'Anti-Ragging Cell',
      security: 'Campus Security',
      counselor: 'Emergency Counselor',
      backButton: 'Back to Chat',
      note: 'This page bypasses normal classification. Your safety is the priority.'
    },
    hi: {
      title: 'आपातकालीन सहायता',
      subtitle: 'आप अकेले नहीं हैं। मदद तुरंत उपलब्ध है।',
      mainButton: '112 पर कॉल करें - आपातकालीन सेवाएं',
      stateContacts: 'राज्य-विशिष्ट आपातकालीन नंबर',
      police: 'पुलिस',
      ambulance: 'एम्बुलेंस',
      women: 'महिला हेल्पलाइन',
      childHelpline: 'बाल हेल्पलाइन',
      safetyGuidance: 'तत्काल सुरक्षा कदम',
      steps: [
        'यदि संभव हो तो सुरक्षित, सार्वजनिक स्थान पर जाएं',
        'तत्काल खतरे में होने पर आपातकालीन सेवाओं (112) को कॉल करें',
        'किसी विश्वसनीय मित्र या परिवार के सदस्य से संपर्क करें',
        'आपको धमकी देने वाले व्यक्ति का सामना न करें',
        'किसी भी सबूत को सुरक्षित रखें (संदेश, फोटो, रिकॉर्डिंग)',
        'घायल होने पर चिकित्सा सहायता लें'
      ],
      campusResources: 'कैंपस आपातकालीन संसाधन',
      icc: 'आंतरिक शिकायत समिति (ICC)',
      antiRagging: 'एंटी-रैगिंग सेल',
      security: 'कैंपस सुरक्षा',
      counselor: 'आपातकालीन परामर्शदाता',
      backButton: 'चैट पर वापस जाएं',
      note: 'यह पेज सामान्य वर्गीकरण को बायपास करता है। आपकी सुरक्षा प्राथमिकता है।'
    }
  };

  const text = content[language] || content.en;
  const contacts = emergencyContacts[state] || emergencyContacts.MH;

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="emergency-page">
      <div className="emergency-container">
        <div className="emergency-header">
          <div className="emergency-icon">🚨</div>
          <h1>{text.title}</h1>
          <p className="emergency-subtitle">{text.subtitle}</p>
        </div>

        <button 
          className="main-emergency-button"
          onClick={() => handleCall('112')}
        >
          📞 {text.mainButton}
        </button>

        <div className="state-contacts-section">
          <h2>{text.stateContacts}</h2>
          <div className="contacts-grid">
            <div className="contact-card" onClick={() => handleCall(contacts.police)}>
              <div className="contact-icon">👮</div>
              <div className="contact-label">{text.police}</div>
              <div className="contact-number">{contacts.police}</div>
            </div>
            <div className="contact-card" onClick={() => handleCall(contacts.ambulance)}>
              <div className="contact-icon">🚑</div>
              <div className="contact-label">{text.ambulance}</div>
              <div className="contact-number">{contacts.ambulance}</div>
            </div>
            <div className="contact-card" onClick={() => handleCall(contacts.women)}>
              <div className="contact-icon">👩</div>
              <div className="contact-label">{text.women}</div>
              <div className="contact-number">{contacts.women}</div>
            </div>
            <div className="contact-card" onClick={() => handleCall(contacts.childHelpline)}>
              <div className="contact-icon">👶</div>
              <div className="contact-label">{text.childHelpline}</div>
              <div className="contact-number">{contacts.childHelpline}</div>
            </div>
          </div>
        </div>

        <div className="safety-guidance-section">
          <h2>{text.safetyGuidance}</h2>
          <ul className="safety-steps">
            {text.steps.map((step, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="campus-resources-section">
          <h2>{text.campusResources}</h2>
          <div className="resource-list">
            <div className="resource-item">
              <span className="resource-icon">🏛️</span>
              <span className="resource-name">{text.icc}</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">🛡️</span>
              <span className="resource-name">{text.antiRagging}</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">🔒</span>
              <span className="resource-name">{text.security}</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">💬</span>
              <span className="resource-name">{text.counselor}</span>
            </div>
          </div>
        </div>

        <div className="emergency-note">
          ℹ️ {text.note}
        </div>

        <button 
          className="back-button"
          onClick={() => navigate('/chat')}
        >
          ← {text.backButton}
        </button>
      </div>
    </div>
  );
};

export default EmergencyPage;
