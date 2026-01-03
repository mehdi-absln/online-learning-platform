<!-- pages/courses/[courseSlug]/lessons/[lessonSlug].vue -->
<template>
  <div class="min-h-screen bg-dark-gray">
    <!-- Loading State -->
    <template v-if="isLoading">
      <div class="animate-pulse">
        <div class="bg-dark-surface border-b border-dark-divider sticky top-0 z-10">
          <div class="container mx-auto px-4 py-4">
            <div class="h-4 bg-dark-bg rounded w-64 mb-2" />
            <div class="h-6 bg-dark-bg rounded w-96" />
          </div>
          <div class="h-1 bg-dark-bg" />
        </div>
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
    </template>

    <!-- Error State -->
    <template v-else-if="error">
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center px-4">
          <div class="w-24 h-24 mx-auto mb-6 text-dark-divider">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Lesson Not Found</h2>
          <p class="text-gray-400 mb-6">{{ error }}</p>
          <NuxtLink
            :to="courseLink"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Back to Course
          </NuxtLink>
        </div>
      </div>
    </template>

    <!-- Main Content -->
    <template v-else-if="lesson">
      <!-- Sticky Header -->
      <header
        class="bg-dark-surface border-b border-dark-divider sticky top-0 z-40 transition-shadow duration-300"
        :class="{ 'shadow-lg shadow-black/20': isScrolled }"
      >
        <div class="container mx-auto px-4">
          <Breadcrumb :crumbs="breadcrumbs" class="py-2 border-b border-dark-divider/50" />

          <div class="py-3 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 min-w-0">
              <NuxtLink
                :to="courseLink"
                class="p-2 hover:bg-dark-bg rounded-lg transition flex-shrink-0"
                title="Back to course"
              >
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </NuxtLink>

              <div class="min-w-0">
                <p class="text-sm text-gray-400">
                  Lesson {{ currentIndex + 1 }} of {{ totalLessons }}
                </p>
                <h1 class="font-bold text-white truncate">
                  {{ lesson.title }}
                </h1>
              </div>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden sm:flex items-center gap-2">
              <button
                :disabled="!prevLesson"
                class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
                title="Previous lesson (→)"
                @click="goToPrev"
              >
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                :disabled="!nextLesson"
                class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
                title="Next lesson (←)"
                @click="goToNext"
              >
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="h-1 bg-dark-bg -mx-4">
            <div
              class="h-full bg-primary transition-all duration-500 ease-out"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Main Content -->
          <main class="lg:col-span-3 space-y-6">
            <LessonVideo :video-url="lesson.videoUrl" :title="lesson.title" />

            <!-- Lesson Info Bar -->
            <div class="bg-dark-surface rounded-xl p-4 border border-dark-divider flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-6 text-sm text-gray-400">
                <span v-if="lesson.duration" class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ lesson.duration }}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(lesson.createdAt) }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  class="p-2 rounded-lg hover:bg-dark-bg transition"
                  :class="isLessonBookmarked ? 'text-yellow-500' : 'text-gray-400'"
                  :title="isLessonBookmarked ? 'Remove from bookmarks' : 'Bookmark lesson'"
                  @click="toggleBookmark"
                >
                  <svg
                    class="w-5 h-5"
                    :fill="isLessonBookmarked ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <button
                  class="p-2 rounded-lg hover:bg-dark-bg transition text-gray-400 hover:text-white"
                  title="Share lesson"
                  @click="shareLesson"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

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
                    {{ isLessonCompleted ? '✅ Lesson completed' : 'Complete this lesson?' }}
                  </h3>
                  <p class="text-sm text-gray-400 mt-1">
                    {{ isLessonCompleted
                      ? 'Great job! You can move to the next lesson'
                      : 'Marking this lesson as complete will save your progress'
                    }}
                  </p>
                </div>
                <button
                  :disabled="isCompletingLesson"
                  class="px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 whitespace-nowrap"
                  :class="isLessonCompleted
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                    : 'bg-primary text-white hover:bg-primary/90'"
                  @click="handleToggleComplete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span v-if="isCompletingLesson">Saving...</span>
                  <span v-else>{{ isLessonCompleted ? 'Completed' : 'Complete Lesson' }}</span>
                </button>
              </div>
            </div>

            <!-- Next Lesson Card -->
            <div
              v-if="nextLesson"
              class="bg-gradient-to-l from-primary to-primary/80 rounded-xl p-6 text-white"
            >
              <p class="text-white/80 text-sm mb-2">Next Lesson</p>
              <h3 class="text-xl font-bold mb-4">{{ nextLesson.title }}</h3>
              <button
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition"
                @click="goToNext"
              >
                Go to next lesson
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>

            <!-- Course Completed Card -->
            <div
              v-else-if="isLessonCompleted && !nextLesson"
              class="bg-gradient-to-l from-green-600 to-green-500 rounded-xl p-6 text-white text-center"
            >
              <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Congratulations! 🎉</h3>
              <p class="text-white/80 mb-4">You have successfully completed this course</p>
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
            :current-lesson-slug="lessonSlug"
            :course-slug="courseSlug"
          />
        </div>
      </div>

      <!-- Mobile Bottom Navigation -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-divider p-4 z-50">
        <div class="flex items-center gap-3">
          <button
            :disabled="!prevLesson"
            class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
            @click="goToPrev"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            :disabled="isCompletingLesson"
            class="flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            :class="isLessonCompleted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-primary text-white'"
            @click="handleToggleComplete"
          >
            <svg v-if="isCompletingLesson" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ isLessonCompleted ? 'Completed' : 'Complete' }}
          </button>

          <button
            :disabled="!nextLesson"
            class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
            @click="goToNext"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import LessonVideo from '~/components/lesson/LessonVideo.vue'
import LessonContent from '~/components/lesson/LessonContent.vue'
import LessonSidebar from '~/components/lesson/LessonSidebar.vue'

const route = useRoute()

// ───── Route Params ─────
const courseSlug = computed(() => route.params.courseSlug as string)
const lessonSlug = computed(() => route.params.lessonSlug as string)

// ───── Composable ─────
const {
  course,
  lesson,
  isLoading,
  error,
  currentIndex,
  totalLessons,
  prevLesson,
  nextLesson,
  progressPercentage,
  breadcrumbs,
  goToPrev,
  goToNext,
  isLessonCompleted,
  isLessonBookmarked,
  toggleComplete,
  toggleBookmark,
  shareLesson,
} = useLesson(courseSlug, lessonSlug)

// ───── Local UI State ─────
const activeTab = ref<'content' | 'resources' | 'notes'>('content')
const isScrolled = ref(false)
const isCompletingLesson = ref(false)

// ───── Computed ─────
const courseLink = computed(() => `/courses/${courseSlug.value}`)

// ───── Methods ─────
async function handleToggleComplete() {
  isCompletingLesson.value = true
  try {
    await toggleComplete()
  } finally {
    isCompletingLesson.value = false
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// ───── Scroll Detection ─────
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

// ───── Keyboard Shortcuts ─────
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    if (e.key === 'ArrowRight' && prevLesson.value) goToPrev()
    if (e.key === 'ArrowLeft' && nextLesson.value) goToNext()
    if (e.key === 'm' && !e.ctrlKey && !e.metaKey) handleToggleComplete()
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})

// ───── SEO ─────
useSeoMeta({
  title: () => lesson.value?.title
    ? `${lesson.value.title} | ${course.value?.title || 'Course'}`
    : 'Loading...',
  description: () => lesson.value?.content?.slice(0, 160) || 'Lesson content',
})
</script>
