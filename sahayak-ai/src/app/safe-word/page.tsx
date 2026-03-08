'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SafeWordContent() {
  const [safeWord, setSafeWord] = useState('');
  const [decoyScreen, setDecoyScreen] = useState('notes');
  const [language, setLanguage] = useState('en');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const content = {
    en: {
      title: 'Safe Word Setup',
      subtitle: 'Create a secret word that instantly hides the chat if you need to',
      safeWordLabel: 'Your Safe Word',
      safeWordPlaceholder: 'Enter a word only you would know',
      decoyScreenLabel: 'Decoy Screen',
      decoyScreenDesc: 'What should appear when you use your safe word?',
      decoyOptions: {
        notes: 'Study Notes',
        calculator: 'Calculator',
        weather: 'Weather App',
        news: 'News Feed'
      },
      howItWorks: 'How it works:',
      steps: [
        'Type your safe word anywhere in the chat',
        'The screen instantly switches to your chosen decoy',
        'Your conversation remains private and secure',
        'The decoy disappears automatically after 5 seconds'
      ],
      saveButton: 'Save Safe Word',
      skipButton: 'Skip for Now',
      backButton: 'Back to Home',
      testButton: 'Test Safe Word',
      preview: 'Preview:'
    },
    hi: {
      title: 'सुरक्षा शब्द सेटअप',
      subtitle: 'एक गुप्त शब्द बनाएं जो जरूरत पड़ने पर तुरंत चैट को छुपा देता है',
      safeWordLabel: 'आपका सुरक्षा शब्द',
      safeWordPlaceholder: 'एक ऐसा शब्द दर्ज करें जो केवल आप जानते हों',
      decoyScreenLabel: 'डिकॉय स्क्रीन',
      decoyScreenDesc: 'जब आप अपना सुरक्षा शब्द उपयोग करें तो क्या दिखना चाहिए?',
      decoyOptions: {
        notes: 'अध्ययन नोट्स',
        calculator: 'कैलकुलेटर',
        weather: 'मौसम ऐप',
        news: 'समाचार फीड'
      },
      howItWorks: 'यह कैसे काम करता है:',
      steps: [
        'चैट में कहीं भी अपना सुरक्षा शब्द टाइप करें',
        'स्क्रीन तुरंत आपके चुने गए डिकॉय में बदल जाती है',
        'आपकी बातचीत निजी और सुरक्षित रहती है',
        'डिकॉय 5 सेकंड बाद अपने आप गायब हो जाता है'
      ],
      saveButton: 'सुरक्षा शब्द सहेजें',
      skipButton: 'अभी के लिए छोड़ें',
      backButton: 'होम पर वापस जाएं',
      testButton: 'सुरक्षा शब्द टेस्ट करें',
      preview: 'पूर्वावलोकन:'
    }
  };

  const text = content[language as keyof typeof content] || content.en;

  const decoyPreviews = {
    notes: (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold text-lg mb-2">Computer Science Notes</h3>
        <p className="text-sm text-gray-600 mb-2">March 6, 2026</p>
        <ul className="text-sm space-y-1">
          <li>• Arrays and Linked Lists</li>
          <li>• Stack and Queue Implementation</li>
          <li>• Binary Search Trees</li>
        </ul>
      </div>
    ),
    calculator: (
      <div className="bg-gray-900 text-white p-4 rounded-lg">
        <div className="text-right text-2xl mb-4">0</div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <button className="bg-gray-700 p-2 rounded">C</button>
          <button className="bg-gray-700 p-2 rounded">±</button>
          <button className="bg-gray-700 p-2 rounded">%</button>
          <button className="bg-orange-500 p-2 rounded">÷</button>
        </div>
      </div>
    ),
    weather: (
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        <h3 className="font-bold text-lg">Mumbai</h3>
        <div className="text-3xl">28°C</div>
        <p className="text-sm">Partly Cloudy</p>
        <div className="text-xs mt-2">High: 32° Low: 24°</div>
      </div>
    ),
    news: (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold text-sm mb-2">Latest News</h3>
        <div className="space-y-2 text-xs">
          <div className="border-b pb-1">Technology sector shows growth...</div>
          <div className="border-b pb-1">Education reforms announced...</div>
          <div>Sports update: Cricket match...</div>
        </div>
      </div>
    )
  };

  const handleSave = () => {
    if (safeWord.trim()) {
      localStorage.setItem('sahayak_safe_word', safeWord.trim());
      localStorage.setItem('sahayak_decoy_screen', decoyScreen);
    }
    
    // Navigate back to home or chat
    const returnUrl = searchParams.get('return') || '/';
    router.push(returnUrl);
  };

  const handleSkip = () => {
    const returnUrl = searchParams.get('return') || '/';
    router.push(returnUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto p-6">
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

        {/* Safe Word Input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-lg font-semibold mb-2">{text.safeWordLabel}</label>
          <input
            type="text"
            value={safeWord}
            onChange={(e) => setSafeWord(e.target.value)}
            placeholder={text.safeWordPlaceholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-2">
            Choose something memorable but not obvious to others
          </p>
        </div>

        {/* Decoy Screen Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">{text.decoyScreenLabel}</h2>
          <p className="text-gray-600 mb-4">{text.decoyScreenDesc}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.entries(text.decoyOptions).map(([key, label]) => (
              <label key={key} className="cursor-pointer">
                <input
                  type="radio"
                  name="decoyScreen"
                  value={key}
                  checked={decoyScreen === key}
                  onChange={(e) => setDecoyScreen(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg transition-all ${
                  decoyScreen === key 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="font-medium text-center">{label}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Preview */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">{text.preview}</h3>
            <div className="max-w-xs mx-auto">
              {decoyPreviews[decoyScreen as keyof typeof decoyPreviews]}
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{text.howItWorks}</h2>
          <div className="space-y-3">
            {text.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            onClick={handleSkip}
          >
            {text.skipButton}
          </button>
          <button 
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!safeWord.trim()}
          >
            {text.saveButton}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-xl">🔒</span>
            <div className="text-sm text-yellow-800">
              <strong>Privacy Note:</strong> Your safe word is stored locally on your device only. 
              It never leaves your phone and cannot be accessed by anyone else.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SafeWordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <SafeWordContent />
    </Suspense>
  );
}