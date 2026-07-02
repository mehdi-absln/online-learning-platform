<template>
  <section
    v-if="enrolledCourses.length > 0"
    aria-labelledby="courses-heading"
  >
    <h2
      id="courses-heading"
      class="text-xl font-bold text-white mb-4"
    >
      My Courses
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <DashboardCourseCard
        v-for="course in enrolledCourses"
        :key="course.id"
        :course="course"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DashboardEnrolledCourse } from '~/types/dashboard'

interface Props {
  enrolledCourses: DashboardEnrolledCourse[]
}

defineProps<Props>()
</script>
