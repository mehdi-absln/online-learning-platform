<template>
  <div class="min-h-screen bg-dark-gray">
    <UiPageHero
      title="Blogs"
      subtitle="Read our latest articles and tutorials"
      :breadcrumb-crumbs="[{ name: 'Blog', path: '/blogs' }]"
    />

    <section
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-labelledby="blogs-section-title"
    >
      <h2
        id="blogs-section-title"
        class="sr-only"
      >
        Blog Articles
      </h2>

      <!-- Search and Filter Bar -->
      <div
        class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        role="search"
        aria-label="Search blog articles"
      >
        <!-- Results Count -->
        <p
          class="text-gray-400"
          aria-live="polite"
          aria-atomic="true"
        >
          <span class="text-white font-semibold">{{ blogs.length }}</span>
          {{ blogs.length === 1 ? 'article' : 'articles' }}
          <span
            v-if="searchQuery"
            class="text-gray-500"
          >
            • Searching for "<span class="text-white">{{ searchQuery }}</span>"
          </span>
        </p>

        <!-- Search Input -->
        <UiSearchInput
          :model-value="searchQuery"
          placeholder="Search articles..."
          wrapper-class="w-full sm:w-80"
          aria-label="Search blog articles"
          @search="handleSearch"
          @clear="handleClear"
        />
      </div>

      <!-- Search Results Region -->
      <div
        aria-live="polite"
        aria-busy="false"
        :aria-label="searchResultsLabel"
      >
        <!-- No Results State -->
        <div
          v-if="!isLoading && searchQuery && blogs.length === 0"
          class="text-center py-12"
          role="status"
        >
          <svg
            class="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg font-medium text-white mb-2">
            No articles found
          </h3>
          <p class="text-gray-400">
            No articles found for "<span class="text-white font-medium">{{ searchQuery }}</span>"
          </p>
          <button
            type="button"
            class="btn-primary mt-4"
            @click="handleClear"
          >
            Clear search
          </button>
        </div>

        <!-- Loading State -->
        <div
          v-else-if="isLoading"
          class="flex justify-center py-12"
          role="status"
          aria-label="Loading blog articles"
        >
          <UiLoadingSpinner message="Loading articles..." />
        </div>

        <!-- Blogs Grid -->
        <BlogsGrid
          v-else
          :blogs="blogs"
          :current-page="currentPage"
          :total-pages="totalPages"
          :on-page-change="handlePageChange"
          :loading="isLoading"
          aria-label="Blog articles list"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta Tags
useHead({
  title: 'Blog - Learning Platform',
  meta: [
    {
      name: 'description',
      content: 'Read our latest articles, tutorials, and insights about online learning and education',
    },
    {
      property: 'og:title',
      content: 'Blog - Learning Platform',
    },
    {
      property: 'og:description',
      content: 'Read our latest articles, tutorials, and insights about online learning and education',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ],
})

// ✅ Updated: Using simplified composable return values
const {
  blogs,
  isLoading,
} = useBlogs()

const {
  currentPage,
  totalPages,
  searchQuery,
  searchBlogs,
  clearSearch,
  changePage,
} = useBlogFilters()

// Computed for accessibility - Updated to use blogs instead of filteredBlogs
const searchResultsLabel = computed(() => {
  if (!searchQuery.value) {
    return 'All blog articles'
  }
  const count = blogs.value.length
  return `Search results: ${count} ${count === 1 ? 'article' : 'articles'} found for "${searchQuery.value}"`
})

// Event handlers - بدون تغییر
const handleSearch = (query: string) => {
  searchBlogs(query)
}

const handleClear = () => {
  clearSearch()
}

const handlePageChange = (page: number) => {
  changePage(page)
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
</script>
