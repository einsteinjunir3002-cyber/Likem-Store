/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '400px',   // Extra small — phones wider than 400px
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: '#050508',
        foreground: '#eef1f8',
        card: '#0c0e18',
        gold: {
          50: '#fdf8e8',
          100: '#f9edca',
          200: '#f5e4ab',
          300: '#e8c97a',
          400: '#d4af37',
          500: '#b8902a',
          600: '#946d1a',
          700: '#765217',
          800: '#634319',
          900: '#55381a',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f0e09a 0%, #d4af37 40%, #b8902a 70%, #c49830 100%)',
        'gold-gradient-subtle': 'linear-gradient(130deg, #ffffff 0%, #f0e2b8 40%, #d4af37 70%, #b8902a 100%)',
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        fadeInUp: 'fadeInUp 0.7s ease-out forwards',
        float: 'float 4s ease-in-out infinite',
        goldPulse: 'goldPulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.10)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.22)' },
        },
      },
      boxShadow: {
        'gold-sm': '0 2px 12px rgba(212, 175, 55, 0.20)',
        'gold-md': '0 4px 24px rgba(212, 175, 55, 0.30)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.40)',
        'luxury': '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(212, 175, 55, 0.15)',
      },
      scale: {
        '108': '1.08',
        '110': '1.10',
        '115': '1.15',
      },
    },
  },
  plugins: [],
};
