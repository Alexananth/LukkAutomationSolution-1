/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main.js",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'base-white': '#FFFFFF',
        'milky-white': '#E2DBCF',
        'primary-accent': '#75C4C4',
        'secondary-accent': '#B0FCFE',
        'soft-highlight': '#FFE5CD',
        'text-color': '#333333',
        'hover-effect': '#E2FDFE',
      },
      fontFamily: {
        barlow: ['"Barlow"', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '12px',
      }
    },
  },
  plugins: [],
}
