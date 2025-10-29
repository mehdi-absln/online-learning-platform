export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devServer: {
    host: 'localhost',
    port: 3000
  },
  routeRules: {
    '/auth': { redirect: '/auth/signin' },
    '/': { redirect: '/home' }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxt/eslint', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/fonts.css', '~/assets/css/app.css']
})
