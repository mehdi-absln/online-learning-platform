<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="py-36 flex flex-col items-center justify-center">
      <LoadingSpinner message="Loading course details..." />
    </div>

    <!-- Error state -->
    <div v-else-if="coursesStore.error" class="py-36 flex flex-col items-center justify-center">
      <p class="text-red-500 text-lg">Error: {{ coursesStore.error }}</p>
      <NuxtLink
        to="/courses"
        class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Back to Courses
      </NuxtLink>
    </div>

    <!-- Course details -->
    <div v-else>
      <!-- Hero -->
      <header>
        <div
          class="min-h-[28rem] py-5 bg-gradient-to-r from-[#1F1F1E] via-[#282828] to-primary/60 shadow-[inset_0_0_40px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm rounded-2xl"
        >
          <div class="container">
            <Breadcrumb :crumbs="breadcrumbCrumbs" class="block mb-6" />
            <div class="flex flex-col justify-center min-h-[20rem] space-y-8 text-white">
              <h1 class="text-4xl md:text-5xl font-bold text-white">
                {{ coursesStore.detailedCourse?.title }}
              </h1>
              <p class="text-white">
                {{ coursesStore.detailedCourse?.description }}
              </p>
              <div class="flex items-center gap-x-4">
                <div class="flex items-center gap-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-[18px] w-[18px] text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{{ coursesStore.detailedCourse?.instructor.name }}</span>
                </div>
                <div class="w-px h-6 bg-white/30"></div>
                <NuxtLink
                  to="/wishlist"
                  class="flex items-center gap-x-2 text-white hover:text-primary transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-[18px] w-[18px] text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="CurrentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span>Wishlist</span>
                </NuxtLink>
                <div class="w-px h-6 bg-white/30"></div>
                <div class="flex items-center gap-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-[18px] w-[18px] text-[#f8a406]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="CurrentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                  <span>{{ coursesStore.detailedCourse?.rating ?? 'N/A' }} Ratings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">
const coursesStore = useCoursesStore()
const isLoading = ref(true)

// Get the course ID from the route params
const route = useRoute()
const courseId = parseInt(route.params.id as string)

// Validate course ID
if (isNaN(courseId) || courseId <= 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Course not found'
  })
}

// Fetch course details when the component is mounted
onMounted(async () => {
  await coursesStore.fetchCourseById(courseId)
  isLoading.value = false
})

useHead({
  title: computed(
    () => `${coursesStore.detailedCourse?.title || 'Course'} - Online Learning Platform`
  ),
  meta: computed(() => [
    { name: 'description', content: coursesStore.detailedCourse?.description || '' }
  ])
})

const breadcrumbCrumbs = computed(() => [
  { name: 'Courses', path: '/courses' },
  { name: coursesStore.detailedCourse?.title || '', path: `/courses/${courseId}` }
])
</script>
