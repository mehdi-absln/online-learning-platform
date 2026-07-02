<template>
  <div class="animate-fade-in">
    <UiErrorState
      v-if="error"
      message="Error loading courses"
      :hide-retry="true"
    />
    <div v-else>
      <!-- Hero -->
      <header>
        <UiPageHero
          title="Courses"
          :breadcrumb-crumbs="breadcrumbCrumbs"
        />
      </header>

      <section class="container py-4 md:py-8">
        <div class="flex justify-end mb-4 lg:hidden">
          <button
            class="group relative inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold rounded-xl
                   bg-primary-500 text-white shadow-md shadow-primary-500/20
                   hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30
                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-dark-bg
                   transition-all duration-200 active:scale-95"
            :aria-expanded="isFilterOpen"
            :aria-label="`Filters (${activeFilterCount} active)`"
            aria-controls="course-filters"
            @click="isFilterOpen = !isFilterOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filters</span>
            <IconChevronRight
              class="w-2 h-2 transition-transform duration-300"
              :class="{ 'rotate-90': isFilterOpen }"
              aria-hidden="true"
            />
            <span
              v-if="activeFilterCount > 0"
              class="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 text-xs font-bold text-primary rounded-full ring-2 ring-dark-bg shadow-sm"
              aria-hidden="true"
            >
              {{ activeFilterCount }}
            </span>
          </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar: collapsible on mobile, always visible on desktop -->
          <aside
            id="course-filters"
            aria-label="Course filters"
            :aria-hidden="isFilterOpen ? 'false' : 'true'"
            class="lg:w-1/4 overflow-hidden transition-all duration-300 ease-in-out"
            :class="[
              isFilterOpen
                ? 'max-h-[2000px] opacity-100'
                : 'max-h-0 opacity-0',
              'lg:max-h-none lg:opacity-100 lg:sticky lg:top-24 lg:self-start',
            ]"
          >
            <CourseSidebarFilters />
          </aside>

          <!-- Main content -->
          <div class="lg:w-3/4">
            <CoursesGrid
              :courses="courses"
              :loading="isLoading"
              :current-page="currentPage"
              :total-pages="totalPages"
              :on-page-change="changePage"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import CoursesGrid from '~/components/courses/CoursesGrid.vue'
import IconChevronRight from '~/components/icons/IconChevronRight.vue'

import { SITE_NAME } from '~/constants'

// Lazy load sidebar for mobile (hidden by default)
const CourseSidebarFilters = defineAsyncComponent(() => import('~/components/courses/CourseSidebarFilters.vue'))

const route = useRoute()
const { courses, isLoading, error } = useCourses()
const { currentPage, totalPages, changePage } = useCourseFilters()

const isFilterOpen = ref(false)

const activeFilterCount = computed(() => {
  const filters = { ...route.query }
  delete filters.page
  return Object.values(filters).filter(v => v !== '' && v !== undefined).length
})

useHead({
  title: `Courses - ${SITE_NAME}`,
  meta: [
    {
      name: 'description',
      content: 'Explore a wide range of courses on our platform.',
    },
  ],
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
