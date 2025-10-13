export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  routeRules: {
    '/auth': { redirect: '/auth/signin' },
  },
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxt/eslint', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/fonts.css', '~/assets/css/app.css']
})
