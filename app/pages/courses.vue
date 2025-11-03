<template>
  <div>
    <div>
      <div
        class="flex flex-col items-center justify-center text-center py-36 gap-y-4 bg-gradient-to-r from-[#1F1F1E] via-[#282828] to-primary/60 shadow-[inset_0_0_40px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm rounded-2xl"
      >
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Courses</h1>
        <Breadcrumb :crumbs="breadcrumbCrumbs" />
      </div>

      <CourseFilters />

      <div v-if="coursesStore.loading" class="text-center py-10">
        <p class="text-white">Loading courses...</p>
      </div>

      <div v-else-if="coursesStore.error" class="text-center py-10">
        <p class="text-red-500">Error: {{ coursesStore.error }}</p>
      </div>

      <div class="container py-24" v-else>
        <div v-if="coursesStore.courses.length === 0" class="text-center py-10">
          <p class="text-white text-lg">No courses found matching your filters.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [grid-auto-rows:1fr]">
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
</template>

<script lang="ts" setup>
import Breadcrumb from '~/components/Breadcrumb.vue'
import CourseCard from '~/components/CourseCard.vue'
import Pagination from '~/components/Pagination.vue'
import CourseFilters from '~/components/CourseFilters.vue'
import { useCoursesStore } from '~/stores/courses'

const coursesStore = useCoursesStore()

// Fetch courses when the component is mounted
onMounted(async () => {
  await coursesStore.fetchAllCourses()
})

useHead({
  title: 'Courses - Online Learning Platform',
  meta: [{ name: 'description', content: 'Explore a wide range of courses on our platform.' }]
})

const breadcrumbCrumbs = [{ name: 'Courses', path: '/courses' }]
</script>
