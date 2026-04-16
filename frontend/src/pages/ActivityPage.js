import React, { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';

const TYPE_CONFIG = {
  COMMIT:       { icon: '💻', color: 'var(--accent-green)',  label: 'Commit' },
  PR_OPENED:    { icon: '🔀', color: 'var(--accent-blue)',   label: 'PR Opened' },
  PR_MERGED:    { icon: '✅', color: 'var(--accent-purple)', label: 'PR Merged' },
  ISSUE_OPENED: { icon: '🐛', color: 'var(--accent-orange)', label: 'Issue Opened' },
  ISSUE_CLOSED: { icon: '🔒', color: 'var(--accent-yellow)', label: 'Issue Closed' },
  CODE_REVIEW:  { icon: '👁️', color: 'var(--accent-cyan)',   label: 'Code Review' },
  STAR_GIVEN:   { icon: '⭐', color: 'var(--accent-yellow)', label: 'Starred' },
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('ALL');

  useEffect(() => {
    activityAPI.getAll()
      .then(r => setActivities(r.data))
      .finally(() => setLoading(false));
  }, []);

  const types = ['ALL', ...Object.keys(TYPE_CONFIG)];
  const filtered = filter === 'ALL'
    ? activities
    : activities.filter(a => a.type === filter);

  const totalXp = activities.reduce((s, a) => s + (a.xpEarned || 0), 0);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, animation:'float 2s ease-in-out infinite' }}>📡</div>
        <div style={{ fontFamily:'var(--font-mono)', color:'var(--accent-cyan)', marginTop:12 }}>
          Fetching activity...
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:860, animation:'slide-in 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:900, letterSpacing:2, marginBottom:4 }}>
          📡 ACTIVITY FEED
        </h1>
        <p style={{ color:'var(--text-secondary)', fontFamily:'var(--font-mono)', fontSize:12 }}>
          {activities.length} events tracked &nbsp;•&nbsp;
          <span style={{ color:'var(--accent-yellow)' }}>+{totalXp.toLocaleString()} XP</span> earned total
        </p>
      </div>

      {/* Summary chips */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:20 }}>
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const count = activities.filter(a => a.type === type).length;
          if (!count) return null;
          return (
            <div key={type} style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'6px 14px', borderRadius:999,
              background:`rgba(0,0,0,0.3)`, border:'1px solid var(--border)',
              fontFamily:'var(--font-mono)', fontSize:12,
            }}>
              <span>{cfg.icon}</span>
              <span style={{ color:cfg.color, fontWeight:700 }}>{count}</span>
              <span style={{ color:'var(--text-muted)' }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:20 }}>
        {types.map(t => {
          const cfg = TYPE_CONFIG[t];
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding:'6px 14px',
              borderRadius:999,
              border:`1px solid ${filter===t ? (cfg?.color||'var(--accent-purple)') : 'var(--border)'}`,
              background: filter===t ? `rgba(0,0,0,0.4)` : 'transparent',
              color: filter===t ? (cfg?.color||'var(--accent-purple)') : 'var(--text-secondary)',
              fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700,
              cursor:'pointer', transition:'all 0.2s',
              letterSpacing:0.5,
            }}>
              {cfg ? `${cfg.icon} ${t}` : '🌐 ALL'}
            </button>
          );
        })}
      </div>

      {/* Activity list */}
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🏜️</div>
            <p style={{ color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>
              No activity yet. Click "Sync GitHub" in the sidebar!
            </p>
          </div>
        ) : filtered.map((act, i) => {
          const cfg = TYPE_CONFIG[act.type] || { icon:'⚡', color:'var(--text-secondary)', label: act.type };
          return (
            <div key={act.id} style={{
              display:'flex', alignItems:'center', gap:14,
              padding:'14px 0',
              borderBottom:'1px solid var(--border)',
              animation:`slide-in 0.3s ease ${Math.min(i,15)*0.03}s both`,
            }}>
              {/* Icon bubble */}
              <div style={{
                width:38, height:38, borderRadius:'50%', flexShrink:0,
                background:`rgba(0,0,0,0.5)`,
                border:`1px solid ${cfg.color}40`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18,
              }}>
                {cfg.icon}
              </div>

              {/* Body */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{
                    fontSize:11, fontFamily:'var(--font-mono)', fontWeight:700,
                    color:cfg.color, letterSpacing:0.5,
                  }}>
                    {cfg.label}
                  </span>
                  <span style={{
                    fontSize:12, color:'var(--text-secondary)',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                    maxWidth:400,
                  }}>
                    {act.description}
                  </span>
                </div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3, fontFamily:'var(--font-mono)' }}>
                  📁 {act.repoName || '—'} &nbsp;•&nbsp; {timeAgo(act.occurredAt)}
                </div>
              </div>

              {/* XP badge */}
              <div style={{
                flexShrink:0,
                padding:'4px 10px', borderRadius:999,
                background:'rgba(227,179,65,0.1)',
                border:'1px solid rgba(227,179,65,0.25)',
                fontFamily:'var(--font-mono)', fontSize:12, fontWeight:700,
                color:'var(--accent-yellow)',
              }}>
                +{act.xpEarned} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
