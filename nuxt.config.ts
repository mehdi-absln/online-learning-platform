export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxt/eslint', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/fonts.css']
})
