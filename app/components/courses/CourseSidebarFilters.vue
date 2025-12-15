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
            v-if="categories.length === 0"
            class="text-gray-400 text-sm"
          >
            No categories available
          </div>
          <div class="space-y-2">
            <div
              v-for="category in categories"
              :key="category"
              class="flex items-center"
            >
              <CourseFilterCheckbox
                :id="'category-' + category"
                v-model="filter.categories"
                :value="category"
                :label="category"
                @update:model-value="applyFilters"
              />
            </div>
          </div>
        </div>

        <!-- Level Filter -->
        <div class="pb-6 border-b border-dark-divider">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Level</label>
          <div
            v-if="levels.length === 0"
            class="text-gray-400 text-sm"
          >
            No levels available
          </div>
          <div class="space-y-2">
            <div
              v-for="level in levels"
              :key="level"
              class="flex items-center"
            >
              <CourseFilterCheckbox
                :id="'level-' + level"
                v-model="filter.levels"
                :value="level"
                :label="level"
                @update:model-value="applyFilters"
              />
            </div>
          </div>
        </div>

        <!-- Tag Filter -->
        <div class="pb-6 border-b border-dark-divider">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Tags</label>
          <div
            v-if="tags.length === 0"
            class="text-gray-400 text-sm"
          >
            No tags available
          </div>
          <div class="space-y-2">
            <div
              v-for="tag in tags"
              :key="tag"
              class="flex items-center"
            >
              <CourseFilterCheckbox
                :id="'tag-' + tag"
                v-model="filter.tags"
                :value="tag"
                :label="tag"
                @update:model-value="applyFilters"
              />
            </div>
          </div>
        </div>

        <!-- Price Filter -->
        <div class="pb-6 border-b border-dark-divider">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Price</label>
          <div class="space-y-3">
            <div class="flex items-center">
              <CourseFilterCheckbox
                id="free-only"
                v-model="filter.freeOnly"
                label="Free"
                @update:model-value="handleFreeOnlyChange"
              />
            </div>
            <div class="flex items-center">
              <CourseFilterCheckbox
                id="paid-only"
                v-model="filter.paidOnly"
                label="Paid"
                @update:model-value="handlePaidOnlyChange"
              />
            </div>
          </div>
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
import { debounce } from 'lodash-es'
import CourseFilterCheckbox from '~/components/courses/CourseFilterCheckbox.vue'

const {
  filter,
  categories,
  levels,
  tags,
  applyFilters,
  resetFilters,
  toggleExclusiveFilter,
  loading,
  error,
} = useCourseFilters()

const searchInput = ref(filter.value.searchQuery)

// Helper functions to handle filter updates
const handleFreeOnlyChange = (newValue: boolean | string[]) => {
  if (typeof newValue === 'boolean') {
    toggleExclusiveFilter('freeOnly', 'paidOnly', newValue)
  }
}
const handlePaidOnlyChange = (newValue: boolean | string[]) => {
  if (typeof newValue === 'boolean') {
    toggleExclusiveFilter('paidOnly', 'freeOnly', newValue)
  }
}

// Watch for changes in search input and apply filters with debounce
watch(
  searchInput,
  debounce((val) => {
    filter.value.searchQuery = val
    applyFilters()
  }, 300),
)

// Watch for changes in filter.searchQuery and update search input
watch(
  () => filter.value.searchQuery,
  (val) => {
    searchInput.value = val
  },
)

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return (
    filter.value.categories.length > 0
    || filter.value.levels.length > 0
    || filter.value.tags.length > 0
    || filter.value.freeOnly
    || filter.value.paidOnly
    || !!filter.value.searchQuery
  )
})

// Clear search input
const clearSearch = () => {
  searchInput.value = ''
  filter.value.searchQuery = ''
  applyFilters()
}
</script>
