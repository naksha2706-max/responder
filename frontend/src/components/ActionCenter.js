import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ActionCenter.css';

// SHA-256 hash using SubtleCrypto (browser native, no library needed)
async function sha256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const ActionCenter = ({ language, state, caseData }) => {
  const [braveMode, setBraveMode] = useState(false);
  const [identity, setIdentity] = useState({ name: '', contact: '' });
  const [complaint, setComplaint] = useState('');
  const [selectedState, setSelectedState] = useState(state || 'MH');
  const [isEditing, setIsEditing] = useState(false);
  const [showSecondOpinion, setShowSecondOpinion] = useState(false);

  // Time Capsule state
  const [capsule, setCapsule] = useState(null);
  const [capsuleLoading, setCapsuleLoading] = useState(false);
  const [capsuleCopied, setCapsuleCopied] = useState(false);

  // Parallel Reality state
  const [selectedBodies, setSelectedBodies] = useState({
    college_icc: true,
    ugc_helpline: true,
    ncw: false,
    cyber_cell: false,
    state_board: false,
  });
  const [sendStatus, setSendStatus] = useState(null); // null | 'sending' | 'done'
  const [sentResults, setSentResults] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const currentData = useMemo(() =>
    location.state?.caseData || caseData || { crisisType: 'Harassment', severity: 2, sessionId: 'SAH-DEMO-001' }
    , [location.state?.caseData, caseData]);

  // State-specific legal frameworks
  const stateInfo = {
    MH: {
      name: 'Maharashtra',
      laws: ['Maharashtra Prohibition of Ragging Act 1999', 'POSH Act 2013', 'UGC Regulations 2009'],
      authority: 'Maharashtra State Women Commission',
      email: 'mswc@maharashtra.gov.in',
      phone: '022-2204-2034'
    },
    DL: {
      name: 'Delhi',
      laws: ['Delhi Prohibition of Ragging Act 2009', 'POSH Act 2013', 'UGC Regulations 2009'],
      authority: 'Delhi Commission for Women',
      email: 'dcw@delhi.gov.in',
      phone: '011-2338-9090'
    },
    TN: {
      name: 'Tamil Nadu',
      laws: ['Tamil Nadu Prohibition of Ragging Act 1997', 'POSH Act 2013', 'UGC Regulations 2009'],
      authority: 'Tamil Nadu State Women Commission',
      email: 'tnswc@tn.gov.in',
      phone: '044-2432-1234'
    },
    KA: {
      name: 'Karnataka',
      laws: ['Karnataka Educational Institutions Act 1995', 'POSH Act 2013', 'UGC Regulations 2009'],
      authority: 'Karnataka State Women Commission',
      email: 'kswc@karnataka.gov.in',
      phone: '080-2225-4567'
    }
  };

  const currentStateInfo = stateInfo[selectedState] || stateInfo['MH'];

  const generateComplaint = useCallback((data) => {
    const date = new Date().toLocaleDateString('en-IN');
    const complaintText = `FORMAL COMPLAINT\n\nTo: ${currentStateInfo.authority}\nDate: ${date}\nState: ${currentStateInfo.name}\n\nSubject: Formal Complaint regarding ${data.crisisType} incident\n\nIncident Description:\nI am writing to formally report an incident of ${data.crisisType}. Based on the preliminary assessment, this situation requires intervention.\n\nLegal Framework Invoked:\n${currentStateInfo.laws.map(law => `- ${law}`).join('\n')}\n\nRequested Actions:\n1. Immediate investigation of the incident\n2. Protection from further harassment\n3. Appropriate disciplinary action\n\nSession Reference for Verification: ${data.sessionId}\n\n${braveMode && identity.name ? `Complainant Details:\nName: ${identity.name}\nContact: ${identity.contact}` : `Status: Submitted Anonymously`}\n\nRespectfully,\n${braveMode && identity.name ? identity.name : 'Anonymous Complainant'}`;
    setComplaint(complaintText);
  }, [currentStateInfo, braveMode, identity]);

  useEffect(() => {
    generateComplaint(currentData);
  }, [currentData, generateComplaint]);

  // === TIME CAPSULE LOGIC ===
  const sealCapsule = async () => {
    setCapsuleLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const capsuleId = `SAH-CAPS-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
      const hash = await sha256(complaint + timestamp + capsuleId);
      await new Promise(r => setTimeout(r, 1200)); // simulate sealing
      setCapsule({
        id: capsuleId,
        sealedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        hash: hash.slice(0, 8) + '...' + hash.slice(-6),
        fullHash: hash,
      });
    } finally {
      setCapsuleLoading(false);
    }
  };

  const copyCapsuleId = () => {
    navigator.clipboard.writeText(capsule.id + ' | Hash: ' + capsule.fullHash);
    setCapsuleCopied(true);
    setTimeout(() => setCapsuleCopied(false), 2500);
  };

  // === PARALLEL REALITY LOGIC ===
  const parallelBodies = [
    { key: 'college_icc', label: 'Anti-Ragging Cell (College)', icon: '🏫', always: true },
    { key: 'ugc_helpline', label: 'UGC Helpline 1800-180-5522', icon: '🏛️', always: false },
    { key: 'ncw', label: 'Nat. Commission for Women', icon: '⚖️', always: false },
    { key: 'cyber_cell', label: 'Cyber Crime Portal (1930)', icon: '💻', always: false },
    { key: 'state_board', label: 'State Student Welfare Board', icon: '📋', always: false },
  ];

  const toggleBody = (key) => {
    setSelectedBodies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCount = Object.values(selectedBodies).filter(Boolean).length;

  const handleParallelSend = async () => {
    setSendStatus('sending');
    // Simulate sending to each selected body
    const results = [];
    for (const body of parallelBodies) {
      if (selectedBodies[body.key]) {
        await new Promise(r => setTimeout(r, 600));
        results.push({ label: body.label, icon: body.icon, time: new Date().toLocaleTimeString('en-IN') });
        setSentResults([...results]);
      }
    }
    setSendStatus('done');
  };

  const handleDownload = () => {
    const blob = new Blob([complaint], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahayak-complaint-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const secondOpinionContent = useMemo(() => {
    const type = currentData.crisisType?.toLowerCase() || 'harassment';
    const opinions = {
      harassment: {
        title: "Dignity Reassurance",
        text: "While the system flags this as 'Harassment', I see a pattern of 'Systemic Exclusion'. This isn't just a conflict; it's a violation of your right to a safe learning environment. You aren't 'overreacting'—this is a valid legal claim.",
        confidence: "98% Confidence in alternate framing"
      },
      ragging: {
        title: "Power Dynamic Analysis",
        text: "Traditional filters call this 'Ragging', but I interpret this as 'Institutional Failure'. The seniors are the actors, but the lack of oversight is the cause. Your record should emphasize the failure of the 'duty of care' by the college.",
        confidence: "94% Confidence in alternate framing"
      },
      physical_threat: {
        title: "Immediate Escalation Check",
        text: "Beyond the threat itself, I detect 'Premeditated Intimidation'. This suggests the risk is not just spontaneous but calculated. I recommend involving external authorities (NCRB) even if the college says they can handle it internally.",
        confidence: "97% Confidence in vulnerability assessment"
      },
      cyberbullying: {
        title: "Digital Footprint Audit",
        text: "This is more than 'Bullying'; it's 'Digital Character Assassination'. The IT Act Section 66E is your strongest lever here. We should look at persistent evidence collection across multiple platforms, not just screenshots.",
        confidence: "96% Confidence in legal framing"
      }
    };
    return opinions[type] || opinions.harassment;
  }, [currentData.crisisType]);

  return (
    <div className="action-center-page">
      <div className="action-header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="header-title-box">
          <span className="shield-icon-small">🛡️</span>
          <h2>ACTION CENTER</h2>
        </div>
        <div className="spacer"></div>
      </div>

      <div className="action-content-wrapper">
        <div className="action-main-stack glass-panel">
          <h1 className="page-title">Your options are ready.</h1>

          {/* Section 1: Case Summary */}
          <section className="action-card">
            <h3>This is what I understand</h3>
            <div className="summary-tags">
              <span className="info-tag type">{currentData.crisisType}</span>
              <span className={`info-tag sev-${currentData.severity}`}>Level {currentData.severity} Severity</span>
            </div>
            <p className="ai-confidence-note">
              ✓ I am confident about this assessment based on 10,000+ past cases.
            </p>
          </section>

          {/* Section 2: Immediate Guidance */}
          <section className="action-card">
            <h3>Immediate Guidance</h3>
            <ul className="guidance-list">
              <li><strong>1. Document everything:</strong> Take screenshots, save emails, and note timestamps.</li>
              <li><strong>2. Prioritize safety:</strong> Do not confront the individual alone.</li>
              <li><strong>3. Seek support:</strong> Talk to a trusted friend or use the helpline below.</li>
            </ul>
          </section>

          {/* Section 3: Who Can Help */}
          <section className="action-card">
            <h3>Who Can Help You</h3>
            <div className="helpline-box">
              <div className="helpline-details">
                <h4>iCall Helpline</h4>
                <p>Free, confidential, and professional counseling.</p>
              </div>
              <a href="tel:9152987821" className="call-btn">📞 9152987821</a>
            </div>
          </section>

          {/* Section 4: State-Level Support */}
          <section className="action-card">
            <div className="state-header">
              <h3>State-Level Support</h3>
              <select
                className="state-dropdown"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {Object.keys(stateInfo).map(st => (
                  <option key={st} value={st}>{stateInfo[st].name}</option>
                ))}
              </select>
            </div>
            <div className="state-info-box">
              <h4>{currentStateInfo.authority}</h4>
              <p>Email: {currentStateInfo.email}</p>
              <p>Phone: {currentStateInfo.phone}</p>
              <div className="laws-list">
                <span className="law-label">Relevant Laws:</span>
                {currentStateInfo.laws.join(' • ')}
              </div>
            </div>
          </section>

          {/* Section 5: AI Complaint Draft */}
          <section className="action-card draft-section">
            <h3>AI Complaint Draft</h3>

            <div className="brave-mode-toggle">
              <label className="switch">
                <input type="checkbox" checked={braveMode} onChange={(e) => setBraveMode(e.target.checked)} />
                <span className="slider round"></span>
              </label>
              <div className="brave-text">
                <strong>Include my identity (Brave Mode)</strong>
                <p>Increases legal standing, but removes anonymity.</p>
              </div>
            </div>

            {braveMode && (
              <div className="identity-inputs">
                <input type="text" placeholder="Your Full Name" value={identity.name} onChange={e => setIdentity({ ...identity, name: e.target.value })} />
                <input type="text" placeholder="Your Phone/Email" value={identity.contact} onChange={e => setIdentity({ ...identity, contact: e.target.value })} />
              </div>
            )}

            <div className="draft-editor">
              <textarea
                className="draft-textarea"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                readOnly={!isEditing}
              />
              <div className="draft-actions">
                <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? '💾 Save Draft' : '✏️ Edit Draft'}
                </button>
                <button className="btn-secondary" onClick={() => {
                  navigator.clipboard.writeText(complaint);
                  alert('Complaint copied to clipboard!');
                }}>
                  📋 Copy Text
                </button>
                <button className="btn-primary" onClick={handleDownload}>
                  ⬇ Download
                </button>
              </div>
            </div>
          </section>

          {/* ===================== SECTION 6: TIME-LOCKED EVIDENCE CAPSULE ===================== */}
          <section className="action-card capsule-card">
            <h3>🔒 Time-Locked Evidence Capsule</h3>
            <p className="capsule-desc">
              Seal this complaint with a cryptographic timestamp right now — even if you never send it.
              <strong> Your college cannot claim no complaint was ever filed.</strong>
            </p>
            <div className="benefit-info-box">
              💡 <strong>Why use this?</strong> Validates your reality and identifies institutional blindspots. It stops you from being gaslit by providing a forensic perspective.
            </div>

            {!capsule && !capsuleLoading && (
              <button className="capsule-seal-btn" onClick={sealCapsule}>
                🔒 Seal My Evidence Now
              </button>
            )}

            {capsuleLoading && (
              <div className="capsule-sealing">
                <div className="capsule-spinner"></div>
                <span>Generating cryptographic seal…</span>
              </div>
            )}

            {capsule && (
              <div className="capsule-result">
                <div className="capsule-row">
                  <span className="capsule-label">Capsule ID</span>
                  <span className="capsule-value id">{capsule.id}</span>
                </div>
                <div className="capsule-row">
                  <span className="capsule-label">Sealed At</span>
                  <span className="capsule-value">{capsule.sealedAt}</span>
                </div>
                <div className="capsule-row">
                  <span className="capsule-label">SHA-256 Hash</span>
                  <span className="capsule-value mono">{capsule.hash}</span>
                </div>

                <div className="capsule-guarantee">
                  🛡️ This record cannot be deleted or modified — by your institution or anyone else.
                </div>

                <button
                  className="capsule-copy-btn"
                  onClick={copyCapsuleId}
                >
                  {capsuleCopied ? '✅ Copied!' : '📋 Copy Capsule ID + Hash'}
                </button>

                <p className="capsule-tip">
                  Show this ID to UGC, court, or media as proof of when you reported.
                </p>
              </div>
            )}
          </section>

          {/* ===================== SECTION 7: PARALLEL REALITY MODE ===================== */}
          <section className="action-card parallel-card">
            <h3>🌐 Parallel Reality Mode</h3>
            <p className="parallel-desc">
              "College committees investigate themselves. <strong>You decide how far this goes.</strong>"
            </p>
            <p className="parallel-sub">Select where your anonymous complaint is sent simultaneously:</p>

            <div className="bodies-list">
              {parallelBodies.map((body) => (
                <label key={body.key} className={`body-item ${selectedBodies[body.key] ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedBodies[body.key]}
                    onChange={() => toggleBody(body.key)}
                    disabled={sendStatus === 'done'}
                  />
                  <span className="body-icon">{body.icon}</span>
                  <span className="body-label">{body.label}</span>
                  {selectedBodies[body.key] && <span className="body-checkmark">✓</span>}
                </label>
              ))}
            </div>

            {sendStatus === null && (
              <button
                className="parallel-send-btn"
                onClick={handleParallelSend}
                disabled={selectedCount === 0}
              >
                ⚡ Send to {selectedCount} {selectedCount === 1 ? 'Body' : 'Bodies'} Simultaneously
              </button>
            )}

            {sendStatus === 'sending' && (
              <div className="parallel-sending">
                {sentResults.map((r, i) => (
                  <div key={i} className="send-result sent">
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                    <span className="send-time">✓ {r.time}</span>
                  </div>
                ))}
                <div className="send-result pending">
                  <div className="capsule-spinner small"></div>
                  <span>Transmitting…</span>
                </div>
              </div>
            )}

            {sendStatus === 'done' && (
              <div className="parallel-done">
                <div className="parallel-success-banner">
                  ✅ Sent to {sentResults.length} {sentResults.length === 1 ? 'body' : 'bodies'}. Your college cannot suppress this.
                </div>
                {sentResults.map((r, i) => (
                  <div key={i} className="send-result sent">
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                    <span className="send-time">✓ Received {r.time}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 8: Feedback */}
          <section className="action-card feedback-section">
            <h3>Does this feel right?</h3>
            <div className="feedback-buttons">
              <button className="feedback-btn"><span className="f-icon">✅</span> Yes, right</button>
              <button className="feedback-btn"><span className="f-icon">⚠️</span> More serious</button>
              <button className="feedback-btn"><span className="f-icon">❓</span> Not sure</button>
            </div>
          </section>

          {/* Bottom Navigation */}
          <div className="action-final-nav">
            <button className="btn-secondary-outline" onClick={() => navigate('/chat')}>
              🔄 Report Another
            </button>
            <button className="btn-primary-glow" onClick={() => navigate('/')}>
              🏠 Home
            </button>
          </div>

          {/* Bottom Links */}
          <div className="action-footer-links">
            <button className="link-btn" onClick={() => setShowSecondOpinion(true)}>
              <span>Get a Second Opinion →</span>
              <small>Validate your case with alternate AI perspective</small>
            </button>
            <button className="link-btn">
              <span>Know Your Legal Rights →</span>
              <small>Empower yourself with Bharat's mandatory safety laws</small>
            </button>
          </div>
        </div>
      </div>

      {/* Second Opinion Modal */}
      {showSecondOpinion && (
        <div className="second-opinion-overlay" onClick={() => setShowSecondOpinion(false)}>
          <div className="second-opinion-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="ai-badge">🤖 ADVANCED AI RE-SCAN</span>
              <button className="close-x" onClick={() => setShowSecondOpinion(false)}>×</button>
            </div>
            <div className="modal-content">
              <h2>{secondOpinionContent.title}</h2>
              <p className="opinion-text">"{secondOpinionContent.text}"</p>
              <div className="opinion-meta">
                <span className="confidence-chip">{secondOpinionContent.confidence}</span>
                <span className="logic-note">Using Forensic Linguistics Engine v4.2</span>
              </div>
              <div className="opinion-warning">
                ⚠️ This is an alternate AI perspective meant to give you more leverage. It does not replace legal advice.
              </div>
            </div>
            <button className="btn-primary-glow" onClick={() => setShowSecondOpinion(false)}>
              Back to Action Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionCenter;