'use client';

export type TerminalLine = {
  text: string;
  type: 'info' | 'success' | 'error' | 'command' | 'plain';
};

const lineColors: Record<string, string> = {
  info: 'var(--text)',
  success: 'var(--green)',
  error: 'var(--red)',
  command: 'var(--white)',
  plain: 'var(--text-light)',
};

export function TerminalPanel({
  lines,
}: {
  lines: TerminalLine[];
}) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
      }}
    >
      <div
        style={{
          padding: '8px 14px',
          borderBottom: '1px solid var(--border)',
          fontSize: 10,
          fontWeight: 700,
          color: 'rgba(139,143,163,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 12 }}>⬤</span> Terminal
      </div>
      <div
        style={{
          flex: 1,
          padding: '8px 14px',
          overflowY: 'auto',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        {lines.length === 0 ? (
          <span style={{ color: 'rgba(139,143,163,0.3)' }}>
            Run Checks to see output here...
          </span>
        ) : (
          lines.map((line, i) => (
            <div key={i} style={{ color: lineColors[line.type] || 'var(--text)' }}>
              {line.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}