<template>
  <div class="max-w-3xl mx-auto">
    <div
      v-if="pending"
      class="text-center py-20"
      role="status"
      aria-live="polite"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
      />
      <p class="mt-4 text-white/60">
        Verifying order details...
      </p>
    </div>

    <div
      v-else-if="error || !data?.success"
      class="text-center py-20 bg-dark-surface rounded-3xl border border-dark-divider"
    >
      <div class="text-red-500 mb-6">
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
      <h1 class="text-2xl font-bold text-white mb-4">
        Order Verification Error
      </h1>
      <p class="text-white/60 mb-8">
        We couldn't retrieve the details for this order. Please check your dashboard.
      </p>
      <NuxtLink
        to="/dashboard"
        class="btn-secondary"
      >
        Go to Dashboard
      </NuxtLink>
    </div>

    <div
      v-else
      class="space-y-8 animate-fade-in"
    >
      <!-- Success Header -->
      <div
        class="text-center bg-dark-surface p-10 rounded-3xl border border-dark-divider shadow-2xl relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"
        />

        <div
          class="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
        >
          <svg
            class="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-white mb-2">
          Purchase Successful!
        </h1>
        <p class="text-white/60">
          Thank you for your order. You now have full access to your courses.
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-4">
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
        </div>
      </div>

      <!-- Order Details Card -->
      <div class="bg-dark-surface rounded-3xl border border-dark-divider overflow-hidden">
        <div
          class="px-8 py-6 border-b border-dark-divider flex justify-between items-center bg-white/5"
        >
          <h2 class="text-lg font-bold text-white">
            Order Details
          </h2>
          <span
            class="text-xs font-mono text-white/70 uppercase tracking-widest"
          >#{{ data.order.id }}</span>
        </div>

        <div class="p-8">
          <div class="divide-y divide-dark-divider">
            <div
              v-for="item in data.order.items"
              :key="item.id"
              class="py-6 flex gap-6 first:pt-0"
            >
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="w-24 h-16 object-cover rounded-xl border border-white/5 shadow-lg"
              >
              <div class="flex-1">
                <h3 class="text-white font-bold text-lg mb-1 leading-tight">
                  {{ item.title }}
                </h3>
                <p class="text-green-500 font-bold text-sm">
                  ✓ Lifetime Access
                </p>
              </div>
              <div class="text-white font-black text-xl">
                ${{ item.price }}
              </div>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t border-dark-divider">
            <div class="flex justify-between items-end">
              <div class="space-y-1">
                <p class="text-white/60 text-xs uppercase tracking-wider font-bold">
                  Payment Method
                </p>
                <p class="text-white font-medium">
                  Portfolio Simulation
                </p>
              </div>
              <div class="text-right">
                <p class="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">
                  Total Paid
                </p>
                <p class="text-3xl font-black text-primary">
                  ${{ data.order.totalAmount.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="text-center text-white/20 text-xs uppercase tracking-widest">
        A confirmation email would normally be sent here.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'minimal',
  middleware: 'auth',
})

useHead({
  title: 'Order Confirmed - Online Learning Platform',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Order Confirmed - Online Learning Platform' },
    { property: 'og:description', content: 'Order confirmation page.' },
    { name: 'twitter:card', content: 'summary' },
  ],
  link: [
    { rel: 'canonical', href: 'https://learning-platform.com/checkout/success' },
  ],
})

const route = useRoute()
const orderId = route.query.id

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

const { data, pending, error } = await useFetch<OrderDetailResponse>(`/api/orders/${orderId}`, {
  key: `order-${orderId}`,
})
</script>
