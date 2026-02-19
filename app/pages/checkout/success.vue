<template>
  <main
    id="success-main"
    class="max-w-3xl mx-auto py-16 px-4"
    role="main"
    aria-labelledby="success-heading"
  >
    <!-- Loading State -->
    <div
      v-if="pending"
      class="py-20 flex flex-col items-center justify-center"
      role="status"
      aria-label="Loading order information"
      aria-live="polite"
    >
      <LoadingSpinner message="Verifying order details..." />
    </div>

    <!-- Error State -->
    <div
      v-else-if="hasError"
      class="text-center py-20 bg-dark-surface rounded-3xl border border-dark-divider"
      role="alert"
      aria-live="assertive"
      aria-labelledby="error-heading"
      aria-describedby="error-description"
    >
      <div
        class="text-red-500 mb-6"
        aria-hidden="true"
      >
        <svg
          class="w-20 h-20 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1
        id="error-heading"
        class="text-2xl font-bold text-white mb-4"
      >
        Order Verification Error
      </h1>
      <p
        id="error-description"
        class="text-white/60 mb-8"
      >
        We couldn't retrieve the details for this order. Please check your dashboard.
      </p>
      <NuxtLink
        to="/dashboard"
        class="btn-secondary"
      >
        Go to Dashboard
      </NuxtLink>
    </div>

    <!-- Success State -->
    <div
      v-else-if="orderData"
      class="space-y-8 animate-fade-in"
    >
      <!-- Success Header Card -->
      <section
        class="text-center bg-dark-surface p-10 rounded-3xl border border-dark-divider shadow-2xl relative overflow-hidden"
        aria-labelledby="success-heading"
      >
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"
          aria-hidden="true"
        />

        <!-- Success Icon -->
        <div
          class="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
          aria-hidden="true"
        >
          <svg
            class="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <!-- Success Message -->
        <h1
          id="success-heading"
          ref="successHeadingRef"
          class="text-3xl font-bold text-white mb-2"
          tabindex="-1"
        >
          Purchase Successful!
        </h1>
        <p
          id="success-description"
          class="text-white/60"
        >
          Thank you for your order. You now have full access to your courses.
        </p>

        <!-- Action Buttons -->
        <nav
          class="mt-8 flex flex-wrap justify-center gap-4"
          aria-label="Next steps"
        >
          <NuxtLink
            to="/dashboard"
            class="btn-primary"
          >
            Start Learning Now
          </NuxtLink>
          <NuxtLink
            to="/courses"
            class="btn-secondary"
          >
            View More Courses
          </NuxtLink>
        </nav>
      </section>

      <!-- Order Details Section -->
      <section
        class="bg-dark-surface rounded-3xl border border-dark-divider overflow-hidden"
        aria-labelledby="order-details-heading"
      >
        <!-- Section Header -->
        <div
          class="px-8 py-6 border-b border-dark-divider flex justify-between items-center bg-white/5"
        >
          <h2
            id="order-details-heading"
            class="text-lg font-bold text-white"
          >
            Order Details
          </h2>
          <span
            class="text-xs font-mono text-white/70 uppercase tracking-widest"
            aria-label="Order number: {{ orderData.order.id }}"
          >
            #{{ orderData.order.id }}
          </span>
        </div>

        <!-- Order Items List -->
        <div class="p-8">
          <ul
            class="divide-y divide-dark-divider"
            role="list"
            aria-label="Purchased courses"
          >
            <li
              v-for="item in orderData.order.items"
              :key="item.id"
              class="py-6 flex gap-6 first:pt-0 last:pb-0"
              role="listitem"
            >
              <img
                :src="item.thumbnail"
                :alt="`Thumbnail for ${item.title} course`"
                class="w-24 h-16 object-cover rounded-xl border border-white/5 shadow-lg"
                loading="lazy"
              >
              <div class="flex-1 min-w-0">
                <h3 class="text-white font-bold text-lg mb-1 leading-tight">
                  {{ item.title }}
                </h3>
                <p
                  class="text-green-500 font-bold text-sm"
                  aria-label="Lifetime access included"
                >
                  <span
                    aria-hidden="true"
                  >✓</span>
                  <span class="sr-only">Included:</span>
                  Lifetime Access
                </p>
              </div>
              <div
                class="text-white font-black text-xl whitespace-nowrap"
                aria-label="Price: ${{ item.price }}"
              >
                ${{ item.price }}
              </div>
            </li>
          </ul>

          <!-- Payment Summary -->
          <dl class="mt-10 pt-6 border-t border-dark-divider">
            <div class="flex justify-between items-end">
              <div class="space-y-1">
                <dt class="text-white/60 text-xs uppercase tracking-wider font-bold">
                  Payment Method
                </dt>
                <dd class="text-white font-medium">
                  Portfolio Simulation
                </dd>
              </div>
              <div class="text-right">
                <dt class="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">
                  Total Paid
                </dt>
                <dd
                  class="text-3xl font-black text-primary"
                  aria-label="Total amount paid: ${{ orderData.order.totalAmount.toFixed(2) }}"
                >
                  ${{ orderData.order.totalAmount.toFixed(2) }}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <!-- Email Notification Note -->
      <p
        class="text-center text-white/20 text-xs uppercase tracking-widest"
        role="note"
        aria-label="Email notification note"
      >
        A confirmation email would normally be sent here.
      </p>

      <!-- Live Region for Screen Readers -->
      <div
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
        role="status"
      >
        Order {{ orderData.order.id }} confirmed. Total amount: ${{ orderData.order.totalAmount.toFixed(2) }}.
        {{ orderData.order.items.length }} {{ orderData.order.items.length === 1 ? 'course' : 'courses' }} purchased.
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useApiError } from '~/composables/useApiError'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

// Page metadata and SEO
definePageMeta({
  layout: 'minimal',
  middleware: 'auth',
  title: 'Order Confirmed',
})

useSeoMeta({
  title: 'Order Confirmed - Purchase Successful | Online Learning Platform',
  description: 'Your order has been confirmed. Start learning now with full access to your purchased courses.',
  robots: 'noindex, nofollow',
  ogTitle: 'Order Confirmed - Online Learning Platform',
  ogDescription: 'Your order has been confirmed. Start learning now with full access to your purchased courses.',
  ogType: 'website',
  ogUrl: 'https://learning-platform.com/checkout/success',
  twitterCard: 'summary',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

// Route and order fetching
const route = useRoute()
const orderId = computed(() => route.query.id as string)

// Order detail response type
interface OrderDetailResponse {
  success: boolean
  order: {
    id: number
    totalAmount: number
    status: string
    createdAt: string
    items: Array<{
      id: number
      title: string
      price: number
      thumbnail: string
    }>
  }
}

// Fetch order details
const { data, pending, error } = await useFetch<OrderDetailResponse>(
  () => `/api/orders/${orderId.value}`,
  {
    key: () => `order-${orderId.value}`,
    immediate: !!orderId.value,
  },
)

// Unified error handling (network + API response errors)
const hasError = useApiError(data, pending, error)

// Computed property for successful order data (type-safe)
const orderData = computed(() => data.value?.success ? data.value : null)

// Focus management - focus success heading when page loads
const successHeadingRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!pending.value && !hasError.value && orderData.value && successHeadingRef.value) {
    // Wait for next tick to ensure DOM is ready
    nextTick(() => {
      successHeadingRef.value?.focus()
    })
  }
})
</script>
