<template>
  <div
    class="border border-dark-divider rounded-xl p-3 mt-10 flex flex-wrap items-center justify-between gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
    role="group"
    aria-label="Pagination"
  >
    <!-- Page Info -->
    <p
      class="text-white/70"
      aria-live="polite"
      aria-atomic="true"
    >
      Page <span class="text-white">{{ activePage }}</span> of
      <span class="text-white">{{ totalPages }}</span>
    </p>

    <!-- Pagination Controls -->
    <ul class="flex items-center space-x-6">
      <!-- Previous -->
      <li>
        <button
          type="button"
          :disabled="activePage <= 1"
          :aria-disabled="activePage <= 1"
          aria-label="Go to previous page"
          class="text-white disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary transition-colors duration-300 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          @click="goToPage(activePage - 1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span class="sr-only">Previous</span>
        </button>
      </li>

      <!-- Pages -->
      <li
        v-for="page in pages"
        :key="page"
      >
        <button
          type="button"
          :aria-label="`Go to page ${page}`"
          :aria-current="activePage === page ? 'page' : undefined"
          class="relative text-lg pb-1 px-2 transition-all duration-300 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :class="activePage === page ? 'text-primary' : 'text-white hover:text-primary'"
          @click="goToPage(page)"
        >
          <span
            v-if="activePage === page"
            class="sr-only"
          >Current page, </span>
          {{ page }}

          <!-- Underline indicator -->
          <span
            class="absolute left-0 bottom-0 h-[2px] bg-primary w-full origin-left transform transition-transform duration-300"
            :class="activePage === page ? 'scale-x-100' : 'scale-x-0'"
            aria-hidden="true"
          />
        </button>
      </li>

      <!-- Next -->
      <li>
        <button
          type="button"
          :disabled="activePage >= totalPages"
          :aria-disabled="activePage >= totalPages"
          aria-label="Go to next page"
          class="text-white disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary transition-colors duration-300 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          @click="goToPage(activePage + 1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="sr-only">Next</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage?: number
  totalPages: number
  onPageChange: (page: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
})

const activePage = computed(() => props.currentPage ?? 1)

const pages = computed(() => {
  const pagesArray = []
  const startPage = Math.max(1, activePage.value - 2)
  const endPage = Math.min(props.totalPages, activePage.value + 2)

  for (let i = startPage; i <= endPage; i++) {
    pagesArray.push(i)
  }

  return pagesArray
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== activePage.value) {
    props.onPageChange(page)
  }
}
</script>
