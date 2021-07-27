const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: Object.assign(defaultTheme.colors, {
      gray: colors.blueGray,
      green: colors.green,
    }),
    fontFamily: Object.assign(defaultTheme.fontFamily, {
      sans: ["'DM Sans'", 'sans-serif'],
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
