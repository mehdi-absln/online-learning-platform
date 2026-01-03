<template>
  <!-- Loading State -->
  <div
    v-if="loading"
    class="py-36 flex flex-col items-center justify-center"
  >
    <LoadingSpinner message="Loading course related..." />
  </div>
  <!-- Error State -->
  <div
    v-else-if="hasError"
    class="py-36 flex flex-col items-center justify-center"
  >
    <p class="text-red-500 text-lg">
      {{ errorMessage }}
    </p>
  </div>
  <!-- Content -->
  <section
    v-if="hasRelatedCourses"
    aria-labelledby="related-heading"
    class="mt-16"
  >
    <!-- Header -->
    <div class="flex items-center mb-8">
      <h2
        id="related-heading"
        class="text-xl font-bold text-primary font-antonio"
      >
        {{ title }}
      </h2>
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
