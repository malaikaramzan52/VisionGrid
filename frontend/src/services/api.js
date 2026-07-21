import axios from 'axios';

// Default deployed backend URL fallback for Visiongrid
const DEFAULT_BACKEND_URL = 'https://vision-grid-m76v.vercel.app/api';

const rawBaseURL = import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL;
let baseURL = rawBaseURL;

if (rawBaseURL.startsWith('http')) {
  const cleanUrl = rawBaseURL.replace(/\/+$/, '');
  baseURL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
} else {
  baseURL = '/api';
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      const hasToken = !!localStorage.getItem('vg_token');
      const isAuthEndpoint = requestUrl.includes('/auth/');

      if (!hasToken || isAuthEndpoint) {
        console.warn('Unauthorized request. Clearing local session...');
        localStorage.removeItem('vg_token');
        localStorage.removeItem('vg_user');
        if (
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/signup')
        ) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
