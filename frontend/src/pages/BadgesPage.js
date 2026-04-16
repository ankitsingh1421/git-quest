import React, { useEffect, useState } from 'react';
import { badgeAPI } from '../services/api';

const ALL_BADGES = [
  { type: 'FIRST_COMMIT', name: 'First Commit', desc: 'Made your first commit!', emoji: '🌱' },
  { type: 'COMMITS_10', name: '10 Commits', desc: '10 commits made', emoji: '🔥' },
  { type: 'COMMITS_50', name: '50 Commits', desc: '50 commits milestone', emoji: '⚡' },
  { type: 'COMMITS_100', name: '100 Commits', desc: '100 commits club!', emoji: '💯' },
  { type: 'FIRST_PR', name: 'First PR', desc: 'Opened first Pull Request', emoji: '🚀' },
  { type: 'PR_MERGED_5', name: 'PR Pro', desc: '5 PRs merged', emoji: '🏅' },
  { type: 'BUG_SLAYER', name: 'Bug Slayer', desc: 'Closed 10 issues', emoji: '🐛' },
  { type: 'STREAK_7', name: 'Week Warrior', desc: '7 day contribution streak', emoji: '📅' },
  { type: 'STREAK_30', name: 'Month Master', desc: '30 day streak!', emoji: '🗓️' },
  { type: 'LEVEL_5', name: 'Level 5', desc: 'Reached level 5', emoji: '⭐' },
  { type: 'LEVEL_10', name: 'Level 10', desc: 'Reached level 10', emoji: '🌟' },
  { type: 'LEVEL_20', name: 'Level 20', desc: 'Reached level 20', emoji: '💫' },
  { type: 'EARLY_BIRD', name: 'Early Bird', desc: 'Joined in first month', emoji: '🐦' },
  { type: 'NIGHT_OWL', name: 'Night Owl', desc: 'Committed after midnight', emoji: '🦉' },
  { type: 'QUEST_MASTER', name: 'Quest Master', desc: 'Completed 10 quests', emoji: '🎯' },
];

export default function BadgesPage() {
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    badgeAPI.getAll()
      .then(r => setEarned(r.data))
      .finally(() => setLoading(false));
  }, []);

  const earnedTypes = new Set(earned.map(b => b.type));
  const earnedCount = earned.length;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite' }}>🎖️</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)', marginTop: 12 }}>Loading badges...</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, animation: 'slide-in 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>
          🎖️ BADGES
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          {earnedCount} / {ALL_BADGES.length} unlocked
        </p>
        {/* Progress bar */}
        <div style={{ marginTop: 12, maxWidth: 400 }}>
          <div className="xp-bar-container" style={{ height: 8 }}>
            <div className="xp-bar-fill" style={{ width: `${(earnedCount / ALL_BADGES.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Recently earned */}
      {earnedCount > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', letterSpacing: 2, marginBottom: 12 }}>
            ✅ EARNED
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {earned.map((b, i) => (
              <div key={b.id} style={{
                background: 'linear-gradient(135deg, rgba(188,140,255,0.1), rgba(88,166,255,0.06))',
                border: '1px solid rgba(188,140,255,0.3)',
                borderRadius: 14,
                padding: '20px 16px',
                textAlign: 'center',
                animation: `slide-in 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{b.emoji}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, marginBottom: 6, color: 'var(--accent-purple)' }}>
                  {b.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{b.description}</div>
                <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(b.earnedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 12 }}>
          🔒 LOCKED
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {ALL_BADGES.filter(b => !earnedTypes.has(b.type)).map((b, i) => (
            <div key={b.type} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '20px 16px',
              textAlign: 'center',
              opacity: 0.5,
              filter: 'grayscale(1)',
              animation: `slide-in 0.3s ease ${i * 0.03}s both`,
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{b.emoji}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                {b.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
