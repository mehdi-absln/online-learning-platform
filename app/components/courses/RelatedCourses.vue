<template>
  <section
    v-if="loading || hasRelatedCourses || hasError"
    class="mt-16"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-white font-antonio">
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

    <!-- Loading State -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="bg-dark-bg border border-dark-divider rounded-2xl overflow-hidden animate-pulse"
      >
        <div class="w-full h-48 bg-dark-bg" />
        <div class="p-6">
          <div class="h-4 bg-dark-bg mb-2 rounded" />
          <div class="h-6 bg-dark-bg mb-4 rounded w-3/4" />
          <div class="h-3 bg-dark-bg mb-4 rounded w-1/2" />
          <div class="flex justify-between">
            <div class="h-3 bg-dark-bg rounded w-1/4" />
            <div class="h-3 bg-dark-bg rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="hasError"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200
             dark:border-red-800 rounded-xl p-6 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-red-500 mx-auto mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <p class="text-red-700 dark:text-red-300 mb-4">
        {{ errorMessage || 'Error loading related courses' }}
      </p>
      <button
        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white
               rounded-lg transition-colors"
        @click="refresh()"
      >
        Try Again
      </button>
    </div>

    <!-- Courses Grid -->
    <div
      v-else-if="hasRelatedCourses"
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
  refresh,
} = useRelatedCourses(() => props.courseId)
</script>
