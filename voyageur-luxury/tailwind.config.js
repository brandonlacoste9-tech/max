/** @type {import('tailwindcss').Config} */
export default {
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
        }
      },
      fontFamily: {
        heading: ['Bodoni Moda', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      backgroundImage: {
        'imperial-gradient': 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A34F 0%, #8B0000 100%)',
      }
    },
  },
  plugins: [],
}
