import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tervlon — Structured Sprint Simulations.',
  description:
    'Structured sprint simulations for developers. Real tickets, AI teammates, real feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: 'var(--bg)',
          color: 'var(--text)',
          minHeight: '100vh',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}