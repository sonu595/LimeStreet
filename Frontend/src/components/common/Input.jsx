import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="space-y-1 sm:space-y-1.5">
      {label && (
        <label className="block text-xs sm:text-sm font-medium lg:text-gray-700 text-white/90">
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base
          transition-all duration-200
          lg:bg-white lg:text-gray-900 lg:border-gray-300 lg:focus:ring-black lg:focus:border-black
          bg-white/20 backdrop-blur-sm text-white placeholder:text-white/50 border-white/30 focus:ring-white focus:border-white
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          focus:outline-none focus:ring-1
        `}
        {...props}
      />
      
      {error && (
        <p className="text-xs sm:text-sm lg:text-red-600 text-red-300">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;