import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCases } from './CaseManagement';
import Sidebar from './Sidebar';
import './HeatmapDashboard.css';

// Mock data moved outside to fix lint dependencies
const mockData = {
  riskScore: 67,
  heatmapData: {
    hostel_a: { name: 'Hostel A', count: 12, severity: 'high' },
    hostel_b: { name: 'Hostel B', count: 4, severity: 'medium' },
    cse_dept: { name: 'CSE Dept', count: 8, severity: 'high' },
    ece_dept: { name: 'ECE Dept', count: 3, severity: 'low' },
    library: { name: 'Library', count: 2, severity: 'low' },
    common_areas: { name: 'Common Areas', count: 6, severity: 'medium' },
    cafeteria: { name: 'Cafeteria', count: 1, severity: 'low' },
    sports_complex: { name: 'Sports Complex', count: 0, severity: 'safe' }
  },
  crisisBreakdown: {
    ragging: { label: 'Ragging', percentage: 67 },
    harassment: { label: 'Harassment', percentage: 21 },
    mental_health: { label: 'Mental Health', percentage: 9 },
    cyberbullying: { label: 'Cyberbullying', percentage: 3 }
  },
  clusterAlerts: [
    {
      id: 1,
      location: 'Hostel A',
      type: 'Ragging',
      count: 3,
      timeframe: '48 hours',
      recommendation: 'Convene anti-ragging cell today.'
    },
    {
      id: 2,
      location: 'CSE Department',
      type: 'Harassment',
      count: 4,
      timeframe: '24 hours',
      recommendation: 'ICC investigation required immediately.'
    }
  ],
  patternInsights: [
    'Ragging incidents peak between 11pm and 2am',
    'Hostel A has 3x the incident rate of Hostel B',
    'CSE department harassment cases increased 40% this month'
  ]
};

const HeatmapDashboard = () => {
  const [adminSession, setAdminSession] = useState(null);
  const [institutionData, setInstitutionData] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [clusterAlerts, setClusterAlerts] = useState([]);
  const [escalatedCount, setEscalatedCount] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!session || !isAuthenticated) {
      navigate('/admin');
      return;
    }

    const parsedSession = JSON.parse(session);
    setAdminSession(parsedSession);

    // Filter data based on permissions
    const permissions = parsedSession.permissions || [];
    const isDean = parsedSession.role === 'dean';

    const filteredData = { ...mockData };

    if (!isDean) {
      // Filter breakdown
      filteredData.crisisBreakdown = Object.fromEntries(
        Object.entries(mockData.crisisBreakdown).filter(([key]) =>
          permissions.includes(key) || permissions.includes('all')
        )
      );

      // Filter alerts
      filteredData.clusterAlerts = mockData.clusterAlerts.filter(alert =>
        permissions.includes(alert.type.toLowerCase()) || permissions.includes('all')
      );

      // Filter insights
      filteredData.patternInsights = mockData.patternInsights.filter(insight => {
        const lower = insight.toLowerCase();
        return permissions.some(p => lower.includes(p)) || permissions.includes('all');
      });
    }

    setInstitutionData(filteredData);
    setRiskScore(isDean ? mockData.riskScore : Math.floor(mockData.riskScore * 0.6));
    setClusterAlerts(filteredData.clusterAlerts);
    
    // Calculate escalated cases (> 72h)
    const escalated = mockCases.filter(c => (new Date() - new Date(c.date)) > (72 * 60 * 60 * 1000) && c.status !== 'Resolved').length;
    setEscalatedCount(escalated);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const getHeatmapColor = (severity) => {
    switch (severity) {
      case 'high': return '#2563eb'; // Deep Blue
      case 'medium': return '#60a5fa'; // Light Blue
      case 'low': return '#dbeafe'; // Very Light Blue
      default: return '#f8fafc'; // Off White
    }
  };

  const exportData = () => {
    alert('Data export initiated (Mockup)');
  };

  if (!adminSession) {
    return (
      <div className="no-access-page">
        <h2>Access Denied. Please login as an administrator.</h2>
        <button onClick={() => navigate('/admin')} className="nav-btn">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="admin-layout-wrapper">
      <Sidebar adminSession={adminSession} onLogout={handleLogout} />
      
      <main className="admin-layout-main">
        <header className="admin-main-header">
          <div className="header-breadcrumbs">
            <span>Admin</span> / <span>Analytics</span>
          </div>
          <div className="header-actions-row">
            <h1>Institution Analytics</h1>
            <div className="header-btns">
              <button className="btn-secondary" onClick={exportData}>📥 Export PDF</button>
            </div>
          </div>
        </header>

        <div className="dashboard-content-grid">
        {/* Main Column */}
        <div className="main-column">

          <div className="top-stats-row">
            <div className="stat-box alert-box">
              <span className="stat-label">Campus Risk Level</span>
              <span className="stat-val critical">{riskScore}/100</span>
            </div>
            <div className="stat-box sentiment-box">
              <span className="stat-label">Student Peace Index</span>
              <span className="stat-val peace-high">
                {Math.round((mockCases.filter(c => c.followUpStatus === 'better').length / mockCases.length) * 100)}%
              </span>
              <span className="sentiment-note">Based on follow-up wellbeing</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">72h+ Escalations</span>
              <span className="stat-val high">{escalatedCount}</span>
            </div>
          </div>

          <div className="dash-card">
            <h2>🔥 Crisis Heatmap (Hotspots)</h2>
            <div className="heatmap-grid">
              {Object.entries(institutionData?.heatmapData || {}).map(([key, data]) => (
                <div
                  key={key}
                  className="heat-cell"
                  style={{ backgroundColor: getHeatmapColor(data.severity), borderColor: getHeatmapColor(data.severity).replace('0.4', '0.8') }}
                >
                  <span className="loc-count">{data.count}</span>
                  <span className="loc-name">{data.name}</span>
                </div>
              ))}
            </div>
            <div className="heat-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#ef4444' }}></div> High Risk
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#f59e0b' }}></div> Medium Risk
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#10b981' }}></div> Low Risk
              </div>
            </div>
          </div>

          <div className="dash-card">
            <h2>🚨 Automated Cluster Alerts</h2>
            <div className="cluster-list">
              {clusterAlerts.map(alert => (
                <div key={alert.id} className="cluster-item">
                  <div className="cluster-header">
                    <span className="c-tag">{alert.type} Cluster</span>
                    <span className="c-time">Last {alert.timeframe}</span>
                  </div>
                  <p className="cluster-desc">
                    Detected <strong>{alert.count} cases</strong> originating from <strong>{alert.location}</strong>.
                  </p>
                  <p className="cluster-rec">AI Recommendation: {alert.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Side Column */}
        <div className="side-column">

          <div className="dash-card">
            <h2>📊 Category Breakdown</h2>
            <div className="breakdown-list">
              {Object.entries(institutionData?.crisisBreakdown || {}).map(([key, data]) => (
                <div key={key} className="b-item">
                  <div className="b-header">
                    <span>{data.label}</span>
                    <span>{data.percentage}%</span>
                  </div>
                  <div className="b-track">
                    <div className="b-fill" style={{ width: `${data.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <h2>💡 AI Pattern Insights</h2>
            <div className="insights-list">
              {institutionData?.patternInsights?.map((insight, idx) => (
                <div key={idx} className="insight-row">
                  <span className="insight-icon">🎯</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
        </div>
      </main>
    </div>
  );
};

export default HeatmapDashboard;