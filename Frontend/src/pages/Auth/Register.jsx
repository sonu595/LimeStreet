// Register.jsx - Simple & Clean Design
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';

const Register = ({ onToggle }) => {
  const navigate = useNavigate();
  const { sendOtp, verifyAndRegister, loading: authLoading } = useAuth();
  
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
          navigate('/', { replace: true });
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
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:flex md:items-center md:justify-center">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl md:h-[calc(100dvh-3rem)] md:max-h-[760px]">
        <div className="absolute inset-0 md:hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop"
            alt="Fashion Store"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-white/35" />
        </div>

        <div className="relative z-10 flex flex-col md:h-full md:flex-row">
          
          {/* Left Side - Form */}
          <div className="order-2 w-full bg-white/88 p-8 backdrop-blur-sm md:order-1 md:flex md:h-full md:w-1/2 md:items-center md:bg-white md:p-12 md:backdrop-blur-none">
            <div className="max-w-md mx-auto w-full">
              {/* Logo for mobile */}
              <div className="flex justify-center mb-8 md:hidden">
                <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
                {step === 1 ? 'Create Account' : 'Verify Your Email'}
              </h1>
              <p className="text-gray-500 mb-8 text-center md:text-left">
                {step === 1 
                  ? 'Join LimeStreet today' 
                  : `We've sent a code to ${registerData.email}`}
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

              {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Account created! Redirecting...
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendOtp}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="name"
                        value={registerData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="tel"
                        name="contactNumber"
                        value={registerData.contactNumber}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleChange}
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
                        name="otp"
                        value={registerData.otp}
                        onChange={handleChange}
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
                    disabled={loading || registerData.otp.length !== 6}
                    className="w-full bg-lime-600 text-white py-3 rounded-lg font-semibold hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify & Register
                  </button>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCountdown > 0}
                      className="text-sm text-lime-600 hover:text-lime-700 disabled:text-gray-400"
                    >
                      {resendCountdown > 0 
                        ? `Resend code in ${resendCountdown}s` 
                        : "Didn't receive code? Resend"}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Already have an account?{' '}
                  <button 
                    onClick={onToggle}
                    className="text-lime-600 font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden md:block md:h-full md:w-1/2 relative order-2">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop"
              alt="Fashion Store"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
              <h2 className="text-3xl font-bold text-white mb-2">Join the Style</h2>
              <p className="text-white/90">Be the first to know about new collections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
