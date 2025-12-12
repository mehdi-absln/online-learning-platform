export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxt/eslint', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  devtools: { enabled: true },
  css: ['~/assets/css/fonts.css', '~/assets/css/app.css'],
  routeRules: {
    '/auth': { redirect: '/auth/signin' },
    '/': { redirect: '/home' },
  },
  devServer: {
    host: 'localhost',
    port: 3000,
  },
  compatibilityDate: '2025-07-15',
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
