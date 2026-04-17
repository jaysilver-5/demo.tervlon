"use client";

import { useState } from "react";
import { Reveal } from "./reveal";
import { BrowserFrame } from "./hero";

type TabId = "journey" | "workspace" | "report";

export function DemoSection() {
  const [view, setView] = useState<TabId>("journey");

  return (
    <section id="demo" style={{ position: "relative", padding: "112px 24px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--cyan)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 14 }}>
            INTERACTIVE DEMO
          </p>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, color: "var(--white)", lineHeight: 1.12, letterSpacing: "-0.035em", maxWidth: 600, marginBottom: 14 }}>
            See what a simulation feels like.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text)", maxWidth: 480, marginBottom: 32 }}>
            Click through a sample sprint. This is what your students experience.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={{ display: "flex", gap: 6, marginBottom: 20, padding: 4, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", width: "fit-content" }}>
            {([
              { id: "journey" as TabId, label: "Sprint Board" },
              { id: "workspace" as TabId, label: "Workspace" },
              { id: "report" as TabId, label: "Score Report" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                style={{
                  padding: "8px 20px", fontSize: 12.5, fontWeight: 600,
                  borderRadius: 9, cursor: "pointer", border: "none",
                  background: view === t.id ? "var(--accent)" : "transparent",
                  color: view === t.id ? "#fff" : "var(--text)",
                  boxShadow: view === t.id ? "0 2px 12px rgba(99,108,240,0.2)" : "none",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-light)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
            <BrowserFrame>
              {view === "journey" && <JourneyPreview />}
              {view === "workspace" && <WorkspaceMini />}
              {view === "report" && <ReportPreview />}
            </BrowserFrame>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Journey ───────────────────────────────────────────── */
const TICKETS = [
  { id: "DS-101", title: "Setup Express server & project structure", s: "done" },
  { id: "DS-102", title: "Design and implement User model with Prisma", s: "active" },
  { id: "DS-103", title: "Build authentication endpoints (register/login)", s: "todo" },
  { id: "DS-104", title: "Implement JWT middleware & route guards", s: "todo" },
  { id: "DS-105", title: "CRUD endpoints for Products resource", s: "locked" },
];

const dotColor: Record<string, string> = { done: "var(--green)", active: "var(--accent)", todo: "var(--yellow)", locked: "var(--border)" };

function JourneyPreview() {
  return (
    <div style={{ background: "var(--bg)", padding: 28, minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--white)", marginBottom: 5 }}>E-Commerce API Sprint</h3>
          <p style={{ fontSize: 13, color: "var(--text)" }}>Build a production-ready REST API using Express, Prisma, and PostgreSQL.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ height: 5, width: 130, borderRadius: 3, background: "var(--surface-light)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "20%", borderRadius: 3, background: "linear-gradient(90deg, var(--accent), var(--cyan))" }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace" }}>1/5</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {TICKETS.map((t) => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 16px", borderRadius: 12,
            border: t.s === "active" ? "1px solid rgba(99,108,240,0.25)" : "1px solid var(--border)",
            background: t.s === "active" ? "rgba(99,108,240,0.04)" : "transparent",
            opacity: t.s === "locked" ? 0.4 : 1,
          }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", flexShrink: 0, background: dotColor[t.s], boxShadow: t.s === "active" ? "0 0 8px rgba(99,108,240,0.4)" : "none" }} />
            <span style={{ fontSize: 11, color: "rgba(139,143,163,0.45)", fontFamily: "'JetBrains Mono', monospace", minWidth: 52 }}>{t.id}</span>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: t.s === "locked" ? "rgba(139,143,163,0.3)" : t.s === "done" ? "var(--text)" : "var(--white)", textDecoration: t.s === "done" ? "line-through" : "none" }}>{t.title}</span>
            {t.s === "active" && <span style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(99,108,240,0.1)", border: "1px solid rgba(99,108,240,0.15)", fontSize: 10, fontWeight: 700, color: "var(--accent-light)", fontFamily: "'JetBrains Mono', monospace" }}>CURRENT</span>}
            {t.s === "done" && <span style={{ color: "var(--green)", fontSize: 14 }}>✓</span>}
            {t.s === "locked" && <span style={{ fontSize: 12, opacity: 0.5 }}>🔒</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Workspace Mini ────────────────────────────────────── */
function WorkspaceMini() {
  return (
    <div style={{ background: "var(--bg)", padding: 20, minHeight: 400 }}>
      <div style={{ display: "flex", gap: 12, height: 360 }}>
        <div style={{ flex: 1, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", padding: 16, overflow: "hidden", fontFamily: "'JetBrains Mono', monospace" }}>
          <div style={{ fontSize: 9, color: "rgba(139,143,163,0.3)", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Instrument Sans', sans-serif" }}>editor · schema.prisma</div>
          <pre style={{ fontSize: 11.5, color: "var(--text-light)", lineHeight: 1.65, whiteSpace: "pre-wrap", margin: 0 }}>
{`model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}`}
          </pre>
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <div style={{ color: "var(--green)", fontSize: 11 }}>✓ Migration: add_user_model</div>
            <div style={{ color: "var(--green)", fontSize: 11 }}>✓ 3 users seeded</div>
          </div>
        </div>
        <div style={{ width: 240, flexShrink: 0, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontSize: 9, color: "rgba(139,143,163,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Team Chat</div>
          <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
            {[
              { from: "AI PM", c: "var(--accent)", t: "DS-102 is ready. Schema first, then seed." },
              { from: "You", c: "var(--text)", t: "Should email have an extra index?" },
              { from: "AI PM", c: "var(--accent)", t: "@unique handles that in Postgres." },
              { from: "AI Reviewer", c: "var(--green)", t: "Good schema design. Consider @@map for naming." },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ fontSize: 9, fontWeight: 700, color: m.c, marginBottom: 2 }}>{m.from}</div>
                <div style={{ fontSize: 10.5, color: "var(--text-light)", lineHeight: 1.45, padding: "6px 8px", borderRadius: 6, background: "var(--surface-light)", border: "1px solid var(--border)" }}>{m.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Report ────────────────────────────────────────────── */
const SCORES = [
  { label: "Technical Accuracy", score: 87, color: "var(--green)" },
  { label: "Code Quality", score: 72, color: "var(--yellow)" },
  { label: "Problem Solving", score: 91, color: "var(--green)" },
  { label: "Collaboration", score: 68, color: "var(--yellow)" },
  { label: "Time Management", score: 80, color: "var(--green)" },
];

function ReportPreview() {
  return (
    <div style={{ background: "var(--bg)", padding: 28, minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--white)", marginBottom: 5 }}>Performance Report</h3>
          <p style={{ fontSize: 13, color: "var(--text)" }}>E-Commerce API Sprint · Completed Mar 7, 2026</p>
        </div>
        <div style={{ padding: "8px 18px", borderRadius: 10, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", fontSize: 24, fontWeight: 800, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>82</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {SCORES.map((s, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-light)" }}>{s.label}</span>
              <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 600 }}>{s.score}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "var(--surface-light)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.score}%`, background: s.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: 18, borderRadius: 12, background: "linear-gradient(135deg, var(--surface-light), var(--surface))", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", marginBottom: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>AI REVIEWER FEEDBACK</div>
        <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.65 }}>
          Strong schema design with proper constraints. Consider adding case-insensitive email handling at the application layer. Seed script is clean but would benefit from a factory pattern. Test coverage gap on error paths — add tests for duplicate key violations.
        </p>
      </div>
    </div>
  );
}