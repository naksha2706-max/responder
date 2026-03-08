import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SafeWordSetup.css';

const SafeWordSetup = ({ language, onComplete }) => {
  const [safeWord, setSafeWord] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const content = {
    en: {
      title: 'Set Up Your Safe Word',
      subtitle: 'Create a secret word that instantly hides this conversation',
      description: 'If someone approaches while you\'re chatting, simply say or type your safe word. The screen will immediately switch to a decoy page that looks like class notes.',
      inputLabel: 'Enter Your Safe Word',
      inputPlaceholder: 'e.g., "notebook", "coffee", "library"',
      privacy: '🔒 Your safe word is stored only on your device and never sent to our servers',
      previewButton: 'Preview Decoy Screen',
      skipButton: 'Skip (Not Recommended)',
      continueButton: 'Continue to Chat',
      previewTitle: 'Decoy Screen Preview',
      previewClose: 'Close Preview',
      decoyContent: {
        title: 'Computer Science Notes - Data Structures',
        date: 'March 1, 2026',
        topics: [
          'Arrays and Linked Lists',
          'Stack and Queue Implementation',
          'Binary Search Trees',
          'Hash Tables and Collision Resolution'
        ],
        notes: 'Remember to review sorting algorithms for the upcoming exam. Focus on time complexity analysis.'
      }
    },
    hi: {
      title: 'अपना सुरक्षित शब्द सेट करें',
      subtitle: 'एक गुप्त शब्द बनाएं जो तुरंत इस बातचीत को छुपा देता है',
      description: 'यदि आप चैट करते समय कोई पास आता है, तो बस अपना सुरक्षित शब्द बोलें या टाइप करें। स्क्रीन तुरंत एक डिकॉय पेज पर स्विच हो जाएगी जो कक्षा के नोट्स जैसी दिखती है।',
      inputLabel: 'अपना सुरक्षित शब्द दर्ज करें',
      inputPlaceholder: 'उदा., "नोटबुक", "कॉफी", "लाइब्रेरी"',
      privacy: '🔒 आपका सुरक्षित शब्द केवल आपके डिवाइस पर संग्रहीत है और कभी भी हमारे सर्वर पर नहीं भेजा जाता',
      previewButton: 'डिकॉय स्क्रीन पूर्वावलोकन',
      skipButton: 'छोड़ें (अनुशंसित नहीं)',
      continueButton: 'चैट पर जारी रखें',
      previewTitle: 'डिकॉय स्क्रीन पूर्वावलोकन',
      previewClose: 'पूर्वावलोकन बंद करें',
      decoyContent: {
        title: 'कंप्यूटर विज्ञान नोट्स - डेटा संरचनाएं',
        date: '1 मार्च, 2026',
        topics: [
          'सरणी और लिंक्ड सूचियां',
          'स्टैक और क्यू कार्यान्वयन',
          'बाइनरी सर्च ट्री',
          'हैश टेबल और टकराव समाधान'
        ],
        notes: 'आगामी परीक्षा के लिए सॉर्टिंग एल्गोरिदम की समीक्षा करना याद रखें। समय जटिलता विश्लेषण पर ध्यान दें।'
      }
    }
  };

  const text = content[language] || content.en;

  const handleContinue = () => {
    if (safeWord.trim()) {
      localStorage.setItem('sahayak_safe_word', safeWord.trim());
      onComplete(safeWord.trim());
    }
    navigate('/chat');
  };

  const handleSkip = () => {
    navigate('/chat');
  };

  return (
    <div className="safe-word-setup">
      <div className="safe-word-card">
        <div className="safe-word-header">
          <h2>{text.title}</h2>
          <p className="subtitle">{text.subtitle}</p>
        </div>

        <div className="safe-word-content">
          <div className="description-box">
            <p>{text.description}</p>
          </div>

          <div className="input-section">
            <label htmlFor="safeWord">{text.inputLabel}</label>
            <input
              id="safeWord"
              type="text"
              value={safeWord}
              onChange={(e) => setSafeWord(e.target.value)}
              placeholder={text.inputPlaceholder}
              className="safe-word-input"
              autoComplete="off"
            />
          </div>

          <div className="privacy-notice">
            {text.privacy}
          </div>

          <button
            className="preview-button"
            onClick={() => setShowPreview(true)}
          >
            {text.previewButton}
          </button>

          <div className="action-buttons">
            <button
              className="continue-button"
              onClick={handleContinue}
              disabled={!safeWord.trim()}
            >
              {text.continueButton}
            </button>
            <button
              className="skip-button"
              onClick={handleSkip}
            >
              {text.skipButton}
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{text.previewTitle}</h3>
              <button
                className="close-preview"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </button>
            </div>
            <div className="decoy-screen-preview">
              <div className="decoy-header">
                <h1>{text.decoyContent.title}</h1>
                <p className="decoy-date">{text.decoyContent.date}</p>
              </div>
              <div className="decoy-body">
                <h3>Topics Covered:</h3>
                <ul>
                  {text.decoyContent.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
                <div className="decoy-notes">
                  <strong>Notes:</strong>
                  <p>{text.decoyContent.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeWordSetup;
