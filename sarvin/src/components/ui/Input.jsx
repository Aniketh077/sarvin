import React, { forwardRef } from 'react';


const Input = (
  ({ label, error, fullWidth = false, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const baseStyles = ' border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-[#2A4365] focus:outline-none focus:ring-1 focus:ring-[#2A4365]';
    const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
    const widthStyles = fullWidth ? 'w-full' : '';
    const iconLeftPadding = leftIcon ? 'pl-10' : '';
    const iconRightPadding = rightIcon ? 'pr-10' : '';

    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseStyles} ${errorStyles} ${widthStyles} ${iconLeftPadding} ${iconRightPadding}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;