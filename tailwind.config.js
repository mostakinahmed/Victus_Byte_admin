/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'rotate': 'rotate 2s linear infinite',
        'dash': 'dash 1.5s ease-in-out infinite',
      },
      keyframes: {
        rotate: {
          '100%': { transform: 'rotate(360deg)' },
        },
        dash: {
          '0%': { 'stroke-dasharray': '1, 150', 'stroke-dashoffset': '0' },
          '50%': { 'stroke-dasharray': '90, 150', 'stroke-dashoffset': '-35' },
          '100%': { 'stroke-dasharray': '90, 150', 'stroke-dashoffset': '-124' },
        },
      },
    },
  },
  plugins: [],
}