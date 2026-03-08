import React, { useState } from 'react';
import './FollowUpPulse.css';

const FollowUpPulse = ({ language, sessionId }) => {
  const [response, setResponse] = useState(null);

  const content = {
    en: {
      title: 'How are you doing?',
      subtitle: 'We wanted to check in with you. How are things now?',
      better: 'Better',
      same: 'Same',
      worse: 'Worse',
      betterMessage: 'We\'re glad to hear things are improving. Keep taking care of yourself.',
      sameMessage: 'Here are some additional resources that might help.',
      worseMessage: 'We\'re concerned about your safety. Let\'s connect you with immediate support.'
    },
    hi: {
      title: 'आप कैसे हैं?',
      subtitle: 'हम आपसे जांच करना चाहते थे। अब चीजें कैसी हैं?',
      better: 'बेहतर',
      same: 'वैसा ही',
      worse: 'बदतर',
      betterMessage: 'हमें खुशी है कि चीजें बेहतर हो रही हैं। अपना ख्याल रखते रहें।',
      sameMessage: 'यहां कुछ अतिरिक्त संसाधन हैं जो मदद कर सकते हैं।',
      worseMessage: 'हम आपकी सुरक्षा के बारे में चिंतित हैं। आइए आपको तत्काल सहायता से जोड़ें।'
    }
  };

  const text = content[language] || content.en;

  const handleResponse = (type) => {
    setResponse(type);
    // In real implementation, update case record
  };

  return (
    <div className="follow-up-page">
      <div className="follow-up-container">
        <h1>{text.title}</h1>
        <p className="subtitle">{text.subtitle}</p>

        {!response ? (
          <div className="response-buttons">
            <button className="response-btn better" onClick={() => handleResponse('better')}>
              😊 {text.better}
            </button>
            <button className="response-btn same" onClick={() => handleResponse('same')}>
              😐 {text.same}
            </button>
            <button className="response-btn worse" onClick={() => handleResponse('worse')}>
              😟 {text.worse}
            </button>
          </div>
        ) : (
          <div className="response-message">
            {response === 'better' && <p className="better-msg">{text.betterMessage}</p>}
            {response === 'same' && <p className="same-msg">{text.sameMessage}</p>}
            {response === 'worse' && <p className="worse-msg">{text.worseMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpPulse;
