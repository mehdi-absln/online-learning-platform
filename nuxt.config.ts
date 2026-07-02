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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Antonio:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: [
    '~/assets/css/app.css',
    'vue3-carousel/dist/carousel.css',
  ],

  routeRules: {
    '/auth': { redirect: '/auth/signin' },
    '/': { redirect: '/home' },
    '/home': { prerender: true },
    // Courses list API - no server-side cache due to dynamic query params
    // Caching handled client-side with useFetch key
    '/api/courses/filter-options': { cache: { maxAge: 3600 } }, // Static filter options
    '/api/blogs': { cache: { maxAge: 3600 } },
    '/api/blog-by-slug/**': { cache: { maxAge: 3600 } },
    '/api/course-by-slug/**': { cache: { maxAge: 3600 } },
    '/api/related-courses/**': { cache: { maxAge: 3600 } },
    // Lesson access check - no cache (user-specific access control)
    '/api/course-by-slug/**/lessons/**': { cache: false },
    // User progress - no cache (personal data)
    '/api/progress/**': { cache: false },
    // Dashboard - no cache (personal data)
    '/api/dashboard': { cache: false },
  },

  devServer: {
    host: 'localhost',
    port: 3000,
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'vercel',
    vercel: {
      functions: {
        maxDuration: 60,
      },
    },
    compressPublicAssets: true,
    minify: true,
  },
    },
    // بهینه‌سازی برای محیط Production
    compressPublicAssets: true,
    minify: true,
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-carousel': ['vue3-carousel'],
          },
        },
      },
    },
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
