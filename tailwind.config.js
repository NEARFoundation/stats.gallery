const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: Object.assign(defaultTheme.colors, {
      gray: colors.blueGray,
      green: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
      },
    }),
    fontFamily: Object.assign(defaultTheme.fontFamily, {
      sans: ["'DM Sans'", 'sans-serif'],
      display: ['Rubik', 'sans-serif'],
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
