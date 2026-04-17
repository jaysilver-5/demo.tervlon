'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState('LEARNER');

  const { login, register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, username, password, role);
      }
      router.push('/app');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 48,
            justifyContent: 'center',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            <defs><linearGradient id="auth-lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5BC8F5" /><stop offset="100%" stopColor="#1A7AB5" /></linearGradient></defs>
            <circle cx="50" cy="78" r="18" fill="url(#auth-lg)" /><circle cx="28" cy="22" r="14" fill="url(#auth-lg)" /><circle cx="72" cy="30" r="9" fill="url(#auth-lg)" />
            <path d="M50 60 L32 34" stroke="url(#auth-lg)" strokeWidth="10" strokeLinecap="round" /><path d="M50 60 L68 38" stroke="url(#auth-lg)" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--white)',
              letterSpacing: '-0.03em',
            }}
          >
            Tervlon
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            padding: 32,
            borderRadius: 18,
            border: '1px solid var(--border-light)',
            background:
              'linear-gradient(180deg, var(--surface-light), var(--surface))',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 6,
            }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text)',
              marginBottom: 28,
            }}
          >
            {mode === 'login'
              ? 'Log in to continue your simulation.'
              : 'Start your first engineering simulation.'}
          </p>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                color: 'var(--red)',
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    marginBottom: 6,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-light)',
                        marginBottom: 6,
                      }}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      required
                      minLength={3}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-light)',
                        marginBottom: 6,
                      }}
                    >
                      I am a...
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { value: 'LEARNER', label: 'Developer' },
                        { value: 'INSTRUCTOR', label: 'Instructor' },
                        { value: 'HIRING_MANAGER', label: 'Hiring Manager' },
                      ].map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          style={{
                            flex: 1,
                            padding: '10px 0',
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 8,
                            border: role === r.value ? '1px solid rgba(99,108,240,0.4)' : '1px solid var(--border)',
                            background: role === r.value ? 'rgba(99,108,240,0.1)' : 'transparent',
                            color: role === r.value ? 'var(--accent-light)' : 'var(--text)',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.15s',
                          }}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    marginBottom: 6,
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  marginTop: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 10,
                  border: 'none',
                  background:
                    'linear-gradient(135deg, var(--accent), var(--accent-light))',
                  color: '#fff',
                  cursor: submitting ? 'wait' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 20px rgba(99,108,240,0.2)',
                }}
              >
                {submitting
                  ? 'Loading...'
                  : mode === 'login'
                    ? 'Log in'
                    : 'Create account'}
              </button>
            </div>
          </form>

          <p
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--text)',
              marginTop: 24,
            }}
          >
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-light)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    fontSize: 13,
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-light)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    fontSize: 13,
                  }}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}