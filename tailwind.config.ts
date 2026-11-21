import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf3f5',
          100: '#fbe7eb',
          200: '#f7d3d9',
          300: '#f0b0bb',
          400: '#e38295',
          500: '#ce5771',
          600: '#b43a56',
          700: '#942a43',
          800: '#7d293e', // Primary Secret Petal Wine / Burgundy
          900: '#581124',
          950: '#340813',
          DEFAULT: '#7d293e',
        },
        rose: {
          50: '#fdf6f7',
          100: '#faebee',
          200: '#f6d9de',
          300: '#eebac4',
          400: '#e190a1',
          500: '#D48B9B', // Secret Petal Rose Petal
          600: '#b85167',
          700: '#9a3c50',
          800: '#813544',
          900: '#6f303c',
          DEFAULT: '#D48B9B',
        },
        blush: {
          50: '#fffbfb',
          100: '#fff5f7',
          200: '#fdf0f2',
          300: '#fae1e6',
          400: '#f5c6cf',
          500: '#eca5b3',
          DEFAULT: '#fff5f7',
        },
        ivory: {
          50: '#ffffff',
          100: '#FFFDFC',
          200: '#fbf7f2',
          300: '#f5eee3',
          DEFAULT: '#FFFDFC',
        },
        gold: {
          50: '#fbf9ee',
          100: '#f6f1d3',
          200: '#ece1a7',
          300: '#dec973',
          400: '#d0b047',
          500: '#D4AF37',
          DEFAULT: '#D4AF37',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-poppins)', 'Poppins', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        marquee: 'marquee 28s linear infinite',
        'pulse-slow': 'pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
