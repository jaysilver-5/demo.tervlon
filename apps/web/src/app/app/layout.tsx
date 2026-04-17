'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'var(--text)', fontSize: 14 }}>Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Nav */}
      <header
        style={{
          height: 60,
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            <defs><linearGradient id="app-lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5BC8F5" /><stop offset="100%" stopColor="#1A7AB5" /></linearGradient></defs>
            <circle cx="50" cy="78" r="18" fill="url(#app-lg)" /><circle cx="28" cy="22" r="14" fill="url(#app-lg)" /><circle cx="72" cy="30" r="9" fill="url(#app-lg)" />
            <path d="M50 60 L32 34" stroke="url(#app-lg)" strokeWidth="10" strokeLinecap="round" /><path d="M50 60 L68 38" stroke="url(#app-lg)" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--white)',
              letterSpacing: '-0.03em',
            }}
          >
            Tervlon
          </span>
          <div style={{ display: 'flex', gap: 16, marginLeft: 16 }}>
            {(user.role === 'INSTRUCTOR' || user.role === 'HIRING_MANAGER') ? (
              <a href="/app/assessments" style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}>
                Assessments
              </a>
            ) : (
              <a href="/app" style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}>
                Simulations
              </a>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
            {user.username}
          </span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--surface-light)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent)',
            }}
          >
            {user.username[0].toUpperCase()}
          </div>
          <button
            onClick={logout}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: 32 }}>
        {children}
      </main>
    </div>
  );
}