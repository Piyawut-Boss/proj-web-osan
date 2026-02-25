import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
});

// Attach JWT token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Helper function to convert relative image paths to absolute URLs
// Uses Vite proxy, so /uploads paths go through proxy to backend
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  // Return paths that work with Vite proxy: /uploads/... → backend through proxy
  if (!imagePath.startsWith('/')) return `/${imagePath}`;
  return imagePath;
};

export default api;