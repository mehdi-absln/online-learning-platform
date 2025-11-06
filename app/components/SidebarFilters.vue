<template>
  <div class="bg-[#282828] rounded-xl p-6 border border-[#474746] h-full">
    <!-- Search Input -->
    <div class="mb-6">
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
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
      <div v-for="category in categories" :key="category" class="flex items-center mb-2">
        <input
          :id="'category-' + category"
          type="checkbox"
          :value="category"
          v-model="selectedCategories"
          @change="updateCategoryFilter"
          class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
        <label :for="'category-' + category" class="ml-2 text-sm text-gray-300">
          {{ category }}
        </label>
      </div>
    </div>

    <!-- Level Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-300 mb-2">Level</label>
      <div v-for="level in levels" :key="level" class="flex items-center mb-2">
        <input
          :id="'level-' + level"
          type="checkbox"
          :value="level"
          v-model="selectedLevels"
          @change="updateLevelFilter"
          class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
        <label :for="'level-' + level" class="ml-2 text-sm text-gray-300">
          {{ level }}
        </label>
      </div>
    </div>

    <!-- Tag Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-300 mb-2">Tags</label>
      <div v-for="tag in tags" :key="tag" class="flex items-center mb-2">
        <input
          :id="'tag-' + tag"
          type="checkbox"
          :value="tag"
          v-model="selectedTags"
          @change="updateTagFilter"
          class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
        <label :for="'tag-' + tag" class="ml-2 text-sm text-gray-300">
          {{ tag }}
        </label>
      </div>
    </div>

    <!-- Price Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-300 mb-2">Price</label>
      <div class="flex flex-col">
        <div class="flex items-center mb-2">
          <input
            id="free-only"
            type="checkbox"
            v-model="localFilter.freeOnly"
            @change="updatePriceFilter"
            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <label for="free-only" class="ml-2 text-sm text-gray-300">
            Free
          </label>
        </div>
        <div class="flex items-center mb-2">
          <input
            id="paid-only"
            type="checkbox"
            v-model="localFilter.paidOnly"
            @change="updatePriceFilter"
            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <label for="paid-only" class="ml-2 text-sm text-gray-300">
            Paid
          </label>
        </div>
      </div>
    </div>

    <!-- Reset Button -->
    <div class="mt-4">
      <button
        @click="resetFilters"
        class="w-full px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCoursesStore } from '~/stores/courses'
import type { CoursesFilter } from '~/types/courses-filter'
import { debounce } from 'lodash-es'

const coursesStore = useCoursesStore()

// Initialize local filter with the current filter from the store
const localFilter = ref<CoursesFilter>({ ...coursesStore.currentFilter })

// Available categories, levels and tags - these might come from an API in a real application
const categories = ref(['Programming', 'Design', 'Marketing', 'Photography', 'Data Science', 'Business'])
const levels = ref(['Beginner', 'Intermediate', 'Advanced'])
const tags = ref(['WordPress', 'JavaScript', 'Python', 'UI/UX', 'React', 'Vue'])

// Initialize selected values based on current filter
const selectedCategories = ref<string[]>(localFilter.value.category ? [localFilter.value.category] : [])
const selectedLevels = ref<string[]>(localFilter.value.level ? [localFilter.value.level] : [])
const selectedTags = ref<string[]>(localFilter.value.tags || [])

// Initialize price filters if needed
if (localFilter.value.freeOnly === undefined) localFilter.value.freeOnly = false
if (localFilter.value.paidOnly === undefined) localFilter.value.paidOnly = false

// For multiple selection, we need to update the filter object format
// Initialize the local filter to handle arrays for category, level and tags if needed
if (!localFilter.value.categories) localFilter.value.categories = []
if (!localFilter.value.levels) localFilter.value.levels = []
if (!localFilter.value.tags) localFilter.value.tags = []

// Update local filter with selected categories
const updateCategoryFilter = () => {
  localFilter.value.categories = [...selectedCategories.value]
  applyFilters()
}

// Update local filter with selected levels
const updateLevelFilter = () => {
  localFilter.value.levels = [...selectedLevels.value]
  applyFilters()
}

// Update local filter with selected tags
const updateTagFilter = () => {
  // Update the local filter with selected tags
  localFilter.value.tags = [...selectedTags.value]
  applyFilters()
}

// Watch for changes in store filter and update local filter
watch(() => coursesStore.currentFilter, (newFilter) => {
  localFilter.value = { ...newFilter }
  
  // Update selected categories - consider both single category and categories array
  selectedCategories.value = newFilter.categories ? [...newFilter.categories] : (newFilter.category ? [newFilter.category] : [])
  
  // Update selected levels - consider both single level and levels array
  selectedLevels.value = newFilter.levels ? [...newFilter.levels] : (newFilter.level ? [newFilter.level] : [])
  
  // Update selected tags
  selectedTags.value = newFilter.tags || []
  
  // Initialize price filters if needed
  if (localFilter.value.freeOnly === undefined) localFilter.value.freeOnly = false
  if (localFilter.value.paidOnly === undefined) localFilter.value.paidOnly = false
}, { deep: true })



const updatePriceFilter = () => {
  // Make sure both freeOnly and paidOnly are not selected at the same time
  if (localFilter.value.freeOnly && localFilter.value.paidOnly) {
    // If both are selected, deselect one of them (let's deselect paidOnly)
    localFilter.value.paidOnly = false
  }
  applyFilters()
}

const applyFilters = debounce(() => {
  // Merge all filters
  const finalFilter = {
    ...localFilter.value,
    // Add any additional filter properties if needed
  }
  coursesStore.applyFilter(finalFilter)
}, 300)

const resetFilters = () => {
  localFilter.value = {}
  selectedCategories.value = []
  selectedLevels.value = []
  selectedTags.value = []
  // Reset price filters
  localFilter.value.freeOnly = false
  localFilter.value.paidOnly = false
  // Reset categories and levels arrays
  localFilter.value.categories = []
  localFilter.value.levels = []
  // Reset tags
  localFilter.value.tags = []
  coursesStore.resetFilter()
  coursesStore.fetchAllCourses()
}
</script>