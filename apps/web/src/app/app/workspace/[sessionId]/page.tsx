'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { FileTree } from '@/components/workspace/file-tree';
import { EditorTabs } from '@/components/workspace/editor-tabs';
import { CodeEditor } from '@/components/workspace/code-editor';
import { TerminalPanel, type TerminalLine } from '@/components/workspace/terminal';
import { BriefPanel } from '@/components/workspace/brief-panel';
import { ChatPanel, type ChatMessage } from '@/components/workspace/chat-panel';

type Ticket = {
  id: string;
  sequence: number;
  title: string;
  brief: string;
  estimatedMinutes: number;
};

type SessionData = {
  id: string;
  currentTicketSeq: number;
  simulation: {
    title: string;
    tickets: Ticket[];
  };
};

const barColor = (score: number) =>
  score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--yellow)' : 'var(--red)';

export default function WorkspacePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  const [files, setFiles] = useState<Record<string, string>>({});
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('');

  const [showBrief, setShowBrief] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showChat, setShowChat] = useState(true);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatSending, setChatSending] = useState(false);

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const filesRef = useRef(files);
  const chatRef = useRef(chatMessages);

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  useEffect(() => { filesRef.current = files; }, [files]);
  useEffect(() => { chatRef.current = chatMessages; }, [chatMessages]);

  // Load session, files, and chat
  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      try {
        const sessionRes = await api(`/workspace/sessions/${sessionId}`);
        if (!sessionRes.ok) {
          router.push('/app');
          return;
        }
        const sessionData = await sessionRes.json();
        setSession(sessionData);

        const filesRes = await api(`/workspace/sessions/${sessionId}/files`);
        if (!filesRes.ok) return;

        const filesData = await filesRes.json();
        const fileTree = filesData.files as Record<string, string>;
        setFiles(fileTree);

        const existingChat = (filesData.chatHistory as ChatMessage[]) || [];
        setChatMessages(existingChat);

        const defaultTabs: string[] = [];
        if (fileTree['TICKET.md']) defaultTabs.push('TICKET.md');
        const firstCode = Object.keys(fileTree).find(
          (f) => f.endsWith('.ts') && !f.includes('.gitkeep') && f.includes('src/'),
        );
        if (firstCode) defaultTabs.push(firstCode);
        if (defaultTabs.length > 0) {
          setOpenTabs(defaultTabs);
          setActiveTab(defaultTabs[0]);
        }

        if (existingChat.length === 0) {
          try {
            const welcomeRes = await api(`/chat/${sessionId}/welcome`, {
              method: 'POST',
            });
            if (welcomeRes.ok) {
              const welcomeData = await welcomeRes.json();
              if (welcomeData.chatHistory) {
                setChatMessages(welcomeData.chatHistory);
              }
            }
          } catch (e) {
            console.error('Welcome message failed', e);
          }
        }
      } catch (e) {
        console.error('Failed to load workspace', e);
        router.push('/app');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId, router, authLoading, user]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isDirty) return;
      try {
        await api(`/workspace/sessions/${sessionId}/snapshots`, {
          method: 'POST',
          body: JSON.stringify({
            snapshotType: 'AUTO_SAVE',
            fileTree: filesRef.current,
            chatHistory: chatRef.current,
          }),
        });
        setLastSaved(new Date());
        setIsDirty(false);
      } catch (e) {
        console.error('Auto-save failed', e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionId, isDirty]);

  const handleFileClick = useCallback(
    (path: string) => {
      if (!openTabs.includes(path)) {
        setOpenTabs((prev) => [...prev, path]);
      }
      setActiveTab(path);
    },
    [openTabs],
  );

  const handleTabClose = useCallback(
    (path: string) => {
      setOpenTabs((prev) => {
        const next = prev.filter((t) => t !== path);
        if (activeTab === path && next.length > 0) {
          setActiveTab(next[next.length - 1]);
        }
        return next;
      });
    },
    [activeTab],
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      setFiles((prev) => ({ ...prev, [activeTab]: value }));
      setIsDirty(true);
    },
    [activeTab],
  );

  const handleCreateFile = useCallback(
    (path: string) => {
      if (files[path] !== undefined) return;
      setFiles((prev) => ({ ...prev, [path]: '' }));
      if (!openTabs.includes(path)) {
        setOpenTabs((prev) => [...prev, path]);
      }
      setActiveTab(path);
      setIsDirty(true);
    },
    [files, openTabs],
  );

  const handleCreateFolder = useCallback(
    (path: string) => {
      const keepPath = `${path}/.gitkeep`;
      if (files[keepPath] !== undefined) return;
      setFiles((prev) => ({ ...prev, [keepPath]: '' }));
      setIsDirty(true);
    },
    [files],
  );

  const handleDeleteFile = useCallback(
    (path: string) => {
      setFiles((prev) => {
        const next = { ...prev };
        delete next[path];
        return next;
      });
      setOpenTabs((prev) => prev.filter((t) => t !== path));
      if (activeTab === path) {
        setOpenTabs((prev) => {
          if (prev.length > 0) setActiveTab(prev[prev.length - 1]);
          else setActiveTab('');
          return prev;
        });
      }
      setIsDirty(true);
    },
    [activeTab],
  );

  const handleSendChat = useCallback(
    async (text: string, agent: 'pm' | 'teammate') => {
      setChatSending(true);

      const userMsg: ChatMessage = {
        from: 'user',
        text,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, userMsg]);

      try {
        const res = await api(`/chat/${sessionId}/message`, {
          method: 'POST',
          body: JSON.stringify({ text, agent }),
        });

        if (res.ok) {
          const data = await res.json();
          setChatMessages((prev) => [...prev, data.aiMessage]);
        } else {
          setChatMessages((prev) => [
            ...prev,
            {
              from: agent === 'pm' ? 'AI PM' : 'AI Teammate',
              agent,
              text: 'Sorry, I couldn\'t process that. Try again.',
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch {
        setChatMessages((prev) => [
          ...prev,
          {
            from: agent === 'pm' ? 'AI PM' : 'AI Teammate',
            agent,
            text: 'Connection error. Try again.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setChatSending(false);
        setIsDirty(true);
      }
    },
    [sessionId],
  );

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await api(`/workspace/sessions/${sessionId}/snapshots`, {
        method: 'POST',
        body: JSON.stringify({
          snapshotType: 'SUBMISSION',
          fileTree: filesRef.current,
          chatHistory: chatRef.current,
        }),
      });
    } catch {}

    setTerminalLines([
      { text: '$ tervlon submit --ticket current', type: 'command' },
      { text: '', type: 'plain' },
      { text: 'Submitting ticket...', type: 'info' },
      { text: 'Running evaluation...', type: 'info' },
    ]);
    setShowTerminal(true);

    try {
      const res = await api(`/evaluate/${sessionId}/submit`, { method: 'POST' });
      if (!res.ok) {
        setTerminalLines((prev) => [...prev, { text: '✗ Submission failed.', type: 'error' }]);
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      const outputLines = (data.terminalOutput as string).split('\n').map((text: string) => ({
        text,
        type: text.startsWith('✓') ? 'success' as const
          : text.startsWith('✗') ? 'error' as const
          : text.startsWith('$') ? 'command' as const
          : text.startsWith('─') ? 'info' as const
          : text.startsWith('→') ? 'info' as const
          : 'plain' as const,
      }));
      setTerminalLines(outputLines);

      if (data.aiReview?.overallReview) {
        setChatMessages((prev) => [...prev, {
          from: 'AI Reviewer',
          agent: 'pm' as const,
          text: data.aiReview.overallReview,
          timestamp: new Date().toISOString(),
        }]);
        setShowChat(true);
      }

      if (data.triggerMessage) {
        setTimeout(() => {
          setChatMessages((prev) => [...prev, {
            from: 'AI PM',
            agent: 'pm' as const,
            text: data.triggerMessage,
            timestamp: new Date().toISOString(),
          }]);
        }, 2000);
      }

      setSubmitResult(data);
    } catch {
      setTerminalLines((prev) => [...prev, { text: '✗ Connection error.', type: 'error' }]);
    } finally {
      setSubmitting(false);
    }
  }, [sessionId, submitting]);

  const currentTicket = session?.simulation.tickets.find(
    (t) => t.sequence === session.currentTicketSeq,
  );

  if (loading || authLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        <span style={{ color: 'var(--text)', fontSize: 14 }}>Loading workspace...</span>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: 48,
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: 14,
              padding: '4px 8px',
              fontFamily: 'inherit',
            }}
          >
            ←
          </button>
          <svg width="20" height="20" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            <defs><linearGradient id="ws-lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5BC8F5" /><stop offset="100%" stopColor="#1A7AB5" /></linearGradient></defs>
            <circle cx="50" cy="78" r="18" fill="url(#ws-lg)" /><circle cx="28" cy="22" r="14" fill="url(#ws-lg)" /><circle cx="72" cy="30" r="9" fill="url(#ws-lg)" />
            <path d="M50 60 L32 34" stroke="url(#ws-lg)" strokeWidth="10" strokeLinecap="round" /><path d="M50 60 L68 38" stroke="url(#ws-lg)" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em' }}>
            Tervlon
          </span>
          <span style={{ color: 'var(--border-light)', fontSize: 14 }}>|</span>
          <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
            {currentTicket?.title.split(':')[0]}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-light)' }}>
            {currentTicket?.title.split(': ').slice(1).join(': ')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowBrief(!showBrief)}
            style={{
              padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 7, border: 'none',
              background: showBrief ? 'rgba(99,108,240,0.12)' : 'transparent',
              color: showBrief ? 'var(--accent)' : 'var(--text)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            📋 Brief
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 7, border: 'none',
              background: showChat ? 'rgba(99,108,240,0.12)' : 'transparent',
              color: showChat ? 'var(--accent)' : 'var(--text)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            style={{
              padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 7, border: 'none',
              background: showTerminal ? 'rgba(99,108,240,0.12)' : 'transparent',
              color: showTerminal ? 'var(--accent)' : 'var(--text)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            ⬤ Terminal
          </button>

          {/* Run Checks */}
          <button
            onClick={async () => {
              try {
                await api(`/workspace/sessions/${sessionId}/snapshots`, {
                  method: 'POST',
                  body: JSON.stringify({
                    snapshotType: 'CHECK_RUN',
                    fileTree: filesRef.current,
                    chatHistory: chatRef.current,
                  }),
                });
              } catch {}

              setTerminalLines([
                { text: '$ tervlon evaluate --ticket current', type: 'command' },
                { text: '', type: 'plain' },
                { text: 'Saving workspace...', type: 'info' },
                { text: 'Analyzing code...', type: 'info' },
              ]);
              setShowTerminal(true);

              try {
                const res = await api(`/evaluate/${sessionId}/check`, { method: 'POST' });

                if (res.ok) {
                  const data = await res.json();

                  const outputLines = (data.terminalOutput as string)
                    .split('\n')
                    .map((text: string) => ({
                      text,
                      type: text.startsWith('✓')
                        ? 'success' as const
                        : text.startsWith('✗')
                          ? 'error' as const
                          : text.startsWith('$')
                            ? 'command' as const
                            : text.startsWith('─')
                              ? 'info' as const
                              : text.startsWith('→')
                                ? 'info' as const
                                : 'plain' as const,
                    }));

                  setTerminalLines(outputLines);

                  const reviewMsg = {
                    from: 'AI Reviewer',
                    agent: 'pm' as const,
                    text: data.aiReview.overallReview,
                    timestamp: new Date().toISOString(),
                  };
                  setChatMessages((prev) => [...prev, reviewMsg]);
                  setShowChat(true);
                } else {
                  setTerminalLines([
                    { text: '$ tervlon evaluate --ticket current', type: 'command' },
                    { text: '', type: 'plain' },
                    { text: '✗ Evaluation failed. Try again.', type: 'error' },
                  ]);
                }
              } catch {
                setTerminalLines([
                  { text: '$ tervlon evaluate --ticket current', type: 'command' },
                  { text: '', type: 'plain' },
                  { text: '✗ Connection error. Is the backend running?', type: 'error' },
                ]);
              }
            }}
            style={{
              padding: '5px 16px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 10px rgba(99,108,240,0.2)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            ▶ Run Checks
          </button>

          {/* Submit Ticket */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '5px 16px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: 'none',
              background: 'linear-gradient(135deg, var(--green), #22c55e)',
              color: '#fff', cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 10px rgba(52,211,153,0.2)',
              display: 'flex', alignItems: 'center', gap: 5,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? '⏳ Submitting...' : '✓ Submit Ticket'}
          </button>

          {/* Save indicator */}
          <span
            style={{
              fontSize: 11, color: 'rgba(139,143,163,0.35)', marginLeft: 8,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {isDirty ? '● unsaved' : lastSaved ? `saved ${lastSaved.toLocaleTimeString()}` : ''}
          </span>
        </div>
      </div>

      {/* Workspace body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {showBrief && currentTicket && (
          <BriefPanel brief={currentTicket.brief} onClose={() => setShowBrief(false)} />
        )}

        <FileTree
          files={files}
          activeFile={activeTab}
          onFileClick={handleFileClick}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onDeleteFile={handleDeleteFile}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <EditorTabs
            openTabs={openTabs}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            onTabClose={handleTabClose}
          />

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeTab && files[activeTab] !== undefined ? (
              <CodeEditor
                filePath={activeTab}
                content={files[activeTab]}
                onChange={handleCodeChange}
              />
            ) : (
              <div
                style={{
                  height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(139,143,163,0.3)', fontSize: 14,
                }}
              >
                Open a file from the explorer
              </div>
            )}
          </div>

          {showTerminal && (
            <div style={{ height: 180, borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <TerminalPanel lines={terminalLines} />
            </div>
          )}
        </div>

        {showChat && (
          <ChatPanel
            messages={chatMessages}
            onSendMessage={handleSendChat}
            sending={chatSending}
          />
        )}
      </div>

      {/* Submit Result Overlay */}
      {submitResult && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(6,8,16,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            maxWidth: 480, width: '100%', padding: 36, borderRadius: 20,
            border: '1px solid var(--border-light)',
            background: 'linear-gradient(180deg, var(--surface-light), var(--surface))',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}>
            {submitResult.status === 'passed' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
                  Ticket Complete!
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                  Score: <span style={{ color: barColor(submitResult.scores.overall), fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{submitResult.scores.overall}%</span>
                </p>
                <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 28 }}>
                  Moving to the next ticket.
                </p>
                <button
                  onClick={() => {
                    setSubmitResult(null);
                    window.location.reload();
                  }}
                  style={{
                    padding: '12px 32px', fontSize: 14, fontWeight: 600, borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                    color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 4px 16px rgba(99,108,240,0.2)',
                  }}
                >
                  Continue to Next Ticket →
                </button>
              </>
            )}

            {submitResult.status === 'complete' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
                  Sprint Complete!
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                  Final Score: <span style={{ color: barColor(submitResult.scores.overall), fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{submitResult.scores.overall}%</span>
                </p>
                <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 28 }}>
                  You finished all tickets. View your performance report.
                </p>
                <button
                  onClick={() => router.push(`/app/report/${sessionId}`)}
                  style={{
                    padding: '12px 32px', fontSize: 14, fontWeight: 600, borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                    color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 4px 16px rgba(99,108,240,0.2)',
                  }}
                >
                  View Report →
                </button>
              </>
            )}

            {submitResult.status === 'below_threshold' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
                  Below Threshold
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                  Score: <span style={{ color: 'var(--red)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{submitResult.scores.overall}%</span>
                  {' '}(need {submitResult.minimumRequired}%)
                </p>
                <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 28 }}>
                  You can keep working on this ticket or accept the reference solution and move on.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    onClick={() => setSubmitResult(null)}
                    style={{
                      padding: '12px 24px', fontSize: 13, fontWeight: 600, borderRadius: 10,
                      border: '1px solid var(--border-light)', background: 'transparent',
                      color: 'var(--text-light)', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Keep Working
                  </button>
                  <button
                    onClick={async () => {
                      const currentSeq = session?.currentTicketSeq;
                      if (!currentSeq) return;
                      try {
                        const res = await api(`/evaluate/${sessionId}/reset/${currentSeq}`, {
                          method: 'POST',
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.isComplete) {
                            router.push(`/app/report/${sessionId}`);
                          } else {
                            setSubmitResult(null);
                            window.location.reload();
                          }
                        }
                      } catch {}
                    }}
                    style={{
                      padding: '12px 24px', fontSize: 13, fontWeight: 600, borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, var(--yellow), #f59e0b)',
                      color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Accept Reset & Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}