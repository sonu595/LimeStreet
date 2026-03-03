import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  verifyOtp: (data) => API.post('/auth/verify-otp', data),
  login: (data) => API.post('/auth/login', data),
  resendOtp: (email) => API.post(`/auth/resend-otp?email=${email}`),
  forgotPassword: (email) => API.post(`/auth/forgot-password?email=${email}`),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  refreshToken: (token) => API.post('/auth/refresh-token', token)
};