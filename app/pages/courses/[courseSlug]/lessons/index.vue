<template>
  <div class="py-36 flex flex-col items-center justify-center">
    <!-- Error state -->
    <template v-if="errorMessage">
      <ErrorState
        :message="errorMessage"
        :hide-retry="true"
      />
      <NuxtLink
        :to="`/courses/${courseSlug}`"
        class="btn-primary mt-4"
      >
        Back to Course
      </NuxtLink>
    </template>

    <!-- Empty state: only show when confirmed no lessons -->
    <template v-else-if="hasNoLessons">
      <EmptyState
        title="No lessons available"
        message="No lessons available yet."
        action-to="`/courses/${courseSlug}`"
        action-label="Back to Course"
      />
    </template>

    <!-- Default: show spinner for all other cases (loading or redirecting) -->
    <LoadingSpinner
      v-else
      message="Loading lessons..."
    />
  </div>
</template>

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

    // Defensive: ensure store hasn't returned stale data from another course
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
  if (!error.value) return null
  return String(error.value)
})

// Check if there are no lessons (only after loading is complete and no error)
const hasNoLessons = computed(() => {
  if (isLoading.value || error.value) return false
  if (!course.value?.courseContent) return true

  const lessons = course.value.courseContent.flatMap(s => s.content || [])
  return lessons.length === 0
})
</script>
