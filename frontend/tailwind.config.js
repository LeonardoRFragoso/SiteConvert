/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8257E5', // Roxo escuro
        secondary: '#996DFF', // Roxo claro
        background: '#121214', // Cinza escuro
        textPrimary: '#FFFFFF', // Branco
        textSecondary: '#A8A8B3', // Cinza claro
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'], // Fontes utilizadas
      },
    },
  },
  plugins: [],
};
