// Login.jsx - Simple & Clean Design
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShoppingBag } from 'lucide-react';

const Login = ({ onToggle }) => {
  const navigate = useNavigate();
  const { sendOtp, verifyLogin, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await sendOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await verifyLogin(email, otp);
      if (result.success) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Left Side - Image */}
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop"
              alt="Fashion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
              <h2 className="text-3xl font-bold text-white mb-2">LimeStreet</h2>
              <p className="text-white/90">Where style meets comfort</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Logo for mobile */}
              <div className="flex justify-center mb-8 md:hidden">
                <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
                Welcome Back
              </h1>
              <p className="text-gray-500 mb-8 text-center md:text-left">
                {step === 1 ? 'Login to your account' : `Enter OTP sent to ${email}`}
              </p>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {(loading || authLoading) && (
                <div className="mb-6 p-3 bg-lime-50 border border-lime-200 rounded-lg text-lime-600 text-sm text-center">
                  {step === 1 ? 'Sending OTP...' : 'Verifying...'}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendOtp}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-lime-600 text-white py-3 rounded-lg font-semibold hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        maxLength="6"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                        required
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-lime-600 text-white py-3 rounded-lg font-semibold hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify & Login
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full mt-3 text-sm text-lime-600 hover:text-lime-700"
                  >
                    ← Back to email
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  New to LimeStreet?{' '}
                  <button 
                    onClick={onToggle}
                    className="text-lime-600 font-semibold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;