import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getUsers = () => api.get('/users');
export const validUsers = () => api.get('auth/users/role');
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    // Clear role from local storage
    localStorage.removeItem('user_role');
  } catch (error) {
    throw error;
  }
};
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      // Store role in local storage
      localStorage.setItem('user_role', response.data.role);
    }
    return response;
  } catch (error) {
    throw error;
  }
};
export const chat = (message: string) => api.post('/chat', { message });

export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const fetchAssignments = (courseID : string,dept:string) => api.get(`/assignments?courseID=${courseID}&dept=${dept}`);
export const fetchStudentsRegistered = (courseID : string,dept:string) => api.get(`/students?courseID=${courseID}&dept=${dept}`);
export const saveAssignment = async (formData: FormData) => {
  return fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: formData,
  });
};

export default api;