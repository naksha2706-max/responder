import React from 'react';
import './ResourcesPage.css';

const ResourcesPage = ({ language }) => {
  const content = {
    en: {
      title: 'Prevention & Support Resources',
      subtitle: 'Educational content and guidance',
      sections: [
        {
          title: 'Recognizing Harassment',
          items: [
            'Unwanted physical contact or advances',
            'Verbal abuse or threats',
            'Sexual comments or gestures',
            'Stalking or following',
            'Sharing private images without consent'
          ]
        },
        {
          title: 'Recognizing Ragging',
          items: [
            'Forced participation in humiliating activities',
            'Physical violence or threats',
            'Verbal abuse by seniors',
            'Forced errands or tasks',
            'Social isolation or exclusion'
          ]
        },
        {
          title: 'Bystander Intervention',
          items: [
            'Directly intervene if safe to do so',
            'Distract the situation',
            'Delegate to authorities',
            'Document the incident',
            'Support the victim afterwards'
          ]
        },
        {
          title: 'Self-Care Tips',
          items: [
            'Talk to someone you trust',
            'Practice mindfulness and breathing exercises',
            'Maintain a regular sleep schedule',
            'Stay connected with supportive friends',
            'Seek professional help when needed'
          ]
        }
      ]
    },
    hi: {
      title: 'रोकथाम और सहायता संसाधन',
      subtitle: 'शैक्षिक सामग्री और मार्गदर्शन',
      sections: [
        {
          title: 'उत्पीड़न को पहचानना',
          items: [
            'अवांछित शारीरिक संपर्क या प्रगति',
            'मौखिक दुर्व्यवहार या धमकी',
            'यौन टिप्पणियां या इशारे',
            'पीछा करना या फॉलो करना',
            'सहमति के बिना निजी छवियां साझा करना'
          ]
        },
        {
          title: 'रैगिंग को पहचानना',
          items: [
            'अपमानजनक गतिविधियों में जबरन भागीदारी',
            'शारीरिक हिंसा या धमकी',
            'वरिष्ठों द्वारा मौखिक दुर्व्यवहार',
            'जबरन काम या कार्य',
            'सामाजिक अलगाव या बहिष्कार'
          ]
        },
        {
          title: 'दर्शक हस्तक्षेप',
          items: [
            'यदि सुरक्षित हो तो सीधे हस्तक्षेप करें',
            'स्थिति को विचलित करें',
            'अधिकारियों को सौंपें',
            'घटना का दस्तावेजीकरण करें',
            'बाद में पीड़ित का समर्थन करें'
          ]
        },
        {
          title: 'स्व-देखभाल युक्तियाँ',
          items: [
            'किसी विश्वसनीय व्यक्ति से बात करें',
            'माइंडफुलनेस और सांस लेने के व्यायाम का अभ्यास करें',
            'नियमित नींद कार्यक्रम बनाए रखें',
            'सहायक दोस्तों के साथ जुड़े रहें',
            'जरूरत पड़ने पर पेशेवर मदद लें'
          ]
        }
      ]
    }
  };

  const text = content[language] || content.en;

  return (
    <div className="resources-page">
      <div className="resources-container">
        <h1>{text.title}</h1>
        <p className="subtitle">{text.subtitle}</p>

        <div className="resources-grid">
          {text.sections.map((section, index) => (
            <div key={index} className="resource-section">
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="download-section">
          <h2>📥 {language === 'en' ? 'Downloadable Guides' : 'डाउनलोड करने योग्य गाइड'}</h2>
          <div className="download-buttons">
            <button className="download-btn">
              {language === 'en' ? 'POSH Act Guide (PDF)' : 'POSH अधिनियम गाइड (PDF)'}
            </button>
            <button className="download-btn">
              {language === 'en' ? 'Anti-Ragging Guide (PDF)' : 'एंटी-रैगिंग गाइड (PDF)'}
            </button>
            <button className="download-btn">
              {language === 'en' ? 'Mental Health Resources (PDF)' : 'मानसिक स्वास्थ्य संसाधन (PDF)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
