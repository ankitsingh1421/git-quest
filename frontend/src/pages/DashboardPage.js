import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { questAPI, notificationAPI } from '../services/api';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
    </div>
  );
}

function QuestCard({ quest }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, flex: 1 }}>
          🎯 {quest.description}
        </div>
        <span style={{
          background: 'rgba(227,179,65,0.15)',
          color: 'var(--accent-yellow)',
          padding: '2px 8px',
          borderRadius: 999,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          marginLeft: 8,
        }}>
          +{quest.xpReward} XP
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{
            height: '100%',
            width: `${quest.progressPercent}%`,
            background: quest.completed ? 'var(--accent-green)' : 'linear-gradient(90deg, #bc8cff, #58a6ff)',
            borderRadius: 999,
            transition: 'width 1s ease',
          }} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
          {quest.currentCount}/{quest.targetCount}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeQuests, setActiveQuests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      questAPI.getActive(),
      notificationAPI.getAll(),
    ]).then(([q, n]) => {
      setActiveQuests(q.data.slice(0, 3));
      setNotifications(n.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (!user || loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite' }}>⚔️</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', marginTop: 12 }}>Loading your quest data...</div>
      </div>
    </div>
  );

  const xpPct = Math.min(100, Math.round((user.xpInCurrentLevel / user.xpNeededForCurrentLevel) * 100));

  return (
    <div style={{ animation: 'slide-in 0.4s ease', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, marginBottom: 4, letterSpacing: 2 }}>
          Welcome back, <span style={{ color: 'var(--accent-purple)' }}>{user.name || user.username}</span> ⚔️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          Rank #{user.rank || '—'} • {user.xp?.toLocaleString()} XP total
        </p>
      </div>

      {/* Level / XP Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(188,140,255,0.1), rgba(88,166,255,0.08))',
        border: '1px solid rgba(188,140,255,0.3)',
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(188,140,255,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: 'var(--accent-purple)', lineHeight: 1 }}>
              {user.level}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 4, letterSpacing: 2 }}>LEVEL</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
                Progress to Level {user.level + 1}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-purple)' }}>
                {xpPct}%
              </span>
            </div>
            <div className="xp-bar-container" style={{ height: 12 }}>
              <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span>{user.xpInCurrentLevel?.toLocaleString()} XP</span>
              <span>{user.xpNeededForCurrentLevel?.toLocaleString()} XP needed</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent-orange)', fontWeight: 700 }}>🔥 {user.streak}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>DAY STREAK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <StatCard icon="💻" label="TOTAL COMMITS" value={user.totalCommits?.toLocaleString() || '0'} color="var(--accent-green)" />
        <StatCard icon="🔀" label="PRS MERGED" value={user.totalPrs?.toLocaleString() || '0'} color="var(--accent-blue)" />
        <StatCard icon="🐛" label="ISSUES CLOSED" value={user.totalIssues?.toLocaleString() || '0'} color="var(--accent-orange)" />
        <StatCard icon="⭐" label="TOTAL XP" value={user.xp?.toLocaleString() || '0'} color="var(--accent-yellow)" />
      </div>

      {/* Two columns: Quests + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flexWrap: 'wrap' }}>

        {/* Active Quests */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>🎯 Active Quests</h2>
            <Link to="/quests" style={{ fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeQuests.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)', textAlign: 'center', padding: '20px 0' }}>
                  No active quests. Sync your GitHub to get started!
                </p>
              : activeQuests.map(q => <QuestCard key={q.id} quest={q} />)
            }
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>🔔 Recent Activity</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)', textAlign: 'center', padding: '20px 0' }}>
                  No notifications yet. Sync your GitHub!
                </p>
              : notifications.map(n => (
                <div key={n.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 12px',
                  background: n.read ? 'transparent' : 'rgba(188,140,255,0.06)',
                  borderRadius: 8,
                  border: `1px solid ${n.read ? 'transparent' : 'rgba(188,140,255,0.15)'}`,
                }}>
                  <span style={{ fontSize: 18 }}>{n.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{n.message}</div>
                  </div>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-purple)', marginTop: 4, flexShrink: 0 }} />}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
