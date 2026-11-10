/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0E14',
          card: '#141A23',
          surface: '#1C2431',
          border: '#2A3447',
          hover: '#222C3D',
        },
        brand: {
          emerald: '#00E599',
          crimson: '#FF4655',
          gold: '#F5A623',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Rajdhani', 'Teko', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -5px rgba(0, 229, 153, 0.4)',
        'glow-crimson': '0 0 20px -5px rgba(255, 70, 85, 0.4)',
        'glow-gold': '0 0 20px -5px rgba(245, 166, 35, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

