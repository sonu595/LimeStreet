import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:8080"
});

export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    verifyOtp: (data) => API.post('/auth/verify-otp', data),
    resendOtp: (email) => API.post('/auth/resend-otp', { email }),
    forgetPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (data) => API.post('/auth/reset-password', data),
    refreshToken: (token) => API.post('/auth/refresh-token', { token })
}