import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      login(token)
        .then(() => navigate('/'))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-primary)'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16,animation:'spin 1s linear infinite'}}>⚙️</div>
        <div style={{fontFamily:'var(--font-mono)',color:'var(--accent-purple)',fontSize:16}}>
          Authenticating...
        </div>
      </div>
    </div>
  );
}
