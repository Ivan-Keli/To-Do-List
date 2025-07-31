import React from 'react';
import { clsx } from 'clsx';

const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className = '',
  placeholder = 'Select an option',
  ...props
}, ref) => {
  const selectClasses = clsx(
    'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm',
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
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
      <select ref={ref} className={selectClasses} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
