import React from 'react';
import './LanguageSelector.css';

const LanguageSelector = ({ language, onLanguageChange }) => {
  return (
    <div className="language-selector">
      <button
        className={`lang-button ${language === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
        aria-label="Switch to English"
      >
        English
      </button>
      <button
        className={`lang-button ${language === 'hi' ? 'active' : ''}`}
        onClick={() => onLanguageChange('hi')}
        aria-label="हिंदी में बदलें"
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageSelector;
