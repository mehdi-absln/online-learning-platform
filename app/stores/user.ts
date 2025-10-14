import { defineStore } from 'pinia'
import type { UserState, User, SigninFormData, SignupFormData, AuthResponse } from '~/types/types'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
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
        const response: any = await $fetch('/api/auth/me')
        if (response?.success && response?.data?.user) {
          this.setUser(response.data.user)
        } else {
          this.clearUser()
        }
      } catch (error: any) {
        console.error('Failed to fetch user:', error)
        this.setError(error.message || 'Failed to fetch user')
        this.clearUser()
      } finally {
        this.setLoading(false)
      }
    },

    async signIn(credentials: SigninFormData) {
      this.setLoading(true)
      try {
        const response: any = await $fetch('/api/auth/signin', {
          method: 'POST',
          body: credentials
        })
        
        if (response?.success && response?.data?.user) {
          this.setUser(response.data.user)
          return { success: true, user: response.data.user } as AuthResponse
        } else {
          this.setError(response?.message || 'Sign in failed')
          return { success: false, error: response?.error || response?.message || 'Sign in failed' } as AuthResponse
        }
      } catch (error: any) {
        console.error('Sign in error:', error)
        this.setError(error.message || 'An unexpected error occurred')
        return { success: false, error: error.message || 'An unexpected error occurred' } as AuthResponse
      } finally {
        this.setLoading(false)
      }
    },

    async signUp(userData: SignupFormData) {
      this.setLoading(true)
      try {
        const response: any = await $fetch('/api/auth/signup', {
          method: 'POST',
          body: userData
        })
        
        if (response?.success && response?.data?.user) {
          this.setUser(response.data.user)
          return { success: true, user: response.data.user } as AuthResponse
        } else {
          this.setError(response?.message || 'Sign up failed')
          return { success: false, error: response?.error || response?.message || 'Sign up failed' } as AuthResponse
        }
      } catch (error: any) {
        console.error('Sign up error:', error)
        this.setError(error.message || 'An unexpected error occurred')
        return { success: false, error: error.message || 'An unexpected error occurred' } as AuthResponse
      } finally {
        this.setLoading(false)
      }
    },

    async logout() {
      try {
        const response: any = await $fetch('/api/auth/logout', { method: 'POST' })
        if (response?.success) {
          this.clearUser()
          // Optionally redirect to home page after logout
          await navigateTo('/home')
        } else {
          this.setError(response?.message || 'Logout failed')
        }
      } catch (error: any) {
        console.error('Logout failed:', error)
        this.setError(error.message || 'Logout failed')
      }
    }
  }
})
