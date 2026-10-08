import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25',
  secondary: 'bg-dark-800 text-white dark:bg-dark-100 dark:text-dark-900 hover:bg-dark-700',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
  ghost: 'text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800',
  danger: 'bg-error-500 text-white hover:bg-red-600',
  gradient: 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/25',
  glass: 'glass text-white hover:bg-white/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
  xl: 'px-10 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="text-lg" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="text-lg" />}
    </motion.button>
  );
}
