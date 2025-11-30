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
            v-model="searchInput"
            type="text"
            placeholder="Search courses..."
            class="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1F1F1E] border border-[#474746] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <div v-if="categories.length === 0" class="text-gray-400 text-sm">
            No categories available
          </div>
          <div class="space-y-2">
            <div v-for="category in categories" :key="category" class="flex items-center">
              <CourseFilterItemCheckbox
                :id="'category-' + category"
                :value="category"
                v-model="filter.categories"
                @update:modelValue="applyFilters"
                :label="category"
              />
            </div>
          </div>
        </div>

        <!-- Level Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Level</label>
          <div v-if="levels.length === 0" class="text-gray-400 text-sm">No levels available</div>
          <div class="space-y-2">
            <div v-for="level in levels" :key="level" class="flex items-center">
              <CourseFilterItemCheckbox
                :id="'level-' + level"
                :value="level"
                v-model="filter.levels"
                @update:modelValue="applyFilters"
                :label="level"
              />
            </div>
          </div>
        </div>

        <!-- Tag Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Tags</label>
          <div v-if="tags.length === 0" class="text-gray-400 text-sm">No tags available</div>
          <div class="space-y-2">
            <div v-for="tag in tags" :key="tag" class="flex items-center">
              <CourseFilterItemCheckbox
                :id="'tag-' + tag"
                :value="tag"
                v-model="filter.tags"
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
              <CourseFilterPriceCheckbox
                id="free-only"
                label="Free"
                v-model="filter.freeOnly"
                @change="updatePriceFilter"
              />
            </div>
            <div class="flex items-center">
              <CourseFilterPriceCheckbox
                id="paid-only"
                label="Paid"
                v-model="filter.paidOnly"
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
import { useCourseFilters } from '~/composables/useCourseFilters'
import { debounce } from 'lodash-es'
import CourseFilterItemCheckbox from '~/components/courses/CourseFilterItemCheckbox.vue'
import CourseFilterPriceCheckbox from '~/components/courses/CourseFilterPriceCheckbox.vue'

const {
  filter,
  categories,
  levels,
  tags,
  applyFilters,
  resetFilters,
  toggleExclusiveFilter,
  fetchFilterOptions,
  loading,
  error
} = useCourseFilters()

const searchInput = ref(filter.value.searchQuery)

// Watch for changes in search input and apply filters with debounce
watch(
  searchInput,
  debounce((val) => {
    filter.value.searchQuery = val
    applyFilters()
  }, 300)
)

// Watch for changes in filter.searchQuery and update search input
watch(
  () => filter.value.searchQuery,
  (val) => {
    searchInput.value = val
  }
)

const updatePriceFilter = () => {
  toggleExclusiveFilter('freeOnly', 'paidOnly')
}

// Fetch filter options when component is mounted
onMounted(async () => {
  await fetchFilterOptions()
})
</script>
