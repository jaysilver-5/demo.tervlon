'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [selectedSim, setSelectedSim] = useState<string>('');
  const [title, setTitle] = useState('');
  const [aiTeammate, setAiTeammate] = useState<'full' | 'limited' | 'disabled'>('limited');

  useEffect(() => {
    async function load() {
      try {
        const res = await api('/simulations');
        if (res.ok) {
          const data = await res.json();
          setSimulations(data);
          if (data.length > 0) {
            setSelectedSim(data[0].id);
            setTitle(data[0].title);
          }
        }
      } catch (e) {
        console.error('Failed to load simulations', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreate() {
    if (!selectedSim || creating) return;
    setCreating(true);

    try {
      const res = await api('/assessments', {
        method: 'POST',
        body: JSON.stringify({
          simulationId: selectedSim,
          title,
          settings: { aiTeammate },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/app/assessments/${data.id}`);
      }
    } catch (e) {
      console.error('Failed to create assessment', e);
    } finally {
      setCreating(false);
    }
  }

  const selectedSimData = simulations.find((s) => s.id === selectedSim);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: 14,
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--white)',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <p style={{ color: 'var(--text)', fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <button
        onClick={() => router.push('/app/assessments')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', fontSize: 13, marginBottom: 24, fontFamily: 'inherit',
        }}
      >
        ← Back to Assessments
      </button>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
        Create Assessment
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 32 }}>
        Pick a simulation, configure settings, and share the invite link with candidates.
      </p>

      <div style={{
        padding: 28, borderRadius: 16, border: '1px solid var(--border-light)',
        background: 'linear-gradient(180deg, var(--surface-light), var(--surface))',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 6 }}>
            Assessment Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Backend Engineer Assessment"
            style={inputStyle}
          />
        </div>

        {/* Simulation selection */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 6 }}>
            Simulation
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {simulations.map((sim) => (
              <div
                key={sim.id}
                onClick={() => {
                  setSelectedSim(sim.id);
                  if (!title || title === selectedSimData?.title) setTitle(sim.title);
                }}
                style={{
                  padding: 16, borderRadius: 10, cursor: 'pointer',
                  border: selectedSim === sim.id ? '1px solid rgba(99,108,240,0.4)' : '1px solid var(--border)',
                  background: selectedSim === sim.id ? 'rgba(99,108,240,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>{sim.title}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: 'rgba(99,108,240,0.08)', color: 'var(--accent)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {sim.stack.replace(/_/g, ' · ')}
                      </span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: 'var(--surface-light)', color: 'var(--text)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {sim.difficulty} · {sim._count.tickets} tickets · ~{sim.estimatedMinutes}min
                      </span>
                    </div>
                  </div>
                  {selectedSim === sim.id && (
                    <span style={{ color: 'var(--accent)', fontSize: 16 }}>✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Teammate setting */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 6 }}>
            AI Teammate Help Level
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { value: 'full' as const, label: 'Full', desc: 'Code snippets & examples' },
              { value: 'limited' as const, label: 'Limited', desc: 'Guidance only, no code' },
              { value: 'disabled' as const, label: 'Disabled', desc: 'No AI help available' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAiTeammate(opt.value)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
                  border: aiTeammate === opt.value ? '1px solid rgba(99,108,240,0.4)' : '1px solid var(--border)',
                  background: aiTeammate === opt.value ? 'rgba(99,108,240,0.08)' : 'transparent',
                  color: aiTeammate === opt.value ? 'var(--accent-light)' : 'var(--text)',
                  fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text)' }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={creating || !selectedSim}
          style={{
            width: '100%', padding: '13px 0', fontSize: 14, fontWeight: 700,
            borderRadius: 10, border: 'none', fontFamily: 'inherit',
            background: selectedSim ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--surface-light)',
            color: selectedSim ? '#fff' : 'rgba(139,143,163,0.35)',
            cursor: selectedSim && !creating ? 'pointer' : 'default',
            boxShadow: selectedSim ? '0 4px 16px rgba(99,108,240,0.2)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {creating ? 'Creating...' : 'Create Assessment & Get Link'}
        </button>
      </div>
    </div>
  );
}