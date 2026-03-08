import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProgressUpdate.css';

const ProgressUpdate = ({ language }) => {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedId = localStorage.getItem('sahayak_session_id');
    if (savedId) setSessionId(savedId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessionId || !status) return;

    // Save to localStorage for mock persistence
    const updates = JSON.parse(localStorage.getItem('sahayak_progress_updates') || '{}');
    updates[sessionId] = {
      status,
      note,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('sahayak_progress_updates', JSON.stringify(updates));
    
    // Also update the specific session's follow-up status if it exists
    localStorage.setItem(`follow_up_${sessionId}`, status);

    setSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  const content = {
    en: {
      title: 'Update Your Progress',
      subtitle: 'Is the situation improving? Your feedback helps hold the institution accountable.',
      sessionIdLabel: 'Your Session ID',
      statusLabel: 'How is the situation now?',
      better: 'Situation Improved',
      same: 'No Change / Same',
      worse: 'Getting Worse',
      noteLabel: 'Additional details (optional)',
      submit: 'Submit Progress Report',
      success: 'Thank you. Your progress has been logged. Redirecting...',
      back: 'Back to Home'
    },
    hi: {
      title: 'अपनी प्रगति अपडेट करें',
      subtitle: 'क्या स्थिति में सुधार हो रहा है? आपकी प्रतिक्रिया संस्थान को जवाबदेह बनाने में मदद करती है।',
      sessionIdLabel: 'आपकी सत्र आईडी',
      statusLabel: 'अब स्थिति कैसी है?',
      better: 'स्थिति में सुधार हुआ',
      same: 'कोई बदलाव नहीं / वही',
      worse: 'बिगड़ रही है',
      noteLabel: 'अतिरिक्त विवरण (वैकल्पिक)',
      submit: 'प्रगति रिपोर्ट सबमिट करें',
      success: 'धन्यवाद। आपकी प्रगति दर्ज कर ली गई है। रीडायरेक्ट किया जा रहा है...',
      back: 'होम पर वापस जाएं'
    }
  };

  const text = content[language] || content.en;

  if (submitted) {
    return (
      <div className="progress-page">
        <div className="progress-container glass-panel success-view">
          <div className="success-icon">✅</div>
          <h2>{text.success}</h2>
          <button className="btn-secondary" onClick={() => navigate('/')}>{text.back}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <div className="progress-container glass-panel">
        <button className="back-btn" onClick={() => navigate('/')}>← {text.back}</button>
        <h1>{text.title}</h1>
        <p className="subtitle">{text.subtitle}</p>

        <form onSubmit={handleSubmit} className="progress-form">
          <div className="input-group">
            <label>{text.sessionIdLabel}</label>
            <input 
              type="text" 
              value={sessionId} 
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="SAH-XXXX-XXX"
              required
            />
          </div>

          <div className="status-selection">
            <label>{text.statusLabel}</label>
            <div className="status-options">
              <button 
                type="button"
                className={`status-btn better ${status === 'better' ? 'active' : ''}`}
                onClick={() => setStatus('better')}
              >
                <span>😊</span> {text.better}
              </button>
              <button 
                type="button"
                className={`status-btn same ${status === 'same' ? 'active' : ''}`}
                onClick={() => setStatus('same')}
              >
                <span>😐</span> {text.same}
              </button>
              <button 
                type="button"
                className={`status-btn worse ${status === 'worse' ? 'active' : ''}`}
                onClick={() => setStatus('worse')}
              >
                <span>😟</span> {text.worse}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>{text.noteLabel}</label>
            <textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any specific updates on the action taken by the college?"
              rows={4}
            />
          </div>

          <button type="submit" className="btn-primary-glow" disabled={!status || !sessionId}>
            {text.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProgressUpdate;
