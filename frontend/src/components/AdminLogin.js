import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    institutionId: '',
    role: '',
    accessKey: ''
  });
  const [roleDetails, setRoleDetails] = useState({
    committeeId: '',
    blockName: '',
    department: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Role-based access control mockup
  const rolePermissions = {
    icc_officer: ['harassment', 'sexual_harassment'],
    anti_ragging_warden: ['ragging', 'bullying'],
    campus_counsellor: ['mental_health', 'counseling'],
    dean: ['all'], // Dean sees everything
    security_officer: ['physical_threat', 'emergency']
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock authentication
    const validInstitutions = ['IIT-001', 'NIT-002', 'IIIT-003', 'COLLEGE-004'];
    const validAccessKeys = {
      'IIT-001': {
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

    const expectedKey = validAccessKeys[credentials.institutionId]?.[credentials.role];
    if (credentials.accessKey !== expectedKey) {
      setError('Invalid credentials. Please try again.');
      return;
    }

    // Store admin session
    const adminSession = {
      institutionId: credentials.institutionId,
      role: credentials.role,
      permissions: rolePermissions[credentials.role],
      loginTime: Date.now()
    };

    localStorage.setItem('admin_session', JSON.stringify(adminSession));
    localStorage.setItem('admin_authenticated', 'true');

    // Log access
    const auditLog = JSON.parse(localStorage.getItem('admin_audit_log') || '[]');
    auditLog.push({
      institutionId: credentials.institutionId,
      role: credentials.role,
      loginTime: new Date().toISOString(),
      ip: 'localhost'
    });
    localStorage.setItem('admin_audit_log', JSON.stringify(auditLog));

    // Navigate to analytics dashboard
    navigate('/admin/analytics');
  };

  return (
    <div className="admin-login-page">
      <div className="login-glass-panel">

        <div className="login-header-top">
          <button className="back-btn-sm" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>

        <div className="login-header">
          <h1><span className="admin-shield">🛡️</span> Admin Portal</h1>
          <p className="login-subtitle">Secure gateway for institution officials.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="institutionId">Institution ID</label>
            <input
              type="text"
              id="institutionId"
              value={credentials.institutionId}
              onChange={(e) => setCredentials({ ...credentials, institutionId: e.target.value })}
              placeholder="Enter your unique institution ID"
              className="admin-input"
              required
            />
            <div className="input-hint">Example: IIT-001</div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role Selection</label>
            <select
              id="role"
              value={credentials.role}
              onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
              className="admin-select"
              required
            >
              <option value="">Select your role</option>
              <option value="icc_officer">ICC Officer</option>
              <option value="anti_ragging_warden">Anti-Ragging Warden</option>
              <option value="campus_counsellor">Campus Counsellor</option>
              <option value="dean">Dean</option>
              <option value="security_officer">Security Officer</option>
            </select>
            {credentials.role && (
              <div className="role-details-section fade-in">
                <div className="role-desc-box">
                  {credentials.role === 'icc_officer' && 'Scope: Internal Complaints Committee - Harassment & Ethics.'}
                  {credentials.role === 'anti_ragging_warden' && 'Scope: Campus Safety & Anti-Ragging Compliance.'}
                  {credentials.role === 'campus_counsellor' && 'Scope: Student Wellbeing & Mental Health Support.'}
                  {credentials.role === 'dean' && 'Scope: Full institutional oversight & legal compliance.'}
                  {credentials.role === 'security_officer' && 'Scope: Physical security & emergency response.'}
                </div>

                {/* Role Specific Extra Fields */}
                {credentials.role === 'icc_officer' && (
                  <div className="form-group secondary-field">
                    <label>Committee Registration ID</label>
                    <input
                      type="text"
                      placeholder="e.g. ICC-2024-REG-XX"
                      className="admin-input-sm"
                      value={roleDetails.committeeId}
                      onChange={(e) => setRoleDetails({ ...roleDetails, committeeId: e.target.value })}
                      required
                    />
                  </div>
                )}

                {credentials.role === 'anti_ragging_warden' && (
                  <div className="form-group secondary-field">
                    <label>Assigned Hostel Block/Zone</label>
                    <input
                      type="text"
                      placeholder="e.g. Boys Hostel Block A"
                      className="admin-input-sm"
                      value={roleDetails.blockName}
                      onChange={(e) => setRoleDetails({ ...roleDetails, blockName: e.target.value })}
                      required
                    />
                  </div>
                )}

                {(credentials.role === 'campus_counsellor' || credentials.role === 'dean') && (
                  <div className="form-group secondary-field">
                    <label>Official Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Student Affairs / Administration"
                      className="admin-input-sm"
                      value={roleDetails.department}
                      onChange={(e) => setRoleDetails({ ...roleDetails, department: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accessKey">Access Key</label>
            <input
              type="password"
              id="accessKey"
              value={credentials.accessKey}
              onChange={(e) => setCredentials({ ...credentials, accessKey: e.target.value })}
              placeholder="Enter your access key"
              className="admin-input"
              required
            />
            <div className="input-hint">Demo key for Dean: DEAN-2024-001</div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="auth-btn">
            Authenticate & Login
          </button>
        </form>

        <div className="audit-footer">
          <span>🔒 All access is cryptographically logged for accountability.</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
