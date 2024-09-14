import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = () => api.get('/users');
export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const fetchAssignments = (courseID : string,dept:string) => api.get(`/assignments?courseID=${courseID}&dept=${dept}`);
export const fetchStudentsRegistered = (courseID : string,dept:string) => api.get(`/students?courseID=${courseID}&dept=${dept}`);
export default api;