import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-dark-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700
            rounded-xl text-dark-900 dark:text-dark-100 placeholder-dark-400 dark:placeholder-dark-500
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            transition-all duration-200
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-error-500 focus:ring-error-500/50 focus:border-error-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-error-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
