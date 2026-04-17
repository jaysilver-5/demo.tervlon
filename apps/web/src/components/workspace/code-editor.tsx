'use client';

import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text)',
        fontSize: 13,
      }}
    >
      Loading editor...
    </div>
  ),
});

function getLanguage(path: string): string {
  if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
  if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.prisma')) return 'graphql';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.html')) return 'html';
  if (path.endsWith('.yaml') || path.endsWith('.yml')) return 'yaml';
  if (path.endsWith('.env') || path.endsWith('.gitkeep')) return 'plaintext';
  return 'plaintext';
}

export function CodeEditor({
  filePath,
  content,
  onChange,
}: {
  filePath: string;
  content: string;
  onChange: (value: string) => void;
}) {
  return (
    <MonacoEditor
      height="100%"
      language={getLanguage(filePath)}
      value={content}
      onChange={(value) => onChange(value ?? '')}
      theme="vs-dark"
      options={{
        fontSize: 13,
        fontFamily: "'JetBrains Mono', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        tabSize: 2,
        wordWrap: filePath.endsWith('.md') ? 'on' : 'off',
        automaticLayout: true,
        bracketPairColorization: { enabled: true },
        guides: { indentation: true },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
      }}
    />
  );
}