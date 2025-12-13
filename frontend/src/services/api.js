import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Items - FIXED VERSION
export const createItem = (data) => {
  console.log('Sending item data:', data); // Debug log
  return api.post('/items', data);
};

export const getItems = (params) => api.get('/items', { params });
export const getItemById = (id) => api.get(`/items/${id}`);

// Search
export const naturalSearch = (query) => api.post('/search/natural', { query });

export default api;