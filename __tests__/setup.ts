import { vi } from 'vitest'

/**
 * Global test setup
 *
 * Provides a safe default `$fetch` stub so that auth middleware
 * (`app/middleware/auth.global.ts`) and the user store
 * (`app/stores/user.ts` → `fetchUser`) don't trigger real network calls
 * during tests. Without this, every test running in the `nuxt` environment
 * logs `Failed to fetch user: FetchError: [GET] "/api/auth/me": 404 ...`.
 *
 * Endpoints that should resolve "logged out" return `{ success: false }`
 * so middleware logic proceeds without warning. Any other URL returns an
 * empty successful response as a safe fallback.
 *
 * Tests that need their own `$fetch` behavior (e.g. `auth.test.ts`,
 * `user-store.test.ts`, `lesson-progress.test.ts`) can still call
 * `vi.stubGlobal('$fetch', ...)` themselves — the last stub wins, and no
 * test calls `vi.unstubAllGlobals`, so per-file overrides stay intact.
 */
const defaultMockFetch = vi.fn().mockImplementation(async (url: string | URL | unknown) => {
  const path = typeof url === 'string' ? url : String(url ?? '')

  // Auth / enrollment endpoints: respond "logged out" so the global
  // middleware and store do not log errors.
  if (path === '/api/auth/me' || path.startsWith('/api/auth/me')) {
    return { success: false }
  }
  if (path === '/api/enrollments/my' || path.startsWith('/api/enrollments/my')) {
    return { success: true, data: { enrollments: [] } }
  }

  // Generic safe fallback for any other endpoint.
  return { success: true, data: {} }
})

vi.stubGlobal('$fetch', defaultMockFetch)
