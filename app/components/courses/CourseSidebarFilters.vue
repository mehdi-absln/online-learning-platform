<template>
  <div class="bg-dark-bg rounded-xl p-6 border border-dark-divider h-full">
    <div
      v-if="loading"
      class="text-center py-10"
    >
      <LoadingSpinner message="Loading filters..." />
    </div>

    <!-- Error message -->
    <div
      v-else-if="error"
      class="text-center py-10"
    >
      <p class="text-red-500">
        Error: {{ error }}
      </p>
    </div>

    <!-- Filters -->
    <div v-else>
      <!-- Search Input -->
      <div class="mb-6">
        <label class="block text-base font-antonio font-bold text-primary mb-4">Search</label>
        <div class="relative">
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search courses..."
            class="w-full pl-10 pr-10 py-3 rounded-lg bg-dark-surface border border-dark-divider text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-5 h-5 text-gray-400 fill-none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            v-if="searchInput"
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            @click="clearSearch"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
      </div>

      <div class="space-y-6">
        <!-- Category Filter -->
        <div class="pb-6 border-b border-dark-divider">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Category</label>
          <div
            v-if="!categories || categories.length === 0"
            class="text-gray-400 text-sm"
          >
            No categories available
          </div>
          <FilterCheckboxGroup
            :model-value="filter.categories || []"
            name="category"
            :options="categories?.map(c => ({ label: c, value: c })) || []"
            @update:model-value="handleCategoryChange"
          />
        </div>

        <!-- Level Filter -->
        <div class="pb-6 border-b border-dark-divider">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Level</label>
          <div
            v-if="!levels || levels.length === 0"
            class="text-gray-400 text-sm"
          >
            No levels available
          </div>
          <FilterCheckboxGroup
            :model-value="filter.levels || []"
            name="level"
            :options="levels?.map(l => ({ label: l, value: l })) || []"
            @update:model-value="handleLevelChange"
          />
        </div>

        <!-- Tag Filter -->
        <div class="pb-6 border-b border-dark-divider">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Tags</label>
          <div
            v-if="!tags || tags.length === 0"
            class="text-gray-400 text-sm"
          >
            No tags available
          </div>
          <FilterCheckboxGroup
            :model-value="filter.tags || []"
            name="tag"
            :options="tags?.map(t => ({ label: t, value: t })) || []"
            @update:model-value="handleTagChange"
          />
        </div>
        <!-- Price Filter -->
        <div class="pb-6 border-b border-dark-divider">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Price</label>
          <FilterRadioGroup
            :model-value="filter.priceFilter || 'all'"
            name="price"
            :options="priceOptions"
            @update:model-value="handlePriceChange"
          />
        </div>
      </div>

      <!-- Reset Button -->
      <div class="mt-6">
        <button
          :disabled="!hasActiveFilters"
          class="relative w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-primary to-primary/90 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          @click="resetFilters"
        >
          <span
            class="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-500"
          />
          <span class="relative z-10 flex items-center justify-center">
            <svg
              class="w-5 h-5 mr-2 fill-none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear All Filters
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseFilters } from '~/composables/useCourseFilters'
import FilterRadioGroup from '~/components/courses/FilterRadioGroup.vue'
import FilterCheckboxGroup from '~/components/courses/FilterCheckboxGroup.vue'

const {
  filter,
  categories,
  levels,
  tags,
  applyFiltersImmediate,
  resetFilters,
  loading,
  error,
} = useCourseFilters()

const searchInput = ref(filter.value.searchQuery || '')

const priceOptions = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
]

// Separate handlers for each filter type
const handleCategoryChange = (newCategories: string[]) => {
  applyFiltersImmediate({
    ...filter.value,
    categories: newCategories,
  })
}

const handleLevelChange = (newLevels: string[]) => {
  applyFiltersImmediate({
    ...filter.value,
    levels: newLevels,
  })
}

const handleTagChange = (newTags: string[]) => {
  applyFiltersImmediate({
    ...filter.value,
    tags: newTags,
  })
}

const handlePriceChange = (newPrice: string) => {
  applyFiltersImmediate({
    ...filter.value,
    priceFilter: newPrice as 'all' | 'free' | 'paid',
  })
}

// Debounced search using applyFilters
const { applyFilters } = useCourseFilters()

watch(
  searchInput,
  (val) => {
    applyFilters({
      ...filter.value,
      searchQuery: val,
    })
  },
)

// Watch for external changes to filter.searchQuery
watch(
  () => filter.value.searchQuery,
  (val) => {
    if (val !== searchInput.value) {
      searchInput.value = val || ''
    }
  },
)

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return (
    (filter.value.categories && filter.value.categories.length > 0)
    || (filter.value.levels && filter.value.levels.length > 0)
    || (filter.value.tags && filter.value.tags.length > 0)
    || (filter.value.priceFilter && filter.value.priceFilter !== 'all')
    || !!filter.value.searchQuery
  )
})

// Clear search input
const clearSearch = () => {
  searchInput.value = ''
  applyFiltersImmediate({
    ...filter.value,
    searchQuery: '',
  })
}
</script>
