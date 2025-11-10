<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb :crumbs="breadcrumbCrumbs" />

    <div class="py-10">
      <div class="container mx-auto px-4">
        <div v-if="coursesStore.loading" class="text-center py-10">
          <p class="text-white">Loading course details...</p>
        </div>

        <div v-else-if="coursesStore.error" class="text-center py-10">
          <p class="text-red-500">Error: {{ coursesStore.error }}</p>
          <NuxtLink to="/courses" class="text-primary mt-4 inline-block">Back to Courses</NuxtLink>
        </div>

        <div v-else-if="coursesStore.detailedCourse" class="bg-gray-800 rounded-xl p-8">
          <h1 class="text-3xl font-bold text-white mb-4">
            {{ coursesStore.detailedCourse.title }}
          </h1>
          <p class="text-gray-300 mb-6">{{ coursesStore.detailedCourse.description }}</p>

          <div class="flex items-center mb-6">
            <img
              :src="coursesStore.detailedCourse.instructor.avatar"
              :alt="coursesStore.detailedCourse.instructor.name"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p class="text-white font-medium">
                {{ coursesStore.detailedCourse.instructor.name }}
              </p>
              <p class="text-gray-400 text-sm">Instructor</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-700 p-4 rounded-lg">
              <p class="text-gray-400">Duration</p>
              <p class="text-white font-medium">{{ coursesStore.detailedCourse.duration }}</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg">
              <p class="text-gray-400">Level</p>
              <p class="text-white font-medium">{{ coursesStore.detailedCourse.level }}</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg">
              <p class="text-gray-400">Students</p>
              <p class="text-white font-medium">{{ coursesStore.detailedCourse.stats.students }}</p>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-xl font-bold text-white mb-4">Course Content</h2>
            <ul class="space-y-2">
              <li
                v-for="(lesson, index) in coursesStore.detailedCourse.lessons"
                :key="index"
                class="flex items-center text-gray-300"
              >
                <svg
                  class="w-5 h-5 text-primary mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                {{ lesson }}
              </li>
            </ul>
          </div>

          <button
            class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Enroll Now
          </button>
        </div>

        <div v-else-if="!coursesStore.loading" class="text-center py-10">
          <p class="text-white">Course not found</p>
          <NuxtLink to="/courses" class="text-primary mt-4 inline-block">Back to Courses</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const coursesStore = useCoursesStore()

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
})

useHead({
  title: computed(() => `${coursesStore.detailedCourse?.title || 'Course'} - Online Learning Platform`),
  meta: computed(() => [{ name: 'description', content: coursesStore.detailedCourse?.description || '' }])
})

const breadcrumbCrumbs = computed(() => [
  { name: 'Courses', path: '/courses' },
  { name: coursesStore.detailedCourse?.title || '', path: `/courses/${courseId}` }
])
</script>