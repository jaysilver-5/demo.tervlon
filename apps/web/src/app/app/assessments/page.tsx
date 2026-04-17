'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

type Assessment = {
  id: string;
  title: string;
  inviteCode: string;
  status: string;
  createdAt: string;
  simulation: {
    title: string;
    stack: string;
    difficulty: string;
    estimatedMinutes: number;
  };
  _count: { candidates: number };
  candidates: { status: string }[];
};

export default function AssessmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api('/assessments');
        if (res.ok) setAssessments(await res.json());
      } catch (e) {
        console.error('Failed to load assessments', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ color: 'var(--text)', fontSize: 14 }}>Loading assessments...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>
            Assessments
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text)' }}>
            Create and manage assessments for candidates and students.
          </p>
        </div>
        <button
          onClick={() => router.push('/app/assessments/create')}
          style={{
            padding: '10px 24px', fontSize: 13, fontWeight: 600, borderRadius: 10,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            color: '#fff', boxShadow: '0 4px 16px rgba(99,108,240,0.2)',
          }}
        >
          + Create Assessment
        </button>
      </div>

      {assessments.length === 0 ? (
        <div style={{
          padding: 48, borderRadius: 16, border: '1px solid var(--border)',
          background: 'var(--surface)', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>📋</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>No assessments yet</p>
          <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 24 }}>Create your first assessment to start evaluating candidates.</p>
          <button
            onClick={() => router.push('/app/assessments/create')}
            style={{
              padding: '10px 24px', fontSize: 13, fontWeight: 600, borderRadius: 10,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: 'var(--accent)', color: '#fff',
            }}
          >
            Create Assessment
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {assessments.map((a) => {
            const completed = a.candidates.filter((c) => c.status === 'COMPLETED').length;
            const inProgress = a.candidates.filter((c) => c.status === 'IN_PROGRESS').length;
            const total = a._count.candidates;

            return (
              <div
                key={a.id}
                onClick={() => router.push(`/app/assessments/${a.id}`)}
                style={{
                  padding: 24, borderRadius: 14, border: '1px solid var(--border)',
                  background: 'linear-gradient(135deg, var(--surface), var(--bg-alt))',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,108,240,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>{a.title}</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                        background: 'rgba(99,108,240,0.08)', border: '1px solid rgba(99,108,240,0.15)',
                        color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {a.simulation.stack.replace(/_/g, ' · ')}
                      </span>
                      <span style={{
                        padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                        background: 'var(--surface-light)', border: '1px solid var(--border)',
                        color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {a.simulation.difficulty}
                      </span>
                      <span style={{
                        padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                        background: a.status === 'ACTIVE' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                        border: a.status === 'ACTIVE' ? '1px solid rgba(52,211,153,0.15)' : '1px solid rgba(248,113,113,0.15)',
                        color: a.status === 'ACTIVE' ? 'var(--green)' : 'var(--red)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>{total}</div>
                    <div style={{ fontSize: 11, color: 'var(--text)' }}>
                      {completed} completed · {inProgress} in progress
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}