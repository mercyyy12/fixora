import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fixora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAuthRoute = err.config.url?.includes('/auth/login') || err.config.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('fixora_token');
        localStorage.removeItem('fixora_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;
