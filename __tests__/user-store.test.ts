import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '~/stores/user'
import type { User } from '~/types/shared/auth'

// Mock $fetch and navigateTo
vi.mock('ofetch', () => {
  const $fetch = vi.fn()
  return { $fetch }
})

vi.mock('nuxt/app', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    navigateTo: vi.fn()
  }
})

// Alternative approach - mock the specific functions we need
vi.mock('#app', async () => {
  return {
    $fetch: vi.fn(),
    navigateTo: vi.fn()
  }
})

describe('User Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('initializes with correct state', () => {
    const userStore = useUserStore()
    
    expect(userStore.user).toBeNull()
    expect(userStore.isAuthenticated).toBe(false)
    expect(userStore.loading).toBe(false)
    expect(userStore.error).toBeNull()
  })

  it('sets user correctly', () => {
    const userStore = useUserStore()
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }
    
    userStore.setUser(mockUser)
    
    expect(userStore.user).toEqual(mockUser)
    expect(userStore.isAuthenticated).toBe(true)
    expect(userStore.error).toBeNull()
  })

  it('clears user correctly', () => {
    const userStore = useUserStore()
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }
    
    userStore.setUser(mockUser)
    userStore.clearUser()
    
    expect(userStore.user).toBeNull()
    expect(userStore.isAuthenticated).toBe(false)
    expect(userStore.error).toBeNull()
  })

  it('sets loading state correctly', () => {
    const userStore = useUserStore()
    
    userStore.setLoading(true)
    expect(userStore.loading).toBe(true)
    
    userStore.setLoading(false)
    expect(userStore.loading).toBe(false)
  })

  it('sets error correctly', () => {
    const userStore = useUserStore()
    const errorMessage = 'Test error'
    
    userStore.setError(errorMessage)
    expect(userStore.error).toBe(errorMessage)
    
    userStore.setError(null)
    expect(userStore.error).toBeNull()
  })
})