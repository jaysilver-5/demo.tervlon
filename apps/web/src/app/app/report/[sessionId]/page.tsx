'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

type TicketScore = {
  sequence: number;
  title: string;
  scores: { technicalAccuracy: number; codeQuality: number; timeManagement: number; overall: number };
  usedReset: boolean;
};

type Report = {
  simulation: { title: string; totalTickets: number };
  scores: { technicalAccuracy: number; codeQuality: number; timeManagement: number; overall: number };
  ticketScores: TicketScore[];
  aiSummary: string;
  totalDuration: number;
  resetsUsed: number;
};

const barColor = (score: number) =>
  score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--yellow)' : 'var(--red)';

export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { loading: authLoading, user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      try {
        const res = await api(`/evaluate/${sessionId}/report`);
        if (res.ok) {
          setReport(await res.json());
        }
      } catch (e) {
        console.error('Failed to load report', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId, authLoading, user]);

  if (loading || authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text)', fontSize: 14 }}>Loading report...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <span style={{ color: 'var(--text)', fontSize: 14 }}>Report not available yet.</span>
        <button
          onClick={() => router.push('/app')}
          style={{
            padding: '10px 24px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-light)', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <button
        onClick={() => router.push('/app')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', fontSize: 13, marginBottom: 32, fontFamily: 'inherit',
        }}
      >
        ← Back to Dashboard
      </button>

      <div style={{
        padding: 32, borderRadius: 18, border: '1px solid var(--border)',
        background: 'linear-gradient(135deg, var(--surface), var(--bg-alt))',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: 'var(--accent)',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 8,
            }}>
              PERFORMANCE REPORT
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>
              {report.simulation.title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text)' }}>
              {report.simulation.totalTickets} tickets · {report.totalDuration} minutes
              {report.resetsUsed > 0 && ` · ${report.resetsUsed} reset${report.resetsUsed > 1 ? 's' : ''} used`}
            </p>
          </div>
          <div style={{
            padding: '12px 24px', borderRadius: 14,
            background: `linear-gradient(135deg, ${barColor(report.scores.overall)}10, transparent)`,
            border: `1px solid ${barColor(report.scores.overall)}25`,
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: barColor(report.scores.overall), fontFamily: "'JetBrains Mono', monospace" }}>
              {report.scores.overall}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text)', textAlign: 'center' }}>overall</div>
          </div>
        </div>
      </div>

      {/* Dimension Scores */}
      <div style={{
        padding: 28, borderRadius: 16, border: '1px solid var(--border)',
        background: 'var(--surface)', marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, fontFamily: "'JetBrains Mono', monospace" }}>
          Dimension Scores
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { label: 'Technical Accuracy', value: report.scores.technicalAccuracy, weight: '50%' },
            { label: 'Code Quality', value: report.scores.codeQuality, weight: '35%' },
            { label: 'Time Management', value: report.scores.timeManagement, weight: '15%' },
          ].map((dim) => (
            <div key={dim.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-light)' }}>
                  {dim.label} <span style={{ fontSize: 11, color: 'var(--text)' }}>({dim.weight})</span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: barColor(dim.value), fontFamily: "'JetBrains Mono', monospace" }}>
                  {dim.value}%
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--surface-light)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${dim.value}%`, borderRadius: 3,
                  background: barColor(dim.value), transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Ticket Breakdown */}
      <div style={{
        padding: 28, borderRadius: 16, border: '1px solid var(--border)',
        background: 'var(--surface)', marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, fontFamily: "'JetBrains Mono', monospace" }}>
          Ticket Breakdown
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {report.ticketScores.map((ts) => (
            <div
              key={ts.sequence}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 10,
                border: '1px solid var(--border)', background: 'var(--bg-alt)',
              }}
            >
              <span style={{
                fontSize: 11, color: 'var(--text)',
                fontFamily: "'JetBrains Mono', monospace", minWidth: 50,
              }}>
                DS-{100 + ts.sequence}
              </span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-light)' }}>
                {ts.title.split(': ').slice(1).join(': ')}
              </span>
              {ts.usedReset && (
                <span style={{
                  padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                  background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)',
                  color: 'var(--yellow)', fontFamily: "'JetBrains Mono', monospace",
                }}>
                  RESET
                </span>
              )}
              <span style={{
                fontSize: 14, fontWeight: 700,
                color: barColor(ts.scores.overall),
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: 40, textAlign: 'right',
              }}>
                {ts.scores.overall}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div style={{
        padding: 28, borderRadius: 16, border: '1px solid var(--border)',
        background: 'linear-gradient(135deg, var(--surface-light), var(--surface))',
      }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
          AI Performance Summary
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {report.aiSummary}
        </p>
      </div>
    </div>
  );
}