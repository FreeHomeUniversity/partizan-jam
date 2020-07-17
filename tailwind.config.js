module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        'screen-4': 'calc(100vh - 1rem)',
      }
    },
  },
  variants: {},
  plugins: [],
}
