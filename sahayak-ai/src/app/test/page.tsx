"use client";

import { useState } from "react";

export default function TestPage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const test = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message, 
          language: 'en',
          sessionId: 'test-session-' + Date.now()
        })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult("ERROR: " + e);
    }
    setLoading(false);
  };

  return (
    <div style={{
      padding: 40,
      fontFamily: "monospace",
      background: "#0f172a",
      minHeight: "100vh",
      color: "white"
    }}>
      <h1 style={{ marginBottom: 8, fontSize: 20 }}>
        🛡️ Sahayak — Bedrock Test
      </h1>
      <p style={{
        color: "#64748b",
        marginBottom: 24,
        fontSize: 13
      }}>
        Test your Bedrock integration here
      </p>

      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a test message..."
        style={{
          width: "100%",
          height: 100,
          padding: 12,
          fontSize: 14,
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          resize: "none",
          boxSizing: "border-box"
        }}
      />

      <button
        onClick={test}
        disabled={loading || !message.trim()}
        style={{
          padding: "12px 28px",
          background: loading ? "#334155" : "#1d4ed8",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "default" : "pointer",
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 24,
          display: "block"
        }}
      >
        {loading ? "Calling Bedrock..." : "Send →"}
      </button>

      {result && (
        <pre style={{
          background: "#020617",
          color: "#22c55e",
          padding: 20,
          borderRadius: 8,
          overflow: "auto",
          fontSize: 12,
          lineHeight: 1.7,
          border: "1px solid #134e4a"
        }}>
          {result}
        </pre>
      )}
    </div>
  );
}