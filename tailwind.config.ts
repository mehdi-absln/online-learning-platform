import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '5.5rem'
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    },
    extend: {
      colors: {
        primary: '#EC5252',
        'primary-alt': '#ff4830',
        'dark-gray': '#191918'
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        antonio: ['Antonio', 'sans-serif']
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem'
      }
    }
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem'
          },
          '@screen lg': {
            paddingLeft: '2rem',
            paddingRight: '2rem'
          },
          '@screen xl': {
            paddingLeft: '3rem',
            paddingRight: '3rem'
          },
          '@screen 2xl': {
            paddingLeft: '5.5rem',
            paddingRight: '5.5rem'
          }
        }
      })
    }
  ]
} satisfies Config
