<template>
  <div class="min-h-screen bg-dark-bg py-16 px-4">
    <div class="max-w-4xl mx-auto">
      <h1
        class="text-3xl font-bold text-white mb-8 border-r-4 border-primary pr-4"
      >
        Checkout
      </h1>

      <div
        v-if="items.length === 0"
        class="text-center py-12 bg-dark-surface rounded-2xl border border-dark-divider"
      >
        <div class="mb-4 text-white/70">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <p class="text-lg text-white mb-6">
          Your cart is empty.
        </p>
        <NuxtLink
          to="/courses"
          class="btn-primary inline-block"
        >
          Browse Courses
        </NuxtLink>
      </div>

      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <!-- Order Summary -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-dark-surface rounded-2xl border border-dark-divider p-6">
            <h2 class="text-xl font-bold text-white mb-4">
              Order Items
            </h2>
            <div class="divide-y divide-dark-divider">
              <div
                v-for="item in items"
                :key="item.id"
                class="py-4 flex gap-4"
              >
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-20 h-14 object-cover rounded-lg border border-white/5"
                >
                <div class="flex-1">
                  <h3 class="text-white font-medium line-clamp-1">
                    {{ item.title }}
                  </h3>
                  <p class="text-white/70 text-sm">
                    Instructor: {{ item.instructor.name }}
                  </p>
                </div>
                <div class="text-white font-bold">
                  ${{ item.price }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Simulation -->
        <div class="space-y-6">
          <div class="bg-dark-surface rounded-2xl border border-dark-divider p-6 sticky top-24">
            <h2 class="text-xl font-bold text-white mb-6">
              Summary
            </h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>${{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-white/70">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div
                class="pt-3 border-t border-dark-divider flex justify-between text-lg font-bold text-white"
              >
                <span>Total</span>
                <span class="text-primary">${{ totalPrice.toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-4">
              <p
                class="text-xs text-white/60 text-center uppercase tracking-widest font-bold"
              >
                Payment Simulation
              </p>

              <button
                class="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                :disabled="isLoading"
                :aria-busy="isLoading"
                @click="handleCheckout('success')"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <template v-else>
                  <span aria-hidden="true">✓</span> Complete Purchase
                </template>
              </button>

              <button
                class="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                :disabled="isLoading"
                :aria-busy="isLoading"
                @click="handleCheckout('fail')"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <template v-else>
                  <span aria-hidden="true">✗</span> Simulate Failure
                </template>
              </button>
            </div>

            <p class="mt-6 text-[10px] text-center text-white/20 uppercase tracking-tighter">
              This is a portfolio simulation. No real funds are exchanged.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'

definePageMeta({
  middleware: 'auth',
  layout: 'minimal',
  title: 'Checkout',
})

useHead({
  title: 'Checkout - Online Learning Platform',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'Secure checkout page for course enrollment.' },
    { property: 'og:title', content: 'Checkout - Online Learning Platform' },
    { property: 'og:description', content: 'Secure checkout page for course enrollment.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://learning-platform.com/checkout' },
    { name: 'twitter:card', content: 'summary' },
  ],
  link: [
    { rel: 'canonical', href: 'https://learning-platform.com/checkout' },
  ],
})

const { items, totalPrice, isLoading, checkout } = useCart()

const handleCheckout = async (type: 'success' | 'fail') => {
  const result = await checkout(type)
  if (result.success) {
    navigateTo(`/checkout/success?id=${result.orderId}`)
  }
  else {
    // If it was a simulated failure, or real error
    if (result.orderId) {
      navigateTo(`/checkout/failed?id=${result.orderId}`)
    }
    else {
      // Something went wrong before order creation
      console.error('Checkout failed:', result.message)
    }
  }
}
</script>
