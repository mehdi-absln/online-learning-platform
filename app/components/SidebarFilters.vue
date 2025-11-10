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
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
              <div class="relative">
                <input
                  :id="'category-' + category"
                  type="checkbox"
                  :value="category"
                  v-model="localFilter.categories"
                  @change="applyFilters"
                  class="w-4 h-4 text-primary bg-[#1F1F1E] border-[#474746] rounded cursor-pointer opacity-0 absolute z-10"
                />
                <label
                  :for="'category-' + category"
                  class="flex items-center cursor-pointer"
                  :class="
                    localFilter.categories.includes(category) ? 'text-primary' : 'text-gray-300'
                  "
                >
                  <span
                    class="w-4 h-4 flex items-center justify-center rounded border mr-3"
                    :class="
                      localFilter.categories.includes(category)
                        ? 'border-primary bg-primary'
                        : 'border-[#474746] bg-[#1F1F1E]'
                    "
                  >
                    <svg
                      v-show="localFilter.categories.includes(category)"
                      class="w-3 h-3 text-[#1F1F1E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                </label>
              </div>
              <label
                :for="'category-' + category"
                class="ml-1 text-sm text-gray-300 cursor-pointer flex-1 py-1"
              >
                {{ category }}
              </label>
            </div>
          </div>
        </div>

        <!-- Level Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Level</label>
          <div class="space-y-2">
            <div v-for="level in levels" :key="level" class="flex items-center">
              <div class="relative">
                <input
                  :id="'level-' + level"
                  type="checkbox"
                  :value="level"
                  v-model="localFilter.levels"
                  @change="applyFilters"
                  class="w-4 h-4 text-primary bg-[#1F1F1E] border-[#474746] rounded cursor-pointer opacity-0 absolute z-10"
                />
                <label
                  :for="'level-' + level"
                  class="flex items-center cursor-pointer"
                  :class="localFilter.levels.includes(level) ? 'text-primary' : 'text-gray-300'"
                >
                  <span
                    class="w-4 h-4 flex items-center justify-center rounded border mr-3"
                    :class="
                      localFilter.levels.includes(level)
                        ? 'border-primary bg-primary'
                        : 'border-[#474746] bg-[#1F1F1E]'
                    "
                  >
                    <svg
                      v-show="localFilter.levels.includes(level)"
                      class="w-3 h-3 text-[#1F1F1E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                </label>
              </div>
              <label
                :for="'level-' + level"
                class="ml-1 text-sm text-gray-300 cursor-pointer flex-1 py-1"
              >
                {{ level }}
              </label>
            </div>
          </div>
        </div>

        <!-- Tag Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Tags</label>
          <div class="space-y-2">
            <div v-for="tag in tags" :key="tag" class="flex items-center">
              <div class="relative">
                <input
                  :id="'tag-' + tag"
                  type="checkbox"
                  :value="tag"
                  v-model="localFilter.tags"
                  @change="applyFilters"
                  class="w-4 h-4 text-primary bg-[#1F1F1E] border-[#474746] rounded cursor-pointer opacity-0 absolute z-10"
                />
                <label
                  :for="'tag-' + tag"
                  class="flex items-center cursor-pointer"
                  :class="localFilter.tags.includes(tag) ? 'text-primary' : 'text-gray-300'"
                >
                  <span
                    class="w-4 h-4 flex items-center justify-center rounded border mr-3"
                    :class="
                      localFilter.tags.includes(tag)
                        ? 'border-primary bg-primary'
                        : 'border-[#474746] bg-[#1F1F1E]'
                    "
                  >
                    <svg
                      v-show="localFilter.tags.includes(tag)"
                      class="w-3 h-3 text-[#1F1F1E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                </label>
              </div>
              <label
                :for="'tag-' + tag"
                class="ml-1 text-sm text-gray-300 cursor-pointer flex-1 py-1"
              >
                {{ tag }}
              </label>
            </div>
          </div>
        </div>

        <!-- Price Filter -->
        <div class="pb-6 border-b border-[#474746]">
          <label class="block text-base font-antonio font-bold text-primary mb-4">Price</label>
          <div class="space-y-3">
            <div class="flex items-center">
              <div class="relative">
                <input
                  id="free-only"
                  type="checkbox"
                  v-model="localFilter.freeOnly"
                  @change="updatePriceFilter"
                  class="w-4 h-4 text-primary bg-[#1F1F1E] border-[#474746] rounded cursor-pointer opacity-0 absolute z-10"
                />
                <label
                  for="free-only"
                  class="flex items-center cursor-pointer"
                  :class="localFilter.freeOnly ? 'text-primary' : 'text-gray-300'"
                >
                  <span
                    class="w-4 h-4 flex items-center justify-center rounded border mr-3"
                    :class="
                      localFilter.freeOnly
                        ? 'border-primary bg-primary'
                        : 'border-[#474746] bg-[#1F1F1E]'
                    "
                  >
                    <svg
                      v-show="localFilter.freeOnly"
                      class="w-3 h-3 text-[#1F1F1E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                </label>
              </div>
              <label for="free-only" class="ml-1 text-sm text-gray-300 cursor-pointer flex-1 py-1">
                Free
              </label>
            </div>
            <div class="flex items-center">
              <div class="relative">
                <input
                  id="paid-only"
                  type="checkbox"
                  v-model="localFilter.paidOnly"
                  @change="updatePriceFilter"
                  class="w-4 h-4 text-primary bg-[#1F1F1E] border-[#474746] rounded cursor-pointer opacity-0 absolute z-10"
                />
                <label
                  for="paid-only"
                  class="flex items-center cursor-pointer"
                  :class="localFilter.paidOnly ? 'text-primary' : 'text-gray-300'"
                >
                  <span
                    class="w-4 h-4 flex items-center justify-center rounded border mr-3"
                    :class="
                      localFilter.paidOnly
                        ? 'border-primary bg-primary'
                        : 'border-[#474746] bg-[#1F1F1E]'
                    "
                  >
                    <svg
                      v-show="localFilter.paidOnly"
                      class="w-3 h-3 text-[#1F1F1E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                </label>
              </div>
              <label for="paid-only" class="ml-1 text-sm text-gray-300 cursor-pointer flex-1 py-1">
                Paid
              </label>
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
              class="w-5 h-5 mr-2"
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

const coursesStore = useCoursesStore()
const { categories, levels, tags, fetchFilterOptions, loading, error } = useCourseFilters()

// Initialize local filter with the current filter from the store
const localFilter = ref<ExtendedCoursesFilter>({
  categories: coursesStore.currentFilter.categories || [],
  levels: coursesStore.currentFilter.levels || [],
  tags: coursesStore.currentFilter.tags || [],
  freeOnly: coursesStore.currentFilter.freeOnly || false,
  paidOnly: coursesStore.currentFilter.paidOnly || false,
  searchQuery: coursesStore.currentFilter.searchQuery || '',
  ...coursesStore.currentFilter
})

// Fetch filter options when component is mounted
onMounted(async () => {
  await fetchFilterOptions()
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

const updatePriceFilter = () => {
  // Make sure both freeOnly and paidOnly are not selected at the same time
  if (localFilter.value.freeOnly && localFilter.value.paidOnly) {
    // If both are selected, deselect one of them (let's deselect paidOnly)
    localFilter.value.paidOnly = false
  }
  applyFilters()
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
