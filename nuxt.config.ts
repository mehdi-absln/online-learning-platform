export default defineNuxtConfig({

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/app.css',
  ],

  routeRules: {
    '/auth': { redirect: '/auth/signin' },
    '/': { redirect: '/home' },
  },

  devServer: {
    host: 'localhost',
    port: 3000,
  },

  compatibilityDate: '2025-07-15',

  vite: {
    server: {
      hmr: {
        overlay: false,
      },
      watch: {
        usePolling: false,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.nuxt/**',
          '**/dist/**',
        ],
      },
    },
    optimizeDeps: {
      exclude: ['fsevents'],
    },
    // Fix for Windows path handling with virtual modules
    // https://github.com/nuxt/nuxt/issues/25941
    resolve: {
      preserveSymlinks: true,
    },
  },

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
    },
  },
})
