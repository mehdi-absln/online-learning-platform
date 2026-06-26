import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./__tests__/setup.ts'],
    environmentOptions: {
      nuxt: {
        rootDir: './',
        overrides: {
          vite: {
            ssr: {
              noExternal: ['@vueuse/core'],
            },
          },
          experimental: {
            appManifest: false,
          },
        },
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    onConsoleLog(log, type) {
      if (
        type === 'stderr'
        && (log.includes('Page not found: /')
          || log.includes('No match found for location with path'))
      ) {
        return false
      }
    },
  },
})
