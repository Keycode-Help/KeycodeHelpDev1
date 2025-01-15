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
    },
  },
  plugins: [],
};
