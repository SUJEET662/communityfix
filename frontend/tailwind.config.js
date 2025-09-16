/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2c7be5",
        secondary: "#00d97e",
        dark: "#283e59",
        light: "#f8f9fa",
        gray: {
          100: "#f8f9fa",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
        },
        danger: "#e63757",
        warning: "#f6c343",
      },
    },
  },
  plugins: [],
};
