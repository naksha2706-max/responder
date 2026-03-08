'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSession {
  institutionId: string;
  role: string;
  permissions: string[];
  loginTime: number;
}

export default function AnalyticsPage() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [riskScore, setRiskScore] = useState(0);
  const [language, setLanguage] = useState('en');
  
  const router = useRouter();

  const content = {
    en: {
      title: 'Analytics Dashboard',
      subtitle: 'Institution sees the big picture — patterns, hotspots, and risk levels across campus',
      riskScore: 'Institution Risk Score',
      crisisHeatmap: 'Crisis Heatmap',
      crisisBreakdown: 'Crisis Breakdown',
      clusterAlerts: 'Cluster Alert Panel',
      patternInsights: 'Pattern Insights',
      peakTimeAnalysis: 'Peak Time Analysis',
      exportData: 'Export Data',
      viewCases: 'View Cases',
      logoutButton: 'Logout',
      noAccess: 'Access Denied. Please login as an administrator.',
      locations: {
        hostel_a: 'Hostel A',
        hostel_b: 'Hostel B',
        cse_dept: 'CSE Department',
        ece_dept: 'ECE Department',
        library: 'Library',
        common_areas: 'Common Areas',
        cafeteria: 'Cafeteria',
        sports_complex: 'Sports Complex'
      },
      crisisTypes: {
        ragging: 'Ragging',
        harassment: 'Harassment',
        mental_health: 'Mental Health',
        cyberbullying: 'Cyberbullying',
        physical_threat: 'Physical Threat'
      },
      riskLevels: {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
        critical: 'Critical Risk'
      }
    },
    hi: {
      title: 'एनालिटिक्स डैशबोर्ड',
      subtitle: 'संस्थान बड़ी तस्वीर देखता है — कैंपस में पैटर्न, हॉटस्पॉट और जोखिम स्तर',
      riskScore: 'संस्थान जोखिम स्कोर',
      crisisHeatmap: 'संकट हीटमैप',
      crisisBreakdown: 'संकट विभाजन',
      clusterAlerts: 'क्लस्टर अलर्ट पैनल',
      patternInsights: 'पैटर्न अंतर्दृष्टि',
      peakTimeAnalysis: 'पीक टाइम विश्लेषण',
      exportData: 'डेटा निर्यात करें',
      viewCases: 'केस देखें',
      logoutButton: 'लॉगआउट',
      noAccess: 'पहुंच अस्वीकृत। कृपया प्रशासक के रूप में लॉगिन करें।',
      locations: {
        hostel_a: 'हॉस्टल A',
        hostel_b: 'हॉस्टल B',
        cse_dept: 'CSE विभाग',
        ece_dept: 'ECE विभाग',
        library: 'पुस्तकालय',
        common_areas: 'सामान्य क्षेत्र',
        cafeteria: 'कैफेटेरिया',
        sports_complex: 'खेल परिसर'
      },
      crisisTypes: {
        ragging: 'रैगिंग',
        harassment: 'उत्पीड़न',
        mental_health: 'मानसिक स्वास्थ्य',
        cyberbullying: 'साइबरबुलिंग',
        physical_threat: 'शारीरिक खतरा'
      },
      riskLevels: {
        low: 'कम जोखिम',
        medium: 'मध्यम जोखिम',
        high: 'उच्च जोखिम',
        critical: 'गंभीर जोखिम'
      }
    }
  };

  const text = content[language as keyof typeof content] || content.en;

  // Mock data
  const mockData = {
    riskScore: 67,
    heatmapData: {
      hostel_a: { count: 12, severity: 'high' },
      hostel_b: { count: 4, severity: 'medium' },
      cse_dept: { count: 8, severity: 'high' },
      ece_dept: { count: 3, severity: 'low' },
      library: { count: 2, severity: 'low' },
      common_areas: { count: 6, severity: 'medium' },
      cafeteria: { count: 1, severity: 'low' },
      sports_complex: { count: 0, severity: 'safe' }
    },
    crisisBreakdown: {
      ragging: 67,
      harassment: 21,
      mental_health: 9,
      cyberbullying: 3
    },
    clusterAlerts: [
      {
        id: 1,
        location: 'hostel_a',
        type: 'ragging',
        count: 3,
        timeframe: '48 hours',
        recommendation: 'Convene anti-ragging cell today'
      },
      {
        id: 2,
        location: 'cse_dept',
        type: 'harassment',
        count: 4,
        timeframe: '24 hours',
        recommendation: 'ICC investigation required'
      }
    ],
    patternInsights: [
      'Ragging incidents peak between 11pm and 2am',
      'Hostel A has 3x the incident rate of Hostel B',
      'CSE department harassment cases increased 40% this month',
      'Mental health cases spike during exam periods'
    ]
  };

  useEffect(() => {
    // Check admin authentication
    const session = localStorage.getItem('admin_session');
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    
    if (!session || !isAuthenticated) {
      router.push('/admin');
      return;
    }

    const parsedSession = JSON.parse(session);
    setAdminSession(parsedSession);
    setRiskScore(mockData.riskScore);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_authenticated');
    router.push('/admin');
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getHeatmapColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#e5e7eb';
    }
  };

  const exportData = () => {
    const dataToExport = {
      institutionId: adminSession?.institutionId,
      exportDate: new Date().toISOString(),
      ...mockData,
      riskScore
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${adminSession?.institutionId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{text.noAccess}</h2>
          <button 
            onClick={() => router.push('/admin')} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
            <p className="text-gray-600">{text.subtitle}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {adminSession.institutionId}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {adminSession.role}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={exportData}
            >
              📊 {text.exportData}
            </button>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => router.push('/admin/cases')}
            >
              📋 {text.viewCases}
            </button>
            <button 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleLogout}
            >
              🚪 {text.logoutButton}
            </button>
          </div>
        </div>

        {/* Risk Score Gauge */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{text.riskScore}</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={getRiskLevel(riskScore) === 'critical' ? '#dc2626' : 
                         getRiskLevel(riskScore) === 'high' ? '#ef4444' :
                         getRiskLevel(riskScore) === 'medium' ? '#f59e0b' : '#10b981'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${riskScore * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{riskScore}</div>
                  <div className="text-sm text-gray-600">{text.riskLevels[getRiskLevel(riskScore) as keyof typeof text.riskLevels]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cluster Alerts */}
        {mockData.clusterAlerts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">{text.clusterAlerts}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockData.clusterAlerts.map(alert => (
                <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 text-2xl">⚠️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-red-900">Cluster Alert</div>
                      <p className="text-red-800">
                        <strong>{alert.count} cases</strong> of {text.crisisTypes[alert.type as keyof typeof text.crisisTypes]} in {text.locations[alert.location as keyof typeof text.locations]}
                      </p>
                      <p className="text-sm text-red-700">Within {alert.timeframe}</p>
                      <p className="text-sm font-medium text-red-900 mt-2">{alert.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crisis Heatmap */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{text.crisisHeatmap}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(mockData.heatmapData).map(([location, data]) => (
              <div 
                key={location}
                className="p-4 rounded-lg text-white text-center"
                style={{ backgroundColor: getHeatmapColor(data.severity) }}
              >
                <div className="font-semibold">{text.locations[location as keyof typeof text.locations]}</div>
                <div className="text-2xl font-bold">{data.count}</div>
                <div className="text-sm opacity-90">cases</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              High
            </span>
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              Medium
            </span>
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              Low
            </span>
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              Safe
            </span>
          </div>
        </div>

        {/* Crisis Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{text.crisisBreakdown}</h2>
          <div className="space-y-4">
            {Object.entries(mockData.crisisBreakdown).map(([type, percentage]) => (
              <div key={type}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{text.crisisTypes[type as keyof typeof text.crisisTypes]}</span>
                  <span className="text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{text.patternInsights}</h2>
          <div className="space-y-3">
            {mockData.patternInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-xl">💡</span>
                <span className="text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}