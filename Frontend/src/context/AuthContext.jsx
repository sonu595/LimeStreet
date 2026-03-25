/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext(null)

const API_BASE_URL = 'http://localhost:8080/api'
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
})

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

const parseStoredToken = (storedToken) => {
  if (!storedToken) {
    return null
  }

  try {
    const decoded = jwtDecode(storedToken)

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null
    }

    return {
      email: decoded.sub || decoded.email || '',
      name: decoded.name || '',
      id: decoded.id,
      role: decoded.role || 'CUSTOMER'
    }
  } catch (jwtError) {
    try {
      const decoded = JSON.parse(atob(storedToken))

      return {
        email: decoded.email || '',
        name: decoded.name || '',
        id: decoded.id,
        role: decoded.role || 'CUSTOMER'
      }
    } catch (parseError) {
      console.error('Invalid token:', jwtError)
      console.error('Token parse fallback failed:', parseError)
      return null
    }
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [otpSent, setOtpSent] = useState(false)
  const [tempEmail, setTempEmail] = useState('')

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete axiosInstance.defaults.headers.common.Authorization
    }
  }, [token])

  const clearAuthState = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setOtpSent(false)
    setTempEmail('')
    delete axiosInstance.defaults.headers.common.Authorization
  }

  const applyAuthResponse = (authResponse) => {
    const {
      token: nextToken,
      email,
      name,
      id,
      role,
      contactNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      createdAt
    } = authResponse

    localStorage.setItem('token', nextToken)
    setToken(nextToken)
    setUser({
      email,
      name,
      id,
      role,
      contactNumber: contactNumber || '',
      addressLine1: addressLine1 || '',
      addressLine2: addressLine2 || '',
      city: city || '',
      state: state || '',
      postalCode: postalCode || '',
      country: country || 'India',
      createdAt
    })
    setOtpSent(false)
    setTempEmail('')
  }

  const refreshCurrentUser = async (fallbackUser = null, tokenOverride = null) => {
    const activeToken = tokenOverride || token

    if (!activeToken) {
      if (fallbackUser) {
        setUser(fallbackUser)
        return fallbackUser
      }

      return null
    }

    try {
      const response = await axiosInstance.get('/users/me', {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      })
      setUser(response.data)
      return response.data
    } catch (error) {
      if (fallbackUser) {
        setUser(fallbackUser)
        return fallbackUser
      }

      throw error
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      const parsedUser = parseStoredToken(token)

      if (!parsedUser) {
        clearAuthState()
        setLoading(false)
        return
      }

      setUser(parsedUser)

      try {
        await refreshCurrentUser(parsedUser)
      } catch (error) {
        console.error('Unable to refresh current user:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [token])

  const sendOtp = async (email, purpose = 'login') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        email,
        purpose
      })

      setTempEmail(email)
      setOtpSent(true)

      return {
        success: true,
        message: response.data.message,
        isExistingUser: response.data.isExistingUser === 'true'
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      throw new Error(error.response?.data?.message || 'Failed to send OTP')
    }
  }

  const verifyAndRegister = async (email, otp, name = null, contactNumber = '') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-register`, {
        email,
        otp,
        name,
        contactNumber
      })

      applyAuthResponse(response.data)
      await refreshCurrentUser(response.data, response.data.token)

      return {
        success: true,
        message: response.data.message,
        isNewUser: Boolean(name)
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw new Error(error.response?.data?.message || 'Verification failed')
    }
  }

  const verifyLogin = async (email, otp) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-login`, {
        email,
        otp
      })

      applyAuthResponse(response.data)
      await refreshCurrentUser(response.data, response.data.token)

      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/password-login`, {
        email: credentials.email,
        password: credentials.password
      })

      applyAuthResponse(response.data)
      await refreshCurrentUser(response.data, response.data.token)

      return { success: true }
    } catch (error) {
      console.error('Password login error:', error)
      throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        contactNumber: userData.contactNumber
      })

      return {
        success: true,
        user: response.data
      }
    } catch (error) {
      console.error('Register error:', error)
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const updateProfile = async (payload) => {
    try {
      const response = await axiosInstance.put('/users/me', payload)
      setUser(response.data)
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const logout = () => {
    clearAuthState()
  }

  const checkOtpStatus = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/otp-status/${email}`)
      return response.data
    } catch (error) {
      console.error('Check OTP status error:', error)
      throw new Error('Failed to check OTP status')
    }
  }

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
    refreshCurrentUser,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
