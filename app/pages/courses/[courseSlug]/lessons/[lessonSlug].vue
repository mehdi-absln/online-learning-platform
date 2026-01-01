<template>
  <div class="min-h-screen bg-dark-gray">
    <!-- Skeleton Loading -->
    <div
      v-if="isLoading"
      class="animate-pulse"
    >
      <!-- Header Skeleton -->
      <div class="bg-dark-surface border-b border-dark-divider sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <div class="h-4 bg-dark-bg rounded w-64 mb-2" />
          <div class="h-6 bg-dark-bg rounded w-96" />
        </div>
        <div class="h-1 bg-dark-bg" />
      </div>

      <!-- Content Skeleton -->
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <div class="aspect-video bg-dark-bg rounded-xl mb-6" />
            <div class="space-y-3">
              <div class="h-4 bg-dark-bg rounded w-full" />
              <div class="h-4 bg-dark-bg rounded w-5/6" />
              <div class="h-4 bg-dark-bg rounded w-4/6" />
            </div>
          </div>
          <div class="hidden lg:block">
            <div class="h-96 bg-dark-bg rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center px-4">
        <div class="w-24 h-24 mx-auto mb-6 text-dark-divider">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">
          Lesson Not Found
        </h2>
        <p class="text-gray-400 mb-6">
          {{ error }}
        </p>
        <NuxtLink
          :to="courseLink"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          Back to Course
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="lesson">
      <!-- Sticky Header -->
      <LessonHeader
        :course="course"
        :lesson="lesson"
        :current-index="currentLessonIndex"
        :total-lessons="totalLessons"
        :progress-percentage="progressPercentage"
        :prev-lesson="prevLesson"
        :next-lesson="nextLesson"
        :is-scrolled="isScrolled"
        @go-prev="goToPrevLesson"
        @go-next="goToNextLesson"
      />

      <!-- Content Area -->
      <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Main Content -->
          <main class="lg:col-span-3 space-y-6">
            <!-- Video Player -->
            <LessonVideo
              :video-url="lesson.videoUrl"
              :title="lesson.title"
            />

            <!-- Lesson Info Bar -->
            <div class="bg-dark-surface rounded-xl p-4 border border-dark-divider flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-6 text-sm text-gray-400">
                <span
                  v-if="lesson.duration"
                  class="flex items-center gap-1.5"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ lesson.duration }}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {{ formatDate(lesson.createdAt) }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  class="p-2 rounded-lg hover:bg-dark-bg transition"
                  :class="isBookmarked ? 'text-yellow-500' : 'text-gray-400'"
                  :title="isBookmarked ? 'Remove from bookmarks' : 'Bookmark lesson'"
                  @click="handleBookmarkToggle"
                >
                  <svg
                    class="w-5 h-5"
                    :fill="isBookmarked ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
                <button
                  class="p-2 rounded-lg hover:bg-dark-bg transition text-gray-400 hover:text-white"
                  title="Share lesson"
                  @click="shareLesson"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content with Tabs -->
            <LessonContent
              :lesson="lesson"
              :active-tab="activeTab"
              @update:active-tab="activeTab = $event"
            />

            <!-- Mark as Complete -->
            <div class="bg-dark-surface rounded-xl p-6 border border-dark-divider">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 class="font-bold text-white">
                    {{ isCompleted ? '✅ Lesson completed' : 'Complete this lesson?' }}
                  </h3>
                  <p class="text-sm text-gray-400 mt-1">
                    {{ isCompleted
                      ? 'Great job! You can move to the next lesson'
                      : 'Marking this lesson as complete will save your progress'
                    }}
                  </p>
                </div>
                <button
                  :disabled="isCompletingLesson"
                  class="px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 whitespace-nowrap"
                  :class="isCompleted
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                    : 'bg-primary text-white hover:bg-primary/90'"
                  @click="toggleComplete"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span v-if="isCompletingLesson">Saving...</span>
                  <span v-else>{{ isCompleted ? 'Completed' : 'Complete Lesson' }}</span>
                </button>
              </div>
            </div>

            <!-- Next Lesson Card -->
            <div
              v-if="nextLesson"
              class="bg-gradient-to-l from-primary to-primary/80 rounded-xl p-6 text-white"
            >
              <p class="text-white/80 text-sm mb-2">
                Next Lesson
              </p>
              <h3 class="text-xl font-bold mb-4">
                {{ nextLesson.title }}
              </h3>
              <button
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition"
                @click="goToNextLesson"
              >
                Go to next lesson
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            </div>

            <!-- Course Completed Card -->
            <div
              v-else-if="isCompleted && !nextLesson"
              class="bg-gradient-to-l from-green-600 to-green-500 rounded-xl p-6 text-white text-center"
            >
              <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">
                Congratulations! 🎉
              </h3>
              <p class="text-white/80 mb-4">
                You have successfully completed this course
              </p>
              <NuxtLink
                :to="courseLink"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Return to course page
              </NuxtLink>
            </div>
          </main>

          <!-- Sidebar -->
          <LessonSidebar
            :course="course"
            :current-lesson-slug="lessonSlug"
            :course-slug="courseSlug"
            :completed-lesson-ids="completedLessonIds"
            :course-progress="courseProgress"
            :completed-lessons-count="completedLessonsCount"
            :total-lessons="totalLessons"
          />
        </div>
      </div>

      <!-- Mobile Bottom Navigation -->
      <LessonNavigation
        :prev-lesson="prevLesson"
        :next-lesson="nextLesson"
        :is-completed="isCompleted"
        :is-completing="isCompletingLesson"
        @go-prev="goToPrevLesson"
        @go-next="goToNextLesson"
        @toggle-complete="toggleComplete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LessonHeader from '~/components/lesson/LessonHeader.vue'
import LessonVideo from '~/components/lesson/LessonVideo.vue'
import LessonContent from '~/components/lesson/LessonContent.vue'
import LessonSidebar from '~/components/lesson/LessonSidebar.vue'
import LessonNavigation from '~/components/lesson/LessonNavigation.vue'
import { useLesson } from '~/composables/useLesson'

import type { DetailedLesson, CourseContentLesson } from '~/types/shared/courses'

const route = useRoute()
const router = useRouter()

// Route params
const courseSlug = computed(() => route.params.courseSlug as string)
const lessonSlug = computed(() => route.params.lessonSlug as string)

// Fetch course data
const { course, isLoading, error } = useCourse(courseSlug.value)

// Use lesson composable for state management
const {
  markLessonComplete,
  markLessonIncomplete,
  toggleBookmark,
  saveNotes,
  getLessonProgress,
  isLessonCompleted,
  isLessonBookmarked,
  getLessonNotes,
} = useLesson()

// State
const activeTab = ref<'content' | 'resources' | 'notes'>('content')
const isScrolled = ref(false)
const isCompletingLesson = ref(false)

// Find the current lesson from the course data
const lesson = computed((): DetailedLesson | null => {
  if (!course.value?.courseContent) return null

  for (const section of course.value.courseContent) {
    if (section.content) {
      const foundLesson = section.content.find(
        (content: CourseContentLesson) => content.slug === lessonSlug.value,
      )
      if (foundLesson) {
        return {
          ...foundLesson,
          id: foundLesson.id || 0,
          courseId: course.value.id,
          content: foundLesson.description || 'Lesson content will be added soon...',
          sectionId: section.id,
          order: foundLesson.order || 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as DetailedLesson
      }
    }
  }
  return null
})

// Get all lessons flat array
const allLessons = computed((): CourseContentLesson[] => {
  if (!course.value?.courseContent) return []
  return course.value.courseContent.flatMap(section => section.content || [])
})

const totalLessons = computed(() => allLessons.value.length)

const currentLessonIndex = computed(() =>
  allLessons.value.findIndex(l => l.slug === lessonSlug.value),
)

const prevLesson = computed((): CourseContentLesson | null =>
  currentLessonIndex.value > 0
    ? allLessons.value[currentLessonIndex.value - 1]
    : null,
)

const nextLesson = computed((): CourseContentLesson | null =>
  currentLessonIndex.value < totalLessons.value - 1
    ? allLessons.value[currentLessonIndex.value + 1]
    : null,
)

const progressPercentage = computed(() =>
  totalLessons.value > 0
    ? ((currentLessonIndex.value + 1) / totalLessons.value) * 100
    : 0,
)

// Completion tracking using composable
const completedLessonsCount = computed(() => {
  return allLessons.value.filter(lesson => isLessonCompleted(lesson.id || 0)).length
})
const courseProgress = computed(() =>
  totalLessons.value > 0
    ? (completedLessonsCount.value / totalLessons.value) * 100
    : 0,
)
const isCompleted = computed(() =>
  lesson.value ? isLessonCompleted(lesson.value.id) : false,
)

// Bookmark state using composable
const isBookmarked = computed(() =>
  lesson.value ? isLessonBookmarked(lesson.value.id) : false,
)

// Course link
const courseLink = computed(() => `/courses/${courseSlug.value}`)

// Get the embed URL for YouTube video
const youtubeEmbedUrl = computed(() => {
  if (!lesson.value?.videoUrl) return ''

  const url = lesson.value.videoUrl
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('youtube.com/watch?v=', 'youtube.com/embed/')
  }
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'youtube.com/embed/')
  }
  return url
})

// Methods
function goToPrevLesson() {
  if (prevLesson.value) {
    router.push(`/courses/${courseSlug.value}/lessons/${prevLesson.value.slug}`)
  }
}

function goToNextLesson() {
  if (nextLesson.value) {
    router.push(`/courses/${courseSlug.value}/lessons/${nextLesson.value.slug}`)
  }
}

async function toggleComplete() {
  if (!lesson.value) return
  isCompletingLesson.value = true

  try {
    if (isCompleted.value) {
      await markLessonIncomplete(lesson.value.id)
    }
    else {
      await markLessonComplete(lesson.value.id)
    }
  }
  finally {
    isCompletingLesson.value = false
  }
}

async function handleBookmarkToggle() {
  if (lesson.value) {
    await toggleBookmark(lesson.value.id)
  }
}

async function shareLesson() {
  const shareData = {
    title: lesson.value?.title || 'Lesson',
    url: window.location.href,
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    }
    catch {
      // User cancelled or error
    }
  }
  else {
    await navigator.clipboard.writeText(window.location.href)
    // TODO: Show toast notification "Link copied"
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Scroll detection for sticky header shadow
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Skip if typing in input/textarea
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    if (e.key === 'ArrowRight' && prevLesson.value) goToPrevLesson()
    if (e.key === 'ArrowLeft' && nextLesson.value) goToNextLesson()
    if (e.key === 'm' && !e.ctrlKey && !e.metaKey) toggleComplete()
  }

  window.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})

// SEO
useSeoMeta({
  title: () => lesson.value?.title
    ? `${lesson.value.title} | ${course.value?.title || 'Course'}`
    : 'Loading...',
  description: () => lesson.value?.content?.slice(0, 160) || 'Lesson content',
})
</script>
