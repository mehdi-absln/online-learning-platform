import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./__tests__/setup.ts'],
    // Memory-friendly defaults: one worker at a time, lighter allocator,
    // isolated isolation so a single OOM doesn't take down the whole suite.
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        maxThreads: 1,
        minThreads: 1,
      },
    },
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
