/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
  });

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

  const clearAuthState = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setOtpSent(false);
    setTempEmail('');
  };

  const getUserFromStoredToken = (storedToken) => {
    try {
      const decoded = jwtDecode(storedToken);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return null;
      }

      return {
        email: decoded.sub || decoded.email || '',
        name: decoded.name || '',
        id: decoded.id,
      };
    } catch (jwtError) {
      try {
        const decoded = JSON.parse(atob(storedToken));

        return {
          email: decoded.email || '',
          name: decoded.name || '',
          id: decoded.id,
        };
      } catch (parseError) {
        console.error('Invalid token:', jwtError);
        console.error('Token parse fallback failed:', parseError);
        return null;
      }
    }
  };

  useEffect(() => {
    const initAuth = () => {
      if (token) {
        const parsedUser = getUserFromStoredToken(token);

        if (parsedUser) {
          setUser(parsedUser);
        } else {
          clearAuthState();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const sendOtp = async (email, purpose = 'login') => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/send-otp', {
        email: email,
        purpose: purpose
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
        isNewUser: Boolean(name)
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error(error.response?.data?.message || 'Verification failed');
    }
  };

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

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data === "Login successful") {
        const userResponse = await axios.get(`http://localhost:8080/api/users?email=${credentials.email}`);
        const userData = userResponse.data.find(u => u.email === credentials.email);

        if (!userData) {
          throw new Error('User details not found');
        }

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

      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

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

  const logout = () => {
    clearAuthState();
  };

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

export default AuthProvider;
