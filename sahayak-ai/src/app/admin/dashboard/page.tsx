"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DEMO_CASES = [
  {
    caseId: "SAH-001",
    crisisType: "RAGGING",
    severity: "HIGH",
    location: "Hostel B",
    status: "REPORTED",
    followUpStatus: null,
    timestamp: Date.now() - 10 * 60 * 60 * 1000
  },
  {
    caseId: "SAH-002",
    crisisType: "RAGGING",
    severity: "HIGH",
    location: "Hostel B",
    status: "UNDER_REVIEW",
    followUpStatus: null,
    timestamp: Date.now() - 24 * 60 * 60 * 1000
  },
  {
    caseId: "SAH-003",
    crisisType: "RAGGING",
    severity: "HIGH",
    location: "Hostel B",
    status: "REPORTED",
    followUpStatus: null,
    timestamp: Date.now() - 36 * 60 * 60 * 1000
  },
  {
    caseId: "SAH-004",
    crisisType: "HARASSMENT",
    severity: "MEDIUM",
    location: "CSE Department",
    status: "ACTION_TAKEN",
    followUpStatus: "WORSE",
    timestamp: Date.now() - 73 * 60 * 60 * 1000
  },
  {
    caseId: "SAH-005",
    crisisType: "MENTAL_HEALTH",
    severity: "LOW",
    location: "Library",
    status: "RESOLVED",
    followUpStatus: "BETTER",
    timestamp: Date.now() - 48 * 60 * 60 * 1000
  },
  {
    caseId: "SAH-006",
    crisisType: "CYBERBULLYING",
    severity: "MEDIUM",
    location: "Common Area",
    status: "REPORTED",
    followUpStatus: null,
    timestamp: Date.now() - 5 * 60 * 60 * 1000
  }
];

const LOCATIONS = [
  "Hostel A", "Hostel B", "Hostel C",
  "CSE Dept", "ECE Dept", "Library", "Common Area"
];

const SEV_COLORS: Record<string, string> = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  EMERGENCY: "#ef4444"
};

const TYPE_COLORS: Record<string, string> = {
  RAGGING: "#ef4444",
  HARASSMENT: "#f97316",
  CYBERBULLYING: "#8b5cf6",
  MENTAL_HEALTH: "#3b82f6",
  PHYSICAL_THREAT: "#dc2626"
};

const FOLLOW_UP_EMOJI: Record<string, string> = {
  BETTER: "😌 Better",
  SAME: "😐 Same",
  WORSE: "😔 Worse"
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminRole, setAdminRole] = useState("");
  const [adminName, setAdminName] = useState("");
  const [cases, setCases] = useState(DEMO_CASES);
  const [clusterAck, setClusterAck] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("adminRole");
    const name = localStorage.getItem("adminName");
    if (!role) {
      router.push("/admin/login");
      return;
    }
    setAdminRole(role || "");
    setAdminName(name || "");
  }, []);

  // Filter cases by role
  const filteredCases = cases.filter(c => {
    if (adminRole === "icc-officer")
      return c.crisisType === "HARASSMENT";
    if (adminRole === "warden")
      return c.crisisType === "RAGGING";
    return true; // dean sees all
  });

  // Stats
  const total = filteredCases.length;
  const highSeverity = filteredCases.filter(
    c => c.severity === "HIGH" || c.severity === "EMERGENCY"
  ).length;
  const pending = filteredCases.filter(
    c => c.status === "REPORTED" || c.status === "UNDER_REVIEW"
  ).length;

  const betterCount = filteredCases.filter(c => c.followUpStatus === "BETTER").length;
  const peaceIndex = total > 0 ? Math.round((betterCount / total) * 100) : 0;

  // Cluster detection
  const ragingHostelB = cases.filter(
    c =>
      c.crisisType === "RAGGING" &&
      c.location === "Hostel B" &&
      Date.now() - c.timestamp < 48 * 60 * 60 * 1000
  );
  const clusterDetected =
    ragingHostelB.length >= 3 && !clusterAck;

  // Heatmap data
  const heatmap = LOCATIONS.map(loc => ({
    location: loc,
    count: cases.filter(c => c.location === loc).length,
    types: cases
      .filter(c => c.location === loc)
      .map(c => c.crisisType)
  }));

  const getHeatColor = (count: number) => {
    if (count === 0) return "#f1f5f9";
    if (count <= 2) return "#dbeafe";
    if (count <= 4) return "#93c5fd";
    return "#2563eb";
  };

  // Sort cases — WORSE first, then 72hr escalation, then rest
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (a.followUpStatus === "WORSE") return -1;
    if (b.followUpStatus === "WORSE") return 1;
    return b.timestamp - a.timestamp;
  });

  const updateStatus = (caseId: string, status: string) => {
    setCases(prev =>
      prev.map(c => c.caseId === caseId ? { ...c, status } : c)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminInstitutionId");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      paddingBottom: 60,
      color: "#1e293b"
    }}>

      {/* Header */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "14px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(37, 99, 235, 0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14
          }}>
            🛡️
          </div>
          <div>
            <p style={{
              color: "#1e3a8a",
              fontWeight: 700,
              margin: 0,
              fontSize: 14
            }}>
              Sahayak Admin
            </p>
            <p style={{
              color: "#64748b",
              fontSize: 10,
              margin: 0
            }}>
              {adminName} · NIT-TN-0042
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            transition: "all 0.2s"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>

        {/* Cluster Alert */}
        {clusterDetected && (
          <div style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 10px 15px -3px rgba(225, 29, 72, 0.1)"
          }}>
            <div>
              <p style={{
                color: "#e11d48",
                fontWeight: 900,
                margin: "0 0 4px",
                fontSize: 15
              }}>
                ⚠️ CLUSTER DETECTED
              </p>
              <p style={{
                color: "#9f1239",
                fontSize: 13,
                margin: "0 0 4px"
              }}>
                {ragingHostelB.length} RAGGING cases — Hostel B — last 48 hours
              </p>
              <p style={{
                color: "#be123c",
                fontSize: 12,
                margin: 0
              }}>
                Recommended: Convene Anti-Ragging Cell today
              </p>
            </div>
            <button
              onClick={() => setClusterAck(true)}
              style={{
                background: "#e11d48",
                border: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                marginLeft: 12
              }}
            >
              Acknowledge
            </button>
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          marginBottom: 12
        }}>
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: 16,
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.03)"
          }}>
            <p style={{ color: "#3b82f6", fontSize: 32, fontWeight: 900, margin: "0 0 4px" }}>{peaceIndex}%</p>
            <p style={{ color: "#64748b", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>Student Peace Index</p>
          </div>
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: 16,
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.03)"
          }}>
            <p style={{ color: "#ef4444", fontSize: 32, fontWeight: 900, margin: "0 0 4px" }}>{highSeverity}</p>
            <p style={{ color: "#64748b", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>Critical Alerts</p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          marginBottom: 20
        }}>
          {[
            { label: "Total Cases", value: total, color: "#1e3a8a" },
            { label: "Pending Action", value: pending, color: "#f59e0b" }
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.03)"
            }}>
              <p style={{
                color: stat.color,
                fontSize: 32,
                fontWeight: 900,
                margin: "0 0 4px"
              }}>
                {stat.value}
              </p>
              <p style={{
                color: "#64748b",
                fontSize: 11,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: 1
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 14,
          padding: 16,
          marginBottom: 20
        }}>
          <p style={{
            color: "#374151",
            fontSize: 10,
            margin: "0 0 14px",
            textTransform: "uppercase",
            letterSpacing: 1
          }}>
            🗺️ Campus Heatmap
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8
          }}>
            {heatmap.map(loc => (
              <div
                key={loc.location}
                title={`${loc.location} — ${loc.count} case${loc.count !== 1 ? "s" : ""}`}
                style={{
                  background: getHeatColor(loc.count),
                  borderRadius: 10,
                  padding: "12px 8px",
                  textAlign: "center",
                  cursor: "default",
                  border: loc.location === "Hostel B"
                    ? "2px solid #ef4444"
                    : "1px solid transparent",
                  transition: "transform 0.1s"
                }}
              >
                <p style={{
                  color: loc.count > 0 ? "#fef2f2" : "#374151",
                  fontSize: 11,
                  fontWeight: 700,
                  margin: "0 0 4px"
                }}>
                  {loc.location}
                </p>
                <p style={{
                  color: loc.count > 0 ? "#fca5a5" : "#1f2937",
                  fontSize: 18,
                  fontWeight: 900,
                  margin: 0
                }}>
                  {loc.count}
                </p>
              </div>
            ))}
          </div>
          <div style={{
            display: "flex",
            gap: 12,
            marginTop: 12,
            flexWrap: "wrap"
          }}>
            {[
              { color: "#f1f5f9", label: "No incidents" },
              { color: "#dbeafe", label: "1-2 cases" },
              { color: "#93c5fd", label: "3-4 cases" },
              { color: "#2563eb", label: "5+ cases" }
            ].map(l => (
              <div key={l.label} style={{
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: l.color,
                  border: "1px solid #e2e8f0"
                }} />
                <span style={{ color: "#64748b", fontSize: 10 }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cases List */}
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 14,
          padding: 16
        }}>
          <p style={{
            color: "#374151",
            fontSize: 10,
            margin: "0 0 14px",
            textTransform: "uppercase",
            letterSpacing: 1
          }}>
            📋 Recent Cases
            {adminRole !== "dean" && (
              <span style={{
                color: "#1e3a5f",
                marginLeft: 8
              }}>
                (filtered by your role)
              </span>
            )}
          </p>

          {sortedCases.length === 0 && (
            <p style={{
              color: "#374151",
              fontSize: 13,
              textAlign: "center",
              padding: "20px 0"
            }}>
              No cases assigned to your role.
            </p>
          )}

          {sortedCases.map(c => {
            const is72hr =
              Date.now() - c.timestamp > 72 * 60 * 60 * 1000 &&
              (c.status === "REPORTED" || c.status === "UNDER_REVIEW");

            return (
              <div
                key={c.caseId}
                style={{
                  background: "#ffffff",
                  border: `1px solid ${c.followUpStatus === "WORSE"
                    ? "#fecdd3"
                    : "#e2e8f0"}`,
                  borderLeft: `4px solid ${c.followUpStatus === "WORSE"
                    ? "#ef4444"
                    : TYPE_COLORS[c.crisisType] || "#94a3b8"}`,
                  borderRadius: 12,
                  padding: "16px",
                  marginBottom: 10,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 8
                }}>
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 4
                    }}>
                      <span style={{
                        color: "#94a3b8",
                        fontSize: 11,
                        fontWeight: 700
                      }}>
                        #{c.caseId}
                      </span>
                      <span style={{
                        background: (TYPE_COLORS[c.crisisType] || "#374151") + "20",
                        color: TYPE_COLORS[c.crisisType] || "#94a3b8",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700
                      }}>
                        {c.crisisType}
                      </span>
                      <span style={{
                        background: SEV_COLORS[c.severity] + "20",
                        color: SEV_COLORS[c.severity],
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700
                      }}>
                        {c.severity}
                      </span>
                      {c.followUpStatus && (
                        <span style={{
                          fontSize: 11,
                          color: c.followUpStatus === "WORSE"
                            ? "#ef4444"
                            : "#22c55e"
                        }}>
                          {FOLLOW_UP_EMOJI[c.followUpStatus]}
                        </span>
                      )}
                      {is72hr && (
                        <span style={{
                          background: "rgba(245,158,11,0.15)",
                          color: "#f59e0b",
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          ⚠️ Escalation pending
                        </span>
                      )}
                    </div>
                    <p style={{
                      color: "#4b5563",
                      fontSize: 11,
                      margin: 0
                    }}>
                      📍 {c.location} · {timeAgo(c.timestamp)}
                    </p>
                  </div>

                  <select
                    value={c.status}
                    onChange={e =>
                      updateStatus(c.caseId, e.target.value)
                    }
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      color: "#94a3b8",
                      padding: "6px 10px",
                      fontSize: 11,
                      cursor: "pointer",
                      outline: "none"
                    }}
                  >
                    <option value="REPORTED">Reported</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ACTION_TAKEN">Action Taken</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}