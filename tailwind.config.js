/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#bae0ff',
          300: '#7cc0ff',
          400: '#369eff',
          500: '#1d4ed8',
          600: '#1e40af',
          700: '#1e3a8a',
          800: '#172554',
          900: '#0f172a',
          950: '#060d1f',
        },
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        amberGold: {
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.45)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.55)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.45)',
        'card-light': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'beacon': 'beacon 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        beacon: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.08)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
