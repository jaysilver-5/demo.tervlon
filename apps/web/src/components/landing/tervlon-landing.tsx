"use client";
import { useEffect } from "react";
import Logo_Image from '@/public/logo.png'

const B = {
  l: "#5BC8F5",
  m: "#3AA3D8",
  d: "#1A7AB5",
  glow: "rgba(91,200,245,0.14)",
};

const A = {
  base: "#636cf0",
  light: "#818af5",
  bg: "rgba(99,108,240,0.1)",
  border: "rgba(99,108,240,0.12)",
  subtle: "rgba(99,108,240,0.06)",
};

const serif = "'Instrument Serif', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";
const mono = "'DM Mono', monospace";
const jb = "'JetBrains Mono', monospace";

export default function TervlonLanding() {
  useEffect(() => {
    const l = document.createElement("link");
    l.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=JetBrains+Mono:wght@400;500;600&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);

  return (
    <div style={{ fontFamily: sans, background: "#070a10", color: "#e4e6ec", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes live-dot { 0%,100% { box-shadow: 0 0 4px ${B.l}; } 50% { box-shadow: 0 0 14px ${B.l}, 0 0 28px rgba(91,200,245,0.34); } }
        @keyframes type-cursor { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

        .grad-text { background: linear-gradient(135deg, ${B.l} 0%, ${B.d} 50%, ${B.l} 100%); background-size: 220% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4.2s linear infinite; }
        .glass { background: rgba(91,200,245,0.035); border: 1px solid rgba(91,200,245,0.085); backdrop-filter: blur(14px); }
        .glass-hi { background: rgba(91,200,245,0.05); border: 1px solid rgba(91,200,245,0.14); backdrop-filter: blur(16px); }
        .label { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(91,200,245,0.48); }
        .container { width: min(1180px, calc(100% - 32px)); margin: 0 auto; position: relative; z-index: 1; }

        .btn-p { background: linear-gradient(135deg, ${B.l}, ${B.d}); color: #071019; border: none; font-weight: 700; font-family: ${sans}; cursor: pointer; border-radius: 999px; transition: transform .16s, box-shadow .22s; box-shadow: 0 0 20px rgba(91,200,245,0.22), 0 10px 32px rgba(0,0,0,0.32); }
        .btn-p:hover { transform: translateY(-1px); box-shadow: 0 0 34px rgba(91,200,245,0.28), 0 14px 34px rgba(0,0,0,0.34); }
        .btn-g { background: rgba(91,200,245,0.04); border: 1px solid rgba(91,200,245,0.13); color: rgba(228,230,236,0.82); font-weight: 600; font-family: ${sans}; cursor: pointer; border-radius: 999px; transition: all .2s; }
        .btn-g:hover { background: rgba(91,200,245,0.08); border-color: rgba(91,200,245,0.22); }

        .nav-link { font-size: 13px; color: rgba(228,230,236,0.44); text-decoration: none; font-weight: 500; transition: color .18s; }
        .nav-link:hover { color: ${B.l}; }

        .fade-child > * { animation: fade-up .72s ease both; }
        .fade-child > *:nth-child(1) { animation-delay: .05s; }
        .fade-child > *:nth-child(2) { animation-delay: .13s; }
        .fade-child > *:nth-child(3) { animation-delay: .21s; }
        .fade-child > *:nth-child(4) { animation-delay: .29s; }
        .fade-child > *:nth-child(5) { animation-delay: .37s; }
        .fade-child > *:nth-child(6) { animation-delay: .45s; }

        .how-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .signal-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: 16px; }
        .aud-grid { display: grid; grid-template-columns: 1.2fr 1fr; grid-template-rows: 1fr 1fr; gap: 16px; }
        .tracks-soon { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .workspace-grid { display: grid; grid-template-columns: 240px 160px minmax(0,1fr) 230px; min-height: 440px; }

        @media (max-width: 1180px) {
          .how-grid { grid-template-columns: repeat(2, 1fr); }
          .signal-grid { grid-template-columns: 1fr; }
          .tracks-soon { grid-template-columns: repeat(3, 1fr); }
          .workspace-grid { grid-template-columns: 200px 140px minmax(0,1fr) 200px; min-height: 380px; }
        }

        @media (max-width: 980px) {
          .aud-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
          .aud-span { grid-row: auto !important; min-height: 240px !important; }
          .workspace-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
          .ws-brief, .ws-explorer { display: none !important; }
          .ws-chat { border-left: none !important; border-top: 1px solid #1a1e2a; }
          .tracks-soon { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 760px) {
          .how-grid { grid-template-columns: 1fr; }
          .nav-links-desk { display: none !important; }
          .container { width: min(1180px, calc(100% - 20px)); }
          .hero-actions { flex-direction: column; align-items: center; }
          .hero-actions button { width: 100%; max-width: 320px; }
          .ws-chat { display: none !important; }
          .ws-topbar-right { display: none !important; }
        }

        @media (max-width: 560px) {
          .tracks-soon { grid-template-columns: 1fr; }
        }
      `}</style>

      <Atmosphere />
      <Nav />
      <Hero />
      <HowItWorks />
      <SignalSection />
      <AudienceGrid />
      <Tracks />
      <Faq />
      <ClosingCTA />
      <Foot />
    </div>
  );
}

/* ─── LOGO SVG ─── */
function Logo({ s = 24 }: { s?: number }) {
  return (
    <img
      src={Logo_Image.src} // adjust path if needed
      alt="Logo"
      width={s}
      height={s}
      style={{ flexShrink: 0, objectFit: "contain" }}
    />
  );
}

/* ─── ATMOSPHERE ─── */
function Atmosphere() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #060810, #070a10 40%, #060810)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(91,200,245,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,200,245,0.1) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black, transparent)", WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black, transparent)" }} />
      <div style={{ position: "absolute", left: "50%", top: -120, transform: "translateX(-50%)", width: 860, height: 860, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,200,245,0.1) 0%, rgba(26,122,181,0.04) 42%, transparent 72%)", filter: "blur(64px)" }} />
      <div style={{ position: "absolute", left: -100, top: "52%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,122,181,0.05), transparent 70%)", filter: "blur(100px)" }} />
      <div style={{ position: "absolute", right: -80, top: "22%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,200,245,0.04), transparent 70%)", filter: "blur(100px)" }} />
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  return (
    <header style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 24px)", maxWidth: 1160, zIndex: 50 }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px 10px 18px", borderRadius: 999, border: "1px solid rgba(91,200,245,0.08)", background: "rgba(7,10,16,0.84)", backdropFilter: "blur(24px)", boxShadow: "0 8px 40px rgba(0,0,0,0.42)", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo s={26} />
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>Tervlon</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: B.l, opacity: 0.54, border: "1px solid rgba(91,200,245,0.15)", borderRadius: 999, padding: "3px 10px" }}>Technical Demo</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div className="nav-links-desk" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {[["#how-it-works", "How it works"], ["#reports", "Reports"], ["#tracks", "Tracks"], ["#faq", "FAQ"]].map(([href, label]) => (
              <a key={label} href={href} className="nav-link">{label}</a>
            ))}
          </div>
          <button className="btn-p" style={{ padding: "10px 20px", fontSize: 13 }}>Open Demo</button>
        </div>
      </nav>
    </header>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section style={{ position: "relative", zIndex: 1, padding: "172px 0 92px" }}>
      <div className="container">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }} className="fade-child">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "7px 18px", borderRadius: 999, border: "1px solid rgba(91,200,245,0.1)", background: "rgba(91,200,245,0.04)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.l, animation: "live-dot 2s ease infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(91,200,245,0.6)" }}>Sprint simulations now live</span>
          </div>

          <h1 style={{ fontFamily: serif, fontSize: "clamp(54px, 8vw, 102px)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.05em" }}>
            Prove how<br /><span className="grad-text" style={{ fontStyle: "italic" }}>you build.</span>
          </h1>

          <p style={{ maxWidth: 620, margin: "24px auto 0", fontSize: 16, lineHeight: 1.88, color: "rgba(228,230,236,0.48)" }}>
            Sprint simulations with live tickets, AI teammates, and structured scoring. What you build, how you think, and how you deliver — measured in context.
          </p>

          <div className="hero-actions" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
            <button className="btn-p" style={{ padding: "16px 32px", fontSize: 15 }}>Start a Sprint</button>
            <button className="btn-g" style={{ padding: "16px 28px", fontSize: 14 }}>Explore Workflow</button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginTop: 26 }}>
            {["Structured sprints", "AI project manager", "Live workspace", "Real execution signal"].map((t) => (
              <span key={t} style={{ fontSize: 11, padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(91,200,245,0.06)", color: "rgba(228,230,236,0.33)", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "44px auto 0", borderRadius: 20, border: "1px solid rgba(91,200,245,0.12)", background: "rgba(7,10,16,0.78)", boxShadow: "0 0 120px rgba(91,200,245,0.06), 0 40px 80px rgba(0,0,0,0.5)", overflow: "hidden", backdropFilter: "blur(16px)" }}>
          <WorkspaceSnapshot />
        </div>
      </div>
    </section>
  );
}

/* ─── WORKSPACE SNAPSHOT ─── */
function WorkspaceSnapshot() {
  const ln = (n: number, content: React.ReactNode, highlight = false) => (
    <div key={n} style={highlight ? { background: "rgba(99,108,240,0.03)" } : undefined}>
      <span style={{ display: "inline-block", width: 24, textAlign: "right", color: "rgba(139,143,163,0.2)", marginRight: 12, userSelect: "none", fontSize: "inherit" }}>{n}</span>
      {content}
    </div>
  );

  const kw = (t: string) => <span style={{ color: "#c792ea" }}>{t}</span>;
  const str = (t: string) => <span style={{ color: "#c3e88d" }}>{t}</span>;
  const fn = (t: string) => <span style={{ color: "#82aaff" }}>{t}</span>;
  const v = (t: string) => <span style={{ color: "#c4c7d4" }}>{t}</span>;
  const p = (t: string) => <span style={{ color: "#8b8fa3" }}>{t}</span>;
  const num = (t: string) => <span style={{ color: "#f78c6c" }}>{t}</span>;
  const op = (t: string) => <span style={{ color: "#89ddff" }}>{t}</span>;
  const cm = (t: string) => <span style={{ color: "#546e7a", fontStyle: "italic" }}>{t}</span>;

  return (
    <>
      {/* Top Bar */}
      <div style={{ height: 42, borderBottom: "1px solid #1a1e2a", background: "#0f1219", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(196,199,212,0.5)", padding: "2px 4px" }}>←</span>
          <Logo s={18} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#edefF4", letterSpacing: "-0.02em" }}>Tervlon</span>
          <span style={{ color: "#252a38" }}>|</span>
          <span style={{ fontSize: 10, color: "#c4c7d4", fontFamily: jb }}>T-01</span>
          <span style={{ fontSize: 10, color: "#8b8fa3" }}>Product Listing API</span>
        </div>
        <div className="ws-topbar-right" style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ padding: "3px 8px", fontSize: 10, fontWeight: 500, borderRadius: 5, background: A.bg, color: A.base }}>Brief</span>
          <span style={{ padding: "3px 8px", fontSize: 10, fontWeight: 500, borderRadius: 5, background: A.bg, color: A.base }}>Chat</span>
          <span style={{ padding: "3px 8px", fontSize: 10, fontWeight: 500, borderRadius: 5, color: "#8b8fa3" }}>Terminal</span>
          <span style={{ padding: "3px 12px", fontSize: 10, fontWeight: 600, borderRadius: 5, background: `linear-gradient(135deg, ${A.base}, ${A.light})`, color: "#fff", marginLeft: 2 }}>▶ Run Checks</span>
          <span style={{ padding: "3px 12px", fontSize: 10, fontWeight: 600, borderRadius: 5, background: "linear-gradient(135deg, #34d399, #22c55e)", color: "#fff" }}>✓ Submit</span>
          <span style={{ fontSize: 9, color: "rgba(139,143,163,0.3)", fontFamily: jb, marginLeft: 4 }}>saved 2:41pm</span>
        </div>
      </div>

      {/* Body */}
      <div className="workspace-grid">
        {/* Brief */}
        <div className="ws-brief" style={{ borderRight: "1px solid #1a1e2a", background: "#0f1219", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #1a1e2a", fontSize: 9, fontWeight: 700, color: "rgba(139,143,163,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", justifyContent: "space-between", alignItems: "center" }}>Ticket Brief<span style={{ fontSize: 14, color: "rgba(139,143,163,0.4)", cursor: "pointer", lineHeight: 1 }}>×</span></div>
          <div style={{ flex: 1, padding: "12px 14px", overflowY: "auto", fontSize: 12, color: "#c4c7d4", lineHeight: 1.6 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#edefF4", marginBottom: 6 }}>Product Listing API</div>
            <p style={{ color: "#8b8fa3", marginBottom: 12, fontSize: 11.5, lineHeight: 1.6 }}>Build a RESTful product listing endpoint with filtering, pagination, and error handling.</p>
            <div style={{ fontSize: 12, fontWeight: 700, color: A.base, margin: "12px 0 5px" }}>Acceptance Criteria</div>
            {[
              { done: true, text: "Express server with CORS + JSON" },
              { done: true, text: "Mount product routes at /api/products" },
              { done: true, text: "GET /api/products returns list" },
              { done: false, text: "Query param filtering (?category=)" },
              { done: false, text: "Pagination with limit/offset" },
              { done: false, text: "Global error handling middleware" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0" }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, border: `1.5px solid ${c.done ? "#34d399" : "#252a38"}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#34d399" }}>{c.done ? "✓" : ""}</span>
                <span style={c.done ? { color: "#8b8fa3", textDecoration: "line-through", opacity: 0.6, fontSize: 11.5 } : { fontSize: 11.5 }}>{c.text}</span>
              </div>
            ))}
            <div style={{ fontSize: 12, fontWeight: 700, color: A.base, margin: "14px 0 5px" }}>Context</div>
            <p style={{ color: "#8b8fa3", fontSize: 11.5, lineHeight: 1.6 }}>Ticket 1 of 5 in the E-Commerce API sprint. Later tickets build auth and orders on top of this.</p>
            <div style={{ marginTop: 14, padding: "8px 10px", borderRadius: 7, background: A.subtle, border: `1px solid ${A.border}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(99,108,240,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Estimated</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#c4c7d4" }}>25 minutes</span>
            </div>
          </div>
        </div>

        {/* Explorer */}
        <div className="ws-explorer" style={{ borderRight: "1px solid #1a1e2a", background: "#0f1219", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "8px 10px", fontSize: 9, fontWeight: 700, color: "rgba(139,143,163,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid #1a1e2a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>Explorer<span style={{ fontSize: 11, color: "#8b8fa3" }}>+</span></div>
          <div style={{ padding: "5px 0", fontFamily: jb, fontSize: 10.5, lineHeight: 1.1 }}>
            {[
              { depth: 0, folder: true, open: true, name: "src/" },
              { depth: 1, folder: true, open: true, name: "routes/" },
              { depth: 2, folder: false, icon: "TS", name: "products.ts" },
              { depth: 1, folder: true, open: false, name: "middleware/" },
              { depth: 1, folder: true, open: false, name: "utils/" },
              { depth: 1, folder: false, icon: "TS", name: "index.ts", active: true },
              { depth: 0, folder: true, open: true, name: "prisma/" },
              { depth: 1, folder: false, icon: "◆", name: "schema.prisma" },
              { depth: 0, folder: false, icon: "#", name: "TICKET.md" },
              { depth: 0, folder: false, icon: "#", name: "README.md" },
              { depth: 0, folder: false, icon: "{}", name: "package.json" },
              { depth: 0, folder: false, icon: "·", name: ".env" },
            ].map((f, i) => (
              <div key={i} style={{
                padding: `3px 6px 3px ${10 + f.depth * 14}px`,
                ...(f.active ? { background: A.subtle, borderLeft: `2px solid ${A.base}`, color: "#edefF4" } : {}),
                color: f.folder ? (f.depth === 0 ? "rgba(251,191,36,0.65)" : "rgba(251,191,36,0.55)") : (f.active ? "#edefF4" : "#8b8fa3"),
                cursor: "pointer",
              }}>
                {f.folder ? (
                  <><span style={{ fontSize: 8, transform: f.open ? "rotate(90deg)" : "none", display: "inline-block", marginRight: 2 }}>▸</span>{f.name}</>
                ) : (
                  <><span style={{ opacity: 0.4, marginRight: 2, fontSize: 8 }}>{f.icon}</span>{f.name}</>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor + Terminal */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #1a1e2a", background: "#0f1219", flexShrink: 0, overflowX: "auto" }}>
            {[
              { icon: "#", name: "TICKET.md", active: false },
              { icon: "TS", name: "index.ts", active: true },
              { icon: "TS", name: "products.ts", active: false },
            ].map((tab) => (
              <div key={tab.name} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", fontSize: 10.5, color: tab.active ? "#edefF4" : "rgba(139,143,163,0.5)", background: tab.active ? "#060810" : "transparent", borderRight: "1px solid #1a1e2a", fontFamily: jb, borderBottom: `2px solid ${tab.active ? A.base : "transparent"}`, whiteSpace: "nowrap" }}>
                <span style={{ opacity: 0.4, fontSize: 8 }}>{tab.icon}</span>{tab.name}<span style={{ fontSize: 12, color: "rgba(139,143,163,0.2)", padding: "0 2px" }}>×</span>
              </div>
            ))}
          </div>

          {/* Code */}
          <div style={{ flex: 1, background: "#060810", padding: "10px 0", overflow: "hidden" }}>
            <div style={{ fontFamily: jb, fontSize: 11.5, lineHeight: 1.85, padding: "0 12px" }}>
              {ln(1, <>{kw("import")} {v("express")} {kw("from")} {str("'express'")}{p(";")}</>)}
              {ln(2, <>{kw("import")} {v("cors")} {kw("from")} {str("'cors'")}{p(";")}</>)}
              {ln(3, <>{kw("import")} {p("{")} {v("productRouter")} {p("}")} {kw("from")} {str("'./routes/products'")}{p(";")}</>)}
              {ln(4, null)}
              {ln(5, <>{fn("const")} {v("app")} {op("=")} {fn("express")}{p("();")}</>, true)}
              {ln(6, null)}
              {ln(7, <>{v("app")}{p(".")}{fn("use")}{p("(")}{fn("cors")}{p("());")}</>)}
              {ln(8, <>{v("app")}{p(".")}{fn("use")}{p("(")}{v("express")}{p(".")}{fn("json")}{p("());")}</>)}
              {ln(9, null)}
              {ln(10, <>{cm("// Mount routes")}</>)}
              {ln(11, <>{v("app")}{p(".")}{fn("use")}{p("(")}{str("'/api/products'")}{p(",")} {v("productRouter")}{p(");")}</>)}
              {ln(12, null)}
              {ln(13, <>{fn("const")} {v("PORT")} {op("=")} {v("process")}{p(".")}{v("env")}{p(".")}{v("PORT")} {op("||")} {num("3000")}{p(";")}</>)}
              {ln(14, null)}
              {ln(15, <>{v("app")}{p(".")}{fn("listen")}{p("(")}{v("PORT")}{p(",")} {p("()")} {op("=>")} {p("{")}</>)}
              {ln(16, <>  {v("console")}{p(".")}{fn("log")}{p("(")}{str("`Server on ")}{op("${")}{v("PORT")}{op("}")}{str("`")}{p(");")}<span style={{ display: "inline-block", width: 2, height: 13, background: A.base, marginLeft: 1, verticalAlign: "middle", animation: "type-cursor 1s step-end infinite" }} /></>)}
              {ln(17, <>{p("});")}</>)}
              {ln(18, null)}
              {ln(19, <>{kw("export default")} {v("app")}{p(";")}</>)}
            </div>
          </div>

          {/* Terminal */}
          <div style={{ height: 115, borderTop: "1px solid #1a1e2a", background: "#0f1219", flexShrink: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "5px 12px", borderBottom: "1px solid #1a1e2a", fontSize: 9, fontWeight: 700, color: "rgba(139,143,163,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, color: A.base }}>●</span>Terminal
            </div>
            <div style={{ flex: 1, padding: "5px 12px", fontFamily: jb, fontSize: 10.5, lineHeight: 1.6, overflow: "hidden" }}>
              <div style={{ color: "#edefF4" }}>$ tervlon evaluate --ticket current</div>
              <div style={{ color: "#34d399", marginTop: 2 }}>✓ Express server boots correctly</div>
              <div style={{ color: "#34d399" }}>✓ CORS + JSON middleware applied</div>
              <div style={{ color: "#34d399" }}>✓ Product routes mounted at /api/products</div>
              <div style={{ color: "#f87171" }}>✗ Missing error handling middleware</div>
              <div style={{ color: "#8b8fa3", marginTop: 2 }}>3 passing, 1 failing (2.1s)</div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="ws-chat" style={{ borderLeft: "1px solid #1a1e2a", background: "#0f1219", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "6px 10px", borderBottom: "1px solid #1a1e2a", fontSize: 9, fontWeight: 700, color: "rgba(139,143,163,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Team Chat</div>
          <div style={{ display: "flex", borderBottom: "1px solid #1a1e2a" }}>
            <div style={{ flex: 1, padding: "5px 0", fontSize: 10, fontWeight: 600, textAlign: "center", color: "#edefF4", borderBottom: `2px solid ${A.base}` }}>PM</div>
            <div style={{ flex: 1, padding: "5px 0", fontSize: 10, fontWeight: 600, textAlign: "center", color: "rgba(139,143,163,0.5)", borderBottom: "2px solid transparent" }}>Teammate</div>
          </div>
          <div style={{ flex: 1, padding: 8, display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
            {[
              { from: "AI PM", color: A.base, text: "Welcome to Sprint #01. First ticket is the product listing API. Start with route structure.", user: false },
              { from: "", color: "", text: "Got express set up with cors. Working on routes now.", user: true },
              { from: "AI PM", color: A.base, text: "Good progress. Don't forget error handling middleware — evaluation checks for it.", user: false },
              { from: "AI Teammate", color: "#34d399", text: "Use a global error handler instead of try/catch in every route.", user: false },
            ].map((msg, i) => (
              <div key={i} style={{ maxWidth: "94%", alignSelf: msg.user ? "flex-end" : "flex-start" }}>
                {!msg.user && <div style={{ fontSize: 8, fontWeight: 700, color: msg.color, marginBottom: 2 }}>{msg.from}</div>}
                <div style={{ fontSize: 11, lineHeight: 1.5, padding: "5px 7px", borderRadius: 6, background: msg.user ? "rgba(99,108,240,0.08)" : "#161a24", border: `1px solid ${msg.user ? A.border : "#1a1e2a"}`, color: "#c4c7d4" }}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "7px 8px", borderTop: "1px solid #1a1e2a", display: "flex", gap: 5 }}>
            <div style={{ flex: 1, padding: "5px 8px", fontSize: 10, borderRadius: 6, border: "1px solid #1a1e2a", background: "#060810", color: "rgba(139,143,163,0.35)" }}>Ask the PM...</div>
            <div style={{ padding: "5px 10px", fontSize: 9, fontWeight: 600, borderRadius: 6, background: "#161a24", color: "rgba(139,143,163,0.35)" }}>Send</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Get a scoped sprint", d: "Every simulation begins with context, acceptance criteria, and a practical ticket that mirrors actual technical work." },
    { n: "02", t: "Work inside the workspace", d: "Open files, inspect context, run checks, and move through the task like you would in a real engineering flow." },
    { n: "03", t: "Collaborate with AI roles", d: "A project manager guides the sprint, teammates unblock the process, and reviewer feedback strengthens delivery." },
    { n: "04", t: "Get evaluated by signal", d: "You are scored on implementation, reasoning, confidence, communication, and quality of execution." },
  ];

  return (
    <section id="how-it-works" style={{ position: "relative", zIndex: 1, padding: "96px 0 120px" }}>
      <div className="container">
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
          <span className="label">How it works</span>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.04em", marginTop: 14 }}>
            A structured flow from<br /><span className="grad-text" style={{ fontStyle: "italic" }}>task to signal.</span>
          </h2>
          <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.85, color: "rgba(228,230,236,0.42)" }}>
            Tervlon measures how someone thinks, builds, communicates, and delivers inside a guided sprint — not whether they got the right answer.
          </p>
        </div>
        <div className="how-grid">
          {steps.map((s, i) => (
            <div key={s.n} className={i === 1 ? "glass-hi" : "glass"} style={{ borderRadius: 24, padding: 26, minHeight: 260, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at top right, rgba(91,200,245,${i === 1 ? 0.12 : 0.06}), transparent 55%)`, pointerEvents: "none" }} />
              <div style={{ position: "relative", width: 54, height: 54, borderRadius: 18, background: "rgba(91,200,245,0.06)", border: "1px solid rgba(91,200,245,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 14, color: B.l, marginBottom: 18 }}>{s.n}</div>
              <div style={{ position: "relative", fontFamily: serif, fontSize: 27, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 12 }}>{s.t}</div>
              <p style={{ position: "relative", fontSize: 14, lineHeight: 1.85, color: "rgba(228,230,236,0.42)" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── REPORTS / SIGNAL ─── */
function SignalSection() {
  const dims: [string, number][] = [["Technical accuracy", 88], ["Code quality", 81], ["Problem solving", 86], ["Context handling", 79], ["Delivery confidence", 84]];

  return (
    <section id="reports" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="label">Reports</span>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.04em", marginTop: 14 }}>
            Scorecards that show<br /><span className="grad-text" style={{ fontStyle: "italic" }}>how someone works.</span>
          </h2>
          <p style={{ maxWidth: 540, margin: "18px auto 0", fontSize: 15, lineHeight: 1.8, color: "rgba(228,230,236,0.42)" }}>
            Every simulation ends with multi-dimensional performance feedback — not a shallow pass or fail.
          </p>
        </div>
        <div className="signal-grid">
          <div className="glass-hi" style={{ borderRadius: 24, padding: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 16 }}>
              <div>
                <span className="label">Your sprint report</span>
                <div style={{ fontFamily: serif, fontSize: 28, marginTop: 10 }}>Sprint #01 Results</div>
              </div>
              <div style={{ padding: "10px 22px", borderRadius: 999, background: `linear-gradient(135deg, ${B.l}, ${B.d})`, fontSize: 18, fontWeight: 800, color: "#070a10" }}>84</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {dims.map(([label, val]) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
                    <span style={{ color: "rgba(228,230,236,0.5)" }}>{label}</span>
                    <span style={{ color: B.l, fontWeight: 600, fontFamily: mono, fontSize: 12 }}>{val}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(91,200,245,0.06)" }}>
                    <div style={{ height: 6, borderRadius: 3, width: `${val}%`, background: `linear-gradient(90deg, ${B.d}, ${B.l})`, boxShadow: "0 0 12px rgba(91,200,245,0.15)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>↑</div>
                <span className="label" style={{ marginBottom: 0 }}>Strength</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(228,230,236,0.54)" }}>Strong core implementation with solid test coverage. The auth flow handles the main happy path and common failure states cleanly.</p>
            </div>
            <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(249,168,38,0.08)", border: "1px solid rgba(249,168,38,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>!</div>
                <span className="label" style={{ marginBottom: 0 }}>Watchpoint</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(228,230,236,0.48)" }}>Expired session handling could be made more defensive under edge cases and multi-route redirect scenarios.</p>
            </div>
            <div className="glass-hi" style={{ borderRadius: 20, padding: 24 }}>
              <span className="label">Reviewer note</span>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(228,230,236,0.56)", marginTop: 10 }}>Solid delivery. The solution is clear, testable, and ready for the next sprint with minor refinements.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── AUDIENCE ─── */
function AudienceGrid() {
  return (
    <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span className="label">The opportunity</span>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(34px, 4.5vw, 52px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.04em", marginTop: 14 }}>
            One environment for<span className="grad-text" style={{ fontStyle: "italic" }}> everyone.</span>
          </h2>
        </div>
        <div className="aud-grid">
          <div className="glass-hi aud-span" style={{ borderRadius: 24, padding: 36, gridRow: "1 / 3", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 380 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.l, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>For developers</div>
            <div style={{ fontFamily: serif, fontSize: 38, fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 16 }}>Practice the way<br />real work happens.</div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(228,230,236,0.46)", maxWidth: 400 }}>Build inside structured sprints that mirror actual team workflows and get scored on execution, not memorization.</p>
          </div>
          <div className="glass" style={{ borderRadius: 20, padding: 30, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 182 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(91,200,245,0.56)", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>For companies</div>
            <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 10 }}>Hire on signal, not guesswork.</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "rgba(228,230,236,0.42)" }}>Evaluate how candidates ship with sprint data instead of surface-level resume keywords.</p>
          </div>
          <div className="glass" style={{ borderRadius: 20, padding: 30, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 182 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(91,200,245,0.56)", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>For academies</div>
            <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 10 }}>Scale real assessment.</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "rgba(228,230,236,0.42)" }}>Run practical simulations with built-in scoring without manually orchestrating every exercise from scratch.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TRACKS ─── */
function Tracks() {
  const soon = [
    { name: "Frontend Engineering", desc: "Component architecture, state management, and product delivery." },
    { name: "DevOps & Infra", desc: "CI/CD pipelines, containerization, infrastructure-as-code." },
    { name: "Cybersecurity", desc: "Incident response, vulnerability assessment, security audits." },
    { name: "Mobile Engineering", desc: "Native and cross-platform app development workflows." },
    { name: "Data Engineering", desc: "Pipeline design, transformation logic, data modeling." },
    { name: "Cloud & Platform", desc: "AWS, GCP, and Azure architecture, serverless, and managed services." },
  ];

  return (
    <section id="tracks" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span className="label">Tracks</span>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(34px, 4.5vw, 52px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.04em", marginTop: 14 }}>
            One framework.<span className="grad-text" style={{ fontStyle: "italic" }}> Full spectrum.</span>
          </h2>
          <p style={{ maxWidth: 520, margin: "18px auto 0", fontSize: 15, lineHeight: 1.8, color: "rgba(228,230,236,0.42)" }}>Starting with backend engineering. The simulation framework extends across the entire engineering discipline.</p>
        </div>

        {/* Live */}
        <div className="glass-hi" style={{ borderRadius: 24, padding: 30, position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(91,200,245,0.05)", marginBottom: 16 }}>
          <div style={{ position: "absolute", inset: "0 0 auto 0", height: 2, background: `linear-gradient(90deg, transparent, ${B.l}, transparent)` }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, border: "1px solid rgba(91,200,245,0.12)", background: "rgba(91,200,245,0.08)", color: B.l, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Live — try it now</div>
              <div style={{ fontFamily: serif, fontSize: 32, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 10 }}>Backend Engineering</div>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(228,230,236,0.44)", maxWidth: 560 }}>Build APIs, auth systems, and data layers inside structured sprint simulations. Express, Prisma, PostgreSQL — real tools, real evaluation.</p>
            </div>
            <button className="btn-p" style={{ padding: "14px 28px", fontSize: 14 }}>Start a Sprint</button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="tracks-soon">
          {soon.map((t) => (
            <div key={t.name} className="glass" style={{ borderRadius: 18, padding: 22, minHeight: 160 }}>
              <div style={{ display: "inline-flex", padding: "5px 10px", borderRadius: 999, border: "1px solid rgba(91,200,245,0.08)", background: "rgba(91,200,245,0.03)", color: "rgba(228,230,236,0.4)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Coming soon</div>
              <div style={{ fontFamily: serif, fontSize: 22, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 8 }}>{t.name}</div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(228,230,236,0.38)" }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function Faq() {
  const items = [
    { q: "Is this just coding practice?", a: "No. It is structured sprint simulation. You are evaluated on how you work through real delivery, not isolated trivia." },
    { q: "Can companies use this for hiring?", a: "Yes. The system generates stronger execution signal than resumes alone. Companies create assessments and invite candidates to complete sprint simulations." },
    { q: "What tracks are available?", a: "Backend engineering launches first with Node.js, Express, and Prisma. Frontend, DevOps, cybersecurity, mobile, data engineering, and cloud platform tracks follow." },
    { q: "Do AI roles replace human review?", a: "No. They structure the sprint and strengthen the simulation experience. The goal is clearer signal, not fake theatre." },
  ];

  return (
    <section id="faq" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="label">FAQ</span>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(34px, 4.5vw, 50px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.04em", marginTop: 14 }}>
            Questions people ask<span className="grad-text" style={{ fontStyle: "italic" }}> first.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {items.map((item) => (
            <div key={item.q} className="glass" style={{ borderRadius: 20, padding: 24 }}>
              <div style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 10 }}>{item.q}</div>
              <p style={{ fontSize: 14, lineHeight: 1.82, color: "rgba(228,230,236,0.44)" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function ClosingCTA() {
  return (
    <section style={{ position: "relative", zIndex: 1, padding: "0 0 90px" }}>
      <div className="container">
        <div className="glass-hi" style={{ borderRadius: 28, padding: "44px 28px", textAlign: "center", maxWidth: 1120, margin: "0 auto", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top center, rgba(91,200,245,0.14), transparent 52%)", pointerEvents: "none" }} />
          <span className="label">Try it now</span>
          <h2 style={{ position: "relative", fontFamily: serif, fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.04em", marginTop: 14 }}>
            Show more than intent.<br /><span className="grad-text" style={{ fontStyle: "italic" }}>Show how you execute.</span>
          </h2>
          <p style={{ position: "relative", maxWidth: 580, margin: "18px auto 0", fontSize: 15, lineHeight: 1.85, color: "rgba(228,230,236,0.44)" }}>
            Start with a guided sprint, build inside context, and leave with signal people can actually use.
          </p>
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 28 }}>
            <button className="btn-p" style={{ padding: "16px 34px", fontSize: 15 }}>Start a Sprint</button>
            <button className="btn-g" style={{ padding: "16px 28px", fontSize: 14 }}>Explore Workflow</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Foot() {
  return (
    <footer style={{ position: "relative", zIndex: 1, padding: "0 0 34px" }}>
      <div className="container">
        <div style={{ borderTop: "1px solid rgba(91,200,245,0.08)", paddingTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo s={22} />
            <span style={{ fontSize: 13, color: "rgba(228,230,236,0.58)", fontWeight: 600 }}>Tervlon</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(228,230,236,0.28)" }}>© 2026 Tervlon. Structured sprint simulations.</div>
        </div>
      </div>
    </footer>
  );
}