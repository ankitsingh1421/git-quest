import React, { useEffect, useState } from 'react';
import { questAPI } from '../services/api';

function QuestCard({ quest, index }) {
  const isExpired = quest.expiresAt && new Date(quest.expiresAt) < new Date() && !quest.completed;
  const statusColor = quest.completed ? 'var(--accent-green)' : isExpired ? 'var(--accent-orange)' : 'var(--accent-blue)';
  const statusLabel = quest.completed ? '✅ COMPLETE' : isExpired ? '⏰ EXPIRED' : '⚡ ACTIVE';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${quest.completed ? 'rgba(57,211,83,0.3)' : 'var(--border)'}`,
      borderRadius: 14,
      padding: '20px 24px',
      animation: `slide-in 0.35s ease ${index * 0.06}s both`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {quest.completed && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 48px 48px 0',
          borderColor: `transparent rgba(57,211,83,0.4) transparent transparent`,
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{quest.description}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 999,
              fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: 1,
              background: `rgba(${statusColor === 'var(--accent-green)' ? '57,211,83' : statusColor === 'var(--accent-orange)' ? '247,129,102' : '88,166,255'},0.12)`,
              color: statusColor,
            }}>
              {statusLabel}
            </span>
            {quest.expiresAt && !quest.completed && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Expires {new Date(quest.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div style={{
          background: 'rgba(227,179,65,0.12)',
          color: 'var(--accent-yellow)',
          border: '1px solid rgba(227,179,65,0.3)',
          padding: '8px 14px',
          borderRadius: 10,
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{quest.xpReward}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1 }}>XP</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 10, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{
            height: '100%',
            width: `${quest.progressPercent}%`,
            background: quest.completed ? 'var(--accent-green)' : 'linear-gradient(90deg, #bc8cff, #58a6ff)',
            borderRadius: 999,
            transition: 'width 1s ease',
            boxShadow: quest.completed ? '0 0 8px rgba(57,211,83,0.5)' : '0 0 8px rgba(188,140,255,0.4)',
          }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap', minWidth: 50 }}>
          {quest.currentCount} / {quest.targetCount}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: statusColor, minWidth: 36, textAlign: 'right' }}>
          {quest.progressPercent}%
        </span>
      </div>

      {quest.completedAt && (
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
          ✓ Completed {new Date(quest.completedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default function QuestsPage() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    questAPI.getAll()
      .then(r => setQuests(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = quests.filter(q => {
    if (filter === 'active') return !q.completed;
    if (filter === 'completed') return q.completed;
    return true;
  });

  const completedCount = quests.filter(q => q.completed).length;
  const totalXp = quests.filter(q => q.completed).reduce((s, q) => s + (q.xpReward || 0), 0);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite' }}>🎯</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', marginTop: 12 }}>Loading quests...</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 750, animation: 'slide-in 0.4s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>
          🎯 QUESTS
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          {completedCount} completed • {totalXp.toLocaleString()} XP earned from quests
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'active', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px',
            borderRadius: 999,
            border: `1px solid ${filter === f ? 'var(--accent-purple)' : 'var(--border)'}`,
            background: filter === f ? 'rgba(188,140,255,0.15)' : 'transparent',
            color: filter === f ? 'var(--accent-purple)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: 1,
            transition: 'all 0.2s ease',
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0
          ? <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏜️</div>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {filter === 'completed' ? 'No completed quests yet!' : 'No quests yet. Sync your GitHub to start!'}
              </p>
            </div>
          : filtered.map((q, i) => <QuestCard key={q.id} quest={q} index={i} />)
        }
      </div>
    </div>
  );
}
