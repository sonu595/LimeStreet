import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const { verifyOtp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP');
      return;
    }
    const result = await verifyOtp(email, otp);
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image - Mobile me dikhega */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Fashion Model"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Left Side Image - Desktop me dikhega */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Fashion Model"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Verify Your Email</h1>
          <p className="text-xl text-gray-200">One last step to join us</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl lg:bg-white bg-white/10 backdrop-blur-md border lg:border-gray-200 border-white/20"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 lg:text-gray-900 text-white">
              Verify OTP
            </h2>
            <p className="text-sm sm:text-base lg:text-gray-600 text-white/80">
              Enter the 6-digit code sent to
            </p>
            <p className="font-semibold mt-1 text-sm sm:text-base break-all lg:text-gray-900 text-white">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="OTP Code"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError('');
              }}
              placeholder="Enter 6-digit OTP"
              error={error}
              maxLength="6"
            />

            <Button type="submit" loading={loading} variant="primary">
              Verify Email
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm lg:text-gray-600 text-white/80">
              Didn't receive code?{' '}
              <Link
                to="/register"
                className="font-semibold hover:underline lg:text-gray-900 text-white"
              >
                Resend
              </Link>
            </p>
            <Link
              to="/login"
              className="text-xs sm:text-sm transition-colors block lg:text-gray-600 lg:hover:text-gray-900 text-white/80 hover:text-white"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;