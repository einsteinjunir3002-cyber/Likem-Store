/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: '#07080b',
        foreground: '#f1f5f9',
        card: '#0d0f17',
        border: 'rgba(212, 175, 55, 0.15)',
        gold: {
          50: '#fbf8ea',
          100: '#f5eecb',
          200: '#ecdc9a',
          300: '#e0c463',
          400: '#d4af37',
          500: '#b89124',
          600: '#946d1a',
          700: '#765217',
          800: '#634319',
          900: '#55381a',
        },
      },
    },
  },
  plugins: [],
};
