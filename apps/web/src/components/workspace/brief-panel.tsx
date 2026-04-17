'use client';

function renderMarkdown(md: string): string {
  return md
    .replace(
      /^# (.+)$/gm,
      '<h2 style="font-size:18px;font-weight:700;color:var(--white);margin:16px 0 8px;">$1</h2>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h3 style="font-size:14px;font-weight:700;color:var(--accent);margin:14px 0 6px;">$1</h3>',
    )
    .replace(
      /^- \[ \] (.+)$/gm,
      '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;"><span style="width:14px;height:14px;border-radius:3px;border:1.5px solid var(--border-light);flex-shrink:0;"></span><span>$1</span></div>',
    )
    .replace(
      /^- (.+)$/gm,
      '<div style="padding:2px 0 2px 12px;">• $1</div>',
    )
    .replace(
      /`([^`]+)`/g,
      '<code style="font-family:JetBrains Mono,monospace;font-size:11px;background:var(--surface-light);padding:2px 6px;border-radius:4px;color:var(--yellow);">$1</code>',
    )
    .replace(/\n\n/g, '<div style="height:8px;"></div>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" style="color:var(--accent);text-decoration:none;" target="_blank">$1</a>',
    );
}

export function BriefPanel({
  brief,
  onClose,
}: {
  brief: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        width: 360,
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          fontSize: 10,
          fontWeight: 700,
          color: 'rgba(139,143,163,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Ticket Brief
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(139,143,163,0.4)',
            cursor: 'pointer',
            fontSize: 16,
            padding: '0 4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          flex: 1,
          padding: '16px 20px',
          overflowY: 'auto',
          fontSize: 13,
          color: 'var(--text-light)',
          lineHeight: 1.65,
        }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }}
      />
    </div>
  );
}