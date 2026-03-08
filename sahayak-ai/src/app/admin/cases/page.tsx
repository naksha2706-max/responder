'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSession {
  institutionId: string;
  role: string;
  permissions: string[];
  loginTime: number;
}

interface Case {
  id: string;
  type: string;
  severity: string;
  status: string;
  date: string;
  followUpStatus: string;
  isAnonymous: boolean;
  priority: boolean;
  sessionId: string;
  description: string;
  location: string;
  reportedBy: string;
}

export default function CaseManagementPage() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [language, setLanguage] = useState('en');
  
  const router = useRouter();

  const content = {
    en: {
      title: 'Case Management',
      subtitle: 'Manage and track all reported cases',
      filterAll: 'All Cases',
      filterHarassment: 'Harassment',
      filterRagging: 'Ragging',
      filterCyber: 'Cyberbullying',
      filterMentalHealth: 'Mental Health',
      filterPhysicalThreat: 'Physical Threat',
      statusAll: 'All Status',
      statusReported: 'Reported',
      statusUnderReview: 'Under Review',
      statusActionTaken: 'Action Taken',
      statusResolved: 'Resolved',
      caseId: 'Case ID',
      type: 'Type',
      severity: 'Severity',
      status: 'Status',
      followUp: 'Follow-Up',
      date: 'Date',
      actions: 'Actions',
      sortBy: 'Sort by',
      sortDate: 'Date',
      sortSeverity: 'Severity',
      sortStatus: 'Status',
      updateStatus: 'Update Status',
      viewDetails: 'View Details',
      exportCases: 'Export Cases',
      backButton: 'Back to Analytics',
      logoutButton: 'Logout',
      noAccess: 'Access Denied. Please login as an administrator.',
      noCases: 'No cases found matching your filters.',
      followUpStatus: {
        better: 'Better',
        same: 'Same',
        worse: 'Worse',
        pending: 'Pending'
      },
      priorityFlag: 'Priority',
      anonymousCase: 'Anonymous Case'
    },
    hi: {
      title: 'मामला प्रबंधन',
      subtitle: 'सभी रिपोर्ट किए गए मामलों का प्रबंधन और ट्रैकिंग',
      filterAll: 'सभी मामले',
      filterHarassment: 'उत्पीड़न',
      filterRagging: 'रैगिंग',
      filterCyber: 'साइबरबुलिंग',
      filterMentalHealth: 'मानसिक स्वास्थ्य',
      filterPhysicalThreat: 'शारीरिक खतरा',
      statusAll: 'सभी स्थिति',
      statusReported: 'रिपोर्ट किया गया',
      statusUnderReview: 'समीक्षाधीन',
      statusActionTaken: 'कार्रवाई की गई',
      statusResolved: 'हल किया गया',
      caseId: 'मामला आईडी',
      type: 'प्रकार',
      severity: 'गंभीरता',
      status: 'स्थिति',
      followUp: 'फॉलो-अप',
      date: 'तारीख',
      actions: 'कार्रवाई',
      sortBy: 'इसके द्वारा क्रमबद्ध करें',
      sortDate: 'तारीख',
      sortSeverity: 'गंभीरता',
      sortStatus: 'स्थिति',
      updateStatus: 'स्थिति अपडेट करें',
      viewDetails: 'विवरण देखें',
      exportCases: 'मामले निर्यात करें',
      backButton: 'एनालिटिक्स पर वापस जाएं',
      logoutButton: 'लॉगआउट',
      noAccess: 'पहुंच अस्वीकृत। कृपया प्रशासक के रूप में लॉगिन करें।',
      noCases: 'आपके फिल्टर से मेल खाने वाले कोई मामले नहीं मिले।',
      followUpStatus: {
        better: 'बेहतर',
        same: 'वैसा ही',
        worse: 'बदतर',
        pending: 'लंबित'
      },
      priorityFlag: 'प्राथमिकता',
      anonymousCase: 'गुमनाम मामला'
    }
  };

  const text = content[language as keyof typeof content] || content.en;

  // Mock cases data
  const mockCases: Case[] = [
    {
      id: 'SAH-CASE-001',
      type: 'harassment',
      severity: 'high',
      status: 'Under Review',
      date: '2026-03-01',
      followUpStatus: 'worse',
      isAnonymous: true,
      priority: true,
      sessionId: 'sess_001',
      description: 'Workplace harassment incident reported',
      location: 'CSE Department',
      reportedBy: 'Anonymous'
    },
    {
      id: 'SAH-CASE-002',
      type: 'ragging',
      severity: 'medium',
      status: 'Action Taken',
      date: '2026-02-28',
      followUpStatus: 'better',
      isAnonymous: false,
      priority: false,
      sessionId: 'sess_002',
      description: 'Ragging incident in hostel',
      location: 'Hostel A',
      reportedBy: 'Student Name'
    },
    {
      id: 'SAH-CASE-003',
      type: 'cyberbullying',
      severity: 'low',
      status: 'Resolved',
      date: '2026-02-27',
      followUpStatus: 'same',
      isAnonymous: true,
      priority: false,
      sessionId: 'sess_003',
      description: 'Online harassment through social media',
      location: 'Online',
      reportedBy: 'Anonymous'
    },
    {
      id: 'SAH-CASE-004',
      type: 'mental_health',
      severity: 'high',
      status: 'Reported',
      date: '2026-03-05',
      followUpStatus: 'worse',
      isAnonymous: true,
      priority: true,
      sessionId: 'sess_004',
      description: 'Student expressing suicidal thoughts',
      location: 'Campus Counseling Center',
      reportedBy: 'Anonymous'
    },
    {
      id: 'SAH-CASE-005',
      type: 'physical_threat',
      severity: 'critical',
      status: 'Under Review',
      date: '2026-03-04',
      followUpStatus: 'pending',
      isAnonymous: false,
      priority: true,
      sessionId: 'sess_005',
      description: 'Physical threat made against student',
      location: 'Sports Complex',
      reportedBy: 'Witness'
    }
  ];

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
    
    // Filter cases based on role permissions
    const filteredCases = filterCasesByRole(mockCases, parsedSession.role);
    setCases(filteredCases);
  }, [router]);

  const filterCasesByRole = (allCases: Case[], role: string) => {
    const rolePermissions = {
      icc_officer: ['harassment', 'sexual_harassment'],
      anti_ragging_warden: ['ragging', 'bullying'],
      campus_counsellor: ['mental_health', 'counseling'],
      dean: ['all'], // Dean sees everything
      security_officer: ['physical_threat', 'emergency']
    };

    const permissions = rolePermissions[role as keyof typeof rolePermissions] || [];
    
    if (permissions.includes('all')) {
      return allCases;
    }
    
    return allCases.filter(case_ => permissions.includes(case_.type));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_authenticated');
    router.push('/admin');
  };

  const handleStatusUpdate = (caseId: string, newStatus: string) => {
    setCases(prevCases => 
      prevCases.map(case_ => 
        case_.id === caseId ? { ...case_, status: newStatus } : case_
      )
    );
    
    console.log(`Case ${caseId} status updated to: ${newStatus}`);
  };

  const getFilteredAndSortedCases = () => {
    let filtered = cases;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(case_ => case_.type === filter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(case_ => case_.status === statusFilter);
    }

    // Sort cases
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'severity':
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = severityOrder[a.severity as keyof typeof severityOrder];
          bValue = severityOrder[b.severity as keyof typeof severityOrder];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a[sortBy as keyof Case];
          bValue = b[sortBy as keyof Case];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const exportCases = () => {
    const dataToExport = {
      institutionId: adminSession?.institutionId,
      exportDate: new Date().toISOString(),
      exportedBy: adminSession?.role,
      cases: getFilteredAndSortedCases()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cases-${adminSession?.institutionId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFollowUpIcon = (status: string) => {
    switch (status) {
      case 'better': return '😊';
      case 'same': return '😐';
      case 'worse': return '😟';
      default: return '⏳';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Action Taken': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const filteredCases = getFilteredAndSortedCases();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => router.push('/admin/analytics')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M5 12L12 19M5 12L12 5" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
            </div>
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
              onClick={exportCases}
            >
              📊 {text.exportCases}
            </button>
            <button 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleLogout}
            >
              🚪 {text.logoutButton}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type:</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setFilter('all')}
                >
                  {text.filterAll}
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filter === 'harassment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setFilter('harassment')}
                >
                  {text.filterHarassment}
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filter === 'ragging' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setFilter('ragging')}
                >
                  {text.filterRagging}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{text.statusAll}</option>
                <option value="Reported">{text.statusReported}</option>
                <option value="Under Review">{text.statusUnderReview}</option>
                <option value="Action Taken">{text.statusActionTaken}</option>
                <option value="Resolved">{text.statusResolved}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{text.sortBy}:</label>
              <div className="flex gap-2">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">{text.sortDate}</option>
                  <option value="severity">{text.sortSeverity}</option>
                  <option value="status">{text.sortStatus}</option>
                </select>
                <button 
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>{text.noCases}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text.caseId}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text.type}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text.severity}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text.status}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text.followUp}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text.date}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text.actions}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCases.map((case_) => (
                    <tr key={case_.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{case_.id}</span>
                          {case_.priority && <span className="text-red-500">🚨</span>}
                          {case_.isAnonymous && <span className="text-gray-500">👤</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {case_.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(case_.severity)}`}>
                          {case_.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={case_.status}
                          onChange={(e) => handleStatusUpdate(case_.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(case_.status)}`}
                        >
                          <option value="Reported">{text.statusReported}</option>
                          <option value="Under Review">{text.statusUnderReview}</option>
                          <option value="Action Taken">{text.statusActionTaken}</option>
                          <option value="Resolved">{text.statusResolved}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFollowUpIcon(case_.followUpStatus)}</span>
                          <span className="text-sm text-gray-600">
                            {text.followUpStatus[case_.followUpStatus as keyof typeof text.followUpStatus] || text.followUpStatus.pending}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(case_.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => setSelectedCase(case_)}
                        >
                          👁️ {text.viewDetails}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Case Details Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Case Details: {selectedCase.id}</h2>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedCase(null)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong className="text-gray-700">Type:</strong>
                      <div className="mt-1">{selectedCase.type}</div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Severity:</strong>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedCase.severity)}`}>
                          {selectedCase.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Status:</strong>
                    <div className="mt-1">{selectedCase.status}</div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Location:</strong>
                    <div className="mt-1">{selectedCase.location}</div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Reported By:</strong>
                    <div className="mt-1">{selectedCase.isAnonymous ? text.anonymousCase : selectedCase.reportedBy}</div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Follow-Up Status:</strong>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg">{getFollowUpIcon(selectedCase.followUpStatus)}</span>
                      <span>{text.followUpStatus[selectedCase.followUpStatus as keyof typeof text.followUpStatus] || text.followUpStatus.pending}</span>
                    </div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Description:</strong>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedCase.description}</div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Session ID:</strong>
                    <div className="mt-1 font-mono text-sm">{selectedCase.sessionId}</div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Date Reported:</strong>
                    <div className="mt-1">{new Date(selectedCase.date).toLocaleString()}</div>
                  </div>
                  
                  {selectedCase.priority && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-800">
                        <span className="text-lg">🚨</span>
                        <span className="font-medium">This case has been flagged as priority due to "worse" follow-up response</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}