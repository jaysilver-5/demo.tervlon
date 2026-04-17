'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

type AssessmentInfo = {
  id: string;
  title: string;
  settings: any;
  simulation: {
    id: string;
    title: string;
    description: string;
    stack: string;
    difficulty: string;
    estimatedMinutes: number;
  };
  creator: { username: string };
};

export default function InvitePage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [assessment, setAssessment] = useState<AssessmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api(`/assessments/invite/${code}`);
        if (res.ok) {
          setAssessment(await res.json());
        } else {
          setError('Invalid or expired invite link.');
        }
      } catch {
        setError('Failed to load assessment.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  async function handleJoin() {
    if (!user) {
      router.push(`/auth?redirect=/invite/${code}`);
      return;
    }

    setJoining(true);
    try {
      const res = await api(`/assessments/invite/${code}/join`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const sessionId = data.session?.id || data.candidate?.sessionId;
        if (sessionId) {
          router.push(`/app/workspace/${sessionId}`);
        } else {
          router.push('/app');
        }
      } else {
        setError('Failed to join assessment.');
      }
    } catch {
      setError('Connection error.');
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text)', fontSize: 14 }}>Loading assessment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 36 }}>⚠️</div>
        <p style={{ color: 'var(--text)', fontSize: 14 }}>{error}</p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 24px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-light)', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        maxWidth: 520, width: '100%', padding: 36, borderRadius: 20,
        border: '1px solid var(--border-light)',
        background: 'linear-gradient(180deg, var(--surface-light), var(--surface))',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <svg width="28" height="28" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            <defs><linearGradient id="inv-lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5BC8F5" /><stop offset="100%" stopColor="#1A7AB5" /></linearGradient></defs>
            <circle cx="50" cy="78" r="18" fill="url(#inv-lg)" /><circle cx="28" cy="22" r="14" fill="url(#inv-lg)" /><circle cx="72" cy="30" r="9" fill="url(#inv-lg)" />
            <path d="M50 60 L32 34" stroke="url(#inv-lg)" strokeWidth="10" strokeLinecap="round" /><path d="M50 60 L68 38" stroke="url(#inv-lg)" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.03em' }}>Tervlon</span>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>
          You've been invited to complete
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
          {assessment.title}
        </h1>

        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 24 }}>
          {assessment.simulation.description}
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: 'rgba(99,108,240,0.08)', border: '1px solid rgba(99,108,240,0.15)',
            color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace",
          }}>
            {assessment.simulation.stack.replace(/_/g, ' · ')}
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: 'var(--surface-light)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace",
          }}>
            {assessment.simulation.difficulty} · ~{assessment.simulation.estimatedMinutes}min
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: 'var(--surface-light)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace",
          }}>
            AI Help: {assessment.settings?.aiTeammate || 'limited'}
          </span>
        </div>

        <button
          onClick={handleJoin}
          disabled={joining}
          style={{
            width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 700,
            borderRadius: 12, border: 'none', fontFamily: 'inherit',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            color: '#fff', cursor: joining ? 'wait' : 'pointer',
            boxShadow: '0 4px 20px rgba(99,108,240,0.25)',
            opacity: joining ? 0.7 : 1, transition: 'all 0.2s',
          }}
        >
          {joining ? 'Starting...' : user ? 'Begin Assessment →' : 'Log In & Begin Assessment →'}
        </button>

        {!user && (
          <p style={{ fontSize: 12, color: 'var(--text)', marginTop: 12 }}>
            You'll need to create an account or log in first.
          </p>
        )}
      </div>
    </div>
  );
}