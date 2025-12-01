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
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
        trailingComma: 'none'
      }
    }
  },
  css: ['~/assets/css/fonts.css', '~/assets/css/app.css']
})
