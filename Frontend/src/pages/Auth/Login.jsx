// Login.jsx - Dark Theme with No Green Color
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

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
      await sendOtp(email, 'login');
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
    <div className="min-h-screen bg-black px-4 py-6 md:flex md:items-center md:justify-center">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl md:h-[calc(100dvh-3rem)] md:max-h-190">
        {/* Mobile Background Image - Fixed */}
        <div className="absolute inset-0 md:hidden">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop"
            alt="Fashion"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col md:h-full md:flex-row">
          {/* Left Side - Image (Desktop Only) */}
          <div className="hidden md:block md:h-full md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop"
              alt="Fashion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">LimeStreet</h2>
              </div>
              <p className="text-white/80">Where style meets comfort</p>
              <div className="flex gap-2 mt-4">
                <Sparkles className="w-4 h-4 text-white/70" />
                <p className="text-sm text-white/60">Premium fashion since 2024</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative w-full bg-zinc-950/95 backdrop-blur-sm md:bg-zinc-950 md:flex md:h-full md:w-1/2 md:items-center md:p-12">
            <div className="w-full max-w-md mx-auto p-6 md:p-0 relative z-20">
              {/* Logo for mobile */}
              <div className="flex justify-center mb-8 md:hidden">
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-400">
                  {step === 1 ? 'Login to your account' : `Enter OTP sent to ${email}`}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {(loading || authLoading) && (
                <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm text-center">
                  {step === 1 ? 'Sending OTP...' : 'Verifying...'}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input 
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        maxLength="6"
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white text-center text-2xl tracking-widest placeholder-gray-500"
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
                    className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify & Login
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full mt-2 text-sm text-white/70 hover:text-white transition"
                  >
                    ← Back to email
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  New to LimeStreet?{' '}
                  <button 
                    onClick={onToggle}
                    className="text-white font-semibold hover:text-gray-300 transition"
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