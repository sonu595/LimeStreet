// Login.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // This should now work
import { FiMail, FiLock, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

const Login = ({ onToggle, onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // This will now work

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData);
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-100 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-96 h-96 bg-lime-300 rounded-full blur-3xl -top-20 -right-20"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute w-80 h-80 bg-lime-400 rounded-full blur-3xl -bottom-20 -left-20"
      />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Side - Brand Showcase */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 bg-gradient-to-br from-lime-600 to-lime-500 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Animated Pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute w-64 h-64 border-2 border-white rounded-full"
                  style={{
                    top: `${i * 20}%`,
                    left: `${i * 15}%`,
                  }}
                />
              ))}
            </div>

            {/* Brand Content */}
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl"
              >
                <FiShoppingBag className="w-8 h-8 text-lime-600" />
              </motion.div>
              
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                LimeStreet
              </motion.h2>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lime-100 text-lg mb-8"
              >
                Where style meets comfort
              </motion.p>
            </div>

            {/* Floating Fashion Items Animation */}
            <div className="relative z-10 space-y-4">
              {['New Arrivals', 'Summer Collection', 'Limited Edition'].map((text, index) => (
                <motion.div
                  key={text}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 text-white"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm font-light">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Decorative Elements */}
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-1/2 p-8 lg:p-12"
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl"
                >
                  <div className="text-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-lime-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-lime-600 font-semibold">Welcome to LimeStreet...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-md mx-auto w-full">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2"
              >
                Welcome Back
              </motion.h1>
              
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 mb-8"
              >
                Log in to continue your style journey
              </motion.p>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 focus:bg-white rounded-xl transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 focus:bg-white rounded-xl transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>

                <motion.button 
                  type="submit"
                  disabled={loading}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-lime-600 to-lime-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-lime-500/30 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{loading ? 'LOGGING IN...' : 'LOG IN'}</span>
                  <motion.div
                    animate={{ x: loading ? [0, 5, 0] : 0 }}
                    transition={{ repeat: loading ? Infinity : 0, duration: 1 }}
                  >
                    <FiArrowRight />
                  </motion.div>
                </motion.button>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-center"
              >
                <p className="text-gray-500">
                  New to LimeStreet?{' '}
                  <motion.button 
                    onClick={onToggle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-lime-600 font-semibold hover:underline ml-1"
                  >
                    Create Account
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;