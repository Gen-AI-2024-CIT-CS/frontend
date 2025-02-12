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

export const fetchAssignments = (dept:string, courseID: string) => api.get(`/assignments?dept=${dept}&courseID=${courseID}`);
export const fetchStudentsRegistered = (dept:string) => api.get(`/students?dept=${dept}`);
export const saveAssignment = async (formData: FormData,courseID: string) => {
  return fetch("http://localhost:3001/api/uploadAssignments", {
    method: "POST",
    body: formData,
    headers: {
      'courseID': courseID
    },
    credentials:'include'
  });
};
export const saveStudents = async (formData: FormData,courseID:string) => {
  return fetch("http://localhost:3001/api/uploadStudents", {
    method: "POST",
    body: formData,
  });
}
export const saveCoursesEnrolled = async (formData: FormData,courseID:string) => {
  return fetch("http://localhost:3001/api/uploadCoursesEnrolled", {
    method: "POST",
    body: formData,
  });
}

export default api;