/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0c',
          800: '#141416',
          700: '#18181a',
          600: '#28282c',
          500: '#666668',
        },
        accent: {
          primary: '#e4020d',
          hover: '#ff1a25',
          dark: '#310000',
          'dark-bg': '#1a0000',
          success: '#00c853',
          warning: '#ff9100',
          danger: '#ff1744',
        },
      },
      fontFamily: {
        pixel: ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}
