import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080',
  withCredentials: true
});

// Helper to read cookie value by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// Attach Authorization header from access_token cookie if present
instance.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  const url = (config.url || '').toString();
  const skipAuthHeader = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/admin-register');
  if (!skipAuthHeader) {
    const token = getCookie('access_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
