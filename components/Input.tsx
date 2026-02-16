import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, multiline, className = '', ...props }) => {
  const baseInputStyles = "block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2 border transition-colors";
  const errorStyles = "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";

  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {multiline ? (
          <textarea
            className={`${baseInputStyles} ${error ? errorStyles : ''} ${className}`}
            rows={3}
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
          />
        ) : (
          <input
            className={`${baseInputStyles} ${error ? errorStyles : ''} ${className}`}
            {...props as React.InputHTMLAttributes<HTMLInputElement>}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
