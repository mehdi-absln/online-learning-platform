<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb :crumbs="breadcrumbCrumbs" />

    <div class="py-10">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-white font-antonio mb-4">Our Courses</h1>
          <p class="text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of courses designed to help you develop new skills and advance
            your career.
          </p>
        </div>

        <div v-if="coursesStore.loading" class="text-center py-10">
          <p class="text-white">Loading courses...</p>
        </div>
        
        <div v-else-if="coursesStore.error" class="text-center py-10">
          <p class="text-red-500">Error: {{ coursesStore.error }}</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCard v-for="course in coursesStore.courses" :key="course.id" :course="course" class="w-full" />
        </div>
        
        <div class="font-test"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from '~/components/Breadcrumb.vue'
import CourseCard from '~/components/CourseCard.vue'
import { useCoursesStore } from '~/stores/courses'

const coursesStore = useCoursesStore()

console.log('Courses page mounted, fetching courses...')
console.log('Initial store state - loading:', coursesStore.loading, 'courses count:', coursesStore.courses.length)

// Fetch courses when the component is mounted
onMounted(async () => {
  console.log('onMounted hook called')
  await coursesStore.fetchAllCourses()
  console.log('After fetch - loading:', coursesStore.loading, 'courses count:', coursesStore.courses.length)
})

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }]
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
