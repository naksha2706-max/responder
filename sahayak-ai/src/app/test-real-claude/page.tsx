"use client";

import { useState } from "react";

export default function TestRealClaudePage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testClaude = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setResponse(null);
    
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: 'test-session-' + Date.now(),
          language: 'en',
          conversationHistory: []
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Test failed:', error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px",
      color: "white"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          marginBottom: 24,
          textAlign: "center"
        }}>
          🧪 Test Real Claude via OpenRouter
        </h1>

        <div style={{
          background: "rgba(30,41,59,0.8)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          border: "1px solid rgba(148,163,184,0.1)"
        }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Test Messages</h2>
          
          <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => setMessage("I am feeling stressed about my studies and some seniors are bothering me")}
              style={{
                padding: "12px 16px",
                background: "rgba(59,130,246,0.2)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              📚 Test 1: Academic stress + harassment
            </button>
            
            <button
              onClick={() => setMessage("I want to kill myself")}
              style={{
                padding: "12px 16px",
                background: "rgba(239,68,68,0.2)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              🚨 Test 2: Emergency detection
            </button>
            
            <button
              onClick={() => setMessage("A professor keeps sending me personal messages and asking me to meet alone")}
              style={{
                padding: "12px 16px",
                background: "rgba(168,85,247,0.2)",
                color: "#a855f7",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ⚖️ Test 3: Harassment detection
            </button>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Or type your own test message..."
            style={{
              width: "100%",
              height: 100,
              padding: 12,
              background: "rgba(15,23,42,0.8)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 8,
              color: "white",
              fontSize: 14,
              resize: "vertical",
              marginBottom: 16
            }}
          />

          <button
            onClick={testClaude}
            disabled={loading || !message.trim()}
            style={{
              padding: "12px 24px",
              background: loading ? "rgba(148,163,184,0.2)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: loading ? "#64748b" : "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "🔄 Testing Claude..." : "🚀 Test Real Claude"}
          </button>
        </div>

        {response && (
          <div style={{
            background: "rgba(30,41,59,0.8)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(148,163,184,0.1)"
          }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>
              {response.error ? "❌ Error" : "✅ Claude Response"}
            </h2>
            
            {response.error ? (
              <p style={{ color: "#f87171", fontSize: 14 }}>
                {response.error}
              </p>
            ) : (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>AI Response:</h3>
                  <p style={{ 
                    fontSize: 14, 
                    lineHeight: 1.6, 
                    background: "rgba(15,23,42,0.8)",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid rgba(148,163,184,0.1)"
                  }}>
                    {response.response}
                  </p>
                </div>

                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                  <div>
                    <h4 style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Ready to Classify</h4>
                    <p style={{ fontSize: 14, color: response.readyToClassify ? "#22c55e" : "#f87171" }}>
                      {response.readyToClassify ? "✅ Yes" : "❌ No"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Safety Override</h4>
                    <p style={{ fontSize: 14, color: response.safetyOverride ? "#f87171" : "#22c55e" }}>
                      {response.safetyOverride ? "🚨 Active" : "✅ Normal"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Immediate Risk</h4>
                    <p style={{ fontSize: 14, color: response.immediateRisk ? "#f87171" : "#22c55e" }}>
                      {response.immediateRisk ? "🚨 Yes" : "✅ No"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Emotion Score</h4>
                    <p style={{ fontSize: 14, color: "#60a5fa" }}>
                      {response.emotionScore}/5 ({response.emotionTrend})
                    </p>
                  </div>
                </div>

                {response.classification && (
                  <div style={{ marginTop: 16 }}>
                    <h3 style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>Classification:</h3>
                    <div style={{ 
                      background: "rgba(15,23,42,0.8)",
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid rgba(148,163,184,0.1)"
                    }}>
                      <p style={{ fontSize: 14, marginBottom: 8 }}>
                        <strong>Type:</strong> {response.classification.crisisType || "None"}
                      </p>
                      <p style={{ fontSize: 14, marginBottom: 8 }}>
                        <strong>Severity:</strong> {response.classification.severity || "None"}
                      </p>
                      {response.classification.authority && (
                        <p style={{ fontSize: 14, marginBottom: 8 }}>
                          <strong>Authority:</strong> {response.classification.authority}
                        </p>
                      )}
                      {response.classification.contact && (
                        <p style={{ fontSize: 14, marginBottom: 8 }}>
                          <strong>Contact:</strong> {response.classification.contact}
                        </p>
                      )}
                      {response.classification.immediateGuidance && (
                        <div style={{ marginTop: 12 }}>
                          <strong style={{ fontSize: 14 }}>Immediate Guidance:</strong>
                          <p style={{ fontSize: 14, marginTop: 4, lineHeight: 1.6 }}>
                            {response.classification.immediateGuidance}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}