// app/composables/useCart.ts
import { useCartStore } from '~/stores/cart'

export const useCart = () => {
  const cartStore = useCartStore()

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
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    clearCart: cartStore.clearCart,
    isInCart: cartStore.isInCart,
    checkout: cartStore.checkout,
  }
}
