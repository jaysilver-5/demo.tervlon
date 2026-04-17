"use client";

import { useState } from "react";
import { Reveal } from "./reveal";

/* ═══════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════ */
const FAQ_ITEMS = [
  { q: "Is the workspace a real development environment?", a: "Yes. It's a containerized environment with a modern IDE, Git workflow, terminal, test runner, and CI/CD pipeline. Students work in the same conditions they'd encounter on the job." },
  { q: "How does scoring work?", a: "The evaluation engine combines automated test results (pass rates, coverage) with AI-powered code analysis (quality, patterns, architecture) to produce a multi-dimensional scorecard. No subjective reviews." },
  { q: "Can I customize simulations for my curriculum?", a: "We're working closely with early-access institutions to build content that matches real curriculum needs. Once the authoring studio ships, you'll be able to create and configure simulations directly." },
  { q: "What about cheating and integrity?", a: "Assessment mode includes behavioral tracking, help-usage analytics, and code originality analysis. We also track AI assistance requests as a signal — how a candidate seeks help is itself evaluative data." },
  { q: "What tech stacks are supported?", a: "Backend engineering (Node.js, Express, Prisma) is the first track. Frontend and cybersecurity tracks are in development. The platform supports any stack through configurable simulation templates." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      border: open ? "1px solid var(--border-light)" : "1px solid var(--border)",
      background: open ? "var(--surface-light)" : "var(--surface)",
      transition: "all 0.3s ease",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "18px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none", cursor: "pointer",
          fontSize: 14.5, fontWeight: 600, color: "var(--white)",
          textAlign: "left", fontFamily: "inherit",
        }}
      >
        <span style={{ paddingRight: 16 }}>{q}</span>
        <span style={{
          fontSize: 20, fontWeight: 300, color: "var(--accent)",
          transition: "transform 0.3s", flexShrink: 0,
          transform: open ? "rotate(45deg)" : "rotate(0)",
        }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{
          padding: "14px 22px 18px",
          borderTop: "1px solid var(--border)",
          fontSize: 13.5, color: "var(--text)", lineHeight: 1.65,
        }}>{a}</div>
      </div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" style={{ position: "relative", padding: "112px 24px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 14 }}>FAQ</p>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, color: "var(--white)", lineHeight: 1.12, letterSpacing: "-0.035em" }}>Everything you need to know.</h2>
          </div>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={i} delay={0.05 + i * 0.05}>
              <FAQItem q={item.q} a={item.a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EARLY ACCESS
   ═══════════════════════════════════════════════════════════ */
export function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = email.length > 0 && role.length > 0;

  async function handleSubmit() {
    if (!canSubmit) return;
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
    } catch { /* still show success */ }
    setSubmitted(true);
  }

  return (
    <section id="early-access" style={{ position: "relative", padding: "112px 24px", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 600, height: 600, borderRadius: "50%", opacity: 0.06, filter: "blur(20px)",
        background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 14 }}>EARLY ACCESS</p>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, color: "var(--white)", lineHeight: 1.12, letterSpacing: "-0.035em", marginBottom: 14 }}>
            Be the first to try Tervlon.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.6, marginBottom: 40 }}>
            We&apos;re onboarding a small group of instructors and developers for our first cohort.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          {submitted ? (
            <div style={{
              padding: 36, borderRadius: 18,
              border: "1px solid rgba(52,211,153,0.15)",
              background: "linear-gradient(135deg, rgba(52,211,153,0.04), rgba(52,211,153,0.01))",
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>✓</div>
              <p style={{ fontSize: 18, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>You&apos;re on the list.</p>
              <p style={{ fontSize: 13.5, color: "var(--text)" }}>We&apos;ll reach out soon with next steps.</p>
            </div>
          ) : (
            <div style={{
              padding: 32, borderRadius: 18,
              border: "1px solid var(--border-light)",
              background: "linear-gradient(180deg, var(--surface-light), var(--surface))",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", padding: "13px 18px",
                  fontSize: 14, borderRadius: 11,
                  border: "1px solid var(--border)", background: "var(--bg)",
                  color: "var(--white)", outline: "none", marginBottom: 14,
                  boxSizing: "border-box", fontFamily: "inherit",
                }}
              />

              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                {["Instructor", "Developer", "Other"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1, padding: "11px 0",
                      fontSize: 13, fontWeight: 600,
                      borderRadius: 9, cursor: "pointer",
                      border: role === r ? "1px solid rgba(99,108,240,0.35)" : "1px solid var(--border)",
                      background: role === r ? "rgba(99,108,240,0.08)" : "transparent",
                      color: role === r ? "var(--accent-light)" : "var(--text)",
                      transition: "all 0.2s", fontFamily: "inherit",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{
                  width: "100%", padding: "13px 0",
                  fontSize: 14.5, fontWeight: 700,
                  borderRadius: 11, border: "none",
                  background: canSubmit ? "linear-gradient(135deg, var(--accent), var(--accent-light))" : "var(--surface-light)",
                  color: canSubmit ? "#fff" : "rgba(139,143,163,0.35)",
                  cursor: canSubmit ? "pointer" : "default",
                  transition: "all 0.25s", fontFamily: "inherit",
                  boxShadow: canSubmit ? "0 4px 20px rgba(99,108,240,0.2)" : "none",
                }}
              >
                Get Early Access
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "48px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, var(--accent), var(--cyan))" }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--white)" }}>Tervlon</span>
        </div>
        <span style={{ fontSize: 12, color: "rgba(139,143,163,0.3)" }}>© 2026 Tervlon. All rights reserved.</span>
      </div>
    </footer>
  );
}