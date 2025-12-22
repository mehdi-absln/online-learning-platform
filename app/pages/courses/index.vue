<template>
  <div>
    <!-- Error state -->
    <div
      v-if="error"
      class="py-36 flex flex-col items-center justify-center"
    >
      <p class="text-red-500 text-lg">
        Error loading courses
      </p>
      <p
        v-if="error"
        class="text-red-400 text-sm mt-2"
      >
        {{ error.message || error }}
      </p>
    </div>
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
              :loading="isLoading || coursesStore.loading"
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
import CourseSidebarFilters from '~/components/courses/CourseSidebarFilters.vue'
import { useCourseFilters } from '~/composables/useCourseFilters'

const coursesStore = useCoursesStore()

const { courses, isLoading, error, pagination } = useCourses()

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }],
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
