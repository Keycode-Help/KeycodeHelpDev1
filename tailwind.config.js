/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0b41e4',    // Deep Blue
        success: '#4ae66c',    // Vibrant Green
        cta: '#FFCE20',        // Gold
        dark: '#000000',       // Black
        slate: '#213341',      // Slate Gray
        'primary-light': '#2255f5',
        'success-light': '#5df77f',
        'cta-light': '#FFD84D', // Lighter gold
        'slate-light': '#2a4155',
      },
      backgroundColor: {
        dark: '#000000',
      },
    },
  },
  plugins: [],
} 