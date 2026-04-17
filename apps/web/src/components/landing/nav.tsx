"use client";

import { useState, useEffect } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: scrolled ? "rgba(6,8,16,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.35s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), var(--cyan))",
              boxShadow: "0 0 16px rgba(99,108,240,0.25)",
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--white)",
              letterSpacing: "-0.03em",
            }}
          >
            Tervlon
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Features", "Demo", "Tracks", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontSize: 13.5,
                fontWeight: 500,
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="#early-access"
            style={{
              padding: "9px 22px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(99,108,240,0.25)",
            }}
          >
            Get Early Access
          </a>
        </div>
      </div>
    </nav>
  );
}