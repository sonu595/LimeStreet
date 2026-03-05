import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Navbar from '../layout/Navbar';

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

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      
      <div className="flex-1 flex relative">
        {/* Background Image - Mobile */}
        <div className="absolute inset-0 lg:hidden">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Fashion Model"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Left Side Image - Desktop */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Fashion Model"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent"></div>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-12 left-12 text-white z-10"
          >
            <h1 className="text-5xl font-light mb-4">Verify Email</h1>
            <p className="text-xl text-gray-200 font-light">One last step</p>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-2">Enter OTP</h2>
              <p className="text-gray-500">Code sent to {email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="mt-8 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Didn't receive code?{' '}
                <Link
                  to="/register"
                  className="font-medium text-black hover:underline"
                >
                  Resend
                </Link>
              </p>
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-black transition-colors block"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyOTP;