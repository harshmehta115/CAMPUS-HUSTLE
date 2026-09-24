/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#05070f',
          900: '#080c1a',
          800: '#0d1224',
          700: '#111827',
          600: '#1a2340',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        neon: {
          green: '#22c55e',
          purple: '#a855f7',
          blue: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #05070f 0%, #0d0a1f 50%, #050d1f 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(59,130,246,0.05) 100%)',
        'button-gradient': 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
        'accent-gradient': 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(168,85,247,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(168,85,247,0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'purple-glow': '0 0 30px rgba(168,85,247,0.3)',
        'blue-glow': '0 0 30px rgba(59,130,246,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(168,85,247,0.2)',
      },
    },
  },
  plugins: [],
}
