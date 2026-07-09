export default defineNuxtConfig({

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  ssr: true,

  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
          tagPriority: 100,
        },
      ],
    },
  },

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/app.css',
  ],

  routeRules: {
    '/auth': { redirect: '/auth/signin' },
    '/': { redirect: '/home' },
    '/home': { headers: { 'Cache-Control': 'no-store' } },
    // Course detail pages are static-friendly (no URL-driven filters) → safe to ISR.
    // The /courses list itself is intentionally NOT cached: its content is driven by
    // query-string filters (?categories=..&q=..), and an ISR/cache key on the path alone
    // would serve a stale filtered list. See course-service caching strategy.
    '/courses/**': { isr: true },
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
