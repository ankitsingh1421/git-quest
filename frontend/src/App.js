import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import BadgesPage from './pages/BadgesPage';
import QuestsPage from './pages/QuestsPage';
import ActivityPage from './pages/ActivityPage';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-primary)'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16,animation:'float 2s ease-in-out infinite'}}>🎮</div>
        <div style={{fontFamily:'var(--font-mono)',color:'var(--accent-purple)'}}>Loading GitQuest...</div>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="badges" element={<BadgesPage />} />
            <Route path="quests" element={<QuestsPage />} />
            <Route path="activity" element={<ActivityPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
