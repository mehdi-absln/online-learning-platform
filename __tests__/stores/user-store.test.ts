import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '~/stores/user'
import type { User } from '~/types/auth'
import type { ApiResponse } from '~/types/api'

// Mock $fetch globally (used by the store via Nuxt auto-import)
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock the useToast composable (auto-imported inside the store)
const toast = {
  success: vi.fn(),
  error: vi.fn(),
  showLoginRequired: vi.fn(),
}
vi.mock('~/composables/useToast', () => ({
  useToast: () => toast,
}))

// Mock the cart store to avoid pulling in real fetch/cookies
vi.mock('~/stores/cart', () => ({
  useCartStore: () => ({
    mergeGuestCart: vi.fn().mockResolvedValue(undefined),
  }),
}))

const mockUser: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'student',
} as User

describe('User Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)
    mockFetch.mockReset()
    vi.clearAllMocks()
  })

  it('initializes with correct state', () => {
    const userStore = useUserStore()

    expect(userStore.user).toBeNull()
    expect(userStore.isAuthenticated).toBe(false)
    expect(userStore.loading).toBe(false)
    expect(userStore.error).toBeNull()
    expect(userStore.hasError).toBe(false)
  })

  it('sets user and authenticates through signIn', async () => {
    const response: ApiResponse<{ user: User }> = {
      success: true,
      data: { user: mockUser },
      message: 'Signed in successfully',
    }
    mockFetch.mockResolvedValueOnce(response)

    const userStore = useUserStore()
    const result = await userStore.signIn({
      username: 'testuser',
      password: 'Password123',
    })

    expect(result.success).toBe(true)
    expect(userStore.user).toEqual(mockUser)
    expect(userStore.isAuthenticated).toBe(true)
    expect(userStore.error).toBeNull()
    expect(userStore.loading).toBe(false)
  })

  it('sets an error on failed signIn', async () => {
    mockFetch.mockResolvedValueOnce({
      success: false,
      message: 'Invalid credentials',
    })

    const userStore = useUserStore()
    const result = await userStore.signIn({
      username: 'testuser',
      password: 'wrong',
    })

    expect(result.success).toBe(false)
    expect(userStore.user).toBeNull()
    expect(userStore.isAuthenticated).toBe(false)
    expect(userStore.error).toBe('Invalid credentials')
    expect(userStore.hasError).toBe(true)
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
  })

  it('loads the user through fetchUser', async () => {
    mockFetch.mockResolvedValueOnce({
      success: true,
      data: { user: mockUser },
    })

    const userStore = useUserStore()
    await userStore.fetchUser()

    expect(userStore.user).toEqual(mockUser)
    expect(userStore.isAuthenticated).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/me', expect.objectContaining({
      credentials: 'include',
    }))
  })

  it('clears the user when fetchUser fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // fetchUser logs the failure via console.error in its catch block.
    // Rather than letting that noise leak into the test output, we spy on it
    // — scoped to this test only and restored afterward — AND turn it into an
    // assertion that proves the error branch was actually exercised.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const userStore = useUserStore()
    await userStore.fetchUser()

    expect(userStore.user).toBeNull()
    expect(userStore.isAuthenticated).toBe(false)
    expect(userStore.hasError).toBe(false)

    // The catch branch ran and reported the failure
    expect(errorSpy).toHaveBeenCalledWith('Failed to fetch user:', expect.any(Error))

    errorSpy.mockRestore()
  })

  it('clears error via clearError', () => {
    const userStore = useUserStore()
    userStore.clearError()
    expect(userStore.error).toBeNull()
    expect(userStore.hasError).toBe(false)
  })

  it('toggles loading state during signIn', async () => {
    let resolveSignIn!: (value: unknown) => void
    mockFetch.mockReturnValueOnce(new Promise(resolve => (resolveSignIn = resolve)))

    const userStore = useUserStore()
    const pending = userStore.signIn({ username: 'x', password: 'y' })

    // While the request is in-flight, loading should be true
    expect(userStore.loading).toBe(true)

    resolveSignIn({ success: false, message: 'no' })
    await pending

    expect(userStore.loading).toBe(false)
  })

  it('isEnrolled returns false when not enrolled', () => {
    const userStore = useUserStore()
    expect(userStore.isEnrolled(1)).toBe(false)
  })

  it('exposes role-based computed getters', () => {
    const userStore = useUserStore()
    // No user → not admin, can purchase
    expect(userStore.isAdminLike).toBe(false)
    expect(userStore.canPurchaseCourses).toBe(true)
  })
})
