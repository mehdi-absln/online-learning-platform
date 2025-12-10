<template>
  <div class="container mx-auto py-8">
    <div
      v-if="courseLoading"
      class="py-36 flex flex-col items-center justify-center"
    >
      <LoadingSpinner message="Loading lesson..." />
    </div>

    <div
      v-else-if="error"
      class="py-36 flex flex-col items-center justify-center"
    >
      <p class="text-red-500 text-lg">
        Error: {{ error || 'Lesson not found' }}
      </p>
      <NuxtLink
        :to="`/courses/${route.params.courseSlug}`"
        class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Back to Course
      </NuxtLink>
    </div>

    <div v-else-if="lesson">
      <NuxtLink
        :to="courseLink"
        class="inline-flex items-center text-primary hover:underline mb-6"
      >
        <svg
          class="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Course
      </NuxtLink>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          {{ lesson.title }}
        </h1>

        <div
          v-if="lesson.videoUrl"
          class="mb-6"
        >
          <div class="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              :src="youtubeEmbedUrl"
              frameborder="0"
              allowfullscreen
              class="w-full h-96"
            />
          </div>
        </div>

        <div
          v-if="lesson.content"
          class="prose max-w-none"
        >
          {{ lesson.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetailedLesson, CourseContentLesson } from '~/types/shared/courses'

const route = useRoute()

const courseSlug = computed(() => route.params.courseSlug as string)
const lessonSlug = computed(() => route.params.lessonSlug as string)

// Use the new composable
const { course, isLoading: courseLoading, error } = useCourse(courseSlug.value)

// Validate slugs
if (!courseSlug.value || !lessonSlug.value || error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Lesson not found',
  })
}

// Find the current lesson from the course data
const lesson = computed(() => {
  if (!course.value?.courseContent) return null

  for (const section of course.value.courseContent) {
    if (section.content) {
      // Find lesson by matching slug
      const foundLesson = section.content.find((content: CourseContentLesson) => content.slug === lessonSlug.value)
      if (foundLesson) {
        return {
          ...foundLesson,
          id: foundLesson.id,
          courseId: course.value.id,
          content:
            foundLesson.description || foundLesson.title || 'Lesson content will appear here',
          sectionId: section.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as DetailedLesson
      }
    }
  }

  return null
})

// Get the embed URL for YouTube video
const youtubeEmbedUrl = computed(() => {
  if (!lesson.value?.videoUrl) return ''

  // Convert regular YouTube URL to embed URL
  if (lesson.value.videoUrl.includes('youtube.com/watch?v=')) {
    return lesson.value.videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/')
  }
  else if (lesson.value.videoUrl.includes('youtu.be/')) {
    return lesson.value.videoUrl.replace('youtu.be/', 'youtube.com/embed/')
  }

  return lesson.value.videoUrl
})

// Computed property to generate course link using slug
const courseLink = computed(() => {
  if (course.value?.slug) {
    return `/courses/${course.value.slug}`
  }
  // Fallback to course slug if slug is not available
  return `/courses/${courseSlug.value}`
})

// Set page metadata
useSeoMeta({
  title: () => (lesson.value?.title ? `${lesson.value.title} - Lesson` : 'Loading Lesson...'),
  description: () => lesson.value?.content || 'Course lesson content',
})
</script>
