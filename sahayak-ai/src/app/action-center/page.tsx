"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ClassificationData {
  response: string;
  classification: {
    crisisType: string;
    severity: string;
    applicableLaw: string;
    authority: string;
    contact: string;
    complaintDraft: string;
    immediateGuidance: string;
    legalRight: string;
  };
}

export default function ActionCenterPage() {
  const router = useRouter();
  const [data, setData] = useState<ClassificationData | null>(null);
  const [caseId, setCaseId] = useState("");

  useEffect(() => {
    // Load classification data from localStorage
    const savedData = localStorage.getItem("sahayak_result");
    const savedCaseId = localStorage.getItem("sahayak_caseId");
    
    if (savedData) {
      setData(JSON.parse(savedData));
    }
    if (savedCaseId) {
      setCaseId(savedCaseId);
    }
  }, []);

  // Fallback complaint drafts for when Claude doesn't generate one
  const fallbackDrafts = {
    RAGGING: `Subject: Formal Complaint Against Ragging Activities

Dear Anti-Ragging Committee,

I am writing to formally report incidents of ragging that I have experienced/witnessed at our institution. The incidents involve seniors forcing juniors to perform humiliating activities and threatening behavior.

Under the UGC Anti-Ragging Regulations 2009, ragging is a punishable offense. I request immediate investigation and action against the perpetrators.

The incidents have caused significant mental distress and created a hostile environment for students. I seek protection from further harassment and appropriate disciplinary action.

I am willing to cooperate with the investigation while maintaining my safety and privacy.

Respectfully submitted,
A Concerned Student`,

    HARASSMENT: `Subject: Formal Complaint Under POSH Act 2013

Dear Internal Complaints Committee (ICC),

I am filing this complaint under the Prevention of Sexual Harassment (POSH) Act 2013 regarding incidents of harassment I have experienced at our institution.

The incidents constitute unwelcome behavior of a sexual nature that has created a hostile environment. Under POSH Act 2013, I have the right to a safe workplace/educational environment free from sexual harassment.

I request immediate investigation and appropriate action as per the Act's provisions. I also request protection from retaliation and maintenance of confidentiality during the process.

I am prepared to provide additional details to the ICC while ensuring my safety and privacy.

Respectfully submitted,
A Concerned Student`,

    CYBERBULLYING: `Subject: Complaint Regarding Cyberbullying and Online Harassment

Dear Cyber Crime Cell,

I am reporting incidents of cyberbullying and online harassment that I have experienced. The incidents involve threatening messages, defamatory content, and harassment through digital platforms.

Under the Information Technology Act 2000, Section 66C and related provisions, such activities constitute cyber crimes. The harassment has caused significant mental distress and affected my academic performance.

I request investigation and appropriate legal action against the perpetrators. I am willing to provide digital evidence and cooperate with the investigation.

I seek protection from further online harassment and appropriate legal remedies.

Respectfully submitted,
A Concerned Student`,

    MENTAL_HEALTH: `Subject: Request for Mental Health Support and Intervention

Dear Campus Counsellor,

I am reaching out regarding mental health challenges I am facing that require professional support and intervention. The situation has significantly impacted my well-being and academic performance.

I request immediate access to counselling services and mental health support available at our institution. I also request information about additional resources and support systems.

I am willing to engage with counselling services and follow recommended treatment plans. I also request confidentiality and privacy in handling my case.

Please provide guidance on available support systems and next steps for accessing mental health care.

Respectfully submitted,
A Concerned Student`,

    PHYSICAL_THREAT: `Subject: Urgent Report of Physical Threats and Safety Concerns

Dear Campus Security/Police,

I am reporting incidents involving physical threats and safety concerns that require immediate attention. The situation poses a direct threat to my physical safety and well-being.

Under relevant sections of the Indian Penal Code (IPC 323, 506), physical threats and assault constitute criminal offenses. I request immediate intervention and protection.

I am willing to provide detailed information and cooperate with the investigation. I also request immediate safety measures and protection from further threats.

This matter requires urgent attention given the direct threat to physical safety.

Respectfully submitted,
A Concerned Student`
  };

  // Get the complaint draft - use Claude's draft or fallback to template
  const classification = data?.classification || {};
  const complaintDraft = classification.complaintDraft || 
    (classification.crisisType ? fallbackDrafts[classification.crisisType as keyof typeof fallbackDrafts] : '') || 
    fallbackDrafts.RAGGING; // Default fallback

  if (!data) {
    return (
      <div style={{
        height: "100vh",
        background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui"
      }}>
        Loading your results...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24
      }}>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#64748b",
            fontSize: 20,
            cursor: "pointer",
            padding: 0
          }}
        >
          ←
        </button>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18
        }}>
          🛡️
        </div>
        <div>
          <h1 style={{
            color: "#f1f5f9",
            fontSize: 18,
            fontWeight: 700,
            margin: 0
          }}>
            Action Center
          </h1>
          <p style={{
            color: "#64748b",
            fontSize: 12,
            margin: 0
          }}>
            Case #{caseId}
          </p>
        </div>
      </div>

      {/* Classification Results */}
      <div style={{
        background: "rgba(30,41,59,0.8)",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        border: "1px solid rgba(148,163,184,0.1)"
      }}>
        <h2 style={{
          color: "#f1f5f9",
          fontSize: 20,
          fontWeight: 700,
          margin: "0 0 16px"
        }}>
          📋 Your Situation Analysis
        </h2>
        
        <div style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
        }}>
          <div>
            <p style={{
              color: "#94a3b8",
              fontSize: 12,
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: 1
            }}>
              Crisis Type
            </p>
            <p style={{
              color: "#f1f5f9",
              fontSize: 16,
              fontWeight: 600,
              margin: 0
            }}>
              {data.classification?.crisisType || "General Support"}
            </p>
          </div>
          
          <div>
            <p style={{
              color: "#94a3b8",
              fontSize: 12,
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: 1
            }}>
              Severity Level
            </p>
            <p style={{
              color: data.classification?.severity === "HIGH" ? "#f87171" : 
                    data.classification?.severity === "MEDIUM" ? "#fbbf24" : "#22c55e",
              fontSize: 16,
              fontWeight: 600,
              margin: 0
            }}>
              {data.classification?.severity || "Low"}
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Guidance */}
      {data.classification?.immediateGuidance && (
        <div style={{
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24
        }}>
          <h3 style={{
            color: "#22c55e",
            fontSize: 16,
            fontWeight: 700,
            margin: "0 0 12px"
          }}>
            🎯 Immediate Next Steps
          </h3>
          <p style={{
            color: "#f1f5f9",
            fontSize: 14,
            lineHeight: 1.6,
            margin: 0
          }}>
            {data.classification.immediateGuidance}
          </p>
        </div>
      )}

      {/* Contact Information */}
      {data.classification?.contact && (
        <div style={{
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24
        }}>
          <h3 style={{
            color: "#3b82f6",
            fontSize: 16,
            fontWeight: 700,
            margin: "0 0 12px"
          }}>
            📞 Who to Contact
          </h3>
          <p style={{
            color: "#f1f5f9",
            fontSize: 14,
            margin: "0 0 8px"
          }}>
            <strong>{data.classification.authority}</strong>
          </p>
          <a
            href={`tel:${data.classification.contact}`}
            style={{
              color: "#60a5fa",
              fontSize: 14,
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            📞 {data.classification.contact}
          </a>
        </div>
      )}

      {/* Legal Information */}
      {data.classification?.applicableLaw && (
        <div style={{
          background: "rgba(168,85,247,0.1)",
          border: "1px solid rgba(168,85,247,0.2)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24
        }}>
          <h3 style={{
            color: "#a855f7",
            fontSize: 16,
            fontWeight: 700,
            margin: "0 0 12px"
          }}>
            ⚖️ Your Legal Rights
          </h3>
          <p style={{
            color: "#f1f5f9",
            fontSize: 14,
            lineHeight: 1.6,
            margin: "0 0 8px"
          }}>
            <strong>Applicable Law:</strong> {data.classification.applicableLaw}
          </p>
          {data.classification.legalRight && (
            <p style={{
              color: "#f1f5f9",
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0
            }}>
              {data.classification.legalRight}
            </p>
          )}
        </div>
      )}

      {/* Complaint Draft */}
      {complaintDraft && (
        <div style={{
          background: "rgba(251,191,36,0.1)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12
          }}>
            <h3 style={{
              color: "#fbbf24",
              fontSize: 16,
              fontWeight: 700,
              margin: 0
            }}>
              📄 Formal Complaint Draft
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(complaintDraft);
                // You could add a toast notification here
              }}
              style={{
                background: "rgba(251,191,36,0.2)",
                border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#fbbf24",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              📋 Copy
            </button>
          </div>
          <textarea
            value={complaintDraft}
            readOnly
            style={{
              width: "100%",
              minHeight: "200px",
              background: "rgba(15,23,42,0.5)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 8,
              padding: 16,
              color: "#f1f5f9",
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: "system-ui, -apple-system, sans-serif",
              resize: "vertical"
            }}
          />
          <p style={{
            color: "#94a3b8",
            fontSize: 12,
            margin: "12px 0 0",
            lineHeight: 1.5
          }}>
            💡 This complaint draft is generated based on your situation. You can copy it and modify as needed before submitting to the appropriate authority.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
      }}>
        <button
          onClick={() => router.push("/wellness-vault")}
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          📝 Write Private Letter
          <br />
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            Safe journaling space
          </span>
        </button>

        <button
          onClick={() => router.push("/wellness-vault")}
          style={{
            padding: "16px 20px",
            background: "rgba(34,197,94,0.2)",
            color: "#22c55e",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          🧘 Wellness Resources
          <br />
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            Self-care & coping tools
          </span>
        </button>

        <button
          onClick={() => router.push("/")}
          style={{
            padding: "16px 20px",
            background: "rgba(148,163,184,0.1)",
            color: "#94a3b8",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          🏠 Return Home
          <br />
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            Start over safely
          </span>
        </button>
      </div>

      {/* Privacy Notice */}
      <div style={{
        marginTop: 32,
        padding: 16,
        background: "rgba(148,163,184,0.05)",
        borderRadius: 12,
        textAlign: "center"
      }}>
        <p style={{
          color: "#64748b",
          fontSize: 11,
          margin: 0,
          lineHeight: 1.6
        }}>
          🔒 Your privacy is protected. This case ID is anonymous and no personal information is stored.
          <br />
          You can safely close this page - your information will not be saved.
        </p>
      </div>
    </div>
  );
}