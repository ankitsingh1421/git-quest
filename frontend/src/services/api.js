import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('gq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gq_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (window.location.hostname === 'localhost' && window.location.port === '3000' ? 'http://localhost:8080' : '');

export const authAPI = {
  getMe: () => API.get('/auth/me'),
  sync: () => API.post('/auth/sync'),
  loginWithGitHub: () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/github`;
  },
};

export const activityAPI = {
  getAll: () => API.get('/activities'),
};

export const badgeAPI = {
  getAll: () => API.get('/badges'),
};

export const questAPI = {
  getAll: () => API.get('/quests'),
  getActive: () => API.get('/quests/active'),
};

export const leaderboardAPI = {
  getTop: () => API.get('/leaderboard'),
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAllRead: () => API.post('/notifications/read-all'),
};

export default API;
