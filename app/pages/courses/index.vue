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

// Fetch courses when the component is mounted
onMounted(async () => {
  await coursesStore.fetchAllCourses()
  isLoading.value = false
})

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }]
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
