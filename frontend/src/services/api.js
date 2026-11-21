import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ────────────────────────────────────────────────
export const signup = (data) => api.post('/auth/signup', data);
export const login  = (data) => api.post('/auth/login', data);
export const getMe  = ()     => api.get('/auth/me');

// ── Jobs ────────────────────────────────────────────────
export const getJobs       = (params = {}) => api.get('/jobs', { params });
export const createJob     = (data)        => api.post('/jobs', data);
export const updateJob     = (id, data)    => api.put(`/jobs/${id}`, data);
export const deleteJob     = (id)          => api.delete(`/jobs/${id}`);
export const updateStatus  = (id, status)  => api.patch(`/jobs/${id}/status`, { status });
export const updateTags    = (id, tags)    => api.patch(`/jobs/${id}/tags`, { tags });
export const updateReminder = (id, followUpDate) =>
  api.patch(`/jobs/${id}/reminder`, { followUpDate });

export default api;
