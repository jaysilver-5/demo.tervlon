'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

type Candidate = {
  id: string;
  status: string;
  joinedAt: string | null;
  completedAt: string | null;
  user: { id: string; email: string; username: string };
  session: { id: string; status: string; currentTicketSeq: number } | null;
  scores: { overall: number; ticketsCompleted: number; resetsUsed: number } | null;
};

type Assessment = {
  id: string;
  title: string;
  inviteCode: string;
  status: string;
  settings: any;
  createdAt: string;
  simulation: {
    id: string;
    title: string;
    stack: string;
    difficulty: string;
    estimatedMinutes: number;
  };
  candidates: Candidate[];
};

const barColor = (score: number) =>
  score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--yellow)' : 'var(--red)';

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { loading: authLoading, user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      try {
        const res = await api(`/assessments/${id}`);
        if (res.ok) setAssessment(await res.json());
      } catch (e) {
        console.error('Failed to load assessment', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, authLoading, user]);

  function copyLink() {
    if (!assessment) return;
    const link = `${window.location.origin}/invite/${assessment.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading || authLoading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ color: 'var(--text)', fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
        <p style={{ color: 'var(--text)' }}>Assessment not found.</p>
      </div>
    );
  }

  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${assessment.inviteCode}`;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <button
        onClick={() => router.push('/app/assessments')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', fontSize: 13, marginBottom: 24, fontFamily: 'inherit',
        }}
      >
        ← Back to Assessments
      </button>

      {/* Header */}
      <div style={{
        padding: 28, borderRadius: 16, border: '1px solid var(--border)',
        background: 'linear-gradient(135deg, var(--surface), var(--bg-alt))',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>{assessment.title}</h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{
                padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                background: 'rgba(99,108,240,0.08)', border: '1px solid rgba(99,108,240,0.15)',
                color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace",
              }}>
                {assessment.simulation.stack.replace(/_/g, ' · ')}
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                background: 'var(--surface-light)', border: '1px solid var(--border)',
                color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace",
              }}>
                {assessment.simulation.difficulty} · ~{assessment.simulation.estimatedMinutes}min
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                background: assessment.settings?.aiTeammate === 'full' ? 'rgba(52,211,153,0.08)' : assessment.settings?.aiTeammate === 'disabled' ? 'rgba(248,113,113,0.08)' : 'rgba(251,191,36,0.08)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}>
                AI Help: {assessment.settings?.aiTeammate || 'limited'}
              </span>
            </div>
          </div>
          <div style={{
            padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
            background: assessment.status === 'ACTIVE' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
            border: assessment.status === 'ACTIVE' ? '1px solid rgba(52,211,153,0.15)' : '1px solid rgba(248,113,113,0.15)',
            color: assessment.status === 'ACTIVE' ? 'var(--green)' : 'var(--red)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {assessment.status}
          </div>
        </div>
      </div>

      {/* Invite Link */}
      <div style={{
        padding: 20, borderRadius: 14, border: '1px solid var(--border)',
        background: 'var(--surface)', marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>
          Invite Link
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            flex: 1, padding: '10px 14px', borderRadius: 8,
            background: 'var(--bg)', border: '1px solid var(--border)',
            fontSize: 13, color: 'var(--text-light)', fontFamily: "'JetBrains Mono', monospace",
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {inviteLink}
          </div>
          <button
            onClick={copyLink}
            style={{
              padding: '10px 20px', fontSize: 12, fontWeight: 600, borderRadius: 8,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: copied ? 'var(--green)' : 'var(--accent)',
              color: '#fff', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {copied ? '✓ Copied' : 'Copy Link'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text)', marginTop: 8 }}>
          Share this link with candidates. They'll create an account and start the assessment.
        </p>
      </div>

      {/* Candidates */}
      <div style={{
        padding: 24, borderRadius: 14, border: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
          Candidates ({assessment.candidates.length})
        </div>

        {assessment.candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ fontSize: 14, color: 'var(--text)' }}>No candidates yet. Share the invite link to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {assessment.candidates.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 10,
                  border: '1px solid var(--border)', background: 'var(--bg-alt)',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--surface-light)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600, color: 'var(--accent)', flexShrink: 0,
                }}>
                  {c.user.username[0].toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{c.user.username}</div>
                  <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.user.email}</div>
                </div>

                {/* Status */}
                <span style={{
                  padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  background: c.status === 'COMPLETED' ? 'rgba(52,211,153,0.08)' : c.status === 'IN_PROGRESS' ? 'rgba(99,108,240,0.08)' : 'var(--surface-light)',
                  border: '1px solid var(--border)',
                  color: c.status === 'COMPLETED' ? 'var(--green)' : c.status === 'IN_PROGRESS' ? 'var(--accent)' : 'var(--text)',
                }}>
                  {c.status.replace('_', ' ')}
                </span>

                {/* Score */}
                {c.scores ? (
                  <span style={{
                    fontSize: 16, fontWeight: 700,
                    color: barColor(c.scores.overall),
                    fontFamily: "'JetBrains Mono', monospace",
                    minWidth: 45, textAlign: 'right',
                  }}>
                    {c.scores.overall}%
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text)', minWidth: 45, textAlign: 'right' }}>—</span>
                )}

                {/* View report */}
                {c.session && c.status === 'COMPLETED' && (
                  <button
                    onClick={() => router.push(`/app/report/${c.session!.id}`)}
                    style={{
                      padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 6,
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--text-light)', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    View Report
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}