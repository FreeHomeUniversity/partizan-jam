module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    typography: {
      default: {
        css: {
          color: 'var(--color)',
          a: {
            color: '#a21b20',
            '&:hover': {
              color: '#2e447f',
            },
          },
        },
      },
    },
    extend: {
      colors: {
        'theme-red': {
          '100': '#f5d3d4',
          '200': '#eaa7a9',
          '300': '#e07a7e',
          '400': '#d54e53',
          '500': '#cb2228',
          '600': '#a21b20',
          '700': '#7a1418',
          '800': '#510e10',
          '900': '#290708',
        },
        'theme-blue': {
          '100': '#d8ddec',
          '200': '#b0bbd8',
          '300': '#8999c5',
          '400': '#6177b2',
          '500': '#3a559e',
          '600': '#2e447f',
          '700': '#23335f',
          '800': '#17223f',
          '900': '#0c1120',
        },
      },
      fontSize: {
        'heading-1': 'clamp(2rem, 2.5em, 3rem)',
        'heading-2': 'clamp(1.125rem, 1.5em, 1.875rem)',
        'heading-3': 'clamp(0.875rem, 1.125em, 1.5rem)',
      },
      height: {
        'screen-4': 'calc(100vh - 1rem)',
      },
      gridTemplateColumns: {
        text: 'minmax(0, 1fr) minmax(65ch, 2fr) minmax(0, 1fr)',
      },
    },
  },
  variants: {
    typography: ['responsive'],
  },
  plugins: [require('@tailwindcss/typography')],
}
