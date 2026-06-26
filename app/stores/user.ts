import { defineStore } from 'pinia'
import { getErrorMessage } from '~/utils/error-helpers'
import { useCartStore } from './cart'
import { useToast } from '~/composables/useToast'
import type { SignInFormData, SignUpFormData } from '~/schemas/auth'
import type { User, UserRole } from '~/types/auth'
import type { ApiResponse } from '~/types/api'

type AuthResponseType = ApiResponse<{ user: User }>

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
  const enrollmentsFetched = ref(false)

  // Computed state (readonly from outside)
  const isAuthenticated = computed(() => user.value !== null)
  const hasError = computed(() => error.value !== null)

  const NON_PURCHASING_ROLES: UserRole[] = ['admin', 'superadmin']
  const isAdminLike = computed(() =>
    user.value?.role === 'admin' || user.value?.role === 'superadmin',
  )
  const canPurchaseCourses = computed(() =>
    !user.value || !NON_PURCHASING_ROLES.includes(user.value.role),
  )

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
      enrollmentsFetched.value = true
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
      enrollmentsFetched.value = true
    }
    catch {
      // Silent fail - don't block UI
      enrollmentsFetched.value = true
    }
  }

  /**
   * Clear enrollments (on logout)
   */
  const clearEnrollments = () => {
    enrolledCourseIds.value = []
    enrollmentsFetched.value = false
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

  // Expose public API
  return {
    // State
    user,
    isAuthenticated,
    isAdminLike,
    canPurchaseCourses,
    loading,
    error,
    enrollmentsFetched,

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
