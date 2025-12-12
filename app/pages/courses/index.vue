<template>
  <div>
    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="py-36 flex flex-col items-center justify-center"
    >
      <LoadingSpinner message="Loading courses..." />
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="py-36 flex flex-col items-center justify-center"
    >
      <p class="text-red-500 text-lg">
        Error loading courses
      </p>
    </div>

    <!-- Course listing -->
    <div v-else>
      <!-- Hero -->
      <header>
        <CoursesHero :breadcrumb-crumbs="breadcrumbCrumbs" />
      </header>

      <section class="container py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <aside class="lg:w-1/4">
            <CourseSidebarFilters />
          </aside>

          <!-- Main Content -->
          <div class="lg:w-3/4">
            <CoursesGrid
              :courses="courses"
              :loading="isLoading"
              :current-page="pagination.currentPage"
              :total-pages="pagination.totalPages"
              :on-page-change="coursesStore.changePage"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { extractFilterFromUrl } from '~/utils/course-helpers'
import CourseSidebarFilters from '~/components/courses/CourseSidebarFilters.vue'
import { useCourses } from '~/composables/useCourses'

const coursesStore = useCoursesStore()
const route = useRoute()

// Extract filter from URL and apply if exists
const urlFilter = extractFilterFromUrl(route.query)
if (Object.keys(urlFilter).length > 0) {
  coursesStore.currentFilter = urlFilter
}

const { courses, isLoading, error, pagination } = useCourses()

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }],
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
