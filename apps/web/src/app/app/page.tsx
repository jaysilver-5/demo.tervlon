'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

type Simulation = {
  id: string;
  title: string;
  description: string;
  stack: string;
  difficulty: string;
  estimatedMinutes: number;
  _count: { tickets: number };
};

const difficultyColor: Record<string, string> = {
  BEGINNER: 'var(--green)',
  INTERMEDIATE: 'var(--yellow)',
  ADVANCED: 'var(--red)',
};

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // If instructor or hiring manager, redirect to assessments
  useEffect(() => {
    if (user && (user.role === 'INSTRUCTOR' || user.role === 'HIRING_MANAGER')) {
      router.replace('/app/assessments');
    }
  }, [user, router]);

  // Learner / Candidate dashboard
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api('/simulations');
        if (res.ok) setSimulations(await res.json());
      } catch (e) {
        console.error('Failed to load simulations', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (user?.role === 'INSTRUCTOR' || user?.role === 'HIRING_MANAGER') {
    return null; // redirecting
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ color: 'var(--text)', fontSize: 14 }}>Loading simulations...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>
        Welcome, {user?.username}
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text)', marginBottom: 40 }}>
        Choose a simulation to begin.
      </p>

      {simulations.length === 0 ? (
        <p style={{ color: 'var(--text)', fontSize: 14 }}>No simulations available yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {simulations.map((sim) => (
            <a
              key={sim.id}
              href={`/app/simulation/${sim.id}`}
              style={{
                padding: 28, borderRadius: 16, border: '1px solid var(--border)',
                background: 'linear-gradient(135deg, var(--surface), var(--bg-alt))',
                textDecoration: 'none', transition: 'all 0.3s ease', display: 'block',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.borderColor = 'rgba(99,108,240,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>{sim.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 16 }}>{sim.description}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: 'rgba(99,108,240,0.08)', border: '1px solid rgba(99,108,240,0.15)',
                      color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {sim.stack.replace(/_/g, ' · ')}
                    </span>
                    <span style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.12)',
                      color: difficultyColor[sim.difficulty] || 'var(--text)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {sim.difficulty}
                    </span>
                    <span style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: 'var(--surface-light)', border: '1px solid var(--border)',
                      color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {sim._count.tickets} tickets · ~{sim.estimatedMinutes}min
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                  color: '#fff', whiteSpace: 'nowrap', alignSelf: 'center',
                  boxShadow: '0 4px 16px rgba(99,108,240,0.2)',
                }}>
                  Start Sprint →
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}