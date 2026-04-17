"use client";

import { Reveal } from "./reveal";

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
};

const section: React.CSSProperties = {
  position: "relative",
  padding: "112px 24px",
  overflow: "hidden",
};

const eyebrow = (color: string): React.CSSProperties => ({
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  color,
  fontWeight: 600,
  letterSpacing: "0.08em",
  marginBottom: 14,
});

const h2Style: React.CSSProperties = {
  fontSize: "clamp(28px, 3.5vw, 42px)",
  fontWeight: 800,
  color: "var(--white)",
  lineHeight: 1.12,
  letterSpacing: "-0.035em",
  maxWidth: 520,
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 20,
  marginTop: 48,
};

const grid4: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 20,
  marginTop: 48,
};

const card: React.CSSProperties = {
  padding: 28,
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "linear-gradient(135deg, var(--surface), var(--bg-alt))",
  transition: "all 0.3s ease",
  height: "100%",
};

/* ═══════════════════════════════════════════════════════════
   PROBLEM SECTION
   ═══════════════════════════════════════════════════════════ */
const PROBLEMS = [
  { title: "Quizzes don't measure real ability", desc: "Multiple choice tests memorization. They reveal nothing about how someone builds, communicates, or navigates ambiguity under real conditions." },
  { title: "Courses teach theory, not execution", desc: "Students complete tutorials then freeze when facing real codebases. The gap between learning and doing is where most engineers stall." },
  { title: "Resumes prove nothing", desc: "Years of listed experience and project names don't show how someone actually works. Hiring on resumes is expensive guesswork." },
];

export function ProblemSection() {
  return (
    <section style={section}>
      <div style={container}>
        <Reveal>
          <p style={eyebrow("var(--red)")}>THE PROBLEM</p>
          <h2 style={h2Style}>Technical education is measuring the wrong things.</h2>
        </Reveal>
        <div style={grid3}>
          {PROBLEMS.map((item, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <div style={card}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(248,113,113,0.06)",
                  border: "1px solid rgba(248,113,113,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800, color: "var(--red)", marginBottom: 20,
                }}>✕</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 10, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════════ */
const STEPS = [
  { num: "01", icon: "📋", title: "Receive a ticket", desc: "Your AI Project Manager assigns a task with real requirements, context, and acceptance criteria.", color: "var(--accent)" },
  { num: "02", icon: "⌨️", title: "Write real code", desc: "Build inside a full IDE with file tree, terminal, and project boilerplate. No toy sandbox.", color: "var(--cyan)" },
  { num: "03", icon: "🔍", title: "AI reviews your work", desc: "An AI Reviewer analyzes code quality, patterns, edge cases, and test coverage. Like a senior engineer.", color: "var(--green)" },
  { num: "04", icon: "📊", title: "Get your scorecard", desc: "Detailed performance report covering technical accuracy, code quality, and problem solving.", color: "var(--yellow)" },
];

export function HowItWorks() {
  return (
    <section id="features" style={section}>
      <div style={container}>
        <Reveal>
          <p style={eyebrow("var(--accent)")}>HOW IT WORKS</p>
          <h2 style={{ ...h2Style, maxWidth: 500 }}>Simulate real work.<br />Get real feedback.</h2>
        </Reveal>
        <div style={grid4}>
          {STEPS.map((step, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <div style={{ ...card, background: "linear-gradient(180deg, var(--surface), var(--bg-alt))", position: "relative", overflow: "hidden" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: step.color, opacity: 0.4, letterSpacing: "0.05em", marginBottom: 16 }}>
                  {step.num}
                </p>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{step.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 8, lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI AGENTS
   ═══════════════════════════════════════════════════════════ */
const AGENTS = [
  { label: "AI PROJECT MANAGER", title: "Realistic task delivery", desc: "Assigns tickets, updates requirements mid-sprint, and responds to clarifying questions — just like a real PM.", glyph: "→", color: "var(--accent)" },
  { label: "AI CODE REVIEWER", title: "Automated PR feedback", desc: "Analyzes every submission for code quality, architecture, edge cases, and test coverage.", glyph: "⟁", color: "var(--green)" },
  { label: "AI TEAMMATE", title: "Contextual help on demand", desc: "A teammate who knows the codebase. Ask questions, get hints. In assessment mode, help-seeking is tracked.", glyph: "◇", color: "var(--yellow)" },
  { label: "EVALUATION ENGINE", title: "Objective scoring", desc: "Combines automated test results with LLM analysis to produce a comprehensive, reproducible scorecard.", glyph: "◆", color: "var(--cyan)" },
];

export function AgentsSection() {
  return (
    <section style={section}>
      <div style={container}>
        <Reveal>
          <p style={eyebrow("var(--green)")}>AI AGENTS</p>
          <h2 style={{ ...h2Style, maxWidth: 480 }}>Not just an IDE.<br />A simulated team.</h2>
        </Reveal>
        <div style={grid4}>
          {AGENTS.map((f, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <div style={{ ...card, background: "linear-gradient(160deg, var(--surface), var(--bg-alt))" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `color-mix(in srgb, ${f.color} 8%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${f.color} 12%, transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: f.color, marginBottom: 18,
                }}>{f.glyph}</div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: f.color, marginBottom: 10, letterSpacing: "0.08em", fontWeight: 700 }}>{f.label}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 8, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRACKS
   ═══════════════════════════════════════════════════════════ */
const TRACKS = [
  { name: "Backend Engineering", desc: "APIs, databases, auth, system design", stack: "Node.js · Express · Prisma", available: true },
  { name: "Frontend Engineering", desc: "Components, state, accessibility, performance", stack: "React · Next.js · TypeScript", available: false },
  { name: "Cybersecurity", desc: "Incident response, vulnerability assessment, compliance", stack: "Simulated SOC environment", available: false },
];

export function TracksSection() {
  return (
    <section id="tracks" style={section}>
      <div style={container}>
        <Reveal>
          <p style={eyebrow("var(--yellow)")}>TRACKS</p>
          <h2 style={{ ...h2Style, maxWidth: 480 }}>Multiple disciplines.<br />One platform.</h2>
        </Reveal>
        <div style={grid3}>
          {TRACKS.map((t, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <div style={{
                ...card,
                border: t.available ? "1px solid rgba(99,108,240,0.2)" : "1px solid var(--border)",
                background: t.available ? "linear-gradient(160deg, rgba(99,108,240,0.04), var(--bg-alt))" : "linear-gradient(160deg, var(--surface), var(--bg-alt))",
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  {t.available ? (
                    <span style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(99,108,240,0.08)", border: "1px solid rgba(99,108,240,0.15)", fontSize: 10, fontWeight: 700, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>AVAILABLE</span>
                  ) : (
                    <span style={{ padding: "4px 12px", borderRadius: 6, background: "var(--surface-light)", border: "1px solid var(--border)", fontSize: 10, fontWeight: 700, color: "rgba(139,143,163,0.45)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>COMING SOON</span>
                  )}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: t.available ? "var(--white)" : "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{t.name}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.6, marginBottom: 16 }}>{t.desc}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: t.available ? "var(--accent)" : "rgba(139,143,163,0.3)" }}>{t.stack}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}