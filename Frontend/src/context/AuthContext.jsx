// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  // Axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
  });

  // Add token to requests if it exists
  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Check token validity on mount
  useEffect(() => {
    const initAuth = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser({
              email: decoded.sub,
              name: decoded.name,
            });
          }
        } catch (error) {
          console.error('Invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Send OTP for registration/login
  const sendOtp = async (email) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/send-otp', {
        email: email
      });
      
      setTempEmail(email);
      setOtpSent(true);
      
      return {
        success: true,
        message: response.data.message,
        isExistingUser: response.data.isExistingUser === 'true'
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  // Verify OTP and register/login
  const verifyAndRegister = async (email, otp, name = null) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-register', {
        email: email,
        otp: otp,
        name: name
      });

      const { token, email: userEmail, name: userName, id, message } = response.data;

      // Save token and user data
      localStorage.setItem('token', token);
      setToken(token);
      setUser({
        email: userEmail,
        name: userName,
        id: id
      });
      setOtpSent(false);
      setTempEmail('');

      return {
        success: true,
        message: message,
        isNewUser: !name
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error(error.response?.data?.message || 'Verification failed');
    }
  };

  // Direct login for existing users
  const verifyLogin = async (email, otp) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-login', {
        email: email,
        otp: otp
      });

      const { token, email: userEmail, name, id, message } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser({
        email: userEmail,
        name: name,
        id: id
      });
      setOtpSent(false);
      setTempEmail('');

      return {
        success: true,
        message: message
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Traditional email/password login
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data === "Login successful") {
        // Get user details
        const userResponse = await axios.get(`http://localhost:8080/api/users?email=${credentials.email}`);
        const userData = userResponse.data.find(u => u.email === credentials.email);
        
        // Create a simple token (in production, your backend should return a real JWT)
        const mockToken = btoa(JSON.stringify({ 
          email: userData.email, 
          name: userData.name,
          id: userData.id 
        }));
        
        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        setUser({
          email: userData.email,
          name: userData.name,
          id: userData.id
        });

        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Register with email/password
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        contactNumber: userData.contactNumber
      });

      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setOtpSent(false);
    setTempEmail('');
  };

  // Check OTP status
  const checkOtpStatus = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/otp-status/${email}`);
      return response.data;
    } catch (error) {
      console.error('Check OTP status error:', error);
      throw new Error('Failed to check OTP status');
    }
  };

  const value = {
    user,
    token,
    loading,
    otpSent,
    tempEmail,
    sendOtp,
    verifyAndRegister,
    verifyLogin,
    login,
    register,
    logout,
    checkOtpStatus,
    axiosInstance,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export for the provider
export default AuthProvider;