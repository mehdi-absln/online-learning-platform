<template>
  <div>
    <!-- Error state -->
    <ErrorState
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
import CourseSidebarFilters from '~/components/courses/CourseSidebarFilters.vue'
import CoursesGrid from '~/components/courses/CoursesGrid.vue'

const { courses, isLoading, error } = useCourses()
const { currentPage, totalPages, changePage } = useCourseFilters()

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }],
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
