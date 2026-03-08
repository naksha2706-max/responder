import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BystanderPage.css';

const BystanderPage = ({ language, state }) => {
  const navigate = useNavigate();

  const content = {
    en: {
      title: 'Witness Report',
      subtitle: 'Thank you for speaking up. Your report can help someone in need.',
      description: 'As a witness, your perspective is valuable. Please describe what you observed.',
      startButton: 'Start Report',
      backButton: 'Back to Home'
    },
    hi: {
      title: 'गवाह रिपोर्ट',
      subtitle: 'बोलने के लिए धन्यवाद। आपकी रिपोर्ट किसी जरूरतमंद की मदद कर सकती है।',
      description: 'एक गवाह के रूप में, आपका दृष्टिकोण मूल्यवान है। कृपया वर्णन करें कि आपने क्या देखा।',
      startButton: 'रिपोर्ट शुरू करें',
      backButton: 'होम पर वापस जाएं'
    }
  };

  const text = content[language] || content.en;

  return (
    <div className="bystander-page">
      <div className="bystander-container">
        <h1>{text.title}</h1>
        <p className="subtitle">{text.subtitle}</p>
        <p className="description">{text.description}</p>
        <button className="start-button" onClick={() => navigate('/chat')}>
          {text.startButton}
        </button>
        <button className="back-button" onClick={() => navigate('/')}>
          {text.backButton}
        </button>
      </div>
    </div>
  );
};

export default BystanderPage;
