"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  emotionScore?: number;
  tag?: string;
}

interface Classification {
  crisisType: string | null;
  severity: string | null;
  applicableLaw: string;
  authority: string;
  contact: string;
  complaintDraft: string;
  immediateGuidance: string;
  legalRight: string;
}

interface BedrockResponse {
  response: string;
  readyToClassify: boolean;
  safetyOverride: boolean;
  immediateRisk: boolean;
  emotionScore: number;
  emotionTrend: string;
  classification: Classification;
}

const ACTION_CHIPS = [
  "My seniors are troubling me",
  "I am being harassed",
  "I feel unsafe right now",
  "I just need to talk"
];

const SEV_COLORS: Record<string, string> = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  EMERGENCY: "#ef4444"
};

function ChatContent() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") || "student";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState<number[]>([]);
  const [safeWordTriggered, setSafeWordTriggered] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [caseId, setCaseId] = useState<string>("");

  // Opening message
  useEffect(() => {
    const opening =
      mode === "witness"
        ? "Thank you for coming forward. What you witnessed matters deeply. Tell me what happened — everything here is completely confidential."
        : "Hello. This is a completely safe and anonymous space. I will not judge anything you share. Tell me what is happening — I am here with you.";
    setMessages([{ role: "assistant", content: opening }]);
  }, [mode]);

  // Generate case ID on client side only
  useEffect(() => {
    setCaseId("SAH-" + Math.random().toString(36).substr(2, 7).toUpperCase());
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;

    // Check safe word
    const savedWord = localStorage.getItem("sahayak_safeword");
    if (savedWord && text.toLowerCase().includes(savedWord)) {
      setSafeWordTriggered(true);
      return;
    }

    setInput("");
    setLoading(true);

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      // Build history for API
      const history = updatedMessages
        .slice(0, -1)
        .map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        }));

      // Check if emotion is escalating
      const isEscalating =
        emotionHistory.length >= 2 &&
        emotionHistory[emotionHistory.length - 1] >
          emotionHistory[emotionHistory.length - 2];

      const messageToSend = isEscalating
        ? text + " [context: student emotion is escalating, stay present, do not push toward reporting]"
        : text;

      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          sessionId: caseId,
          language: "en",
          conversationHistory: history
        })
      });

      const data: BedrockResponse = await res.json();

      // Update emotion history
      const newHistory = [...emotionHistory, data.emotionScore];
      setEmotionHistory(newHistory);

      // Build tag if classified
      let tag = undefined;
      if (data.readyToClassify && data.classification?.crisisType && !data.immediateRisk) {
        tag = `${data.classification.crisisType} · ${data.classification.severity}`;
      }

      const botMessage: Message = {
        role: "assistant",
        content: data.response,
        emotionScore: data.emotionScore,
        tag
      };

      setMessages(prev => [...prev, botMessage]);
      setLoading(false);

      // Handle emergency
      if (data.immediateRisk || data.safetyOverride) {
        setShowEmergency(true);
        return;
      }

      // Handle classification ready
      if (data.readyToClassify && data.classification?.crisisType) {
        localStorage.setItem("sahayak_result", JSON.stringify(data));
        localStorage.setItem("sahayak_caseId", caseId);
        setTimeout(() => router.push("/action-center"), 1000);
      }

    } catch (err) {
      setLoading(false);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "I am still here with you. There was a brief connection issue. Please tell me again what is happening."
        }
      ]);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Triple tap to return from decoy
  const handleDecoyTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 3) {
      setSafeWordTriggered(false);
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 1000);
  };

  // Safe word decoy screen
  if (safeWordTriggered) {
    return (
      <div
        onClick={handleDecoyTap}
        style={{
          minHeight: "100vh",
          background: "#f5f5f0",
          fontFamily: "Georgia, serif",
          padding: 20
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center"
        }}>
          <h2 style={{ color: "#333", fontSize: 22, margin: 0 }}>
            📝 Notes
          </h2>
          <span style={{ color: "#999", fontSize: 12 }}>
            {new Date().toLocaleDateString("en-IN")}
          </span>
        </div>

        {[
          {
            title: "Chemistry — Chapter 4",
            body: "Periodic table revision\nAtomic numbers 1-20\nAssignment due Friday"
          },
          {
            title: "Tomorrow Schedule",
            body: "9am — Maths lecture\n2pm — Lab session\n5pm — Study group"
          },
          {
            title: "Weekend Plans",
            body: "Call home Sunday\nReturn library books\nLaundry"
          }
        ].map((note, i) => (
          <div key={i} style={{
            background: "#fffef0",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{
              color: "#333",
              fontWeight: 600,
              margin: "0 0 6px",
              fontSize: 14
            }}>
              {note.title}
            </p>
            <p style={{
              color: "#666",
              fontSize: 13,
              margin: 0,
              lineHeight: 1.7,
              whiteSpace: "pre-line"
            }}>
              {note.body}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Emergency overlay
  if (showEmergency) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #150000, #2d0000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 64, marginBottom: 10 }}>🚨</div>
          <h1 style={{
            color: "#fca5a5",
            fontSize: 30,
            fontWeight: 900,
            margin: "0 0 10px"
          }}>
            YOU MATTER.
          </h1>
          <p style={{
            color: "#fecaca",
            fontSize: 15,
            margin: "0 0 28px",
            lineHeight: 1.8
          }}>
            What you are feeling is real and it matters deeply.
            <br />
            Please reach out right now. You are not alone.
          </p>

          {[
            {
              name: "iCall",
              num: "9152987821",
              tag: "Free · Confidential · 24/7"
            },
            {
              name: "Vandrevala Foundation",
              num: "1860-2662-345",
              tag: "Free · 24/7"
            },
            {
              name: "Police Emergency",
              num: "112",
              tag: "Immediate physical danger"
            }
          ].map(h => (
            <div key={h.name} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,80,80,0.2)",
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left"
            }}>
              <div>
                <p style={{
                  color: "#fff",
                  fontWeight: 700,
                  margin: "0 0 3px",
                  fontSize: 14
                }}>
                  {h.name}
                </p>
                <p style={{
                  color: "#f87171",
                  fontSize: 11,
                  margin: 0
                }}>
                  {h.tag}
                </p>
              </div>
              <a
                href={`tel:${h.num}`}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 13,
                  whiteSpace: "nowrap"
                }}
              >
                📞 {h.num}
              </a>
            </div>
          ))}

          <p style={{
            color: "#6b7280",
            fontSize: 12,
            margin: "16px 0 12px",
            lineHeight: 1.7
          }}>
            A trained counsellor is available right now.
            <br />
            One call can help.
          </p>

          <button
            onClick={() => setShowEmergency(false)}
            style={{
              background: "transparent",
              color: "#4b5563",
              border: "1px solid #374151",
              borderRadius: 10,
              padding: "10px 22px",
              cursor: "pointer",
              fontSize: 12
            }}
          >
            I am physically safe — continue reporting
          </button>
        </div>
      </div>
    );
  }

  // Main chat screen
  return (
    <div style={{
      height: "100vh",
      background: "#0a0f1e",
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>

      {/* Header */}
      <div style={{
        background: "#111827",
        borderBottom: "1px solid #1f2937",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "#4b5563",
              fontSize: 20,
              cursor: "pointer",
              padding: "0 6px 0 0",
              lineHeight: 1
            }}
          >
            ←
          </button>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16
          }}>
            🛡️
          </div>
          <div>
            <p style={{
              color: "#f1f5f9",
              fontWeight: 700,
              margin: 0,
              fontSize: 14
            }}>
              Sahayak AI
              {mode === "witness" && (
                <span style={{
                  color: "#64748b",
                  fontSize: 11,
                  marginLeft: 6
                }}>
                  (Witness)
                </span>
              )}
            </p>
            <p style={{
              color: "#1e3a5f",
              fontSize: 10,
              margin: 0
            }}>
              #{caseId || "Loading..."} · 🔒 Anonymous
            </p>
          </div>
        </div>

        <div style={{
          background: "rgba(34,197,94,0.1)",
          color: "#22c55e",
          padding: "4px 10px",
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 700,
          border: "1px solid rgba(34,197,94,0.2)"
        }}>
          ● Live
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px"
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user"
                ? "flex-end"
                : "flex-start",
              marginBottom: 12,
              alignItems: "flex-end",
              gap: 8
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                flexShrink: 0
              }}>
                🛡️
              </div>
            )}
            <div style={{
              maxWidth: "75%",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
                : "#1f2937",
              color: "#e2e8f0",
              padding: "12px 15px",
              borderRadius: msg.role === "user"
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
              fontSize: 14,
              lineHeight: 1.65,
              border: msg.role === "assistant"
                ? "1px solid #374151"
                : "none"
            }}>
              {msg.content}

              {/* Crisis tag */}
              {msg.tag && (
                <div style={{
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: "1px solid #374151"
                }}>
                  <span style={{
                    background: "rgba(37,99,235,0.3)",
                    color: "#93c5fd",
                    padding: "3px 10px",
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    {msg.tag}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            marginBottom: 12
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12
            }}>
              🛡️
            </div>
            <div style={{
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "18px 18px 18px 4px",
              padding: "14px 18px",
              display: "flex",
              gap: 5,
              alignItems: "center"
            }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Smart Action Chips */}
        {messages.length <= 1 && !loading && (
          <div style={{ marginTop: 8 }}>
            <p style={{
              color: "#374151",
              fontSize: 10,
              margin: "0 0 8px",
              textTransform: "uppercase",
              letterSpacing: 1
            }}>
              Quick start:
            </p>
            {ACTION_CHIPS.map((chip, i) => (
              <button
                key={i}
                onClick={() => sendMessage(chip)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid #1f2937",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#6b7280",
                  fontSize: 13,
                  cursor: "pointer",
                  marginBottom: 6,
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    "rgba(59,130,246,0.08)";
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.borderColor = "#1d4ed8";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.02)";
                  e.currentTarget.style.color = "#6b7280";
                  e.currentTarget.style.borderColor = "#1f2937";
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        background: "#111827",
        borderTop: "1px solid #1f2937",
        padding: "12px 16px 16px",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end"
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type what is happening... (Enter to send)"
            rows={1}
            style={{
              flex: 1,
              background: "#0a0f1e",
              border: "1px solid #374151",
              borderRadius: 12,
              padding: "11px 14px",
              color: "#e2e8f0",
              fontSize: 14,
              resize: "none",
              fontFamily: "system-ui, sans-serif",
              outline: "none",
              lineHeight: 1.5,
              maxHeight: 100,
              transition: "border-color 0.2s"
            }}
            onFocus={e => {
              e.target.style.borderColor = "#3b82f6";
            }}
            onBlur={e => {
              e.target.style.borderColor = "#374151";
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background:
                input.trim() && !loading
                  ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
                  : "#1f2937",
              border: "none",
              cursor: input.trim() && !loading
                ? "pointer"
                : "default",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
              boxShadow:
                input.trim() && !loading
                  ? "0 4px 12px rgba(37,99,235,0.4)"
                  : "none"
            }}
          >
            ➤
          </button>
        </div>
        <p style={{
          color: "#1e3a5f",
          fontSize: 9,
          margin: "7px 0 0",
          textAlign: "center"
        }}>
          🔒 No identity stored · Everything you share is private
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{
        height: "100vh",
        background: "#0a0f1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui"
      }}>
        Loading...
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}