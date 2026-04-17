'use client';

import { useState } from 'react';

type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

function buildTree(files: Record<string, string>): FileNode[] {
  const root: FileNode[] = [];
  const sorted = Object.keys(files).sort();

  for (const path of sorted) {
    const parts = path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isFile = i === parts.length - 1;
      const fullPath = parts.slice(0, i + 1).join('/');

      let existing = current.find((n) => n.name === name);

      if (!existing) {
        existing = {
          name,
          path: fullPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
        current.push(existing);
      }

      if (!isFile && existing.children) {
        current = existing.children;
      }
    }
  }

  return root;
}

function FileNodeItem({
  node,
  depth,
  activeFile,
  onFileClick,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
}: {
  node: FileNode;
  depth: number;
  activeFile: string;
  onFileClick: (path: string) => void;
  onCreateFile: (parentPath: string) => void;
  onCreateFolder: (parentPath: string) => void;
  onDeleteFile: (path: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const [hovered, setHovered] = useState(false);
  const isActive = node.type === 'file' && node.path === activeFile;

  if (node.type === 'folder') {
    return (
      <div>
        <div
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: `3px 8px 3px ${14 + depth * 14}px`,
            fontSize: 12,
            color: 'rgba(251,191,36,0.65)',
            cursor: 'pointer',
            userSelect: 'none',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: 10,
              transition: 'transform 0.15s',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              display: 'inline-block',
            }}
          >
            ▸
          </span>
          <span style={{ flex: 1 }}>{node.name}/</span>
          {hovered && (
            <span style={{ display: 'flex', gap: 2 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onCreateFile(node.path); }}
                title="New file"
                style={{
                  background: 'none', border: 'none', color: 'var(--text)',
                  cursor: 'pointer', fontSize: 13, padding: '0 3px', lineHeight: 1,
                }}
              >
                +
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onCreateFolder(node.path); }}
                title="New folder"
                style={{
                  background: 'none', border: 'none', color: 'var(--text)',
                  cursor: 'pointer', fontSize: 11, padding: '0 3px', lineHeight: 1,
                }}
              >
                📁
              </button>
            </span>
          )}
        </div>
        {open &&
          node.children?.map((child) => (
            <FileNodeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              onFileClick={onFileClick}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onDeleteFile={onDeleteFile}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      onClick={() => onFileClick(node.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: `3px 8px 3px ${14 + depth * 14}px`,
        fontSize: 12,
        color: isActive ? 'var(--white)' : 'var(--text)',
        background: isActive ? 'rgba(99,108,240,0.08)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
        cursor: 'pointer',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span style={{ opacity: 0.4, marginRight: 4, fontSize: 10 }}>
        {node.name.endsWith('.ts') || node.name.endsWith('.tsx')
          ? 'TS'
          : node.name.endsWith('.json')
            ? '{}'
            : node.name.endsWith('.prisma')
              ? '◆'
              : node.name.endsWith('.md')
                ? '#'
                : '·'}
      </span>
      <span style={{ flex: 1 }}>{node.name}</span>
      {hovered && !node.path.endsWith('.gitkeep') && (
        <button
          onClick={(e) => { e.stopPropagation(); onDeleteFile(node.path); }}
          title="Delete file"
          style={{
            background: 'none', border: 'none',
            color: 'rgba(248,113,113,0.5)', cursor: 'pointer',
            fontSize: 12, padding: '0 3px', lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

function NewItemInput({
  parentPath,
  type,
  onConfirm,
  onCancel,
}: {
  parentPath: string;
  type: 'file' | 'folder';
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');

  return (
    <div style={{ padding: '3px 8px 3px 28px' }}>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) {
            onConfirm(name.trim());
          }
          if (e.key === 'Escape') {
            onCancel();
          }
        }}
        onBlur={() => {
          if (name.trim()) {
            onConfirm(name.trim());
          } else {
            onCancel();
          }
        }}
        placeholder={type === 'file' ? 'filename.ts' : 'folder-name'}
        style={{
          width: '100%',
          padding: '2px 6px',
          fontSize: 11,
          borderRadius: 4,
          border: '1px solid var(--accent)',
          background: 'var(--bg)',
          color: 'var(--white)',
          outline: 'none',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      />
    </div>
  );
}

export function FileTree({
  files,
  activeFile,
  onFileClick,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
}: {
  files: Record<string, string>;
  activeFile: string;
  onFileClick: (path: string) => void;
  onCreateFile: (path: string) => void;
  onCreateFolder: (path: string) => void;
  onDeleteFile: (path: string) => void;
}) {
  const tree = buildTree(files);

  const [newItem, setNewItem] = useState<{
    parentPath: string;
    type: 'file' | 'folder';
  } | null>(null);

  function handleCreateFile(parentPath: string) {
    setNewItem({ parentPath, type: 'file' });
  }

  function handleCreateFolder(parentPath: string) {
    setNewItem({ parentPath, type: 'folder' });
  }

  function handleConfirm(name: string) {
    if (!newItem) return;
    const fullPath = newItem.parentPath ? `${newItem.parentPath}/${name}` : name;
    if (newItem.type === 'file') {
      onCreateFile(fullPath);
    } else {
      onCreateFolder(fullPath);
    }
    setNewItem(null);
  }

  return (
    <div
      style={{
        width: 220,
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '10px 14px 8px',
          fontSize: 10,
          fontWeight: 700,
          color: 'rgba(139,143,163,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Explorer
        <span style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setNewItem({ parentPath: '', type: 'file' })}
            title="New file at root"
            style={{
              background: 'none', border: 'none', color: 'var(--text)',
              cursor: 'pointer', fontSize: 13, padding: '0 2px', lineHeight: 1,
            }}
          >
            +
          </button>
          <button
            onClick={() => setNewItem({ parentPath: '', type: 'folder' })}
            title="New folder at root"
            style={{
              background: 'none', border: 'none', color: 'var(--text)',
              cursor: 'pointer', fontSize: 11, padding: '0 2px', lineHeight: 1,
            }}
          >
            📁
          </button>
        </span>
      </div>
      <div style={{ padding: '6px 0', flex: 1 }}>
        {newItem && newItem.parentPath === '' && (
          <NewItemInput
            parentPath=""
            type={newItem.type}
            onConfirm={handleConfirm}
            onCancel={() => setNewItem(null)}
          />
        )}
        {tree.map((node) => (
          <FileNodeItem
            key={node.path}
            node={node}
            depth={0}
            activeFile={activeFile}
            onFileClick={onFileClick}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onDeleteFile={onDeleteFile}
          />
        ))}
      </div>
    </div>
  );
}