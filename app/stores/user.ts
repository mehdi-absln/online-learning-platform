import { defineStore } from 'pinia'
import { getErrorMessage } from '~/utils/error-helpers'
import { useCartStore } from './cart'
import { useToast } from '~/composables/useToast'
import type { SignInFormData, SignUpFormData } from '~/schemas/auth'
import type { User } from '~/types/shared/auth'
import type { ApiResponse, AuthResponse as AuthResponseType } from '~/types/shared/api'

export const useUserStore = defineStore('user', () => {
  const toast = useToast()

  // Get headers at store initialization (inside Vue setup context)
  const requestHeaders = import.meta.server
    ? useRequestHeaders(['cookie'])
    : {}

  // State
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const enrolledCourseIds = ref<number[]>([])

  // Computed state (readonly from outside)
  const isAuthenticated = computed(() => user.value !== null)
  const hasError = computed(() => error.value !== null)

  // Check if user is enrolled in a course (O(1) lookup)
  const isEnrolled = (courseId: number) => {
    return enrolledCourseIds.value.includes(courseId)
  }

  // Private actions (not exposed)
  const setUser = (userData: User) => {
    user.value = userData
    error.value = null
  }

  const clearUser = () => {
    user.value = null
    error.value = null
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  /**
   * Fetch user's enrolled course IDs (bulk check for UI)
   */
  const fetchEnrollments = async () => {
    if (!user.value) {
      enrolledCourseIds.value = []
      return
    }

    try {
      const response = await $fetch<ApiResponse<{ courseIds: number[] }>>('/api/enrollments/my', {
        headers: requestHeaders,
        credentials: 'include',
      })
      if (response?.success && response?.data?.courseIds) {
        enrolledCourseIds.value = response.data.courseIds
      }
    }
    catch (err: unknown) {
      console.error('Failed to fetch enrollments:', err)
      // Silent fail - don't block UI
    }
  }

  /**
   * Clear enrollments (on logout)
   */
  const clearEnrollments = () => {
    enrolledCourseIds.value = []
  }

  // Public actions
  const fetchUser = async () => {
    loading.value = true
    clearError()

    try {
      const response = await $fetch<ApiResponse<{ user: User }>>('/api/auth/me', {
        headers: requestHeaders,
        credentials: 'include',
      })
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
      // Silent fail for fetchUser - don't show toast on initial load
    }
    finally {
      loading.value = false
    }
  }

  const signIn = async (credentials: SignInFormData) => {
    loading.value = true
    clearError()

    try {
      const response = await $fetch<AuthResponseType>('/api/auth/signin', {
        method: 'POST',
        body: credentials,
      })

      if (response?.success && response?.data?.user) {
        setUser(response.data.user)

        // Trigger cart merge (don't await - let it happen in background)
        const cartStore = useCartStore()
        cartStore.mergeGuestCart().catch(() => {
          // Silently ignore merge errors on sign in
        })

        // Fetch enrollments in background (don't block sign-in)
        fetchEnrollments().catch(() => {
          // Silently ignore enrollment fetch errors on sign in
        })

        toast.success(response.message || 'Signed in successfully')
        return { success: true, user: response.data.user }
      }
      else {
        const errorMsg = response?.message || 'Sign in failed'
        setError(errorMsg)
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    }
    catch (err: unknown) {
      console.error('Sign in error:', err)
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
    finally {
      loading.value = false
    }
  }

  const signUp = async (userData: SignUpFormData) => {
    loading.value = true
    clearError()

    try {
      const response = await $fetch<AuthResponseType>('/api/auth/signup', {
        method: 'POST',
        body: userData,
      })

      if (response?.success && response?.data?.user) {
        setUser(response.data.user)

        // Trigger cart merge (don't await - let it happen in background)
        const cartStore = useCartStore()
        cartStore.mergeGuestCart().catch(() => {
          // Silently ignore merge errors on sign up
        })

        // Fetch enrollments in background (don't block sign-up)
        fetchEnrollments().catch(() => {
          // Silently ignore enrollment fetch errors on sign up
        })

        toast.success(response.message || 'Account created successfully! Welcome aboard')
        return { success: true, user: response.data.user }
      }
      else {
        const errorMsg = response?.message || 'Sign up failed'
        setError(errorMsg)
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    }
    catch (err: unknown) {
      console.error('Sign up error:', err)
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
    finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      const response = await $fetch<ApiResponse>('/api/auth/logout', {
        method: 'POST',
        headers: requestHeaders,
        credentials: 'include',
      })
      if (response?.success) {
        clearUser()
        clearEnrollments()
        toast.success('Logged out successfully. See you soon!')
        await navigateTo('/home')
      }
      else {
        const errorMsg = response?.message || 'Logout failed'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    }
    catch (err: unknown) {
      console.error('Logout failed:', err)
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
    }
    finally {
      loading.value = false
    }
  }

  // Watch for auth changes to fetch enrollments
  watch(() => isAuthenticated.value, async (isAuth) => {
    if (isAuth) {
      // Fetch enrollments when user becomes authenticated
      await fetchEnrollments()
    }
    else {
      // Clear enrollments when user logs out
      clearEnrollments()
    }
  })

  // Expose public API with readonly state
  return {
    // State (readonly)
    user: readonly(user),
    isAuthenticated,
    loading: readonly(loading),
    error: readonly(error),
    enrolledCourseIds: readonly(enrolledCourseIds),

    // Getters
    hasError,
    isEnrolled,

    // Actions
    fetchUser,
    signIn,
    signUp,
    logout,
    clearError,
    fetchEnrollments,
    clearEnrollments,
  }
})
