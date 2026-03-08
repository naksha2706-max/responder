"use client";

import { useState } from "react";

export default function PlaygroundPage() {
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testName: string, testFn: () => Promise<string>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    }
    setLoading(prev => ({ ...prev, [testName]: false }));
  };

  const tests = [
    {
      name: "API Health Check",
      description: "Test if the classify API is responding",
      test: async () => {
        const response = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "test", history: [] })
        });
        
        if (response.ok) {
          return "✅ API is responding correctly";
        } else {
          return `❌ API returned ${response.status}`;
        }
      }
    },
    {
      name: "Emergency Detection",
      description: "Test emergency keyword detection",
      test: async () => {
        const response = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "I want to kill myself", history: [] })
        });
        
        const data = await response.json();
        
        if (data.immediateRisk || data.safetyOverride) {
          return "✅ Emergency detection working";
        } else {
          return "❌ Emergency not detected";
        }
      }
    },
    {
      name: "Normal Classification",
      description: "Test normal message classification",
      test: async () => {
        const response = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: "My seniors are troubling me every night", 
            history: [] 
          })
        });
        
        const data = await response.json();
        
        if (data.response && data.emotionScore !== undefined) {
          return `✅ Classification working - Emotion: ${data.emotionScore}`;
        } else {
          return "❌ Classification failed";
        }
      }
    },
    {
      name: "Safe Word Storage",
      description: "Test localStorage safe word functionality",
      test: async () => {
        // Test setting safe word
        localStorage.setItem("sahayak_safeword", "testword");
        const stored = localStorage.getItem("sahayak_safeword");
        
        if (stored === "testword") {
          // Clean up
          localStorage.removeItem("sahayak_safeword");
          return "✅ Safe word storage working";
        } else {
          return "❌ Safe word storage failed";
        }
      }
    },
    {
      name: "Pre-screening Speed",
      description: "Test emergency pre-screening response time",
      test: async () => {
        const startTime = Date.now();
        
        const response = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "I want to die", history: [] })
        });
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        const data = await response.json();
        
        if (data.immediateRisk && responseTime < 1000) {
          return `✅ Fast emergency response: ${responseTime}ms`;
        } else {
          return `❌ Slow response: ${responseTime}ms`;
        }
      }
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      padding: 24,
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: 800,
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          border: "1px solid rgba(148,163,184,0.1)"
        }}>
          <h1 style={{
            color: "#f1f5f9",
            fontSize: 28,
            fontWeight: 900,
            margin: "0 0 8px",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            🛡️ Sahayak AI Playground
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: 14,
            margin: 0
          }}>
            Test all system components and verify functionality
          </p>
        </div>

        {/* Navigation Links */}
        <div style={{
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          border: "1px solid rgba(148,163,184,0.1)"
        }}>
          <h3 style={{
            color: "#f1f5f9",
            fontSize: 16,
            fontWeight: 700,
            margin: "0 0 12px"
          }}>
            🔗 Quick Navigation
          </h3>
          <div style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap"
          }}>
            {[
              { name: "Landing Page", path: "/" },
              { name: "Chat (Student)", path: "/chat?mode=student" },
              { name: "Chat (Witness)", path: "/chat?mode=witness" },
              { name: "Emergency", path: "/emergency" },
              { name: "Action Center", path: "/action-center" },
              { name: "Admin Portal", path: "/admin" }
            ].map(link => (
              <a
                key={link.path}
                href={link.path}
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  transition: "transform 0.1s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Test Suite */}
        <div style={{
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid rgba(148,163,184,0.1)"
        }}>
          <h3 style={{
            color: "#f1f5f9",
            fontSize: 18,
            fontWeight: 700,
            margin: "0 0 16px"
          }}>
            🧪 Automated Test Suite
          </h3>

          <div style={{
            display: "flex",
            gap: 12,
            marginBottom: 24
          }}>
            <button
              onClick={() => {
                tests.forEach(test => {
                  runTest(test.name, test.test);
                });
              }}
              style={{
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              🚀 Run All Tests
            </button>
            
            <button
              onClick={() => {
                setTestResults({});
                setLoading({});
              }}
              style={{
                background: "rgba(100,116,139,0.3)",
                color: "#94a3b8",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              🗑️ Clear Results
            </button>
          </div>

          {/* Individual Tests */}
          <div style={{
            display: "grid",
            gap: 16
          }}>
            {tests.map(test => (
              <div
                key={test.name}
                style={{
                  background: "rgba(30,41,59,0.5)",
                  border: "1px solid rgba(148,163,184,0.1)",
                  borderRadius: 12,
                  padding: 16
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8
                }}>
                  <div>
                    <h4 style={{
                      color: "#f1f5f9",
                      fontSize: 14,
                      fontWeight: 600,
                      margin: "0 0 4px"
                    }}>
                      {test.name}
                    </h4>
                    <p style={{
                      color: "#94a3b8",
                      fontSize: 12,
                      margin: 0
                    }}>
                      {test.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => runTest(test.name, test.test)}
                    disabled={loading[test.name]}
                    style={{
                      background: loading[test.name] 
                        ? "rgba(100,116,139,0.3)" 
                        : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: loading[test.name] ? "not-allowed" : "pointer",
                      minWidth: 60
                    }}
                  >
                    {loading[test.name] ? "..." : "Test"}
                  </button>
                </div>

                {/* Test Result */}
                {testResults[test.name] && (
                  <div style={{
                    background: testResults[test.name].startsWith("✅") 
                      ? "rgba(34,197,94,0.1)" 
                      : "rgba(239,68,68,0.1)",
                    border: `1px solid ${testResults[test.name].startsWith("✅") 
                      ? "rgba(34,197,94,0.2)" 
                      : "rgba(239,68,68,0.2)"}`,
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8
                  }}>
                    <p style={{
                      color: testResults[test.name].startsWith("✅") 
                        ? "#22c55e" 
                        : "#ef4444",
                      fontSize: 12,
                      fontWeight: 600,
                      margin: 0
                    }}>
                      {testResults[test.name]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manual Testing Guide */}
        <div style={{
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          padding: 24,
          marginTop: 24,
          border: "1px solid rgba(148,163,184,0.1)"
        }}>
          <h3 style={{
            color: "#f1f5f9",
            fontSize: 18,
            fontWeight: 700,
            margin: "0 0 16px"
          }}>
            📋 Manual Testing Checklist
          </h3>

          {[
            "✅ Landing page loads with rotating safety messages",
            "✅ Safe word modal opens and saves correctly",
            "✅ Chat page navigation works (student/witness modes)",
            "✅ Action chips send messages and get AI responses",
            "✅ Emergency detection shows red screen instantly",
            "✅ Safe word triggers decoy screen (triple-tap to return)",
            "✅ Case ID generates correctly (SAH-XXXXXXX format)",
            "✅ No hydration errors in browser console",
            "✅ Mobile responsive design works",
            "✅ All animations and transitions smooth"
          ].map((item, i) => (
            <div
              key={i}
              style={{
                color: "#94a3b8",
                fontSize: 14,
                margin: "8px 0",
                padding: "8px 12px",
                background: "rgba(30,41,59,0.3)",
                borderRadius: 6,
                border: "1px solid rgba(148,163,184,0.1)"
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}