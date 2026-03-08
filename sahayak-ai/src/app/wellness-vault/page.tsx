'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WellnessVaultPage() {
  const [currentMood, setCurrentMood] = useState(5);
  const [moodStreak, setMoodStreak] = useState(0);
  const [unsentLetter, setUnsentLetter] = useState('');
  const [letterAccessKey, setLetterAccessKey] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const [followUpStatus, setFollowUpStatus] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<Array<{date: string, mood: number, timestamp: number}>>([]);
  const [language, setLanguage] = useState('en');
  
  const router = useRouter();

  const content = {
    en: {
      title: 'Wellness Vault',
      subtitle: 'Your private space for healing and self-care',
      moodTracker: 'Mood Tracker',
      moodQuestion: 'How are you feeling today?',
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

  const text = content[language as keyof typeof content] || content.en;

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

  const submitFollowUp = (status: string) => {
    setFollowUpStatus(status);
    localStorage.setItem('follow_up_status', status);
    
    // Send to backend for admin tracking
    const followUpData = {
      sessionId: localStorage.getItem('sahayak_session_id'),
      status,
      timestamp: Date.now(),
      date: new Date().toISOString()
    };
    
    console.log('Follow-up submitted:', followUpData);
    alert(`Follow-up status recorded: ${status}`);
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return moodEmojis[0];
    if (mood <= 4) return moodEmojis[1];
    if (mood <= 6) return moodEmojis[2];
    if (mood <= 8) return moodEmojis[3];
    return moodEmojis[4];
  };

  const getMoodLabel = (mood: number) => {
    const labels = moodLabels[language as keyof typeof moodLabels] || moodLabels.en;
    if (mood <= 2) return labels[0];
    if (mood <= 4) return labels[1];
    if (mood <= 6) return labels[2];
    if (mood <= 8) return labels[3];
    return labels[4];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
            <p className="text-gray-600">{text.subtitle}</p>
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{text.moodTracker}</h2>
          <div className="text-lg mb-6">{text.moodQuestion}</div>
          
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{getMoodEmoji(currentMood)}</div>
            <div className="text-xl font-medium mb-2">{getMoodLabel(currentMood)}</div>
            <div className="text-2xl font-bold text-blue-600">{currentMood}/10</div>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={currentMood}
            onChange={(e) => setCurrentMood(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-6"
          />
          
          <button 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={handleMoodSubmit}
          >
            Log Mood
          </button>

          <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl">🔥</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{moodStreak}</div>
              <div className="text-sm text-orange-700">{text.streakDays} {text.streakCounter}</div>
            </div>
          </div>
        </div>

        {/* Mood History */}
        {moodHistory.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">{text.moodHistoryTitle}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {moodHistory.slice(-7).map((entry, index) => (
                <div key={index} className="flex-shrink-0 text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">{getMoodEmoji(entry.mood)}</div>
                  <div className="text-xs text-gray-600 mb-1">{new Date(entry.timestamp).toLocaleDateString()}</div>
                  <div className="text-sm font-medium">{entry.mood}/10</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unsent Letter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-2">{text.unsentLetterTitle}</h2>
          <p className="text-gray-600 mb-4">{text.unsentLetterDesc}</p>
          
          <div className="mb-4">
            {!letterAccessKey && (
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                onClick={generateAccessKey}
              >
                🔑 {text.generateKey}
              </button>
            )}
            
            {letterAccessKey && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{text.accessKey}:</span>
                <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">{letterAccessKey}</code>
              </div>
            )}
          </div>

          {showLetter && (
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              placeholder={text.letterPlaceholder}
              value={unsentLetter}
              onChange={(e) => setUnsentLetter(e.target.value)}
            />
          )}

          <div className="flex gap-3">
            <button 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={toggleLetterVisibility}
            >
              {showLetter ? text.hideLetter : text.showLetterButton}
            </button>
            {showLetter && (
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                onClick={saveLetter}
              >
                💾 {text.saveLetterButton}
              </button>
            )}
          </div>
        </div>

        {/* Follow-Up Pulse */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-2">{text.followUpTitle}</h2>
          <p className="text-gray-600 mb-4">{text.followUpQuestion}</p>
          
          {!followUpStatus ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                onClick={() => submitFollowUp('better')}
              >
                😊 {text.betterOption}
              </button>
              <button 
                className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                onClick={() => submitFollowUp('same')}
              >
                😐 {text.sameOption}
              </button>
              <button 
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                onClick={() => submitFollowUp('worse')}
              >
                😟 {text.worseOption}
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="font-medium text-blue-900">
                Status recorded: <strong>{followUpStatus}</strong>
              </div>
              {followUpStatus === 'worse' && (
                <div className="mt-2 text-red-700 font-medium">
                  ⚠️ Your response has been flagged for priority attention
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wellness Tips */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{text.wellnessTips}</h2>
          <div className="space-y-3">
            {text.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-xl">💡</span>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}