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
        <div
          class="flex flex-col items-center justify-center text-center py-36 gap-y-4 bg-gradient-to-r from-[#1F1F1E] via-[#282828] to-primary/60 shadow-[inset_0_0_40px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm rounded-2xl"
        >
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Courses</h1>
          <Breadcrumb :crumbs="breadcrumbCrumbs" />
        </div>
      </header>

      <section class="container py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <aside class="lg:w-1/4">
            <SidebarFilters />
          </aside>

          <!-- Main Content -->
          <div class="lg:w-3/4">
            <div v-if="coursesStore.loading" class="text-center py-10">
              <LoadingSpinner message="Updating results..." />
            </div>

            <div v-else>
              <div v-if="coursesStore.courses.length === 0" class="text-center py-10">
                <p class="text-white text-lg">No courses found matching your filters.</p>
              </div>

              <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [grid-auto-rows:1fr]"
              >
                <div v-for="course in coursesStore.courses" :key="course.id" class="h-full">
                  <CourseCard :course="course" class="h-full" />
                </div>
              </div>

              <Pagination
                v-if="coursesStore.courses.length > 0 && coursesStore.totalPages > 1"
                :current-page="coursesStore.currentPage"
                :total-pages="coursesStore.totalPages"
                :on-page-change="coursesStore.changePage"
                class="mt-12"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const coursesStore = useCoursesStore()
const isLoading = ref(true)
const route = useRoute()

// Fetch courses with filters from URL query parameters
onMounted(async () => {
  // Extract filters from URL query
  const filters: any = {}

  if (route.query.category) {
    filters.category = route.query.category as string
  }

  if (route.query.level) {
    filters.level = route.query.level as string
  }

  if (route.query.tag) {
    // For tag, we need to add it to tags array
    filters.tags = [route.query.tag as string]
  } else if (route.query.tags) {
    // If there are multiple tags in URL
    const tagParam = route.query.tags
    filters.tags = Array.isArray(tagParam) ? tagParam : [tagParam as string]
  }

  if (route.query.q) {
    filters.searchQuery = route.query.q as string
  }

  if (route.query.instructorId) {
    filters.instructorId = parseInt(route.query.instructorId as string)
  }

  if (route.query.minPrice) {
    filters.minPrice = parseInt(route.query.minPrice as string)
  }

  if (route.query.maxPrice) {
    filters.maxPrice = parseInt(route.query.maxPrice as string)
  }

  if (route.query.freeOnly) {
    filters.freeOnly = route.query.freeOnly === 'true'
  }

  if (route.query.paidOnly) {
    filters.paidOnly = route.query.paidOnly === 'true'
  }

  await coursesStore.fetchAllCourses(filters)
  isLoading.value = false
})

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }]
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
