// app/composables/useCart.ts
import { useCartStore } from '~/stores/cart'
import { useUserStore } from '~/stores/user'
import { useToast } from '~/composables/useToast'
import type { Course } from '~/types/course'

export const useCart = () => {
  const cartStore = useCartStore()
  const userStore = useUserStore()
  const toast = useToast()

  const ensureCanPurchase = () => {
    if (userStore.isAuthenticated && !userStore.canPurchaseCourses) {
      toast.error('Admin and superadmin accounts cannot purchase courses.')
      return false
    }
    return true
  }

  // ───── UI State ─────
  // Using useState for cross-component UI state management in Nuxt
  const isCartDrawerOpen = useState('isCartDrawerOpen', () => false)

  const openCart = () => {
    isCartDrawerOpen.value = true
  }

  const closeCart = () => {
    isCartDrawerOpen.value = false
  }

  const toggleCart = () => {
    isCartDrawerOpen.value = !isCartDrawerOpen.value
  }

  return {
    // UI State
    isCartDrawerOpen,
    openCart,
    closeCart,
    toggleCart,

    // Store State & Getters
    items: computed(() => cartStore.items),
    itemsCount: computed(() => cartStore.itemsCount),
    totalPrice: computed(() => cartStore.totalPrice),
    isLoading: computed(() => cartStore.isLoading),

    // Store Actions
    addItem: async (course: Course) => {
      if (!ensureCanPurchase()) return false
      await cartStore.addItem(course)
      return true
    },
    removeItem: cartStore.removeItem,
    clearCart: cartStore.clearCart,
    isInCart: cartStore.isInCart,
    checkout: async (simulationType?: 'success' | 'fail') => {
      if (!ensureCanPurchase()) return { success: false, message: 'Admin/superadmin accounts cannot purchase courses.' }
      return await cartStore.checkout(simulationType)
    },
  }
}
