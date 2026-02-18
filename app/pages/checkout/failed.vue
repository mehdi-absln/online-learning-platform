<template>
  <div class="max-w-2xl mx-auto text-center">
    <div class="bg-dark-surface p-12 rounded-3xl border border-dark-divider shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />

      <div class="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 class="text-3xl font-bold text-white mb-4">
        Payment Declined
      </h1>
      <p class="text-white/70 text-lg mb-10 max-w-md mx-auto">
        We couldn't process your simulated payment. This might happen in a real-world scenario due to insufficient funds or network issues.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <NuxtLink
          to="/checkout"
          class="btn-primary flex items-center justify-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </NuxtLink>
        <NuxtLink
          to="/courses"
          class="btn-secondary"
        >
          Keep Browsing
        </NuxtLink>
      </div>
    </div>

    <div class="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 inline-block">
      <p class="text-dark-muted text-sm">
        <span class="text-white/60 font-bold uppercase tracking-widest mr-2">Tip:</span>
        In this portfolio, you can choose <strong>Successful Payment</strong> to complete the flow.
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
  title: 'Payment Failed - Online Learning Platform',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Payment Failed - Online Learning Platform' },
    { property: 'og:description', content: 'Payment simulation failed.' },
    { name: 'twitter:card', content: 'summary' },
  ],
  link: [
    { rel: 'canonical', href: 'https://learning-platform.com/checkout/failed' },
  ],
})
</script>
