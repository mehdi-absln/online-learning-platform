// app/stores/cart.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useToast } from '~/composables/useToast'
import type { Course } from '~/types/shared/auth'
import type { ApiResponse } from '~/types/shared/api'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const toast = useToast()

  // Get headers at store initialization (inside Vue setup context)
  const requestHeaders = import.meta.server
    ? useRequestHeaders(['cookie'])
    : {}

  // ───── State ─────
  const items = ref<Course[]>([])
  const isLoading = ref(false)
  const serverTotalPrice = ref(0)

  // Cookie for Guest Cart (IDs only to optimize size < 4KB)
  const guestCartCookie = useCookie<number[] | null>('guest-cart', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    watch: 'shallow',
  })

  // ───── Getters ─────
  const itemsCount = computed(() => {
    if (userStore.isAuthenticated) return items.value.length
    return guestCartCookie.value?.length || 0
  })

  const totalPrice = computed(() => {
    if (userStore.isAuthenticated) {
      return serverTotalPrice.value
    }
    return items.value.reduce((total, item) => total + (item.price || 0), 0)
  })

  const isInCart = (courseId: number) => {
    if (userStore.isAuthenticated) {
      return items.value.some(item => item.id === courseId)
    }
    return guestCartCookie.value?.includes(courseId) || false
  }

  // ───── Actions ─────

  /**
   * Fetch full details for guest items based on IDs in cookie
   */
  const fetchGuestCartDetails = async () => {
    const ids = guestCartCookie.value || []
    if (ids.length === 0) {
      items.value = []
      return
    }

    try {
      const response = await $fetch<ApiResponse<Course[]>>('/api/courses/bulk', {
        method: 'POST',
        body: { ids },
      })
      if (response?.success && response?.data) {
        items.value = response.data
      }
    }
    catch (error: unknown) {
      console.error('Failed to fetch guest cart details:', error)
      toast.error('Failed to load guest cart items')
    }
  }

  /**
   * Fetch authenticated user's cart from DB
   */
  const fetchUserCart = async () => {
    isLoading.value = true
    try {
      const response = await $fetch<ApiResponse<{ items: Course[], totalPrice: number }>>('/api/cart', {
        headers: requestHeaders,
        credentials: 'include',
      })
      if (response?.success && response?.data) {
        items.value = response.data.items
        serverTotalPrice.value = response.data.totalPrice
      }
    }
    catch (error: unknown) {
      console.error('Failed to fetch cart from server:', error)
      toast.error('Failed to load your cart')
    }
    finally {
      isLoading.value = false
    }
  }

  const fetchCart = async () => {
    if (userStore.isAuthenticated) {
      await fetchUserCart()
    }
    else {
      await fetchGuestCartDetails()
    }
  }

  const addItem = async (course: Course) => {
    if (isInCart(course.id)) return

    if (userStore.isAuthenticated) {
      try {
        const response = await $fetch<ApiResponse>('/api/cart', {
          method: 'POST',
          body: { courseId: course.id },
          headers: requestHeaders,
          credentials: 'include',
        })
        if (response?.success) {
          await fetchUserCart()
          toast.success('Course added to cart')
        }
      }
      catch (error: unknown) {
        const err = error as { statusMessage?: string }
        console.error('Failed to add item to cart on server:', error)
        toast.error(err.statusMessage || 'Failed to add item to cart')
      }
    }
    else {
      const currentIds = guestCartCookie.value || []
      guestCartCookie.value = [...currentIds, course.id]
      items.value.push(course)
      toast.success('Course added to cart')
    }
  }

  const removeItem = async (courseId: number) => {
    if (userStore.isAuthenticated) {
      try {
        const response = await $fetch<ApiResponse>(`/api/cart/${courseId}`, {
          method: 'DELETE',
          headers: requestHeaders,
          credentials: 'include',
        })
        if (response?.success) {
          await fetchUserCart()
          toast.info('Course removed from cart')
        }
      }
      catch (error: unknown) {
        console.error('Failed to remove item from cart on server:', error)
        toast.error('Failed to remove item')
      }
    }
    else {
      const currentIds = guestCartCookie.value || []
      guestCartCookie.value = currentIds.filter(id => id !== courseId)
      items.value = items.value.filter(item => item.id !== courseId)
      toast.info('Course removed from cart')
    }
  }

  const mergeGuestCart = async () => {
    const ids = guestCartCookie.value || []
    if (ids.length === 0) {
      return
    }

    try {
      const response = await $fetch<ApiResponse>('/api/cart/merge', {
        method: 'POST',
        body: { courseIds: ids },
        headers: requestHeaders,
        credentials: 'include',
      })
      if (response?.success) {
        // Clear guest cookie after successful merge
        guestCartCookie.value = null
        await fetchUserCart()
        // Don't show toast - it's distracting during login flow
      }
    }
    catch (error: unknown) {
      console.warn('Cart merge failed silently:', error)
      // Don't show error toast - merge is not critical and user is already logged in
      // This can happen if:
      // - Course no longer exists
      // - User already enrolled
      // - Network issue
      // None of these should block the login flow
    }
  }

  const clearCart = async () => {
    items.value = []
    if (!userStore.isAuthenticated) {
      guestCartCookie.value = null
    }
    // Note: server-side clear usually happens after checkout
  }

  const checkout = async (simulationType: 'success' | 'fail' = 'success') => {
    if (!userStore.isAuthenticated) {
      toast.showLoginRequired('checkout')
      return { success: false, message: 'Please login to checkout' }
    }

    if (items.value.length === 0) {
      toast.info('Your cart is empty')
      return { success: false, message: 'Cart is empty' }
    }

    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean, message: string, orderId: number }>('/api/checkout', {
        method: 'POST',
        body: { simulationType },
        headers: requestHeaders,
        credentials: 'include',
      })

      if (response?.success) {
        await clearCart()
        // Success toast is optional here as we redirect to success page
        return { success: true, message: response.message, orderId: response.orderId }
      }

      return { success: false, message: response?.message || 'Checkout failed', orderId: response?.orderId }
    }
    catch (error: unknown) {
      const err = error as { statusMessage?: string, data?: { message?: string, orderId?: number } }
      console.error('Checkout error:', error)
      const message = err.statusMessage || err.data?.message || 'Payment processing failed'
      // Only show error toast if it's a real unexpected failure, not a simulated one
      if (simulationType === 'success') toast.error(message)
      return { success: false, message, orderId: err.data?.orderId }
    }
    finally {
      isLoading.value = false
    }
  }

  // ───── Initialization ─────

  /**
   * Initialize cart - called once on app mount after auth state is known
   */
  const initializeCart = async () => {
    // Wait a tick to ensure user store has initialized
    await nextTick()
    
    if (userStore.isAuthenticated) {
      await fetchUserCart()
    }
    else {
      await fetchGuestCartDetails()
    }
  }

  // Watch for auth changes to fetch appropriate data
  // Note: No { immediate: true } - we fetch once user auth state is known
  watch(() => userStore.isAuthenticated, async (isAuth, oldIsAuth) => {
    // Skip if auth state hasn't actually changed (prevents double fetch on init)
    if (isAuth === oldIsAuth) return
    
    if (isAuth) {
      await fetchUserCart()
    }
    else {
      await fetchGuestCartDetails()
    }
  })

  // Initialize cart on store creation (after auth state is known)
  initializeCart()

  return {
    items,
    isLoading,
    itemsCount,
    totalPrice,
    isInCart,
    addItem,
    removeItem,
    clearCart,
    fetchCart,
    fetchGuestCartDetails,
    mergeGuestCart,
    checkout,
  }
})
