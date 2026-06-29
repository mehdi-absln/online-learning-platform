<template>
  <div class="bg-dark-bg rounded-xl p-6 border border-dark-divider h-full">
    <div
      v-if="loading"
      class="animate-pulse space-y-6"
      aria-hidden="true"
    >
      <!-- Search skeleton -->
      <div>
        <div class="h-5 w-16 bg-dark-divider rounded mb-4" />
        <div class="h-10 w-full bg-dark-divider rounded-lg" />
      </div>
      <!-- Filter sections -->
      <div
        v-for="i in 4"
        :key="i"
        class="pb-6 border-b border-dark-divider space-y-3"
      >
        <div class="h-5 w-20 bg-dark-divider rounded" />
        <div class="space-y-2">
          <div class="h-4 w-24 bg-dark-divider rounded" />
          <div class="h-4 w-20 bg-dark-divider rounded" />
          <div class="h-4 w-28 bg-dark-divider rounded" />
        </div>
      </div>
      <!-- Button skeleton -->
      <div class="h-12 w-full bg-dark-divider rounded" />
    </div>

    <!-- Error message -->
    <UiErrorState
      v-else-if="error"
      :message="`Error: ${error}`"
      :hide-retry="true"
      variant="minimal"
    />

    <!-- Filters -->
    <div v-else>
      <!-- Search -->
      <div class="mb-6">
        <label class="block text-base font-antonio font-bold text-primary mb-4">Search</label>
        <UiSearchInput
          v-model="searchQuery"
          placeholder="Search courses..."
          :debounce="400"
          @search="handleSearch"
          @clear="handleClear"
        />
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
            :options="categories?.map((c: { id: number; name: string }) => ({ label: c.name, value: String(c.id) })) || []"
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
            :options="levels?.map((l: string) => ({ label: l, value: l })) || []"
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
            :options="tags?.map((t: string) => ({ label: t, value: t })) || []"
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

const searchQuery = ref(filter.value.searchQuery || '')

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

// Search handlers
function handleSearch(query: string) {
  applyFiltersImmediate({
    ...filter.value,
    searchQuery: query || undefined,
  })
}

function handleClear() {
  applyFiltersImmediate({
    ...filter.value,
    searchQuery: undefined,
  })
}

// Watch for external changes to filter.searchQuery
watch(
  () => filter.value.searchQuery,
  (newQuery) => {
    searchQuery.value = newQuery || ''
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
</script>
