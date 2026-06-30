<template>
  <!-- Loading State -->
  <section
    v-if="loading"
    class="mt-16"
    aria-hidden="true"
  >
    <div class="h-7 w-48 bg-dark-divider rounded mb-8 animate-pulse" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CoursesCourseCardSkeleton
        v-for="i in 3"
        :key="i"
      />
    </div>
  </section>
  <!-- Error State -->
  <div
    v-else-if="hasError"
    class="py-36 flex flex-col items-center justify-center"
  >
    <UiErrorState
      :message="errorMessage ?? undefined"
      :hide-retry="true"
    />
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
      <CoursesCourseCard
        v-for="relatedCourse in relatedCourses"
        :key="relatedCourse.id"
        :course="relatedCourse"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRelatedCourses } from '~/composables/useRelatedCourses'

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
