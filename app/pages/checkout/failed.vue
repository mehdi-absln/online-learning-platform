<template>
  <main
    id="failed-main"
    class="max-w-2xl mx-auto py-16 px-4"
    role="main"
    aria-labelledby="failed-heading"
  >
    <section
      class="bg-dark-surface p-12 rounded-3xl border border-dark-divider shadow-2xl relative overflow-hidden"
      aria-labelledby="failed-heading"
    >
      <!-- Decorative Top Border -->
      <div
        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"
        aria-hidden="true"
      />

      <!-- Error Icon -->
      <div
        class="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <!-- Error Message -->
      <h1
        id="failed-heading"
        ref="failedHeadingRef"
        class="text-3xl font-bold text-white mb-4"
        tabindex="-1"
      >
        Payment Declined
      </h1>
      <p
        id="failed-description"
        class="text-white/70 text-lg mb-10 max-w-md mx-auto"
      >
        We couldn't process your simulated payment. This might happen in a real-world scenario due to insufficient funds, network issues, or an expired card.
      </p>

      <!-- Action Buttons -->
      <nav
        class="flex flex-col sm:flex-row justify-center gap-4"
        aria-label="Payment recovery options"
      >
        <NuxtLink
          to="/checkout"
          class="btn-primary flex items-center justify-center gap-2"
          aria-label="Return to checkout to try payment again"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
          aria-label="Browse more courses without purchasing"
        >
          Keep Browsing
        </NuxtLink>
      </nav>
    </section>

    <!-- Helpful Tip -->
    <aside
      class="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 inline-block"
      role="note"
      aria-labelledby="tip-label"
    >
      <p class="text-dark-muted text-sm">
        <span
          id="tip-label"
          class="text-white/60 font-bold uppercase tracking-widest mr-2"
        >Tip:</span>
        <span>
          In this portfolio, you can choose
          <strong class="text-white/80">Successful Payment</strong>
          on the checkout page to complete the flow.
        </span>
      </p>
    </aside>

    <!-- Live Region for Screen Readers -->
    <div
      aria-live="assertive"
      aria-atomic="true"
      class="sr-only"
      role="alert"
    >
      Payment was declined. Please try again or contact support if the problem persists.
    </div>
  </main>
</template>

<script setup lang="ts">
// Page metadata and SEO
definePageMeta({
  layout: 'minimal',
  middleware: 'auth',
  title: 'Payment Failed',
})

useSeoMeta({
  title: 'Payment Declined - Try Again | Online Learning Platform',
  description: 'Your payment was declined. Learn what might have gone wrong and how to complete your purchase.',
  robots: 'noindex, nofollow',
  ogTitle: 'Payment Declined - Online Learning Platform',
  ogDescription: 'Your payment was declined. Try again or browse more courses.',
  ogType: 'website',
  ogUrl: 'https://learning-platform.com/checkout/failed',
  twitterCard: 'summary',
  canonical: 'https://learning-platform.com/checkout/failed',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

// Focus management - focus error heading when page loads
const failedHeadingRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Focus the error heading for screen readers
  if (failedHeadingRef.value) {
    nextTick(() => {
      failedHeadingRef.value?.focus()
    })
  }
})
</script>
