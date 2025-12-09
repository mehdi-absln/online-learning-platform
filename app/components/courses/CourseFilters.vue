<template>
  <div class="bg-[#282828] rounded-xl p-6 mb-8 border border-[#474746]">
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <input
            v-model="localFilter.searchQuery"
            type="text"
            placeholder="Search courses..."
            class="w-full px-4 py-2 rounded-lg bg-[#1F1F1E] border border-[#474746] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            @input="applyFilters"
          />
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            v-model="localFilter.category"
            class="w-full px-4 py-2 rounded-lg bg-[#1F1F1E] border border-[#474746] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Level Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Level</label>
          <select
            v-model="localFilter.level"
            class="w-full px-4 py-2 rounded-lg bg-[#1F1F1E] border border-[#474746] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Levels</option>
            <option v-for="level in levels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>

        <!-- Price Range Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
          <div class="flex space-x-2">
            <input
              v-model.number="localFilter.minPrice"
              type="number"
              placeholder="Min"
              class="w-full px-3 py-2 rounded-lg bg-[#1F1F1E] border border-[#474746] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              @input="applyFilters"
            />
            <input
              v-model.number="localFilter.maxPrice"
              type="number"
              placeholder="Max"
              class="w-full px-3 py-2 rounded-lg bg-[#1F1F1E] border border-[#474746] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              @input="applyFilters"
            />
          </div>
        </div>
      </div>

      <!-- Reset Button -->
      <div class="mt-4 flex justify-end">
        <button
          @click="resetFilters"
          class="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CoursesFilter } from '~/types/courses-filter'
import { debounce } from 'lodash-es'

const coursesStore = useCoursesStore()
const { categories, levels, fetchFilterOptions, loading, error } = useCourseFilters()

// Initialize local filter with the current filter from the store
const localFilter = ref<CoursesFilter>({ ...coursesStore.currentFilter })

// Fetch filter options when component is mounted
onMounted(async () => {
  await fetchFilterOptions()
})

// Watch for changes in store filter and update local filter
watch(
  () => coursesStore.currentFilter,
  (newFilter) => {
    // Update only the changed properties to avoid overriding user input
    localFilter.value = {
      ...localFilter.value,
      ...newFilter
    }
  },
  { deep: true }
)

// Apply filters without debounce to ensure all filters are applied immediately
const applyFilters = () => {
  coursesStore.applyFilter(localFilter.value)
}

const resetFilters = () => {
  localFilter.value = {}
  coursesStore.resetFilter()
}
</script>
