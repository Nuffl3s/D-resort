  /** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lemon: ['Lemon', 'cursive'], 
      },
      keyframes: {
        'spinner-wave': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        'spinner-wave': 'spinner-wave 1s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
