import { defineStore } from 'pinia'
import type { SignInFormData, SignUpFormData } from '~/schemas/auth'
import type { User } from '~/types/shared/auth'
import type { ApiResponse, AuthResponse, AuthResponse as AuthResponseType } from '~/types/shared/api'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Actions
  const setUser = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    error.value = null
  }

  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    error.value = null
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await $fetch<ApiResponse<{ user: User }>>('/api/auth/me')
      if (response?.success && response?.data?.user) {
        setUser(response.data.user)
      }
      else {
        clearUser()
      }
    }
    catch (error: unknown) {
      console.error('Failed to fetch user:', error)
      const errorMessage = (error as Error)?.message || 'Failed to fetch user'
      setError(errorMessage)
      clearUser()
    }
    finally {
      setLoading(false)
    }
  }

  const signIn = async (credentials: SignInFormData) => {
    setLoading(true)
    try {
      const response = await $fetch<AuthResponseType>('/api/auth/signin', {
        method: 'POST',
        body: credentials,
      })

      if (response?.success && response?.user) {
        setUser(response.user)
        return { success: true, user: response.user }
      }
      else {
        setError(response?.message || 'Sign in failed')
        return {
          success: false,
          error: response?.error || response?.message || 'Sign in failed',
        }
      }
    }
    catch (error: unknown) {
      console.error('Sign in error:', error)
      const errorMessage = (error as Error)?.message || 'An unexpected error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
    finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: SignUpFormData) => {
    setLoading(true)
    try {
      const response = await $fetch<AuthResponse>('/api/auth/signup', {
        method: 'POST',
        body: userData,
      })

      if (response?.success && response?.user) {
        setUser(response.user)
        return { success: true, user: response.user }
      }
      else {
        setError(response?.message || 'Sign up failed')
        return {
          success: false,
          error: response?.error || response?.message || 'Sign up failed',
        }
      }
    }
    catch (error: unknown) {
      console.error('Sign up error:', error)
      const errorMessage = (error as Error)?.message || 'An unexpected error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
    finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const response = await $fetch<ApiResponse>('/api/auth/logout', { method: 'POST' })
      if (response?.success) {
        clearUser()
        await navigateTo('/home')
      }
      else {
        setError(response?.message || 'Logout failed')
      }
    }
    catch (error: unknown) {
      console.error('Logout failed:', error)
      const errorMessage = (error as Error)?.message || 'Logout failed'
      setError(errorMessage)
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,

    // Actions
    setUser,
    clearUser,
    setLoading,
    setError,
    fetchUser,
    signIn,
    signUp,
    logout,
  }
})
