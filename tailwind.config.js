/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        inmeta: {
          orange: '#E65124',
          greenDark: '#1E4737',
          greenMid: '#254D3E',
          greenBorder: '#2D5C4A',
          greenAccent: '#4BC586',
          greenText: '#9ECFBB',
        },
      },
    },
  },
  plugins: [],
};

