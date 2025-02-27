/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0b41e4",
        success: "#4ae66c",
        cta: "#ffce20",
        dark: "#000000",
        slate: "#213341",
      },
      screens: {      
      // Custom additional breakpoints
      'xs': '360px',      // Extra small (small mobile - 360x640)
      'phone': '375px',   // iPhone X/11 Pro/12 mini (375x812)
      'phone-lg': '414px', // iPhone XR/11/11 Pro Max (414x896)
      'tablet-sm': '810px', // iPad Mini/Air portrait (810x1080)
      'fhd': '1920px',    // Full HD (1920x1080)
      'qhd': '2560px',    // QHD (2560x1440)
      },
    },
  },
  plugins: [],
};
