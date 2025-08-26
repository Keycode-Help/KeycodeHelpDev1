/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: "#0b41e4",
        "primary-light": "#3d6bff",
        "primary-dark": "#0729a3",

        // Secondary Colors
        secondary: "#213341",
        "secondary-light": "#3a4f5f",
        "secondary-dark": "#1a2a35",

        // Accent Colors
        accent: "#ffce20",
        "accent-light": "#ffd84d",
        "accent-dark": "#e6b800",

        // Status Colors
        success: "#4ae66c",
        "success-light": "#6bff8a",
        "success-dark": "#3bc55a",

        warning: "#ffa726",
        "warning-light": "#ffb74d",
        "warning-dark": "#f57c00",

        error: "#f44336",
        "error-light": "#ef5350",
        "error-dark": "#d32f2f",

        info: "#2196f3",
        "info-light": "#42a5f5",
        "info-dark": "#1976d2",

        // Neutral Colors
        dark: "#000000",
        slate: "#213341",

        // Surface Colors
        surface: "#0a0a0a",
        "surface-light": "#1a1a1a",
        "surface-dark": "#050505",
      },
    },
  },
  plugins: [],
};
