'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    institutionId: '',
    role: '',
    accessKey: ''
  });
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en');
  
  const router = useRouter();

  const content = {
    en: {
      title: 'Admin Login',
      subtitle: 'Secure entry point that separates student world from institution world',
      institutionId: 'Institution ID',
      institutionPlaceholder: 'Enter your unique institution ID',
      role: 'Role Selection',
      accessKey: 'Access Key',
      accessKeyPlaceholder: 'Enter your access key',
      loginButton: 'Login',
      backButton: 'Back to Home',
      invalidCredentials: 'Invalid credentials. Please try again.',
      auditNote: 'All access is logged for accountability',
      roles: {
        icc_officer: 'ICC Officer',
        anti_ragging_warden: 'Anti-Ragging Warden',
        campus_counsellor: 'Campus Counsellor',
        dean: 'Dean',
        security_officer: 'Security Officer'
      }
    },
    hi: {
      title: 'एडमिन लॉगिन',
      subtitle: 'सुरक्षित प्रवेश बिंदु जो छात्र दुनिया को संस्थान दुनिया से अलग करता है',
      institutionId: 'संस्थान आईडी',
      institutionPlaceholder: 'अपनी अनूठी संस्थान आईडी दर्ज करें',
      role: 'भूमिका चयन',
      accessKey: 'एक्सेस की',
      accessKeyPlaceholder: 'अपनी एक्सेस की दर्ज करें',
      loginButton: 'लॉगिन',
      backButton: 'होम पर वापस जाएं',
      invalidCredentials: 'अमान्य क्रेडेंशियल। कृपया पुन: प्रयास करें।',
      auditNote: 'जवाबदेही के लिए सभी पहुंच लॉग की जाती है',
      roles: {
        icc_officer: 'ICC अधिकारी',
        anti_ragging_warden: 'एंटी-रैगिंग वार्डन',
        campus_counsellor: 'कैंपस काउंसलर',
        dean: 'डीन',
        security_officer: 'सुरक्षा अधिकारी'
      }
    }
  };

  const text = content[language as keyof typeof content] || content.en;

  // Role-based access control
  const rolePermissions = {
    icc_officer: ['harassment', 'sexual_harassment'],
    anti_ragging_warden: ['ragging', 'bullying'],
    campus_counsellor: ['mental_health', 'counseling'],
    dean: ['all'], // Dean sees everything
    security_officer: ['physical_threat', 'emergency']
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo credentials for testing
    const demoCredentials = {
      dean: { name: "Dr. Sarah Kumar", role: "dean" },
      "icc-officer": { name: "Prof. Meera Singh", role: "icc-officer" },
      warden: { name: "Mr. Rajesh Patel", role: "warden" }
    };

    // Check for demo login
    const demoKey = credentials.accessKey.toLowerCase();
    if (demoCredentials[demoKey as keyof typeof demoCredentials]) {
      const demo = demoCredentials[demoKey as keyof typeof demoCredentials];
      
      // Store admin session
      localStorage.setItem('adminRole', demo.role);
      localStorage.setItem('adminName', demo.name);
      localStorage.setItem('adminInstitutionId', 'NIT-TN-0042');
      
      // Navigate to dashboard
      router.push('/admin/dashboard');
      return;
    }
    
    // Mock authentication - in production, this would be handled by backend
    const validInstitutions = ['IIT-001', 'NIT-TN-01', 'NIT-002', 'IIIT-003', 'COLLEGE-004'];
    const validAccessKeys = {
      'IIT-001': { 
        icc_officer: 'ICC-2024-001',
        anti_ragging_warden: 'ARW-2024-001',
        campus_counsellor: 'CC-2024-001',
        dean: 'DEAN-2024-001',
        security_officer: 'SEC-2024-001'
      },
      'NIT-TN-01': {
        icc_officer: 'ICC-2024-001',
        anti_ragging_warden: 'ARW-2024-001',
        campus_counsellor: 'CC-2024-001',
        dean: 'DEAN-2024-001',
        security_officer: 'SEC-2024-001'
      }
    };

    if (!validInstitutions.includes(credentials.institutionId)) {
      setError('Invalid Institution ID');
      return;
    }

    if (!credentials.role) {
      setError('Please select a role');
      return;
    }

    const expectedKey = validAccessKeys[credentials.institutionId as keyof typeof validAccessKeys]?.[credentials.role as keyof typeof validAccessKeys['IIT-001']];
    if (credentials.accessKey !== expectedKey) {
      setError(text.invalidCredentials);
      return;
    }

    // Store admin session
    const adminSession = {
      institutionId: credentials.institutionId,
      role: credentials.role,
      permissions: rolePermissions[credentials.role as keyof typeof rolePermissions],
      loginTime: Date.now()
    };

    localStorage.setItem('admin_session', JSON.stringify(adminSession));
    localStorage.setItem('admin_authenticated', 'true');

    // Log access for audit
    const auditLog = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
    auditLog.push({
      institutionId: credentials.institutionId,
      role: credentials.role,
      loginTime: new Date().toISOString(),
      ip: 'localhost' // In production, get real IP
    });
    localStorage.setItem('admin_audit_log', JSON.stringify(auditLog));

    // Navigate to dashboard
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => router.push('/')}
            className="mb-4 text-gray-600 hover:text-gray-800 underline"
          >
            ← {text.backButton}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.title}</h1>
          <p className="text-gray-600">{text.subtitle}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div>
            <label htmlFor="institutionId" className="block text-sm font-medium text-gray-700 mb-2">
              {text.institutionId}
            </label>
            <input
              type="text"
              id="institutionId"
              value={credentials.institutionId}
              onChange={(e) => setCredentials({...credentials, institutionId: e.target.value})}
              placeholder={text.institutionPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="text-xs text-gray-500 mt-1">Example: IIT-001, NIT-002, COLLEGE-004</div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              {text.role}
            </label>
            <select
              id="role"
              value={credentials.role}
              onChange={(e) => setCredentials({...credentials, role: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select your role</option>
              <option value="icc_officer">{text.roles.icc_officer}</option>
              <option value="anti_ragging_warden">{text.roles.anti_ragging_warden}</option>
              <option value="campus_counsellor">{text.roles.campus_counsellor}</option>
              <option value="dean">{text.roles.dean}</option>
              <option value="security_officer">{text.roles.security_officer}</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">
              {credentials.role === 'icc_officer' && 'Access: Harassment and sexual harassment cases only'}
              {credentials.role === 'anti_ragging_warden' && 'Access: Ragging and bullying cases only'}
              {credentials.role === 'campus_counsellor' && 'Access: Mental health and counseling cases only'}
              {credentials.role === 'dean' && 'Access: All cases and full administrative control'}
              {credentials.role === 'security_officer' && 'Access: Physical threats and emergency cases only'}
            </div>
          </div>

          <div>
            <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 mb-2">
              {text.accessKey}
            </label>
            <input
              type="password"
              id="accessKey"
              value={credentials.accessKey}
              onChange={(e) => setCredentials({...credentials, accessKey: e.target.value})}
              placeholder={text.accessKeyPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Demo keys: dean, icc-officer, warden | Or use: ICC-2024-001, ARW-2024-001, CC-2024-001, DEAN-2024-001, SEC-2024-001
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔐 {text.loginButton}
          </button>
        </form>

        {/* Audit Note */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {text.auditNote}
          </div>
        </div>
      </div>
    </div>
  );
}