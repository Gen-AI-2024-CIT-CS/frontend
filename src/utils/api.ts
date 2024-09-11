import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getUsers = () => api.get('/users');
export const validUsers = () => api.get('auth/users');
export const logout = () => api.post('auth/logout');
export const login = (email: string, password: string) => api.post('/auth/login', { email, password });

export default api;