'use client';

export function EditorTabs({
  openTabs,
  activeTab,
  onTabClick,
  onTabClose,
}: {
  openTabs: string[];
  activeTab: string;
  onTabClick: (path: string) => void;
  onTabClose: (path: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
        overflowX: 'auto',
      }}
    >
      {openTabs.map((tab) => {
        const isActive = tab === activeTab;
        const fileName = tab.split('/').pop() || tab;

        return (
          <div
            key={tab}
            onClick={() => onTabClick(tab)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px 8px 16px',
              fontSize: 12,
              color: isActive ? 'var(--white)' : 'rgba(139,143,163,0.5)',
              background: isActive ? 'var(--bg)' : 'transparent',
              borderRight: '1px solid var(--border)',
              borderBottom: isActive
                ? '2px solid var(--accent)'
                : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: "'JetBrains Mono', monospace",
              transition: 'all 0.1s ease',
            }}
          >
            <span style={{ opacity: 0.4, fontSize: 10 }}>
              {fileName.endsWith('.ts') || fileName.endsWith('.tsx')
                ? 'TS'
                : fileName.endsWith('.json')
                  ? '{}'
                  : fileName.endsWith('.prisma')
                    ? '◆'
                    : fileName.endsWith('.md')
                      ? '#'
                      : '·'}
            </span>
            {fileName}
            <span
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab);
              }}
              style={{
                fontSize: 14,
                lineHeight: 1,
                color: 'rgba(139,143,163,0.3)',
                cursor: 'pointer',
                padding: '0 2px',
                borderRadius: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--white)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(139,143,163,0.3)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ×
            </span>
          </div>
        );
      })}
    </div>
  );
}