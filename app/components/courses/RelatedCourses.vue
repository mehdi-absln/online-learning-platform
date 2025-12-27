<template>
  <!-- Loading State -->
  <div
    v-if="loading"
    class="py-36 flex flex-col items-center justify-center"
  >
    <LoadingSpinner message="Loading course related..." />
  </div>
  <div
    v-else-if="hasError"
    class="py-36 flex flex-col items-center justify-center"
  >
    <p class="text-red-500 text-lg">
      {{ errorMessage }}
    </p>
  </div>
  <section
    v-if="hasRelatedCourses"
    aria-labelledby="related-heading"
    class="mt-16"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h2
        id="related-heading"
        class="text-xl font-bold text-primary font-antonio"
      >
        {{ title }}
      </h2>

      <NuxtLink
        v-if="showViewAll && hasRelatedCourses"
        to="/courses"
        class="text-primary hover:text-primary/90 text-sm font-medium
               flex items-center gap-1 transition-colors"
      >
        View All
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </NuxtLink>
    </div>

    <!-- Courses Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <CourseCard
        v-for="relatedCourse in relatedCourses"
        :key="relatedCourse.id"
        :course="relatedCourse"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRelatedCourses } from '~/composables/useRelatedCourses'
import CourseCard from '~/components/courses/CourseCard.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

interface Props {
  courseId: string
  title?: string
  showViewAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Related Courses',
  showViewAll: true,
})

const {
  relatedCourses,
  loading,
  hasRelatedCourses,
  hasError,
  errorMessage,
} = useRelatedCourses(props.courseId)
</script>
