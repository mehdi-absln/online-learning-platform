import { defineStore } from 'pinia'
import { getErrorMessage } from '~/utils/error-helpers'
import type { SignInFormData, SignUpFormData } from '~/schemas/auth'
import type { User } from '~/types/shared/auth'
import type { ApiResponse, AuthResponse, AuthResponse as AuthResponseType } from '~/types/shared/api'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const hasError = computed(() => error.value !== null)

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

  const clearError = () => {
    error.value = null
  }

  const fetchUser = async () => {
    setLoading(true)
    clearError()

    try {
      const response = await $fetch<ApiResponse<{ user: User }>>('/api/auth/me')
      if (response?.success && response?.data?.user) {
        setUser(response.data.user)
      }
      else {
        clearUser()
      }
    }
    catch (err: unknown) {
      console.error('Failed to fetch user:', err)
      setError(getErrorMessage(err))
      clearUser()
    }
    finally {
      setLoading(false)
    }
  }

  const signIn = async (credentials: SignInFormData) => {
    setLoading(true)
    clearError()

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
        const errorMsg = response?.message || 'Sign in failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    }
    catch (err: unknown) {
      console.error('Sign in error:', err)
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
    finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: SignUpFormData) => {
    setLoading(true)
    clearError()

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
        const errorMsg = response?.message || 'Sign up failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    }
    catch (err: unknown) {
      console.error('Sign up error:', err)
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
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
    catch (err: unknown) {
      console.error('Logout failed:', err)
      setError(getErrorMessage(err))
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,

    // Getters
    hasError,

    // Actions
    setUser,
    clearUser,
    setLoading,
    setError,
    clearError,
    fetchUser,
    signIn,
    signUp,
    logout,
  }
})
