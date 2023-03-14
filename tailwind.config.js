// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      black: '#1d1d1d',
      white: '#fafafa',
      gray: colors.slate,
      skyPrimary: {
        ...colors.sky,
        light: colors.sky[200],
        DEFAULT: colors.sky[600],
        dark: colors.sky[900],
      },
      yellowAccent: {
        ...colors.yellow,
        light: colors.yellow[100],
        default: colors.yellow[200],
        dark: colors.yellow[300],
      }
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
