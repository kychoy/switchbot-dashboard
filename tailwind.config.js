/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // App Router pages and layouts
    './pages/**/*.{js,ts,jsx,tsx}',     // (optional) if you use Pages Router
    './components/**/*.{js,ts,jsx,tsx}' // Any shared components
  ],
  theme: {
    extend: {
      // You can customize your design system here (colors, fonts, spacing, etc.)
    },
  },
  plugins: [],
};
