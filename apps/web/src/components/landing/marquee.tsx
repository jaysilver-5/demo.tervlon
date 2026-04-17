"use client";

const STACKS = [
  { n: "Node.js", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { n: "Express", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", inv: true },
  { n: "TypeScript", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { n: "Prisma", u: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg", inv: true },
  { n: "PostgreSQL", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { n: "Docker", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { n: "Git", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { n: "React", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { n: "Next.js", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", inv: true },
  { n: "Python", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { n: "Jest", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
  { n: "AWS", u: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", inv: true },
];

export function StackMarquee() {
  const track = [...STACKS, ...STACKS];

  return (
    <div style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "rgba(15,18,25,0.5)", padding: "14px 0" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, var(--bg), transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(270deg, var(--bg), transparent)", zIndex: 2, pointerEvents: "none" }} />

      <div style={{ display: "flex", gap: 16, width: "max-content", animation: "marquee-scroll 40s linear infinite" }}>
        {track.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 100,
              border: "1px solid var(--border)",
              background: "var(--surface-light)",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.u}
              alt={s.n}
              style={{
                width: 22,
                height: 22,
                objectFit: "contain",
                filter: s.inv ? "invert(1) brightness(2)" : "none",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-light)", whiteSpace: "nowrap" }}>
              {s.n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}