import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './CaseManagement.css';

export const mockCases = [
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

const CaseManagement = ({ language }) => {
  const [adminSession, setAdminSession] = useState(null);
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCase, setSelectedCase] = useState(null);
  const navigate = useNavigate();

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
      followUp: 'Outcome & Impact',
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
      institutionConfig: 'Institution Configuration',
      configureRoles: 'Configure Roles',
      configureNotifications: 'Configure Notifications',
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
      institutionConfig: 'संस्थान कॉन्फ़िगरेशन',
      configureRoles: 'भूमिकाएं कॉन्फ़िगर करें',
      configureNotifications: 'सूचनाएं कॉन्फ़िगर करें',
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

  const text = content[language] || content.en;
  useEffect(() => {
    // Check admin authentication
    const session = localStorage.getItem('admin_session');
    const isAuthenticated = localStorage.getItem('admin_authenticated');

    if (!session || !isAuthenticated) {
      navigate('/admin');
      return;
    }

    const parsedSession = JSON.parse(session);
    setAdminSession(parsedSession);

    // Filter cases based on role permissions
    const filteredCases = filterCasesByRole(mockCases, parsedSession.role);
    setCases(filteredCases);
  }, [navigate]);

  const filterCasesByRole = (allCases, role) => {
    const rolePermissions = {
      icc_officer: ['harassment', 'sexual_harassment'],
      anti_ragging_warden: ['ragging', 'bullying'],
      campus_counsellor: ['mental_health', 'counseling'],
      dean: ['all'], // Dean sees everything
      security_officer: ['physical_threat', 'emergency']
    };

    const permissions = rolePermissions[role] || [];

    if (permissions.includes('all')) {
      return allCases;
    }

    return allCases.filter(case_ => permissions.includes(case_.type));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const handleStatusUpdate = (caseId, newStatus) => {
    setCases(prevCases =>
      prevCases.map(case_ =>
        case_.id === caseId ? { ...case_, status: newStatus } : case_
      )
    );

    // In production, this would be an API call
    console.log(`Case ${caseId} status updated to: ${newStatus}`);
  };

  const getResolutionHealth = (case_) => {
    // Check if there's a real-time progress update from the student
    const updates = JSON.parse(localStorage.getItem('sahayak_progress_updates') || '{}');
    const update = updates[case_.sessionId] || updates[case_.id];
    
    const currentStatus = update ? update.status : case_.followUpStatus;

    if (case_.status === 'Resolved') {
      if (currentStatus === 'better') return { label: 'Successful Resolution', color: '#10b981', icon: '🟢' };
      if (currentStatus === 'worse') return { label: 'Failed Intervention', color: '#ef4444', icon: '🔴' };
      return { label: 'Stagnant Resolution', color: '#f59e0b', icon: '🟡' };
    }
    
    if (currentStatus === 'worse') return { label: 'URGENT: Escalating', color: '#dc2626', icon: '🚨' };
    if (currentStatus === 'better') return { label: 'Improving', color: '#34d399', icon: '📈' };
    
    return { label: 'Monitoring', color: '#6b7280', icon: '⏳' };
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
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'severity':
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = severityOrder[a.severity];
          bValue = severityOrder[b.severity];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
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

  const getFollowUpIcon = (status) => {
    switch (status) {
      case 'better': return '😊';
      case 'same': return '😐';
      case 'worse': return '😟';
      default: return '⏳';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported': return '#3b82f6';
      case 'Under Review': return '#f59e0b';
      case 'Action Taken': return '#8b5cf6';
      case 'Resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (!adminSession) {
    return (
      <div className="case-management">
        <div className="no-access">
          <h2>{text.noAccess}</h2>
          <button onClick={() => navigate('/admin')} className="login-redirect">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const filteredCases = getFilteredAndSortedCases();

  return (
    <div className="admin-layout-wrapper">
      <Sidebar adminSession={adminSession} onLogout={handleLogout} />
      
      <main className="admin-layout-main">
        <header className="admin-main-header">
          <div className="header-breadcrumbs">
            <span>Admin</span> / <span>Cases Hub</span>
          </div>
          <div className="header-actions-row">
            <h1>Cases Hub</h1>
            <div className="header-btns">
              <button className="btn-secondary" onClick={exportCases}>📊 {text.exportCases}</button>
            </div>
          </div>
        </header>

        {/* Feature 11: 72-Hour Escalation Warning */}
        {filteredCases.some(c => (new Date() - new Date(c.date)) > (72 * 60 * 60 * 1000) && c.status !== 'Resolved') && (
          <div className="escalation-warning-banner">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <strong>Escalation Warning:</strong> Some active cases have been unresolved for more than 72 hours. Immediate action recommended.
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="controls-section">
          <div className="filter-section">
            <div className="filter-group">
              <label>Filter by Type:</label>
              <div className="filter-buttons">
                <button
                  className={filter === 'all' ? 'active' : ''}
                  onClick={() => setFilter('all')}
                >
                  {text.filterAll}
                </button>
                <button
                  className={filter === 'harassment' ? 'active' : ''}
                  onClick={() => setFilter('harassment')}
                >
                  {text.filterHarassment}
                </button>
                <button
                  className={filter === 'ragging' ? 'active' : ''}
                  onClick={() => setFilter('ragging')}
                >
                  {text.filterRagging}
                </button>
                <button
                  className={filter === 'cyberbullying' ? 'active' : ''}
                  onClick={() => setFilter('cyberbullying')}
                >
                  {text.filterCyber}
                </button>
                <button
                  className={filter === 'mental_health' ? 'active' : ''}
                  onClick={() => setFilter('mental_health')}
                >
                  {text.filterMentalHealth}
                </button>
                <button
                  className={filter === 'physical_threat' ? 'active' : ''}
                  onClick={() => setFilter('physical_threat')}
                >
                  {text.filterPhysicalThreat}
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">{text.statusAll}</option>
                <option value="Reported">{text.statusReported}</option>
                <option value="Under Review">{text.statusUnderReview}</option>
                <option value="Action Taken">{text.statusActionTaken}</option>
                <option value="Resolved">{text.statusResolved}</option>
              </select>
            </div>

            <div className="sort-group">
              <label>{text.sortBy}:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">{text.sortDate}</option>
                <option value="severity">{text.sortSeverity}</option>
                <option value="status">{text.sortStatus}</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="cases-table">
          <div className="table-header">
            <div className="col-case-id">{text.caseId}</div>
            <div className="col-type">{text.type}</div>
            <div className="col-severity">{text.severity}</div>
            <div className="col-status">{text.status}</div>
            <div className="col-follow-up">{text.followUp}</div>
            <div className="col-date">{text.date}</div>
            <div className="col-actions">{text.actions}</div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="no-cases">
              <p>{text.noCases}</p>
            </div>
          ) : (
            filteredCases.map((case_) => (
              <div key={case_.id} className="table-row">
                <div className="col-case-id">
                  <div className="case-id-container">
                    {case_.id}
                    {case_.priority && <span className="priority-flag">🚨</span>}
                    {case_.isAnonymous && <span className="anonymous-flag">👤</span>}
                  </div>
                </div>
                <div className="col-type">
                  <span className="type-badge">{case_.type}</span>
                </div>
                <div className="col-severity">
                  <span
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(case_.severity) }}
                  >
                    {case_.severity}
                  </span>
                </div>
                <div className="col-status">
                  <select
                    value={case_.status}
                    onChange={(e) => handleStatusUpdate(case_.id, e.target.value)}
                    className="status-select"
                    style={{ borderColor: getStatusColor(case_.status) }}
                  >
                    <option value="Reported">{text.statusReported}</option>
                    <option value="Under Review">{text.statusUnderReview}</option>
                    <option value="Action Taken">{text.statusActionTaken}</option>
                    <option value="Resolved">{text.statusResolved}</option>
                  </select>
                </div>
                <div className="col-follow-up">
                  {(() => {
                    const health = getResolutionHealth(case_);
                    return (
                      <div className="outcome-insight" style={{ color: health.color }}>
                        <span className="outcome-icon">{health.icon}</span>
                        <div className="outcome-details">
                          <span className="outcome-label">{health.label}</span>
                          {case_.status === 'Resolved' && case_.followUpStatus === 'worse' && (
                            <span className="outcome-alert">Student still suffering</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="col-date">
                  {new Date(case_.date).toLocaleDateString()}
                </div>
                <div className="col-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedCase(case_)}
                  >
                    👁️ {text.viewDetails}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Case Details Modal */}
        {selectedCase && (
          <div className="case-modal-overlay" onClick={() => setSelectedCase(null)}>
            <div className="case-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Case Details: {selectedCase.id}</h2>
                <button
                  className="close-modal"
                  onClick={() => setSelectedCase(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-content">
                <div className="detail-row">
                  <strong>Type:</strong> {selectedCase.type}
                </div>
                <div className="detail-row">
                  <strong>Severity:</strong>
                  <span
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(selectedCase.severity) }}
                  >
                    {selectedCase.severity}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Status:</strong> {selectedCase.status}
                </div>
                <div className="detail-row">
                  <strong>Location:</strong> {selectedCase.location}
                </div>
                <div className="detail-row">
                  <strong>Reported By:</strong> {selectedCase.isAnonymous ? text.anonymousCase : selectedCase.reportedBy}
                </div>
                <div className="detail-row">
                  <strong>Follow-Up Status:</strong>
                  <span className="follow-up-display">
                    {getFollowUpIcon(selectedCase.followUpStatus)}
                    {text.followUpStatus[selectedCase.followUpStatus] || text.followUpStatus.pending}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Description:</strong>
                  <p>{selectedCase.description}</p>
                </div>
                <div className="detail-row">
                  <strong>Session ID:</strong> {selectedCase.sessionId}
                </div>
                <div className="detail-row">
                  <strong>Date Reported:</strong> {new Date(selectedCase.date).toLocaleString()}
                </div>
                {selectedCase.priority && (
                  <div className="priority-notice">
                    🚨 This case has been flagged as priority due to "worse" follow-up response
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Institution Configuration Section (for Dean role) */}
        {adminSession.role === 'dean' && (
          <div className="institution-config">
            <h2>{text.institutionConfig}</h2>
            <div className="config-buttons">
              <button className="config-btn">
                👥 {text.configureRoles}
              </button>
              <button className="config-btn">
                🔔 {text.configureNotifications}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CaseManagement;