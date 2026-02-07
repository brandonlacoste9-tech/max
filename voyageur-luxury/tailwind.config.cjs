/** @type {import('tailwindcss').Config} */
/** UI Pro Max design tokens — AI-Native, Bento, Glassmorphism */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        imperial: {
          red: '#8B0000',
          gold: '#C9A34F',
          white: '#F8F2E8',
          black: '#1C1917',
          dark: '#0C0A09',
        },
        // UI Pro Max AI-Native
        'ai-accent': '#6366F1',
        'ai-success': '#10B981',
        'user-bubble': '#E0E7FF',
        'ai-bubble': 'rgba(249, 250, 251, 0.12)',
      },
      fontFamily: {
        heading: ['Bodoni Moda', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      backgroundImage: {
        'imperial-gradient': 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A34F 0%, #8B0000 100%)',
      },
      // UI Pro Max: Bento grid, card radius, elevation
      borderRadius: {
        'bento': '20px',
        'bento-lg': '24px',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.1)',
        'elevation-2': '0 4px 6px rgba(0,0,0,0.1)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.1)',
        'elevation-4': '0 20px 40px rgba(0,0,0,0.15)',
      },
      backdropBlur: {
        'glass': '15px',
      },
      animation: {
        'typing-dot': 'typing-pulse 1.4s ease-in-out infinite both',
        'typing-dot-2': 'typing-pulse 1.4s ease-in-out 0.2s infinite both',
        'typing-dot-3': 'typing-pulse 1.4s ease-in-out 0.4s infinite both',
      },
      keyframes: {
        'typing-pulse': {
          '0%, 80%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
