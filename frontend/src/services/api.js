import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || '/api';
let baseURL = rawBaseURL;
if (import.meta.env.VITE_API_URL) {
  const cleanUrl = rawBaseURL.replace(/\/+$/, '');
  baseURL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
}

const api = axios.create({
  baseURL,
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      // Only force-logout on actual auth endpoints or if no stored token exists at all
      const hasToken = !!localStorage.getItem('vg_token');
      const isAuthEndpoint = requestUrl.includes('/auth/');
      
      if (!hasToken || isAuthEndpoint) {
        console.warn("Unauthorized request. Clearing local session...");
        localStorage.removeItem('vg_token');
        localStorage.removeItem('vg_user');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
