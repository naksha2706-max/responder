import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = ({ language, state, caseData }) => {
  const [braveMode, setBraveMode] = useState(false);
  const [identity, setIdentity] = useState({ name: '', contact: '' });
  const [followUpOptIn, setFollowUpOptIn] = useState(false);
  const navigate = useNavigate();

  const content = {
    en: {
      title: 'Your Report Summary',
      crisisType: 'Crisis Type',
      severity: 'Severity',
      complaint: 'Generated Complaint',
      braveMode: 'Brave Mode',
      braveModeDesc: 'Include your identity in the complaint (optional)',
      nameLabel: 'Your Name',
      contactLabel: 'Contact Information',
      resources: 'Recommended Resources',
      followUp: 'Follow-Up Check-In',
      followUpDesc: 'We\'ll check in with you in 48 hours to see how you\'re doing',
      downloadButton: 'Download Complaint',
      submitButton: 'Submit to Authorities',
      backButton: 'Back to Chat'
    },
    hi: {
      title: 'आपकी रिपोर्ट सारांश',
      crisisType: 'संकट प्रकार',
      severity: 'गंभीरता',
      complaint: 'उत्पन्न शिकायत',
      braveMode: 'ब्रेव मोड',
      braveModeDesc: 'शिकायत में अपनी पहचान शामिल करें (वैकल्पिक)',
      nameLabel: 'आपका नाम',
      contactLabel: 'संपर्क जानकारी',
      resources: 'अनुशंसित संसाधन',
      followUp: 'फॉलो-अप चेक-इन',
      followUpDesc: 'हम 48 घंटों में आपसे संपर्क करेंगे यह देखने के लिए कि आप कैसे हैं',
      downloadButton: 'शिकायत डाउनलोड करें',
      submitButton: 'अधिकारियों को सबमिट करें',
      backButton: 'चैट पर वापस जाएं'
    }
  };

  const text = content[language] || content.en;

  // Mock complaint data
  const complaint = caseData?.complaint || `
[Complaint Draft]

To: Internal Complaints Committee
Date: March 1, 2026
State: ${state || 'Not specified'}

Incident Description:
[Based on your conversation, we've identified this as a ${caseData?.crisisType || 'harassment'} incident]

Legal Framework:
- POSH Act 2013
- UGC Regulations 2009
${state === 'MH' ? '- Maharashtra Ragging Act' : ''}

Requested Actions:
1. Immediate investigation of the incident
2. Protection from further harassment
3. Appropriate disciplinary action

${braveMode && identity.name ? `\nSubmitted by: ${identity.name}\nContact: ${identity.contact}` : '\nSubmitted anonymously'}
  `.trim();

  return (
    <div className="result-page">
      <div className="result-container">
        <h1>{text.title}</h1>

        <div className="crisis-summary">
          <div className="summary-item">
            <span className="summary-label">{text.crisisType}:</span>
            <span className="summary-value">{caseData?.crisisType || 'Harassment'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{text.severity}:</span>
            <span className={`severity-badge ${caseData?.severity || 'medium'}`}>
              {caseData?.severity || 'Medium'}
            </span>
          </div>
        </div>

        <div className="complaint-section">
          <h2>{text.complaint}</h2>
          <textarea 
            className="complaint-text"
            value={complaint}
            readOnly
            rows={15}
          />
        </div>

        <div className="brave-mode-section">
          <div className="brave-mode-toggle">
            <input 
              type="checkbox"
              id="braveMode"
              checked={braveMode}
              onChange={(e) => setBraveMode(e.target.checked)}
            />
            <label htmlFor="braveMode">
              <strong>{text.braveMode}</strong>
              <span className="brave-mode-desc">{text.braveModeDesc}</span>
            </label>
          </div>

          {braveMode && (
            <div className="identity-form">
              <input 
                type="text"
                placeholder={text.nameLabel}
                value={identity.name}
                onChange={(e) => setIdentity({...identity, name: e.target.value})}
                className="identity-input"
              />
              <input 
                type="text"
                placeholder={text.contactLabel}
                value={identity.contact}
                onChange={(e) => setIdentity({...identity, contact: e.target.value})}
                className="identity-input"
              />
            </div>
          )}
        </div>

        <div className="follow-up-section">
          <div className="follow-up-toggle">
            <input 
              type="checkbox"
              id="followUp"
              checked={followUpOptIn}
              onChange={(e) => setFollowUpOptIn(e.target.checked)}
            />
            <label htmlFor="followUp">
              <strong>{text.followUp}</strong>
              <span className="follow-up-desc">{text.followUpDesc}</span>
            </label>
          </div>
        </div>

        <div className="action-buttons">
          <button className="download-button">
            📥 {text.downloadButton}
          </button>
          <button className="submit-button">
            📤 {text.submitButton}
          </button>
        </div>

        <button className="back-button" onClick={() => navigate('/chat')}>
          ← {text.backButton}
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
