<template>
  <div class="min-h-screen bg-dark-bg py-16 px-4 animate-fade-in">
    <section
      class="max-w-4xl mx-auto"
      aria-labelledby="checkout-heading"
    >
      <h1
        id="checkout-heading"
        class="text-3xl font-bold text-white mb-8 border-r-4 border-primary pr-4"
      >
        Complete Your Purchase
      </h1>

      <!-- Empty Cart State -->
      <div
        v-if="items.length === 0"
        role="status"
        aria-live="polite"
      >
        <UiEmptyState
          title="Your cart is empty"
          message="Add courses to your cart to begin checkout."
          action-to="/courses"
          action-label="Browse Courses"
        >
          <template #icon>
            <svg
              class="w-full h-full"
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
          </template>
        </UiEmptyState>
      </div>

      <!-- Checkout Content -->
      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <!-- Order Summary Section -->
        <section
          class="lg:col-span-2 space-y-6"
          aria-labelledby="order-items-heading"
        >
          <div class="bg-dark-surface rounded-2xl border border-dark-divider p-6">
            <h2
              id="order-items-heading"
              class="text-xl font-bold text-white mb-4"
            >
              Order Items ({{ itemsCount }})
            </h2>

            <ul
              class="divide-y divide-dark-divider"
              role="list"
              aria-label="Courses in your cart"
            >
              <li
                v-for="item in items"
                :key="item.id"
                class="py-4 flex gap-4"
                role="listitem"
              >
                <CourseImage
                  :src="item.thumbnail"
                  :alt="`Thumbnail for ${item.title} course`"
                  class="w-20 h-14 object-cover rounded-lg border border-white/5"
                  loading="lazy"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-medium line-clamp-1">
                    {{ item.title }}
                  </h3>
                  <p class="text-white/70 text-sm">
                    Instructor: {{ item.instructor.name }}
                  </p>
                </div>
                <div
                  class="text-white font-bold whitespace-nowrap"
                  aria-label="Price: ${{ item.price }}"
                >
                  ${{ item.price }}
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!-- Payment Section -->
        <aside
          class="space-y-6"
          aria-labelledby="payment-summary-heading"
        >
          <div
            class="bg-dark-surface rounded-2xl border border-dark-divider p-6 sticky top-24"
          >
            <h2
              id="payment-summary-heading"
              class="text-xl font-bold text-white mb-6"
            >
              Order Summary
            </h2>

            <!-- Price Breakdown -->
            <dl class="space-y-3 mb-6">
              <div class="flex justify-between text-white/70">
                <dt>Subtotal</dt>
                <dd>${{ totalPrice.toFixed(2) }}</dd>
              </div>
              <div class="flex justify-between text-white/70">
                <dt>Tax</dt>
                <dd aria-label="Tax: $0.00">
                  $0.00
                </dd>
              </div>
              <div
                class="pt-3 border-t border-dark-divider flex justify-between text-lg font-bold text-white"
              >
                <dt>Total</dt>
                <dd
                  class="text-primary"
                  aria-label="Total: ${{ totalPrice.toFixed(2) }}"
                >
                  ${{ totalPrice.toFixed(2) }}
                </dd>
              </div>
            </dl>

            <!-- Payment Simulation Buttons -->
            <div
              class="space-y-4"
              role="group"
              aria-labelledby="payment-actions-label"
            >
              <p
                id="payment-actions-label"
                class="text-xs text-white/60 text-center uppercase tracking-widest font-bold"
              >
                Payment Simulation
              </p>

              <button
                type="button"
                class="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading"
                :aria-busy="isLoading"
                aria-label="Complete purchase with successful payment simulation"
                @click="handleCheckout('success')"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                <span
                  v-else
                  aria-hidden="true"
                >✓</span>
                <span v-if="!isLoading">Complete Purchase</span>
                <span
                  v-else
                  class="sr-only"
                >Processing payment...</span>
              </button>

              <button
                type="button"
                class="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading"
                :aria-busy="isLoading"
                aria-label="Simulate failed payment for testing purposes"
                @click="handleCheckout('fail')"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                <span
                  v-else
                  aria-hidden="true"
                >✗</span>
                <span v-if="!isLoading">Simulate Failure</span>
                <span
                  v-else
                  class="sr-only"
                >Processing payment...</span>
              </button>
            </div>

            <!-- Simulation Disclaimer -->
            <p
              class="mt-6 text-[10px] text-center text-white/20 uppercase tracking-tighter"
              role="note"
              aria-label="Simulation disclaimer"
            >
              This is a portfolio simulation. No real funds are exchanged.
            </p>
          </div>
        </aside>
      </div>

      <!-- Live Region for Status Updates -->
      <div
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
        role="status"
      >
        <template v-if="isLoading">
          Processing your payment, please wait...
        </template>
        <template v-else-if="items.length === 0">
          Your cart is empty
        </template>
        <template v-else>
          Ready to checkout with {{ itemsCount }} {{ itemsCount === 1 ? 'item' : 'items' }}, total ${{ totalPrice.toFixed(2) }}
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import CourseImage from '~/components/courses/CourseImage.vue'
import { SITE_NAME } from '~/constants'

// Page metadata and SEO
definePageMeta({
  requiresAuth: true,
  layout: 'minimal',
  title: 'Checkout',
})

useSeoMeta({
  title: `Checkout - Complete Your Purchase | ${SITE_NAME}`,
  description: 'Secure checkout page for course enrollment. Review your order and complete your purchase to start learning.',
  robots: 'noindex, nofollow',
  ogTitle: `Checkout - ${SITE_NAME}`,
  ogDescription: 'Secure checkout page for course enrollment. Review your order and complete your purchase.',
  ogType: 'website',
  twitterCard: 'summary',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

// Cart state and actions
const { items, totalPrice, isLoading, checkout } = useCart()

// Computed values
const itemsCount = computed(() => items.value.length)

// Checkout handler
const handleCheckout = async (type: 'success' | 'fail') => {
  const result = await checkout(type)

  if (result.success && result.orderId) {
    await navigateTo(`/checkout/success?id=${result.orderId}`)
  }
  else if (result.orderId) {
    // Simulated failure with order ID
    await navigateTo(`/checkout/failed?id=${result.orderId}`)
  }
  else {
    // Unexpected error before order creation
  }
}
</script>
