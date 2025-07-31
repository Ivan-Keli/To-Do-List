import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const inputClasses = clsx(
    'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm',
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
    'placeholder-gray-500 dark:placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed',
    error && 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
