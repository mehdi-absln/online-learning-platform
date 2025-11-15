<template>
  <div class="bg-[#282828] rounded-xl p-6 border border-[#474746] h-full">
    <!-- Loading indicator -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-white">Loading filters...</p>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500">Error: {{ error }}</p>
    </div>

    <!-- Filters -->
    <div v-else>
      <!-- Search Input -->
      <div class="mb-6">
        <label class="block text-base font-antonio font-bold text-primary mb-4">Search</label>
        <div class="relative">
          <input
            v-model="localFilter.searchQuery"
            type="text"
            placeholder="Search courses..."
            class="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1F1F1E] border border-[#474746] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            @input="applyFilters"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 fill-none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Category Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Category</label>
          <div class="space-y-2">
            <div v-for="category in categories" :key="category" class="flex items-center">
              <FilterItemCheckbox
                :id="'category-' + category"
                :value="category"
                v-model="localFilter.categories"
                @update:modelValue="applyFilters"
                :label="category"
              />
            </div>
          </div>
        </div>

        <!-- Level Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Level</label>
          <div class="space-y-2">
            <div v-for="level in levels" :key="level" class="flex items-center">
              <FilterItemCheckbox
                :id="'level-' + level"
                :value="level"
                v-model="localFilter.levels"
                @update:modelValue="applyFilters"
                :label="level"
              />
            </div>
          </div>
        </div>

        <!-- Tag Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Tags</label>
          <div class="space-y-2">
            <div v-for="tag in tags" :key="tag" class="flex items-center">
              <FilterItemCheckbox
                :id="'tag-' + tag"
                :value="tag"
                v-model="localFilter.tags"
                @update:modelValue="applyFilters"
                :label="tag"
              />
            </div>
          </div>
        </div>

        <!-- Price Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Price</label>
          <div class="space-y-3">
            <div class="flex items-center">
              <FilterCheckbox
                id="free-only"
                label="Free"
                v-model="localFilter.freeOnly"
                @change="updatePriceFilter"
              />
            </div>
            <div class="flex items-center">
              <FilterCheckbox
                id="paid-only"
                label="Paid"
                v-model="localFilter.paidOnly"
                @change="updatePriceFilter"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Reset Button -->
      <div class="mt-6">
        <button
          @click="resetFilters"
          class="relative w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-primary to-primary/90 group overflow-hidden"
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
              ></path>
            </svg>
            Clear All Filters
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import type { ExtendedCoursesFilter } from '~/types/courses-filter'
import { useRoute } from '#app'

const coursesStore = useCoursesStore()
const route = useRoute()
const { categories, levels, tags, fetchFilterOptions, loading, error } = useCourseFilters()

// Initialize local filter with the current filter from the store and URL query
const localFilter = ref<ExtendedCoursesFilter>({
  categories: coursesStore.currentFilter.categories ||
    (route.query.category ? [route.query.category as string] : []) ||
    [],
  levels: coursesStore.currentFilter.levels ||
    (route.query.level ? [route.query.level as string] : []) ||
    [],
  tags: coursesStore.currentFilter.tags ||
    (route.query.tag
      ? [route.query.tag as string]
      : route.query.tags
        ? Array.isArray(route.query.tags)
          ? route.query.tags.map((tag) => tag as string)
          : [route.query.tags as string]
        : []) ||
    [],
  freeOnly: coursesStore.currentFilter.freeOnly || route.query.freeOnly === 'true',
  paidOnly: coursesStore.currentFilter.paidOnly || route.query.paidOnly === 'true',
  searchQuery: coursesStore.currentFilter.searchQuery || (route.query.q as string) || '',
  ...coursesStore.currentFilter
})

// Fetch filter options when component is mounted
onMounted(async () => {
  await fetchFilterOptions()

  // Apply filters from URL query after filter options are loaded
  if (
    route.query.tag ||
    route.query.tags ||
    route.query.category ||
    route.query.level ||
    route.query.q ||
    route.query.freeOnly ||
    route.query.paidOnly
  ) {
    applyFilters()
  }
})

// Watch for changes in store filter and update local filter
watch(
  () => coursesStore.currentFilter,
  (newFilter) => {
    localFilter.value = {
      categories: newFilter.categories || [],
      levels: newFilter.levels || [],
      tags: newFilter.tags || [],
      freeOnly: newFilter.freeOnly || false,
      paidOnly: newFilter.paidOnly || false,
      searchQuery: newFilter.searchQuery || '',
      ...newFilter
    }
  },
  { deep: true }
)

// Toggle exclusive boolean filters (e.g. freeOnly and paidOnly)
const toggleExclusiveFilter = (filterName: keyof ExtendedCoursesFilter, oppositeFilterName: keyof ExtendedCoursesFilter) => {
  if (localFilter.value[filterName] && localFilter.value[oppositeFilterName]) {
    localFilter.value[oppositeFilterName] = false
  }
  applyFilters()
}

const updatePriceFilter = () => {
  toggleExclusiveFilter('freeOnly', 'paidOnly')
}

const applyFilters = debounce(() => {
  coursesStore.applyFilter(localFilter.value)
}, 300)

const resetFilters = () => {
  // Reset all filter values to their defaults
  localFilter.value = {
    categories: [],
    levels: [],
    tags: [],
    freeOnly: false,
    paidOnly: false,
    searchQuery: ''
  }
  coursesStore.resetFilter()
  coursesStore.fetchAllCourses()
}
</script>

<style scoped>
input[type='checkbox']:checked:hover {
  filter: brightness(100%);
  border-color: #e05243; /* Primary color */
  background-color: #e05243; /* Primary color */
}
</style>
