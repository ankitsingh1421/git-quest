import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/badges', label: 'Badges', icon: '🎖️' },
  { to: '/quests', label: 'Quests', icon: '🎯' },
  { to: '/activity', label: 'Activity', icon: '📡' },
];

export default function Layout() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await authAPI.sync();
      await refreshUser();
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const xpPct = user
    ? Math.min(100, Math.round((user.xpInCurrentLevel / user.xpNeededForCurrentLevel) * 100))
    : 0;

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🎮</span>
          <span style={styles.brandName}>GitQuest</span>
        </div>

        {/* User card */}
        {user && (
          <div style={styles.userCard}>
            <img src={user.avatarUrl || `https://github.com/${user.username}.png`}
              alt={user.username} style={styles.avatar} />
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.name || user.username}</div>
              <div style={styles.userMeta}>
                <span style={{color:'var(--accent-purple)'}}>Lv.{user.level}</span>
                <span style={{color:'var(--text-muted)'}}>•</span>
                <span style={{color:'var(--accent-orange)'}}>🔥 {user.streak}d</span>
              </div>
            </div>
            <div style={styles.xpSection}>
              <div style={styles.xpLabel}>
                <span style={{color:'var(--text-secondary)',fontSize:11}}>XP</span>
                <span style={{color:'var(--accent-purple)',fontSize:11,fontFamily:'var(--font-mono)'}}>
                  {user.xpInCurrentLevel}/{user.xpNeededForCurrentLevel}
                </span>
              </div>
              <div className="xp-bar-container" style={{height:6}}>
                <div className="xp-bar-fill" style={{width:`${xpPct}%`}} />
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={styles.nav}>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <span style={styles.navIcon}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <button style={styles.syncBtn} onClick={handleSync} disabled={syncing}>
            {syncing ? '⏳ Syncing...' : '🔄 Sync GitHub'}
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            ← Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
  sidebar: {
    width: 260,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    overflowY: 'auto',
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '24px 20px 16px',
    borderBottom: '1px solid var(--border)',
  },
  brandIcon: { fontSize: 24 },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: 900,
    background: 'linear-gradient(135deg, #bc8cff, #58a6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: 2,
  },
  userCard: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '2px solid var(--accent-purple)',
    objectFit: 'cover',
  },
  userInfo: { display: 'flex', flexDirection: 'column', gap: 4 },
  userName: { fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' },
  userMeta: { display: 'flex', gap: 8, fontSize: 12, fontFamily: 'var(--font-mono)' },
  xpSection: { display: 'flex', flexDirection: 'column', gap: 4 },
  xpLabel: { display: 'flex', justifyContent: 'space-between' },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 12px',
    gap: 4,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    fontWeight: 700,
    transition: 'all 0.2s ease',
    letterSpacing: 0.5,
  },
  navLinkActive: {
    background: 'rgba(188,140,255,0.12)',
    color: 'var(--accent-purple)',
    borderLeft: '3px solid var(--accent-purple)',
  },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  syncBtn: {
    width: '100%',
    padding: '9px',
    background: 'rgba(57,211,83,0.1)',
    color: 'var(--accent-green)',
    border: '1px solid rgba(57,211,83,0.3)',
    borderRadius: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  logoutBtn: {
    width: '100%',
    padding: '9px',
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  main: {
    marginLeft: 260,
    flex: 1,
    padding: '32px',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
};
