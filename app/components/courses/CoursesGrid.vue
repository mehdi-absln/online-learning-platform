<template>
  <div>
    <div
      v-if="loading"
      class="text-center py-10"
    >
      <LoadingSpinner message="Updating results..." />
    </div>

    <div v-else>
      <div
        v-if="courses.length === 0"
        class="text-center py-10"
      >
        <p class="text-white text-lg">
          No courses found matching your filters.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [grid-auto-rows:1fr]"
      >
        <div
          v-for="course in courses"
          :key="course.id"
          class="h-full"
        >
          <CourseCard
            :course="course"
            class="h-full"
          />
        </div>
      </div>

      <Pagination
        v-if="courses.length > 0 && totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :on-page-change="onPageChange"
        class="mt-12"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CourseCard from '~/components/courses/CourseCard.vue'
import type { Course } from '~/types/shared/courses'

interface CoursesGridProps {
  courses: Course[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
}

defineProps<CoursesGridProps>()
</script>
