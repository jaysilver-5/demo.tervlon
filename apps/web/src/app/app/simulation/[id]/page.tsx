'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

type Ticket = {
  id: string;
  sequence: number;
  title: string;
  brief: string;
  estimatedMinutes: number;
};

type Session = {
  id: string;
  currentTicketSeq: number;
  status: string;
  simulation: {
    id: string;
    title: string;
    description: string;
    stack: string;
    estimatedMinutes: number;
    tickets: Ticket[];
  };
};

function getTicketStatus(
  ticket: Ticket,
  currentSeq: number,
): 'done' | 'active' | 'todo' | 'locked' {
  if (ticket.sequence < currentSeq) return 'done';
  if (ticket.sequence === currentSeq) return 'active';
  if (ticket.sequence === currentSeq + 1) return 'todo';
  return 'locked';
}

const dotColor: Record<string, string> = {
  done: 'var(--green)',
  active: 'var(--accent)',
  todo: 'var(--yellow)',
  locked: 'var(--border)',
};

export default function SimulationPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Check if user already has a session for this simulation
        const res = await api(`/workspace/sessions/by-sim/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSession(data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // No existing session
      }

      // No session yet — start one
      await startSession();
    }
    load();
  }, [id]);

  async function startSession() {
    setStarting(true);
    try {
      const res = await api('/workspace/sessions', {
        method: 'POST',
        body: JSON.stringify({ simulationId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    } catch (e) {
      console.error('Failed to start session', e);
    } finally {
      setStarting(false);
      setLoading(false);
    }
  }

  if (loading || starting) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <span style={{ color: 'var(--text)', fontSize: 14 }}>
          {starting ? 'Starting simulation...' : 'Loading...'}
        </span>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ color: 'var(--text)', fontSize: 14 }}>Failed to load simulation.</p>
        <button
          onClick={() => router.push('/app')}
          style={{
            marginTop: 16, padding: '10px 24px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-light)', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { simulation, currentTicketSeq } = session;
  const totalTickets = simulation.tickets.length;
  const completedTickets = currentTicketSeq - 1;
  const progressPct = (completedTickets / totalTickets) * 100;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back link */}
      <button
        onClick={() => router.push('/app')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', fontSize: 13, marginBottom: 24,
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={{
        padding: 28, borderRadius: 16,
        border: '1px solid var(--border)',
        background: 'linear-gradient(135deg, var(--surface), var(--bg-alt))',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--white)', marginBottom: 6, letterSpacing: '-0.02em' }}>
              {simulation.title}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, maxWidth: 560 }}>
              {simulation.description}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
              {completedTickets} / {totalTickets} tickets
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 140, height: 5, borderRadius: 3, background: 'var(--surface-light)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: 'linear-gradient(90deg, var(--accent), var(--cyan))',
                  width: `${progressPct}%`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>
                {Math.round(progressPct)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Backlog */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{
          fontSize: 11, fontWeight: 700, color: 'var(--text)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 16,
        }}>
          Sprint Backlog
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {simulation.tickets.map((ticket) => {
          const status = getTicketStatus(ticket, currentTicketSeq);
          const isClickable = status === 'active';

          return (
            <div
              key={ticket.id}
              onClick={() => {
                if (isClickable) {
                  // Slice 3 will navigate to workspace here
                //    alert(`Opening workspace for ${ticket.title}\n\nThis will work in Slice 3!`);
                    router.push(`/app/workspace/${session.id}`);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderRadius: 12,
                border: status === 'active' ? '1px solid rgba(99,108,240,0.3)' : '1px solid var(--border)',
                background: status === 'active' ? 'rgba(99,108,240,0.04)' : 'transparent',
                opacity: status === 'locked' ? 0.4 : 1,
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (isClickable) {
                  e.currentTarget.style.borderColor = 'rgba(99,108,240,0.5)';
                  e.currentTarget.style.background = 'rgba(99,108,240,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (isClickable) {
                  e.currentTarget.style.borderColor = 'rgba(99,108,240,0.3)';
                  e.currentTarget.style.background = 'rgba(99,108,240,0.04)';
                }
              }}
            >
              {/* Status dot */}
              <span style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: dotColor[status],
                boxShadow: status === 'active' ? '0 0 8px rgba(99,108,240,0.4)' : 'none',
              }} />

              {/* Ticket ID */}
              <span style={{
                fontSize: 11, color: 'rgba(139,143,163,0.5)',
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: 55,
              }}>
                {ticket.title.split(':')[0]}
              </span>

              {/* Title */}
              <span style={{
                flex: 1, fontSize: 14, fontWeight: 500,
                color: status === 'locked' ? 'rgba(139,143,163,0.35)' :
                       status === 'done' ? 'var(--text)' : 'var(--white)',
                textDecoration: status === 'done' ? 'line-through' : 'none',
                textDecorationColor: 'rgba(139,143,163,0.25)',
              }}>
                {ticket.title.split(': ').slice(1).join(': ')}
              </span>

              {/* Time estimate */}
              <span style={{
                fontSize: 11, color: 'rgba(139,143,163,0.35)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                ~{ticket.estimatedMinutes}m
              </span>

              {/* Status badge */}
              {status === 'active' && (
                <span style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                  background: 'linear-gradient(135deg, rgba(99,108,240,0.12), rgba(56,189,248,0.06))',
                  border: '1px solid rgba(99,108,240,0.2)',
                  color: 'var(--accent-light)',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.03em',
                }}>
                  CURRENT
                </span>
              )}
              {status === 'done' && (
                <span style={{ color: 'var(--green)', fontSize: 15 }}>✓</span>
              )}
              {status === 'locked' && (
                <span style={{ fontSize: 12, opacity: 0.5 }}>🔒</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Ticket Brief Preview */}
      {simulation.tickets
        .filter((t) => getTicketStatus(t, currentTicketSeq) === 'active')
        .map((ticket) => (
          <div
            key={ticket.id}
            style={{
              marginTop: 24, padding: 28, borderRadius: 16,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 700, color: 'var(--accent)',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.08em', marginBottom: 12,
            }}>
              CURRENT TICKET BRIEF
            </div>
            <div
              style={{
                fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(ticket.brief),
              }}
            />
          </div>
        ))}
    </div>
  );
}

/* Simple markdown renderer for ticket briefs */
function renderMarkdown(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h2 style="font-size:20px;font-weight:700;color:var(--white);margin:20px 0 8px;">$1</h2>')
    .replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;color:var(--accent);margin:18px 0 8px;">$1</h3>')
    .replace(/^- \[ \] (.+)$/gm, '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;"><span style="width:15px;height:15px;border-radius:4px;border:1.5px solid var(--border-light);flex-shrink:0;"></span><span>$1</span></div>')
    .replace(/^- (.+)$/gm, '<div style="padding:2px 0 2px 12px;">• $1</div>')
    .replace(/`([^`]+)`/g, '<code style="font-family:JetBrains Mono,monospace;font-size:12px;background:var(--surface-light);padding:2px 6px;border-radius:4px;color:var(--yellow);">$1</code>')
    .replace(/\n\n/g, '<div style="height:10px;"></div>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent);text-decoration:none;" target="_blank">$1</a>');
}