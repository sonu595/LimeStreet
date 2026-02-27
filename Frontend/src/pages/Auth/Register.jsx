import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { FiUser, FiPhone, FiMail, FiLock, FiArrowRight, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';

const Register = ({ onToggle }) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
    await register({
      name: registerData.name,
      contactNumber: registerData.contactNumber,
      email: registerData.email,
      password: registerData.password
    });


      setSuccess(true);
      setLoading(false);
      
      // Show success message then redirect to login
      setTimeout(() => {
        onToggle();
      }, 3000);

    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const { register } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-100 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-96 h-96 bg-lime-300 rounded-full blur-3xl -top-20 -left-20"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute w-80 h-80 bg-lime-400 rounded-full blur-3xl -bottom-20 -right-20"
      />

      {/* Success Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FiCheckCircle className="w-10 h-10 text-lime-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to LimeStreet!</h3>
              <p className="text-gray-600">Your account has been created successfully. Redirecting to login...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Side - Registration Form */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 p-8 lg:p-12 order-2 lg:order-1"
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
                    <p className="text-lime-600 font-semibold">Creating your account...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-md mx-auto w-full">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <motion.div 
                      animate={{ scale: step >= i ? 1 : 0.8 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        step >= i 
                          ? 'bg-lime-600 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {i}
                    </motion.div>
                    {i < 2 && (
                      <div className={`w-16 h-1 mx-2 rounded ${
                        step > i ? 'bg-lime-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <motion.h1 
                key={step}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2"
              >
                {step === 1 ? 'Join LimeStreet' : 'Almost Done!'}
              </motion.h1>
              
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 mb-8"
              >
                {step === 1 
                  ? 'Start your fashion journey with us' 
                  : 'Secure your account with a password'}
              </motion.p>

              <AnimatePresence mode="wait">
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
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text"
                            name="name"
                            value={registerData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 focus:bg-white rounded-xl transition-all outline-none"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Contact Number
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="tel"
                            name="contactNumber"
                            value={registerData.contactNumber}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 focus:bg-white rounded-xl transition-all outline-none"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 focus:bg-white rounded-xl transition-all outline-none"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="password"
                            name="password"
                            value={registerData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 focus:bg-white rounded-xl transition-all outline-none"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="password"
                            name="confirmPassword"
                            value={registerData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 focus:bg-white rounded-xl transition-all outline-none"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex space-x-4">
                  {step === 2 && (
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-gray-400 transition-all"
                    >
                      Back
                    </motion.button>
                  )}
                  
                  <motion.button 
                    type={step === 2 ? "submit" : "button"}
                    onClick={() => step === 1 ? setStep(2) : null}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 bg-gradient-to-r from-lime-600 to-lime-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-lime-500/30 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <span>
                      {step === 1 ? 'CONTINUE' : loading ? 'CREATING...' : 'REGISTER'}
                    </span>
                    <FiArrowRight />
                  </motion.button>
                </div>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-center"
              >
                <p className="text-gray-500">
                  Already have an account?{' '}
                  <motion.button 
                    onClick={onToggle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-lime-600 font-semibold hover:underline ml-1"
                  >
                    Sign In
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Brand Showcase */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-1/2 bg-gradient-to-br from-lime-600 to-lime-500 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden order-1 lg:order-2"
          >
            {/* Animated Pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: [0, 360],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 15 + i * 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute w-32 h-32 border border-white rounded-3xl"
                  style={{
                    top: `${i * 12}%`,
                    right: `${i * 8}%`,
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
                Join the Style
              </motion.h2>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lime-100 text-lg mb-8"
              >
                Be the first to know about new collections and exclusive offers
              </motion.p>
            </div>

            {/* Perks List */}
            <div className="relative z-10 space-y-4">
              {[
                'Early access to sales',
                'Free shipping on first order',
                'Style tips & inspiration',
                'Member-only prices'
              ].map((text, index) => (
                <motion.div
                  key={text}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 text-white"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, delay: index * 0.5, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <span className="text-sm">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-20 -right-20 w-64 h-64 border-4 border-white/10 rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;