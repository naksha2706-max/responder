import React, { useState } from 'react';
import './UnsentLetter.css';

const UnsentLetter = ({ language }) => {
  const [letter, setLetter] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [saved, setSaved] = useState(false);

  const content = {
    en: {
      title: 'Unsent Letter',
      subtitle: 'Write privately. Your words are encrypted and safe.',
      placeholder: 'Write your thoughts here... This is a private space just for you.',
      saveButton: 'Save Letter',
      accessKeyLabel: 'Your Access Key',
      accessKeyNote: 'Save this key to retrieve your letter later. It will be deleted after 30 days.',
      convertButton: 'Convert to Formal Complaint'
    },
    hi: {
      title: 'अनभेजा पत्र',
      subtitle: 'निजी तौर पर लिखें। आपके शब्द एन्क्रिप्टेड और सुरक्षित हैं।',
      placeholder: 'यहां अपने विचार लिखें... यह केवल आपके लिए एक निजी स्थान है।',
      saveButton: 'पत्र सहेजें',
      accessKeyLabel: 'आपकी एक्सेस कुंजी',
      accessKeyNote: 'बाद में अपना पत्र पुनः प्राप्त करने के लिए इस कुंजी को सहेजें। यह 30 दिनों के बाद हटा दी जाएगी।',
      convertButton: 'औपचारिक शिकायत में बदलें'
    }
  };

  const text = content[language] || content.en;

  const handleSave = () => {
    const key = 'SAH-PRIV-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setAccessKey(key);
    setSaved(true);
    // In real implementation, encrypt and save to S3
  };

  return (
    <div className="unsent-letter-page">
      <div className="unsent-letter-container">
        <h1>{text.title}</h1>
        <p className="subtitle">{text.subtitle}</p>

        <textarea
          className="letter-textarea"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          placeholder={text.placeholder}
          rows={15}
        />

        {!saved ? (
          <button className="save-button" onClick={handleSave} disabled={!letter.trim()}>
            🔒 {text.saveButton}
          </button>
        ) : (
          <div className="access-key-section">
            <h3>{text.accessKeyLabel}</h3>
            <div className="access-key-display">{accessKey}</div>
            <p className="access-key-note">{text.accessKeyNote}</p>
            <button className="convert-button">
              📝 {text.convertButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnsentLetter;
