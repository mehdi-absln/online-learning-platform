<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="py-36 flex flex-col items-center justify-center">
      <LoadingSpinner message="Loading courses..." />
    </div>

    <!-- Error state -->
    <div v-else-if="coursesStore.error" class="py-36 flex flex-col items-center justify-center">
      <p class="text-red-500 text-lg">Error: {{ coursesStore.error }}</p>
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
              :courses="coursesStore.courses"
              :loading="coursesStore.loading"
              :current-page="coursesStore.currentPage"
              :total-pages="coursesStore.totalPages"
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

const coursesStore = useCoursesStore()
const isLoading = ref(true)
const route = useRoute()

// Fetch courses with filters from URL query parameters
onMounted(async () => {
  // Extract filters from URL query
  const filters = extractFilterFromUrl(route.query)

  await coursesStore.fetchAllCourses()
  isLoading.value = false
})

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }]
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
