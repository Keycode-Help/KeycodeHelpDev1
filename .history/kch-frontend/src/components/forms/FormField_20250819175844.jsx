import React from "react";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  error,
  name,
  placeholder,
  required = false,
  autoComplete,
  rightElement,
}) {
  return (
    <label className="block mb-8">
      <span className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </span>
      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border border-gray-600 bg-gray-800 py-3 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
            rightElement ? "pr-16" : "px-4"
          }`}
        />
        {rightElement && (
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-center w-6 h-6 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200 shadow-none">
              <div className="w-5 h-5 flex items-center justify-center password-toggle-icon">
                {rightElement}
              </div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <span className="block text-xs text-red-500 mt-2">{error}</span>
      )}
    </label>
  );
}
