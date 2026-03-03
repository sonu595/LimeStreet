import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...props 
}) => {
  
  const variants = {
    primary: 'lg:bg-black lg:hover:bg-gray-800 lg:text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white',
    secondary: 'lg:bg-gray-200 lg:hover:bg-gray-300 lg:text-gray-900 bg-gray-200/20 hover:bg-gray-200/30 backdrop-blur-sm border border-gray-300/30 text-white',
    danger: 'lg:bg-red-600 lg:hover:bg-red-700 lg:text-white bg-red-600/20 hover:bg-red-600/30 backdrop-blur-sm border border-red-400/30 text-white',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm sm:text-base">Loading...</span>
        </span>
      ) : children}
    </motion.button>
  );
};

export default Button;