import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WellnessVault.css';

const WellnessVault = ({ language, sessionId }) => {
  const [currentMood, setCurrentMood] = useState(5);
  const [moodStreak, setMoodStreak] = useState(0);
  const [unsentLetter, setUnsentLetter] = useState('');
  const [letterAccessKey, setLetterAccessKey] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const [followUpStatus, setFollowUpStatus] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const navigate = useNavigate();

  const content = {
    en: {
      title: 'Wellness Vault',
      subtitle: 'Your private space for healing and self-care',
      moodTracker: 'Mood Tracker',
      moodQuestion: 'How are you feeling today?',
      moodScale: 'Rate your mood (1-10)',
      streakCounter: 'Wellness Streak',
      streakDays: 'days',
      unsentLetterTitle: 'Unsent Letter',
      unsentLetterDesc: 'Write a letter you\'ll never send - sometimes putting feelings into words helps',
      letterPlaceholder: 'Dear...\n\nWrite your thoughts here. This is your safe space.',
      generateKey: 'Generate Access Key',
      accessKey: 'Access Key',
      saveLetterButton: 'Save Letter',
      showLetterButton: 'Show Letter',
      hideLetter: 'Hide Letter',
      followUpTitle: 'Follow-Up Pulse',
      followUpQuestion: 'Since your last report, how do you feel?',
      betterOption: 'Better',
      sameOption: 'Same',
      worseOption: 'Worse',
      submitFollowUp: 'Submit Follow-Up',
      moodHistoryTitle: 'Mood History',
      backButton: 'Back to Chat',
      wellnessTips: 'Wellness Tips',
      tips: [
        'Take deep breaths when feeling overwhelmed',
        'Talk to someone you trust',
        'Practice gratitude daily',
        'Get enough sleep and exercise',
        'It\'s okay to ask for help'
      ]
    },
    hi: {
      title: 'वेलनेस वॉल्ट',
      subtitle: 'उपचार और स्व-देखभाल के लिए आपका निजी स्थान',
      moodTracker: 'मूड ट्रैकर',
      moodQuestion: 'आज आप कैसा महसूस कर रहे हैं?',
      moodScale: 'अपने मूड को रेट करें (1-10)',
      streakCounter: 'वेलनेस स्ट्रीक',
      streakDays: 'दिन',
      unsentLetterTitle: 'न भेजा गया पत्र',
      unsentLetterDesc: 'एक पत्र लिखें जो आप कभी नहीं भेजेंगे - कभी-कभी भावनाओं को शब्दों में डालना मदद करता है',
      letterPlaceholder: 'प्रिय...\n\nयहाँ अपने विचार लिखें। यह आपका सुरक्षित स्थान है।',
      generateKey: 'एक्सेस की जेनरेट करें',
      accessKey: 'एक्सेस की',
      saveLetterButton: 'पत्र सहेजें',
      showLetterButton: 'पत्र दिखाएं',
      hideLetter: 'पत्र छुपाएं',
      followUpTitle: 'फॉलो-अप पल्स',
      followUpQuestion: 'आपकी अंतिम रिपोर्ट के बाद से, आप कैसा महसूस करते हैं?',
      betterOption: 'बेहतर',
      sameOption: 'वैसा ही',
      worseOption: 'बदतर',
      submitFollowUp: 'फॉलो-अप सबमिट करें',
      moodHistoryTitle: 'मूड हिस्ट्री',
      backButton: 'चैट पर वापस जाएं',
      wellnessTips: 'वेलनेस टिप्स',
      tips: [
        'जब परेशान हों तो गहरी सांस लें',
        'किसी भरोसेमंद व्यक्ति से बात करें',
        'रोज कृतज्ञता का अभ्यास करें',
        'पर्याप्त नींद और व्यायाम करें',
        'मदद मांगना ठीक है'
      ]
    }
  };

  const text = content[language] || content.en;

  const moodEmojis = ['😢', '😟', '😐', '😊', '😄'];
  const moodLabels = {
    en: ['Very Sad', 'Sad', 'Okay', 'Good', 'Great'],
    hi: ['बहुत दुखी', 'दुखी', 'ठीक', 'अच्छा', 'बहुत अच्छा']
  };

  useEffect(() => {
    // Load saved data from localStorage
    const savedMoodHistory = JSON.parse(localStorage.getItem('mood_history') || '[]');
    const savedStreak = parseInt(localStorage.getItem('wellness_streak') || '0');
    const savedLetter = localStorage.getItem('unsent_letter') || '';
    const savedAccessKey = localStorage.getItem('letter_access_key') || '';
    const savedFollowUp = localStorage.getItem('follow_up_status');

    setMoodHistory(savedMoodHistory);
    setMoodStreak(savedStreak);
    setUnsentLetter(savedLetter);
    setLetterAccessKey(savedAccessKey);
    if (savedFollowUp) {
      setFollowUpStatus(savedFollowUp);
    }
  }, []);

  const handleMoodSubmit = () => {
    const today = new Date().toDateString();
    const newMoodEntry = {
      date: today,
      mood: currentMood,
      timestamp: Date.now()
    };

    // Check if already logged today
    const existingEntry = moodHistory.find(entry => entry.date === today);
    let updatedHistory;
    
    if (existingEntry) {
      updatedHistory = moodHistory.map(entry => 
        entry.date === today ? newMoodEntry : entry
      );
    } else {
      updatedHistory = [...moodHistory, newMoodEntry];
      // Increment streak if mood is 6 or above
      if (currentMood >= 6) {
        const newStreak = moodStreak + 1;
        setMoodStreak(newStreak);
        localStorage.setItem('wellness_streak', newStreak.toString());
      }
    }

    setMoodHistory(updatedHistory);
    localStorage.setItem('mood_history', JSON.stringify(updatedHistory));
  };

  const generateAccessKey = () => {
    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setLetterAccessKey(key);
    localStorage.setItem('letter_access_key', key);
  };

  const saveLetter = () => {
    if (!letterAccessKey) {
      generateAccessKey();
    }
    localStorage.setItem('unsent_letter', unsentLetter);
    alert('Letter saved securely with your access key');
  };

  const toggleLetterVisibility = () => {
    if (!showLetter && letterAccessKey) {
      const inputKey = prompt('Enter your access key to view the letter:');
      if (inputKey === letterAccessKey) {
        setShowLetter(true);
      } else {
        alert('Incorrect access key');
      }
    } else {
      setShowLetter(!showLetter);
    }
  };

  const submitFollowUp = (status) => {
    setFollowUpStatus(status);
    localStorage.setItem('follow_up_status', status);
    
    // Send to backend for admin tracking
    const followUpData = {
      sessionId,
      status,
      timestamp: Date.now(),
      date: new Date().toISOString()
    };
    
    // In production, this would be an API call
    console.log('Follow-up submitted:', followUpData);
    
    alert(`Follow-up status recorded: ${status}`);
  };

  const getMoodEmoji = (mood) => {
    if (mood <= 2) return moodEmojis[0];
    if (mood <= 4) return moodEmojis[1];
    if (mood <= 6) return moodEmojis[2];
    if (mood <= 8) return moodEmojis[3];
    return moodEmojis[4];
  };

  const getMoodLabel = (mood) => {
    const labels = moodLabels[language] || moodLabels.en;
    if (mood <= 2) return labels[0];
    if (mood <= 4) return labels[1];
    if (mood <= 6) return labels[2];
    if (mood <= 8) return labels[3];
    return labels[4];
  };

  return (
    <div className="wellness-vault">
      <div className="wellness-container">
        <div className="wellness-header">
          <button className="back-button" onClick={() => navigate('/chat')}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <h1>{text.title}</h1>
            <p className="subtitle">{text.subtitle}</p>
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="mood-tracker-section">
          <h2>{text.moodTracker}</h2>
          <div className="mood-question">{text.moodQuestion}</div>
          
          <div className="mood-slider-container">
            <div className="mood-display">
              <div className="mood-emoji">{getMoodEmoji(currentMood)}</div>
              <div className="mood-label">{getMoodLabel(currentMood)}</div>
              <div className="mood-number">{currentMood}/10</div>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={currentMood}
              onChange={(e) => setCurrentMood(parseInt(e.target.value))}
              className="mood-slider"
            />
            
            <button className="mood-submit-btn" onClick={handleMoodSubmit}>
              Log Mood
            </button>
          </div>

          <div className="streak-counter">
            <div className="streak-icon">🔥</div>
            <div className="streak-info">
              <div className="streak-number">{moodStreak}</div>
              <div className="streak-label">{text.streakDays} {text.streakCounter}</div>
            </div>
          </div>
        </div>

        {/* Mood History */}
        {moodHistory.length > 0 && (
          <div className="mood-history-section">
            <h3>{text.moodHistoryTitle}</h3>
            <div className="mood-history-chart">
              {moodHistory.slice(-7).map((entry, index) => (
                <div key={index} className="mood-history-item">
                  <div className="history-emoji">{getMoodEmoji(entry.mood)}</div>
                  <div className="history-date">{new Date(entry.timestamp).toLocaleDateString()}</div>
                  <div className="history-mood">{entry.mood}/10</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unsent Letter */}
        <div className="unsent-letter-section">
          <h2>{text.unsentLetterTitle}</h2>
          <p className="letter-description">{text.unsentLetterDesc}</p>
          
          <div className="letter-controls">
            {!letterAccessKey && (
              <button className="generate-key-btn" onClick={generateAccessKey}>
                🔑 {text.generateKey}
              </button>
            )}
            
            {letterAccessKey && (
              <div className="access-key-display">
                <span className="key-label">{text.accessKey}:</span>
                <code className="access-key">{letterAccessKey}</code>
              </div>
            )}
          </div>

          <textarea
            className="letter-textarea"
            placeholder={text.letterPlaceholder}
            value={showLetter ? unsentLetter : ''}
            onChange={(e) => setUnsentLetter(e.target.value)}
            rows={8}
            style={{ display: showLetter ? 'block' : 'none' }}
          />

          <div className="letter-buttons">
            <button className="toggle-letter-btn" onClick={toggleLetterVisibility}>
              {showLetter ? text.hideLetter : text.showLetterButton}
            </button>
            {showLetter && (
              <button className="save-letter-btn" onClick={saveLetter}>
                💾 {text.saveLetterButton}
              </button>
            )}
          </div>
        </div>

        {/* Follow-Up Pulse */}
        {sessionId && (
          <div className="follow-up-section">
            <h2>{text.followUpTitle}</h2>
            <p className="follow-up-question">{text.followUpQuestion}</p>
            
            {!followUpStatus ? (
              <div className="follow-up-options">
                <button 
                  className="follow-up-btn better"
                  onClick={() => submitFollowUp('better')}
                >
                  😊 {text.betterOption}
                </button>
                <button 
                  className="follow-up-btn same"
                  onClick={() => submitFollowUp('same')}
                >
                  😐 {text.sameOption}
                </button>
                <button 
                  className="follow-up-btn worse"
                  onClick={() => submitFollowUp('worse')}
                >
                  😟 {text.worseOption}
                </button>
              </div>
            ) : (
              <div className="follow-up-status">
                <div className="status-display">
                  Status recorded: <strong>{followUpStatus}</strong>
                  {followUpStatus === 'worse' && (
                    <div className="priority-notice">
                      ⚠️ Your response has been flagged for priority attention
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wellness Tips */}
        <div className="wellness-tips-section">
          <h2>{text.wellnessTips}</h2>
          <div className="tips-list">
            {text.tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">💡</span>
                <span className="tip-text">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessVault;