"use client";

import { useState, useEffect } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const anim = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 180,
        paddingBottom: 100,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundImage: `linear-gradient(rgba(26,30,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(26,30,42,0.12) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
        }}
      />
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          opacity: 0.12,
          filter: "blur(20px)",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Status badge */}
      <div
        style={{
          ...anim(0.1),
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 18px",
          borderRadius: 100,
          border: "1px solid rgba(99,108,240,0.25)",
          background: "rgba(99,108,240,0.08)",
          marginBottom: 40,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 10px rgba(52,211,153,0.5)",
            animation: "pulse-dot 2s ease infinite",
          }}
        />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-light)" }}>
          Now accepting early access signups
        </span>
      </div>

      {/* Headline */}
      <h1
        style={{
          ...anim(0.2),
          fontWeight: 800,
          fontSize: "clamp(38px, 5.5vw, 70px)",
          lineHeight: 1.06,
          letterSpacing: "-0.045em",
          color: "var(--white)",
          maxWidth: 800,
        }}
      >
        Real projects.{" "}
        <span className="text-gradient">AI-graded.</span>
      </h1>

      {/* Subheadline */}
      <p
        style={{
          ...anim(0.35),
          fontSize: "clamp(15px, 1.6vw, 18px)",
          color: "var(--text)",
          lineHeight: 1.65,
          maxWidth: 540,
          marginTop: 32,
        }}
      >
        Tervlon drops developers into simulated engineering environments with AI
        teammates, real tickets, and automated evaluation. The closest thing to
        the job — without the job.
      </p>

      {/* CTAs */}
      <div
        style={{
          ...anim(0.5),
          display: "flex",
          gap: 14,
          marginTop: 48,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <a
          href="#demo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 30px",
            fontSize: 14.5,
            fontWeight: 600,
            borderRadius: 12,
            background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
            color: "#fff",
            textDecoration: "none",
            boxShadow: "0 6px 28px rgba(99,108,240,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          Try the Demo <span>→</span>
        </a>
        <a
          href="#early-access"
          style={{
            padding: "13px 30px",
            fontSize: 14.5,
            fontWeight: 600,
            borderRadius: 12,
            background: "transparent",
            color: "var(--text-light)",
            textDecoration: "none",
            border: "1px solid var(--border-light)",
          }}
        >
          Request Early Access
        </a>
      </div>

      {/* Workspace Preview */}
      <div
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s",
          width: "100%",
          maxWidth: 1000,
          marginTop: 80,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid var(--border-light)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 100px rgba(99,108,240,0.05)",
          }}
        >
          <BrowserFrame>
            <WorkspacePreview />
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}

/* ── Browser Frame ─────────────────────────────────────── */
export function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          {["var(--red)", "var(--yellow)", "var(--green)"].map((c) => (
            <div
              key={c}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: c,
                opacity: 0.5,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: 400,
            margin: "0 auto",
            padding: "5px 16px",
            borderRadius: 8,
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            fontSize: 11,
            color: "rgba(139,143,163,0.4)",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            textAlign: "center",
          }}
        >
          app.tervlon.dev/workspace
        </div>
        <div style={{ width: 60 }} />
      </div>
      {children}
    </div>
  );
}

/* ── Workspace Preview ─────────────────────────────────── */
function WorkspacePreview() {
  const codeLines = [
    { t: "// prisma/schema.prisma", dim: true },
    { t: "" },
    { t: "model User {", kw: true },
    { t: "  id        String   @id @default(cuid())" },
    { t: "  email     String   @unique" },
    { t: "  username  String   @unique" },
    { t: "  password  String" },
    { t: "  role      Role     @default(USER)" },
    { t: "  createdAt DateTime @default(now())" },
    { t: "}", kw: true },
    { t: "" },
    { t: "enum Role {", kw: true },
    { t: "  USER" },
    { t: "  ADMIN" },
    { t: "}", kw: true },
  ];

  const files = [
    { n: "src/", d: 0, f: true },
    { n: "modules/", d: 1, f: true },
    { n: "user.service.ts", d: 2, f: false },
    { n: "prisma/", d: 0, f: true },
    { n: "schema.prisma", d: 1, a: true },
    { n: "seed.ts", d: 1 },
    { n: "package.json", d: 0 },
    { n: "TICKET.md", d: 0 },
  ];

  const chatMsgs = [
    { from: "AI PM", color: "var(--accent)", text: "DS-102 is up. Get the Prisma schema right — DS-103 depends on this." },
    { from: "You", color: "var(--text)", text: "Extra index on email beyond unique?" },
    { from: "AI PM", color: "var(--accent)", text: "@unique already creates one in Postgres. You're covered." },
    { from: "AI Teammate", color: "var(--green)", text: 'Tip: add @@map("users") for lowercase table convention.' },
  ];

  const mono = "'JetBrains Mono', monospace";
  const sans = "'Instrument Sans', sans-serif";

  return (
    <div style={{ display: "flex", height: 380, background: "var(--bg)", fontFamily: mono, fontSize: 11.5 }}>
      {/* File tree */}
      <div style={{ width: 170, borderRight: "1px solid var(--border)", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px 8px", fontSize: 9.5, fontWeight: 700, color: "rgba(139,143,163,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: sans }}>
          Explorer
        </div>
        {files.map((f, i) => (
          <div
            key={i}
            style={{
              padding: `3px 12px 3px ${14 + (f.d ?? 0) * 14}px`,
              fontSize: 11,
              color: f.a ? "var(--white)" : f.f ? "rgba(251,191,36,0.65)" : "var(--text)",
              background: f.a ? "rgba(99,108,240,0.08)" : "transparent",
              borderLeft: f.a ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            <span style={{ opacity: 0.5 }}>{f.f ? "▸ " : "  "}</span>
            {f.n}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {["schema.prisma", "TICKET.md"].map((tab, i) => (
            <div
              key={tab}
              style={{
                padding: "8px 18px",
                fontSize: 11.5,
                color: i === 0 ? "var(--white)" : "rgba(139,143,163,0.35)",
                borderRight: "1px solid var(--border)",
                borderBottom: i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
                background: i === 0 ? "var(--bg)" : "transparent",
              }}
            >
              {tab}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {codeLines.map((line, i) => (
            <div key={i} style={{ display: "flex", padding: "0 14px", lineHeight: 1.75 }}>
              <span style={{ width: 36, textAlign: "right", paddingRight: 14, color: "rgba(139,143,163,0.15)", fontSize: 10.5, userSelect: "none" }}>
                {i + 1}
              </span>
              <span
                style={{
                  color: line.dim ? "rgba(139,143,163,0.25)" : line.kw ? "var(--accent)" : "var(--text-light)",
                  whiteSpace: "pre",
                }}
              >
                {line.t}
              </span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "8px 14px", background: "var(--surface)", flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(139,143,163,0.28)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: sans }}>
            Terminal
          </div>
          {[
            { c: "var(--white)", t: "$ npx prisma migrate dev" },
            { c: "var(--green)", t: "✓ Migration: add_user_model" },
            { c: "var(--green)", t: "✓ Database synced" },
          ].map((l, i) => (
            <div key={i} style={{ color: l.c, lineHeight: 1.65, fontSize: 11 }}>
              {l.t}
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ width: 210, borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 9.5, fontWeight: 700, color: "rgba(139,143,163,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: sans }}>
          Team Chat
        </div>
        <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          {chatMsgs.map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 9, fontWeight: 700, color: m.color, marginBottom: 2, fontFamily: sans }}>
                {m.from}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  lineHeight: 1.45,
                  padding: "6px 8px",
                  borderRadius: 7,
                  background: m.from === "You" ? "rgba(99,108,240,0.08)" : "var(--surface-light)",
                  border: m.from === "You" ? "1px solid rgba(99,108,240,0.12)" : "1px solid var(--border)",
                  color: "var(--text-light)",
                  fontFamily: sans,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}