<script setup lang="ts">
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const route = useRoute()
const courseSlug = route.params.courseSlug as string

// Use useCourse composable which fetches course and syncs to store
const { course, isLoading, error } = useCourse(courseSlug)

// Watch for course content to load, then redirect to first lesson
watch(
  () => course.value,
  (courseData) => {
    // Guard 1: No data yet
    if (!courseData) return

    // Guard 2: CRITICAL — Make sure course matches the URL!
    if (courseData.slug !== courseSlug) return

    // Extract lessons from courseContent
    const lessons = courseData.courseContent?.flatMap(section => section.content || []) || []

    // Redirect to first lesson if available
    if (lessons.length > 0 && lessons[0]?.slug) {
      navigateTo(
        `/courses/${courseSlug}/lessons/${lessons[0].slug}`,
        { replace: true },
      )
    }
  },
  { immediate: true },
)

// Get error message for display
const errorMessage = computed(() => {
  const err = error.value
  if (!err) return null
  if (typeof err === 'string') return err
  return err.message || 'Failed to load course'
})

// Check if there are no lessons (only after loading is complete and no error)
const hasNoLessons = computed(() => {
  return !isLoading.value && !error.value && course.value?.courseContent?.length === 0
})
</script>

<template>
  <div class="py-36 flex flex-col items-center justify-center">
    <!-- Error state -->
    <template v-if="errorMessage">
      <p class="text-red-500 text-lg mb-4">
        {{ errorMessage }}
      </p>
      <NuxtLink
        :to="`/courses/${courseSlug}`"
        class="btn-primary"
      >
        Back to Course
      </NuxtLink>
    </template>

    <!-- Empty state: only show when confirmed no lessons -->
    <template v-else-if="hasNoLessons">
      <p class="text-white text-lg mb-4">
        No lessons available yet.
      </p>
      <NuxtLink
        :to="`/courses/${courseSlug}`"
        class="btn-primary"
      >
        Back to Course
      </NuxtLink>
    </template>

    <!-- Default: show spinner for all other cases (loading or redirecting) -->
    <LoadingSpinner
      v-else
      message="Loading lessons..."
    />
  </div>
</template>
