<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Backdrop: Dark Overlay with blur -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-linear"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-linear"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isCartDrawerOpen"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeCart"
        />
      </Transition>

      <!-- Drawer: Right Side Slide-out -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-in-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in-out"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="isCartDrawerOpen"
          ref="drawerRef"
          class="fixed inset-y-0 right-0 z-[60] w-full max-w-md shadow-2xl flex flex-col bg-dark-gray border-l border-dark-divider"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
        >
          <!-- Header Section -->
          <div class="px-6 py-6 border-b border-dark-divider flex items-center justify-between bg-dark-surface">
            <h2
              id="cart-title"
              class="text-xl font-bold text-white flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Shopping Cart
              <span class="text-sm font-normal text-white/70">({{ itemsCount }} items)</span>
            </h2>
            <button
              ref="closeBtnRef"
              class="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close cart"
              @click="closeCart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content Section: Item List -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div
              v-if="items.length === 0"
            >
              <UiEmptyState
                title="Your cart is empty"
                message="Looks like you haven't added anything yet."
                action-label="Start Learning"
                action-to="/courses"
                @action="closeCart"
              >
                <template #icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </template>
              </UiEmptyState>
            </div>

            <ul
              v-else
              class="space-y-4"
              role="list"
            >
              <li
                v-for="item in items"
                :key="item.id"
                class="flex gap-4 p-4 bg-dark-bg rounded-xl border border-dark-divider group focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30"
              >
                <div class="relative w-20 h-20 flex-shrink-0 bg-dark-surface rounded-lg overflow-hidden border border-dark-divider">
                  <CourseImage
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="h-16 w-16 flex-shrink-0 rounded-md border border-dark-divider object-cover"
                    sizes="64px"
                  />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 class="text-white font-medium truncate group-hover:text-primary group-focus-within:text-primary transition-colors text-sm">
                      {{ item.title }}
                    </h3>
                    <p class="text-white/70 text-xs mt-1 truncate">
                      By {{ item.instructor?.name || 'Instructor' }}
                    </p>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-primary font-bold">{{ '$' + formatPrice(item.price) }}</span>
                    <button
                      class="text-xs text-red-500 hover:text-red-400 focus-visible:text-red-400 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:rounded transition-colors flex items-center gap-1 focus:outline-none"
                      :aria-label="`Remove ${item.title}`"
                      @click="removeItem(item.id)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Footer Section: Summary & Checkout -->
          <div
            v-if="items.length > 0"
            class="p-6 border-t border-dark-divider bg-dark-surface space-y-4"
          >
            <div class="flex items-center justify-between">
              <span class="text-white/70">Total Amount:</span>
              <span class="text-2xl font-bold text-white">${{ totalPrice.toFixed(2) }}</span>
            </div>
            <button
              class="btn-primary w-full py-4 text-lg gap-3 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-surface focus:outline-none"
              :disabled="isLoading"
              @click="handleCheckout"
            >
              <template v-if="isLoading">
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </template>
              <template v-else>
                Checkout Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </template>
            </button>
            <p class="text-center text-xs text-white/30">
              Secure checkout powered by our platform
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { onKeyStroke } from '@vueuse/core'
import CourseImage from '~/components/courses/CourseImage.vue'

const drawerRef = ref<HTMLElement | null>(null)

const {
  isCartDrawerOpen,
  closeCart,
  items,
  itemsCount,
  totalPrice,
  removeItem,
  isLoading,
} = useCart()

const handleCheckout = () => {
  closeCart()
  navigateTo('/checkout')
}

// Prevent body scroll and manage focus
watch(isCartDrawerOpen, async (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (isOpen) {
      await nextTick()
      // Simple focus management: focus the close button or container
      const focusable = drawerRef.value?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement
      if (focusable) focusable.focus()
    }
  }
})

// Close on Escape
onKeyStroke('Escape', (e) => {
  if (isCartDrawerOpen.value) {
    e.preventDefault()
    closeCart()
  }
})

// Focus trap for Tab key
onKeyStroke('Tab', (e) => {
  if (!isCartDrawerOpen.value || !drawerRef.value) return

  const focusableElements = drawerRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  const first = focusableElements[0] as HTMLElement
  const last = focusableElements[focusableElements.length - 1] as HTMLElement

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  }
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #474746;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #ec5252;
}
</style>
