import React, { useEffect, useState } from 'react';
import { leaderboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RANK_STYLES = {
  1: { color: '#FFD700', icon: '🥇', bg: 'rgba(255,215,0,0.08)' },
  2: { color: '#C0C0C0', icon: '🥈', bg: 'rgba(192,192,192,0.06)' },
  3: { color: '#CD7F32', icon: '🥉', bg: 'rgba(205,127,50,0.06)' },
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI.getTop()
      .then(r => setEntries(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite' }}>🏆</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)', marginTop: 12 }}>Loading leaderboard...</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, animation: 'slide-in 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>
          🏆 LEADERBOARD
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          Top developers ranked by XP earned
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map((entry, idx) => {
          const rs = RANK_STYLES[entry.rank] || {};
          const isMe = user && entry.userId === user.id;
          return (
            <div key={entry.userId} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 20px',
              background: isMe ? 'rgba(88,166,255,0.08)' : (rs.bg || 'var(--bg-card)'),
              border: `1px solid ${isMe ? 'rgba(88,166,255,0.3)' : 'var(--border)'}`,
              borderRadius: 12,
              transition: 'all 0.2s ease',
              animation: `slide-in 0.3s ease ${idx * 0.04}s both`,
            }}>
              {/* Rank */}
              <div style={{
                width: 40,
                textAlign: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: rs.icon ? 22 : 18,
                color: rs.color || 'var(--text-muted)',
                flexShrink: 0,
              }}>
                {rs.icon || `#${entry.rank}`}
              </div>

              {/* Avatar */}
              <img
                src={entry.avatarUrl || `https://github.com/${entry.username}.png`}
                alt={entry.username}
                style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${isMe ? 'var(--accent-blue)' : 'var(--border)'}`, objectFit: 'cover', flexShrink: 0 }}
              />

              {/* Name */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{entry.name || entry.username}</span>
                  {isMe && <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(88,166,255,0.2)', color: 'var(--accent-blue)', borderRadius: 999, fontFamily: 'var(--font-mono)' }}>YOU</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  @{entry.username} • 🔥 {entry.streak}d streak
                </div>
              </div>

              {/* Level */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--accent-purple)' }}>
                  {entry.level}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>LVL</div>
              </div>

              {/* XP */}
              <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: rs.color || 'var(--accent-yellow)' }}>
                  {entry.xp?.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>XP</div>
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏜️</div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              No entries yet. Be the first to sync your GitHub!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
