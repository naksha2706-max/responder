"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SAFETY_MESSAGES = [
  "What happened to you is not your fault.",
  "You are safe here.",
  "Help is one message away.",
  "You do not have to face this alone.",
  "Taking this step takes courage."
];

export default function LandingPage() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fade, setFade] = useState(true);
  const [showSafeWordModal, setShowSafeWordModal] = useState(false);
  const [safeWord, setSafeWord] = useState("");
  const [savedWord, setSavedWord] = useState(false);

  // Rotating safety messages
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentMessage(prev =>
          prev === SAFETY_MESSAGES.length - 1 ? 0 : prev + 1
        );
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveWord = () => {
    if (safeWord.trim()) {
      localStorage.setItem("sahayak_safeword", safeWord.trim().toLowerCase());
      setSavedWord(true);
      setTimeout(() => {
        setShowSafeWordModal(false);
        setSavedWord(false);
        setSafeWord("");
      }, 1500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 70%, #7dd3fc 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: 420,
        width: "100%",
        textAlign: "center"
      }}>

        {/* Logo */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: 38,
          boxShadow: "0 0 40px rgba(59,130,246,0.3)"
        }}>
          🛡️
        </div>

        {/* Title */}
        <h1 style={{
          color: "#1e40af",
          fontSize: 32,
          fontWeight: 900,
          margin: "0 0 6px",
          letterSpacing: -1
        }}>
          SAHAYAK AI
        </h1>
        <p style={{
          color: "#1e3a8a",
          fontSize: 13,
          margin: "0 0 28px",
          letterSpacing: 2,
          textTransform: "uppercase"
        }}>
          AI First Responder · Bharat
        </p>

        {/* Trust Badges */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 28
        }}>
          {[
            "🔒 Anonymous",
            "⏰ 24/7",
            "🌐 Multilingual",
            "✅ Safe"
          ].map(badge => (
            <span key={badge} style={{
              background: "rgba(59,130,246,0.1)",
              color: "#60a5fa",
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 11,
              border: "1px solid rgba(59,130,246,0.2)",
              fontWeight: 500
            }}>
              {badge}
            </span>
          ))}
        </div>

        {/* Main Card */}
        <div style={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 16,
          padding: "24px 20px",
          marginBottom: 24,
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(59,130,246,0.1)"
        }}>
          {/* Rotating Message */}
          <p style={{
            color: "#1e40af",
            fontSize: 16,
            fontWeight: 600,
            margin: "0 0 12px",
            lineHeight: 1.5,
            opacity: fade ? 1 : 0,
            transition: "opacity 0.5s ease"
          }}>
            "{SAFETY_MESSAGES[currentMessage]}"
          </p>
          <p style={{
            color: "#475569",
            fontSize: 12,
            margin: 0,
            lineHeight: 1.8
          }}>
            Safe anonymous support for ragging, harassment,
            cyberbullying and mental health crises.
            We connect you to the right help — instantly.
          </p>
        </div>

        {/* Entry Buttons */}
        <button
          onClick={() => router.push("/chat?mode=student")}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: 12,
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
            transition: "transform 0.1s, box-shadow 0.1s"
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✍️ &nbsp; I experienced something
        </button>

        <button
          onClick={() => router.push("/chat?mode=witness")}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: 24,
            background: "rgba(255,255,255,0.7)",
            color: "#1e40af",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s, transform 0.1s",
            backdropFilter: "blur(10px)"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.9)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.7)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          👁️ &nbsp; I witnessed something
        </button>

        {/* Safe Word Link */}
        <button
          onClick={() => setShowSafeWordModal(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "#1e40af",
            fontSize: 12,
            cursor: "pointer",
            textDecoration: "underline",
            marginBottom: 16
          }}
        >
          🔐 Set a safe word for privacy
        </button>

        {/* Legal Footer */}
        <p style={{
          color: "#1e3a8a",
          fontSize: 10,
          margin: 0
        }}>
          UGC Anti-Ragging 2009 · POSH Act 2013 · IT Act 2000
        </p>
      </div>

      {/* Safe Word Modal */}
      {showSafeWordModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: 24
        }}>
          <div style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: 28,
            maxWidth: 380,
            width: "100%"
          }}>
            <h3 style={{
              color: "#fff",
              margin: "0 0 8px",
              fontSize: 18,
              fontWeight: 700
            }}>
              🔐 Set Your Safe Word
            </h3>
            <p style={{
              color: "#64748b",
              fontSize: 13,
              margin: "0 0 20px",
              lineHeight: 1.6
            }}>
              If you type this word anytime during
              a conversation, the screen instantly
              switches to a fake notes page.
              Use it if someone walks in unexpectedly.
            </p>

            <input
              type="text"
              value={safeWord}
              onChange={e => setSafeWord(e.target.value)}
              placeholder='e.g. "notes" or "history"'
              onKeyDown={e => {
                if (e.key === "Enter") handleSaveWord();
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 10,
                color: "#fff",
                fontSize: 14,
                marginBottom: 14,
                boxSizing: "border-box",
                outline: "none"
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setShowSafeWordModal(false);
                  setSafeWord("");
                }}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  color: "#64748b",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 13
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWord}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: savedWord
                    ? "#065f46"
                    : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700
                }}
              >
                {savedWord ? "✅ Saved!" : "Save Word"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}