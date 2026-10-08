export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    premium: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
