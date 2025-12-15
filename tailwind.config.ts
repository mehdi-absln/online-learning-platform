import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        'DEFAULT': '1rem',
        'sm': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        'primary': '#EC5252',
        'primary-alt': '#ff4830',
        'dark-gray': '#191918',
        'dark-divider': '#474746',
        'dark-surface': '#1F1F1E',
        'dark-bg': '#282828',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        antonio: ['Antonio', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
      },
    },
  },
  plugins: [],
} satisfies Config
