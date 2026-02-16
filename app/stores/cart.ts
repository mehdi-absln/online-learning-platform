// app/stores/cart.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useToast } from '~/composables/useToast'
import type { Course } from '~/types/shared/auth'
import type { ApiResponse } from '~/types/shared/api'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const toast = useToast()

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
      const headers = useRequestHeaders(['cookie'])
      const response = await $fetch<ApiResponse<{ items: Course[], totalPrice: number }>>('/api/cart', { headers })
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
    if (ids.length === 0) return

    try {
      const response = await $fetch<ApiResponse>('/api/cart/merge', {
        method: 'POST',
        body: { courseIds: ids },
      })
      if (response?.success) {
        // Clear guest cookie after successful merge
        guestCartCookie.value = null
        await fetchUserCart()
        toast.success('Guest cart items merged to your account')
      }
    }
    catch (error: unknown) {
      console.error('Failed to merge guest cart:', error)
      toast.error('Failed to sync guest cart')
    }
  }

  const clearCart = async () => {
    items.value = []
    if (!userStore.isAuthenticated) {
      guestCartCookie.value = null
    }
    // Note: server-side clear usually happens after checkout
  }

  const checkout = async () => {
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
      const response = await $fetch<ApiResponse>('/api/checkout', {
        method: 'POST',
      })
      if (response?.success) {
        await clearCart()
        toast.success('Congratulations! Your purchase was successful.')
        return { success: true, message: response.message }
      }
      toast.error(response?.message || 'Checkout failed')
      return { success: false, message: response?.message || 'Checkout failed' }
    }
    catch (error: unknown) {
      const err = error as { statusMessage?: string }
      console.error('Checkout error:', error)
      toast.error(err.statusMessage || 'Payment processing failed')
      return { success: false, message: err.statusMessage || 'Checkout failed' }
    }
    finally {
      isLoading.value = false
    }
  }

  // ───── Initialization ─────

  // Watch for auth changes to fetch appropriate data
  watch(() => userStore.isAuthenticated, async (isAuth) => {
    if (isAuth) {
      await fetchUserCart()
    }
    else {
      await fetchGuestCartDetails()
    }
  }, { immediate: true })

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
