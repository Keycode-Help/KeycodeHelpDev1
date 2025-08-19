import React from "react";

export default function FormField({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  name, 
  placeholder, 
  required = false, 
  autoComplete,
  rightElement 
}) {
  return (
    <label className="block mb-3">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <div className="relative">
        <input 
          name={name} 
          type={type} 
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="mt-1 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500" 
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </label>
  );
}
