'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function EmergencyContent() {
  const [language, setLanguage] = useState('en');
  const [selectedState, setSelectedState] = useState('MH');
  const [crisis, setCrisis] = useState('');
  const [severity, setSeverity] = useState(1);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const content = {
    en: {
      title: 'Emergency Support',
      subtitle: 'Immediate help and resources for crisis situations',
      nationalEmergency: 'National Emergency',
      call112: 'Call 112',
      call112Desc: 'Police, Fire, Medical Emergency',
      crisisHelplines: 'Crisis Helplines',
      stateSpecific: 'State-Specific Resources',
      selectState: 'Select Your State',
      immediateActions: 'Immediate Actions',
      safetyFirst: 'Your safety is the top priority',
      actions: [
        'Move to a safe location if possible',
        'Call emergency services if in immediate danger',
        'Reach out to trusted friends or family',
        'Contact campus security if on campus',
        'Seek medical attention if injured'
      ],
      backToChat: 'Back to Chat',
      getHelp: 'Get Professional Help',
      shareLocation: 'Share Location with Trusted Contact'
    },
    hi: {
      title: 'आपातकालीन सहायता',
      subtitle: 'संकट की स्थितियों के लिए तत्काल सहायता और संसाधन',
      nationalEmergency: 'राष्ट्रीय आपातकाल',
      call112: '112 पर कॉल करें',
      call112Desc: 'पुलिस, अग्निशमन, चिकित्सा आपातकाल',
      crisisHelplines: 'संकट हेल्पलाइन',
      stateSpecific: 'राज्य-विशिष्ट संसाधन',
      selectState: 'अपना राज्य चुनें',
      immediateActions: 'तत्काल कार्रवाई',
      safetyFirst: 'आपकी सुरक्षा सर्वोच्च प्राथमिकता है',
      actions: [
        'यदि संभव हो तो सुरक्षित स्थान पर जाएं',
        'तत्काल खतरे में हों तो आपातकालीन सेवाओं को कॉल करें',
        'विश्वसनीय मित्रों या परिवार से संपर्क करें',
        'कैंपस में हों तो कैंपस सुरक्षा से संपर्क करें',
        'घायल हों तो चिकित्सा सहायता लें'
      ],
      backToChat: 'चैट पर वापस जाएं',
      getHelp: 'पेशेवर सहायता प्राप्त करें',
      shareLocation: 'विश्वसनीय संपर्क के साथ स्थान साझा करें'
    }
  };

  const text = content[language as keyof typeof content] || content.en;

  const states = {
    MH: { name: 'Maharashtra', nameHi: 'महाराष्ट्र' },
    DL: { name: 'Delhi', nameHi: 'दिल्ली' },
    TN: { name: 'Tamil Nadu', nameHi: 'तमिलनाडु' },
    KA: { name: 'Karnataka', nameHi: 'कर्नाटक' },
    WB: { name: 'West Bengal', nameHi: 'पश्चिम बंगाल' }
  };

  const helplines = {
    national: [
      { name: 'Women Helpline', number: '1091', available: '24/7' },
      { name: 'Child Helpline', number: '1098', available: '24/7' },
      { name: 'Mental Health Helpline', number: '9152987821', available: '24/7' },
      { name: 'Suicide Prevention', number: '9820466726', available: '24/7' }
    ],
    state: {
      MH: [
        { name: 'Maharashtra Women Commission', number: '022-26592707', available: '9 AM - 6 PM' },
        { name: 'Mumbai Police Women Helpline', number: '103', available: '24/7' },
        { name: 'Anti-Ragging Helpline', number: '1800-180-5522', available: '24/7' }
      ],
      DL: [
        { name: 'Delhi Women Commission', number: '011-23379181', available: '9 AM - 6 PM' },
        { name: 'Delhi Police Women Helpline', number: '1091', available: '24/7' },
        { name: 'Student Helpline Delhi', number: '1800-11-8004', available: '24/7' }
      ],
      TN: [
        { name: 'Tamil Nadu Women Helpline', number: '044-28592750', available: '9 AM - 6 PM' },
        { name: 'Chennai Police Women Cell', number: '044-28447777', available: '24/7' },
        { name: 'TN Student Helpline', number: '1800-425-2670', available: '24/7' }
      ],
      KA: [
        { name: 'Karnataka Women Commission', number: '080-22100435', available: '9 AM - 6 PM' },
        { name: 'Bangalore Police Women Cell', number: '080-22943225', available: '24/7' },
        { name: 'Karnataka Student Helpline', number: '1800-425-9339', available: '24/7' }
      ],
      WB: [
        { name: 'West Bengal Women Commission', number: '033-22143526', available: '9 AM - 6 PM' },
        { name: 'Kolkata Police Women Cell', number: '033-22143526', available: '24/7' },
        { name: 'WB Student Helpline', number: '1800-345-3644', available: '24/7' }
      ]
    }
  };

  useEffect(() => {
    const crisisParam = searchParams.get('crisis');
    const severityParam = searchParams.get('severity');
    
    if (crisisParam) setCrisis(crisisParam);
    if (severityParam) setSeverity(parseInt(severityParam));
  }, [searchParams]);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        if (navigator.share) {
          navigator.share({
            title: 'My Current Location - Emergency',
            text: 'I need help. This is my current location.',
            url: locationUrl
          });
        } else {
          // Fallback to copying to clipboard
          navigator.clipboard.writeText(`Emergency Location: ${locationUrl}`);
          alert('Location copied to clipboard. Share this with someone you trust.');
        }
      }, (error) => {
        alert('Unable to get location. Please share your location manually.');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
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
            <h1 className="text-3xl font-bold text-red-700">{text.title}</h1>
            <p className="text-gray-600">{text.subtitle}</p>
          </div>
        </div>

        {/* Crisis Alert */}
        {crisis && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-2xl">⚠️</span>
              <div>
                <div className="font-semibold text-red-800">Crisis Detected: {crisis}</div>
                <div className="text-red-700">Severity Level: {severity}/4</div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Call Button */}
        <div className="bg-red-600 text-white rounded-2xl shadow-lg p-6 mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">{text.nationalEmergency}</h2>
          <button 
            className="bg-white text-red-600 px-8 py-4 rounded-xl text-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            onClick={() => handleCall('112')}
          >
            📞 {text.call112}
          </button>
          <p className="mt-2 text-red-100">{text.call112Desc}</p>
        </div>

        {/* Immediate Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-orange-700">{text.immediateActions}</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 font-semibold text-orange-800">
              <span className="text-xl">🛡️</span>
              {text.safetyFirst}
            </div>
          </div>
          <div className="space-y-3">
            {text.actions.map((action, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* State Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{text.stateSpecific}</h2>
          <label className="block text-lg font-medium mb-2">{text.selectState}</label>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {Object.entries(states).map(([code, state]) => (
              <option key={code} value={code}>
                {language === 'hi' ? state.nameHi : state.name}
              </option>
            ))}
          </select>
        </div>

        {/* National Helplines */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{text.crisisHelplines}</h2>
          <div className="space-y-3">
            {helplines.national.map((helpline, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-blue-900">{helpline.name}</div>
                  <div className="text-sm text-blue-700">{helpline.available}</div>
                </div>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => handleCall(helpline.number)}
                >
                  📞 {helpline.number}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* State-Specific Helplines */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'hi' ? states[selectedState as keyof typeof states].nameHi : states[selectedState as keyof typeof states].name} Resources
          </h2>
          <div className="space-y-3">
            {helplines.state[selectedState as keyof typeof helplines.state]?.map((helpline, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <div className="font-semibold text-green-900">{helpline.name}</div>
                  <div className="text-sm text-green-700">{helpline.available}</div>
                </div>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  onClick={() => handleCall(helpline.number)}
                >
                  📞 {helpline.number}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button 
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            onClick={shareLocation}
          >
            📍 {text.shareLocation}
          </button>
          <button 
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={() => router.push('/wellness-vault')}
          >
            🏥 {text.getHelp}
          </button>
        </div>

        {/* Back to Chat */}
        <div className="text-center">
          <button 
            className="text-gray-600 hover:text-gray-800 font-medium underline"
            onClick={() => router.push('/chat')}
          >
            {text.backToChat}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <EmergencyContent />
    </Suspense>
  );
}