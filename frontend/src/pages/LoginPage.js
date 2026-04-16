import React from 'react';
import { authAPI } from '../services/api';

export default function LoginPage() {
  return (
    <div style={styles.container}>
      {/* Background grid */}
      <div style={styles.grid} />
      {/* Glow blobs */}
      <div style={{...styles.blob, top:'10%', left:'15%', background:'rgba(188,140,255,0.15)'}} />
      <div style={{...styles.blob, bottom:'15%', right:'10%', background:'rgba(88,166,255,0.1)'}} />

      <div style={styles.card}>
        <div style={styles.logo}>🎮</div>
        <h1 style={styles.title}>GitQuest</h1>
        <p style={styles.tagline}>Turn your commits into conquests.</p>
        <div style={styles.divider} />
        <p style={styles.desc}>
          Connect your GitHub account and start earning XP, unlocking badges,
          climbing leaderboards, and completing quests — all from your real coding activity.
        </p>
        <button style={styles.githubBtn} onClick={() => authAPI.loginWithGitHub()}>
          <svg style={{width:22,height:22}} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>
        <p style={styles.footnote}>
          We only read your public activity. No write access. Ever.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(88,166,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(88,166,255,0.05) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  },
  blob: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '48px 40px',
    maxWidth: 460,
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  logo: {
    fontSize: 56,
    marginBottom: 12,
    display: 'block',
    animation: 'float 3s ease-in-out infinite',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 36,
    fontWeight: 900,
    background: 'linear-gradient(135deg, #bc8cff, #58a6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: 8,
    letterSpacing: 4,
  },
  tagline: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-green)',
    fontSize: 14,
    marginBottom: 24,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    marginBottom: 24,
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: 14,
    lineHeight: 1.7,
    marginBottom: 32,
  },
  githubBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 24px',
    background: '#e6edf3',
    color: '#0d1117',
    border: 'none',
    borderRadius: 10,
    fontFamily: 'var(--font-mono)',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: 16,
  },
  footnote: {
    color: 'var(--text-muted)',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
  },
};
