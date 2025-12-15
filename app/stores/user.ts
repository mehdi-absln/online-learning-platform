import { defineStore } from 'pinia'
import type { UserState } from '~/types/types'
import type { SignInFormData, SignUpFormData } from '~/schemas/auth'
import type { User } from '~/types/shared/auth'
import type { ApiResponse, AuthResponse as AuthResponseType } from '~/types/shared/api'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
      this.error = null
    },

    clearUser() {
      this.user = null
      this.isAuthenticated = false
      this.error = null
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    async fetchUser() {
      this.setLoading(true)
      try {
        const response = await $fetch<ApiResponse<{ user: User }>>('/api/auth/me')
        if (response?.success && response?.data?.user) {
          this.setUser(response.data.user)
        }
        else {
          this.clearUser()
        }
      }
      catch (error: unknown) {
        console.error('Failed to fetch user:', error)
        const errorMessage = (error as Error)?.message || 'Failed to fetch user'
        this.setError(errorMessage)
        this.clearUser()
      }
      finally {
        this.setLoading(false)
      }
    },

    async signIn(credentials: SignInFormData) {
      this.setLoading(true)
      try {
        const response = await $fetch<AuthResponseType>('/api/auth/signin', {
          method: 'POST',
          body: credentials,
        })

        if (response?.success && response?.user) {
          this.setUser(response.user)
          return { success: true, user: response.user }
        }
        else {
          this.setError(response?.message || 'Sign in failed')
          return {
            success: false,
            error: response?.error || response?.message || 'Sign in failed',
          }
        }
      }
      catch (error: unknown) {
        console.error('Sign in error:', error)
        const errorMessage = (error as Error)?.message || 'An unexpected error occurred'
        this.setError(errorMessage)
        return {
          success: false,
          error: errorMessage,
        }
      }
      finally {
        this.setLoading(false)
      }
    },

    async signUp(userData: SignUpFormData) {
      this.setLoading(true)
      try {
        const response = await $fetch<AuthResponseType>('/api/auth/signup', {
          method: 'POST',
          body: userData,
        })

        if (response?.success && response?.user) {
          this.setUser(response.user)
          return { success: true, user: response.user }
        }
        else {
          this.setError(response?.message || 'Sign up failed')
          return {
            success: false,
            error: response?.error || response?.message || 'Sign up failed',
          }
        }
      }
      catch (error: unknown) {
        console.error('Sign up error:', error)
        const errorMessage = (error as Error)?.message || 'An unexpected error occurred'
        this.setError(errorMessage)
        return {
          success: false,
          error: errorMessage,
        }
      }
      finally {
        this.setLoading(false)
      }
    },

    async logout() {
      try {
        const response = await $fetch<ApiResponse>('/api/auth/logout', { method: 'POST' })
        if (response?.success) {
          this.clearUser()
          await navigateTo('/home')
        }
        else {
          this.setError(response?.message || 'Logout failed')
        }
      }
      catch (error: unknown) {
        console.error('Logout failed:', error)
        const errorMessage = (error as Error)?.message || 'Logout failed'
        this.setError(errorMessage)
      }
    },
  },
})
