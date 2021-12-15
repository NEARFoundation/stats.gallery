const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./public/index.html', './src/**/*.{ts,js,json,vue,svg}'],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
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
      },
      fontFamily: {
        sans: ["'DM Sans'", 'sans-serif'],
        display: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
