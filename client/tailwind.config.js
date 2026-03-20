/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--accent-bg)',
          100: 'var(--accent-bg)',
          200: 'var(--accent-bg)',
          300: 'var(--accent)',
          400: 'var(--accent)',
          500: 'var(--accent)',
          600: 'var(--accent-2)',
          700: 'var(--accent-2)',
          800: 'var(--accent-2)',
          900: 'var(--accent-2)',
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-2)',
          bg: 'var(--accent-bg)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          alt: 'var(--surface-2)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
        },
        outline: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        canvas: {
          DEFAULT: 'var(--bg)',
          alt: 'var(--bg-alt)',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
