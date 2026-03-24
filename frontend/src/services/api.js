import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401, clear auth and redirect — BUT skip auth endpoints to avoid loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes('/api/auth/login') ||
      error.config?.url?.includes('/api/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

export const productAPI = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  getFeatured: () => api.get('/api/products/featured'),
  getCategories: () => api.get('/api/products/categories'),
  create: (product) => api.post('/api/products', product),
  update: (id, product) => api.put(`/api/products/${id}`, product),
  delete: (id) => api.delete(`/api/products/${id}`),
};

export const profileAPI = {
  get: () => api.get('/api/profile'),
  update: (data) => api.put('/api/profile', data),
  changePassword: (data) => api.put('/api/profile/password', data),
};

export default api;