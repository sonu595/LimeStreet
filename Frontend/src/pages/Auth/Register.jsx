// Register.jsx - Dark Theme with No Green Color
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShoppingBag, CheckCircle, Sparkles } from 'lucide-react';

const Register = ({ onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOtp, verifyAndRegister, loading: authLoading } = useAuth();
  const redirectTo = location.state?.from || '/';
  
  const [step, setStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!registerData.email) {
      setError('Please enter email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await sendOtp(registerData.email, 'register');
      setStep(2);
      startCountdown();
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!registerData.otp || registerData.otp.length !== 6) {
      setError('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await verifyAndRegister(
        registerData.email,
        registerData.otp,
        registerData.name || registerData.email.split('@')[0],
        registerData.contactNumber
      );
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    try {
      await sendOtp(registerData.email, 'register');
      startCountdown();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6 md:flex md:items-center md:justify-center">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl md:h-[calc(100dvh-3rem)] md:max-h-[760px]">
        {/* Mobile Background Image - Fixed */}
        <div className="absolute inset-0 md:hidden">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop"
            alt="Fashion Store"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col md:h-full md:flex-row">
          {/* Left Side - Form */}
          <div className="relative order-2 w-full bg-zinc-950/95 backdrop-blur-sm md:order-1 md:bg-zinc-950 md:flex md:h-full md:w-1/2 md:items-center md:p-12">
            <div className="w-full max-w-md mx-auto p-6 md:p-0 relative z-20">
              {/* Logo for mobile */}
              <div className="flex justify-center mb-8 md:hidden">
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {step === 1 ? 'Create Account' : 'Verify Your Email'}
                </h1>
                <p className="text-gray-400">
                  {step === 1 
                    ? 'Join LimeStreet today' 
                    : `We've sent a code to ${registerData.email}`}
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

              {success && (
                <div className="mb-6 p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Account created! Redirecting...
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input 
                        type="text"
                        name="name"
                        value={registerData.name}
                        onChange={handleChange}
                        placeholder="type your name"
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input 
                        type="tel"
                        name="contactNumber"
                        value={registerData.contactNumber}
                        onChange={handleChange}
                        placeholder="+91 ..."
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input 
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/15 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none text-white placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
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
                        name="otp"
                        value={registerData.otp}
                        onChange={handleChange}
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
                    disabled={loading || registerData.otp.length !== 6}
                    className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify & Register
                  </button>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCountdown > 0}
                      className="text-sm text-white/70 hover:text-white transition disabled:text-gray-600"
                    >
                      {resendCountdown > 0 
                        ? `Resend code in ${resendCountdown}s` 
                        : "Didn't receive code? Resend"}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button 
                    onClick={onToggle}
                    className="text-white font-semibold hover:text-gray-300 transition"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image (Desktop Only) */}
          <div className="hidden md:block md:h-full md:w-1/2 relative order-2">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop"
              alt="Fashion Store"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">Join the Style</h2>
              </div>
              <p className="text-white/80">Be the first to know about new collections</p>
              <div className="flex gap-2 mt-4">
                <Sparkles className="w-4 h-4 text-white/70" />
                <p className="text-sm text-white/60">Exclusive early access for members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
