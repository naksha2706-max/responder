import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDetailsPage.css';

const StudentDetailsPage = ({ language, onLanguageChange, state, onStateChange }) => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [institution, setInstitution] = useState('');

  const states = [
    { code: 'MH', name: { en: 'Maharashtra', hi: 'महाराष्ट्र', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర', bn: 'মহারাষ্ট্র', kn: 'ಮಹಾರಾಷ್ಟ್ರ', mr: 'महाराष्ट्र' }, laws: 'POSH 2013 + UGC 2009 + Maharashtra Ragging Act' },
    { code: 'DL', name: { en: 'Delhi', hi: 'दिल्ली', ta: 'டெல்லி', te: 'ఢిల్లీ', bn: 'দিল্লি', kn: 'ದೆಹಲಿ', mr: 'दिल्ली' }, laws: 'POSH 2013 + UGC 2009 + Delhi Ragging Act' },
    { code: 'TN', name: { en: 'Tamil Nadu', hi: 'तमिलनाडु', ta: 'தமிழ்நாடு', te: 'తమిళనాడు', bn: 'তামিলনাড়ু', kn: 'ತಮಿಳುನಾಡು', mr: 'तामिळनाडू' }, laws: 'POSH 2013 + UGC 2009 + TN Ragging Act 1997' },
    { code: 'KA', name: { en: 'Karnataka', hi: 'कर्नाटक', ta: 'கர்நாடகா', te: 'కర్ణాటక', bn: 'কর্ণাটক', kn: 'ಕರ್ನಾಟಕ', mr: 'कर्नाटक' }, laws: 'POSH 2013 + UGC 2009 + Karnataka Ragging Act' },
    { code: 'WB', name: { en: 'West Bengal', hi: 'पश्चिम बंगाल', ta: 'மேற்கு வங்காளம்', te: 'పశ్చిమ బెంగాల్', bn: 'পশ্চিমবঙ্গ', kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', mr: 'पश्चिम बंगाल' }, laws: 'POSH 2013 + UGC 2009 + WB Ragging Act' }
  ];

  const content = {
    en: {
      title: 'Tell Us About Yourself',
      subtitle: 'This information helps us provide better support (Optional)',
      studentNameLabel: 'Your Name (Optional)',
      studentNamePlaceholder: 'You can remain anonymous',
      institutionLabel: 'Institution Name (Optional)',
      institutionPlaceholder: 'Your college or university',
      selectState: 'Select Your State',
      legalFramework: 'Legal Framework',
      entryPoint: 'How can we help you?',
      experienced: 'I experienced something',
      witnessed: 'I witnessed something',
      continueBtn: 'Continue',
      skipBtn: 'Skip & Stay Anonymous',
      privacyNote: '🔒 Your information is encrypted and never shared without your consent'
    },
    hi: {
      title: 'अपने बारे में बताएं',
      subtitle: 'यह जानकारी हमें बेहतर सहायता प्रदान करने में मदद करती है (वैकल्पिक)',
      studentNameLabel: 'आपका नाम (वैकल्पिक)',
      studentNamePlaceholder: 'आप गुमनाम रह सकते हैं',
      institutionLabel: 'संस्थान का नाम (वैकल्पिक)',
      institutionPlaceholder: 'आपका कॉलेज या विश्वविद्यालय',
      selectState: 'अपना राज्य चुनें',
      legalFramework: 'कानूनी ढांचा',
      entryPoint: 'हम आपकी कैसे मदद कर सकते हैं?',
      experienced: 'मैंने कुछ अनुभव किया',
      witnessed: 'मैंने कुछ देखा',
      continueBtn: 'जारी रखें',
      skipBtn: 'छोड़ें और गुमनाम रहें',
      privacyNote: '🔒 आपकी जानकारी एन्क्रिप्टेड है और आपकी सहमति के बिना कभी साझा नहीं की जाती'
    },
    ta: {
      title: 'உங்களைப் பற்றி சொல்லுங்கள்',
      subtitle: 'இந்த தகவல் சிறந்த ஆதரவை வழங்க உதவுகிறது (விருப்பமானது)',
      studentNameLabel: 'உங்கள் பெயர் (விருப்பமானது)',
      studentNamePlaceholder: 'நீங்கள் அநாமதேயமாக இருக்கலாம்',
      institutionLabel: 'நிறுவன பெயர் (விருப்பமானது)',
      institutionPlaceholder: 'உங்கள் கல்லூரி அல்லது பல்கலைக்கழகம்',
      selectState: 'உங்கள் மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
      legalFramework: 'சட்ட கட்டமைப்பு',
      entryPoint: 'நாங்கள் உங்களுக்கு எப்படி உதவ முடியும்?',
      experienced: 'நான் ஏதோ அனுபவித்தேன்',
      witnessed: 'நான் ஏதோ பார்த்தேன்',
      continueBtn: 'தொடரவும்',
      skipBtn: 'தவிர்த்து அநாமதேயமாக இருங்கள்',
      privacyNote: '🔒 உங்கள் தகவல் குறியாக்கம் செய்யப்பட்டுள்ளது மற்றும் உங்கள் ஒப்புதல் இல்லாமல் பகிரப்படாது'
    },
    te: {
      title: 'మీ గురించి చెప్పండి',
      subtitle: 'ఈ సమాచారం మెరుగైన మద్దతును అందించడంలో సహాయపడుతుంది (ఐచ్ఛికం)',
      studentNameLabel: 'మీ పేరు (ఐచ్ఛికం)',
      studentNamePlaceholder: 'మీరు అనామకంగా ఉండవచ్చు',
      institutionLabel: 'సంస్థ పేరు (ఐచ్ఛికం)',
      institutionPlaceholder: 'మీ కళాశాల లేదా విశ్వవిద్యాలయం',
      selectState: 'మీ రాష్ట్రాన్ని ఎంచుకోండి',
      legalFramework: 'చట్టపరమైన ఫ్రేమ్‌వర్క్',
      entryPoint: 'మేము మీకు ఎలా సహాయం చేయగలం?',
      experienced: 'నేను ఏదో అనుభవించాను',
      witnessed: 'నేను ఏదో చూశాను',
      continueBtn: 'కొనసాగించు',
      skipBtn: 'దాటవేసి అనామకంగా ఉండండి',
      privacyNote: '🔒 మీ సమాచారం ఎన్‌క్రిప్ట్ చేయబడింది మరియు మీ సమ్మతి లేకుండా భాగస్వామ్యం చేయబడదు'
    },
    bn: {
      title: 'আপনার সম্পর্কে বলুন',
      subtitle: 'এই তথ্য আমাদের আরও ভাল সহায়তা প্রদান করতে সাহায্য করে (ঐচ্ছিক)',
      studentNameLabel: 'আপনার নাম (ঐচ্ছিক)',
      studentNamePlaceholder: 'আপনি বেনামী থাকতে পারেন',
      institutionLabel: 'প্রতিষ্ঠানের নাম (ঐচ্ছিক)',
      institutionPlaceholder: 'আপনার কলেজ বা বিশ্ববিদ্যালয়',
      selectState: 'আপনার রাজ্য নির্বাচন করুন',
      legalFramework: 'আইনি কাঠামো',
      entryPoint: 'আমরা আপনাকে কীভাবে সাহায্য করতে পারি?',
      experienced: 'আমি কিছু অনুভব করেছি',
      witnessed: 'আমি কিছু দেখেছি',
      continueBtn: 'চালিয়ে যান',
      skipBtn: 'এড়িয়ে যান এবং বেনামী থাকুন',
      privacyNote: '🔒 আপনার তথ্য এনক্রিপ্ট করা এবং আপনার সম্মতি ছাড়া কখনও শেয়ার করা হয় না'
    },
    kn: {
      title: 'ನಿಮ್ಮ ಬಗ್ಗೆ ತಿಳಿಸಿ',
      subtitle: 'ಈ ಮಾಹಿತಿಯು ಉತ್ತಮ ಬೆಂಬಲವನ್ನು ಒದಗಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ (ಐಚ್ಛಿಕ)',
      studentNameLabel: 'ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)',
      studentNamePlaceholder: 'ನೀವು ಅನಾಮಧೇಯರಾಗಿ ಉಳಿಯಬಹುದು',
      institutionLabel: 'ಸಂಸ್ಥೆಯ ಹೆಸರು (ಐಚ್ಛಿಕ)',
      institutionPlaceholder: 'ನಿಮ್ಮ ಕಾಲೇಜು ಅಥವಾ ವಿಶ್ವವಿದ್ಯಾಲಯ',
      selectState: 'ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      legalFramework: 'ಕಾನೂನು ಚೌಕಟ್ಟು',
      entryPoint: 'ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      experienced: 'ನಾನು ಏನನ್ನಾದರೂ ಅನುಭವಿಸಿದೆ',
      witnessed: 'ನಾನು ಏನನ್ನಾದರೂ ನೋಡಿದೆ',
      continueBtn: 'ಮುಂದುವರಿಸಿ',
      skipBtn: 'ಬಿಟ್ಟು ಅನಾಮಧೇಯರಾಗಿ ಉಳಿಯಿರಿ',
      privacyNote: '🔒 ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ನಿಮ್ಮ ಒಪ್ಪಿಗೆ ಇಲ್ಲದೆ ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ'
    },
    mr: {
      title: 'तुमच्याबद्दल सांगा',
      subtitle: 'ही माहिती आम्हाला चांगले समर्थन प्रदान करण्यात मदत करते (पर्यायी)',
      studentNameLabel: 'तुमचे नाव (पर्यायी)',
      studentNamePlaceholder: 'तुम्ही अनामिक राहू शकता',
      institutionLabel: 'संस्थेचे नाव (पर्यायी)',
      institutionPlaceholder: 'तुमचे महाविद्यालय किंवा विद्यापीठ',
      selectState: 'तुमचे राज्य निवडा',
      legalFramework: 'कायदेशीर चौकट',
      entryPoint: 'आम्ही तुम्हाला कशी मदत करू शकतो?',
      experienced: 'मी काहीतरी अनुभवले',
      witnessed: 'मी काहीतरी पाहिले',
      continueBtn: 'सुरू ठेवा',
      skipBtn: 'वगळा आणि अनामिक रहा',
      privacyNote: '🔒 तुमची माहिती एन्क्रिप्ट केलेली आहे आणि तुमच्या संमतीशिवाय कधीही शेअर केली जात नाही'
    }
  };

  const text = content[language] || content.en;

  const handleContinue = (mode) => {
    if (!state) {
      alert(text.selectState);
      return;
    }
    
    // Store student details in sessionStorage
    if (studentName) sessionStorage.setItem('studentName', studentName);
    if (institution) sessionStorage.setItem('institution', institution);
    sessionStorage.setItem('entryMode', mode); // 'experienced' or 'witnessed'
    
    navigate('/safe-word');
  };

  const handleSkip = (mode) => {
    if (!state) {
      alert(text.selectState);
      return;
    }
    
    sessionStorage.setItem('entryMode', mode);
    navigate('/safe-word');
  };

  return (
    <div className="student-details-screen">
      <div className="student-details-card">
        <div className="student-details-header">
          <h2>{text.title}</h2>
          <p className="subtitle">{text.subtitle}</p>
        </div>

        <div className="student-details-content">
          <div className="form-section">
            <div className="form-group">
              <label>{text.studentNameLabel}</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={text.studentNamePlaceholder}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>{text.institutionLabel}</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder={text.institutionPlaceholder}
                className="form-input"
              />
            </div>
          </div>

          <div className="state-selector-section">
            <h3>📍 {text.selectState}</h3>
            <div className="state-selector">
              {states.map((s) => (
                <button
                  key={s.code}
                  className={`state-btn ${state === s.code ? 'active' : ''}`}
                  onClick={() => onStateChange(s.code)}
                >
                  {s.name[language] || s.name.en}
                </button>
              ))}
            </div>
            {state && (
              <div className="legal-framework-display">
                <strong>{text.legalFramework}:</strong> {states.find(s => s.code === state)?.laws}
              </div>
            )}
          </div>

          <div className="entry-point-section">
            <h3>{text.entryPoint}</h3>
            <div className="entry-buttons">
              <button className="entry-btn experienced" onClick={() => handleContinue('experienced')}>
                {text.experienced}
              </button>
              <button className="entry-btn witnessed" onClick={() => handleContinue('witnessed')}>
                {text.witnessed}
              </button>
            </div>
          </div>

          <button className="skip-btn" onClick={() => handleSkip('experienced')}>
            {text.skipBtn}
          </button>

          <div className="privacy-note">
            {text.privacyNote}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
