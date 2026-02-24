<template>
  <div class="min-h-screen bg-dark-gray">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="py-36 flex flex-col items-center justify-center"
      role="status"
      aria-label="Loading Lesson"
      aria-live="polite"
    >
      <LoadingSpinner message="Loading Lesson..." />
    </div>

    <!-- Error State -->
    <template v-else-if="error">
      <div
        class="py-40 flex items-center justify-center"
        role="alert"
        aria-live="assertive"
      >
        <div class="text-center px-4">
          <div
            class="w-24 h-24 mx-auto mb-6 text-dark-divider"
            aria-hidden="true"
          >
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
          <h1 class="text-2xl font-bold text-white mb-2">
            Lesson Not Found
          </h1>
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
              aria-hidden="true"
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
    </template>

    <!-- Main Content -->
    <template v-else-if="lesson">
      <ClientOnly>
        <!-- 1. Loading state -->
        <template v-if="isAccessLoading">
          <div
            class="py-36 flex flex-col items-center justify-center"
            role="status"
            aria-label="Loading lesson"
            aria-live="polite"
          >
            <LoadingSpinner message="Checking access..." />
          </div>
        </template>

        <!-- 2. Error state (high priority!) -->
        <template v-else-if="accessError">
          <div
            class="py-40 flex flex-col items-center justify-center"
            role="alert"
            aria-live="assertive"
          >
            <div class="text-center px-4">
              <div
                class="w-24 h-24 mx-auto mb-6 text-red-500"
                aria-hidden="true"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-white mb-2">
                Failed to Load Lesson
              </h1>
              <p class="text-gray-400 mb-6">
                {{ accessError }}
              </p>
              <div class="flex gap-3 justify-center">
                <button
                  type="button"
                  class="btn-primary"
                  @click="fetchLessonAccess"
                >
                  Retry
                </button>
                <NuxtLink
                  :to="courseLink"
                  class="btn-secondary"
                >
                  Back to Course
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>

        <!-- 3. Lesson Content (user has access - locked redirects automatically) -->
        <template v-else>
          <header
            class="py-10 bg-hero-shimmer border-dark-divider"
          >
            <div class="container">
              <Breadcrumb
                :crumbs="breadcrumbs"
                class="py-2"
              />

              <!-- Lesson Info -->
              <div class="py-3 flex items-center justify-between gap-4">
                <div class="flex items-center min-w-0">
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
                <nav
                  class="hidden sm:flex items-center gap-2"
                  aria-label="Lesson navigation"
                >
                  <button
                    :disabled="!prevLesson"
                    class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
                    title="Previous lesson (←)"
                    aria-label="Go to previous lesson"
                    @click="goToPrev"
                  >
                    <svg
                      class="w-5 h-5 text-white/90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    :disabled="!nextLesson"
                    class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
                    title="Next lesson (→)"
                    aria-label="Go to next lesson"
                    @click="goToNext"
                  >
                    <svg
                      class="w-5 h-5 text-white/90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </nav>
              </div>

              <!-- Progress Bar -->
              <div
                role="progressbar"
                :aria-valuenow="Math.round(progressPercentage)"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="`Course progress: Lesson ${currentIndex + 1} of ${totalLessons}`"
                class="h-1 bg-dark-bg"
              >
                <div
                  class="h-full bg-primary transition-all duration-500 ease-out"
                  :style="{ width: `${progressPercentage}%` }"
                />
              </div>
            </div>
          </header>

          <!-- Content Area -->
          <div class="container py-6">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <!-- Main Content -->
              <main class="lg:col-span-3 space-y-6">
                <LessonVideo
                  :video-url="lessonData?.isLocked ? undefined : (lesson.videoUrl || undefined)"
                  :title="lesson.title"
                />

                <!-- Lesson Info Bar -->
                <section
                  class="bg-dark-surface rounded-xl p-4 border border-dark-divider flex flex-wrap items-center justify-between gap-4"
                  aria-label="Lesson information"
                >
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
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="sr-only">Duration:</span>
                      {{ lesson.duration }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span class="sr-only">Published:</span>
                      <time :datetime="lesson.createdAt.toISOString()">
                        {{ formatDate(lesson.createdAt) }}
                      </time>
                    </span>
                  </div>

                  <div
                    class="flex items-center gap-2"
                    role="group"
                    aria-label="Lesson actions"
                  >
                    <button
                      class="p-2 rounded-lg hover:bg-dark-bg transition"
                      :class="isLessonBookmarked ? 'text-yellow-500' : 'text-gray-400'"
                      :aria-label="isLessonBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'"
                      :aria-pressed="isLessonBookmarked"
                      @click="toggleBookmark"
                    >
                      <svg
                        class="w-5 h-5"
                        :fill="isLessonBookmarked ? 'currentColor' : 'none'"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
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
                      aria-label="Share lesson"
                      @click="shareLesson"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
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
                </section>

                <LessonContent :lesson="lesson" />

                <!-- Mark as Complete -->
                <section
                  class="bg-dark-surface rounded-xl p-6 border border-dark-divider"
                  aria-label="Lesson completion"
                >
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 class="font-bold text-white">
                        {{ isLessonCompleted ? '✅ Lesson completed' : 'Complete this lesson?' }}
                      </h2>
                      <p class="text-sm text-gray-400 mt-1">
                        {{ isLessonCompleted
                          ? 'Great job! You can move to the next lesson'
                          : 'Marking this lesson as complete will save your progress'
                        }}
                      </p>
                    </div>
                    <button
                      :disabled="isCompletingLesson"
                      :aria-busy="isCompletingLesson"
                      :aria-pressed="isLessonCompleted"
                      class="px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 whitespace-nowrap"
                      :class="isLessonCompleted
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                        : 'bg-primary text-white hover:bg-primary/90'"
                      @click="handleToggleComplete"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span v-if="isCompletingLesson">Saving...</span>
                      <span v-else>{{ isLessonCompleted ? 'Completed' : 'Complete Lesson' }}</span>
                    </button>
                  </div>
                </section>

                <!-- Next Lesson Card -->
                <section
                  v-if="nextLesson"
                  class="bg-gradient-to-l from-primary to-primary/80 rounded-xl p-6 text-white"
                  aria-label="Next lesson"
                >
                  <p class="text-white/80 text-sm mb-2">
                    Next Lesson
                  </p>
                  <h2 class="text-xl font-bold mb-4">
                    {{ nextLesson.title }}
                  </h2>
                  <button
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition"
                    aria-label="Go to next lesson: {{ nextLesson.title }}"
                    @click="goToNext"
                  >
                    Go to next lesson
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </section>

                <!-- Course Completed Card -->
                <section
                  v-else-if="isLessonCompleted && !nextLesson"
                  class="bg-gradient-to-l from-green-600 to-green-500 rounded-xl p-6 text-white text-center"
                  aria-label="Course completed"
                  role="alert"
                >
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
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
                  <h2 class="text-xl font-bold mb-2">
                    Congratulations! 🎉
                  </h2>
                  <p class="text-white/80 mb-4">
                    You have successfully completed this course
                  </p>
                  <NuxtLink
                    :to="courseLink"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition"
                  >
                    Return to course page
                  </NuxtLink>
                </section>
              </main>

              <!-- Sidebar -->
              <LessonSidebar
                :current-lesson-slug="lessonSlug"
                :course-slug="courseSlug"
              />
            </div>
          </div>

          <!-- Mobile Bottom Navigation -->
          <nav
            class="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-divider p-4 z-50"
            aria-label="Mobile lesson navigation"
          >
            <div class="flex items-center gap-3">
              <button
                :disabled="!prevLesson"
                class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
                aria-label="Go to previous lesson"
                @click="goToPrev"
              >
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                :disabled="isCompletingLesson"
                :aria-busy="isCompletingLesson"
                :aria-pressed="isLessonCompleted"
                class="flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                :class="isLessonCompleted
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-primary text-white'"
                @click="handleToggleComplete"
              >
                <svg
                  v-if="isCompletingLesson"
                  class="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ isLessonCompleted ? 'Completed' : 'Complete' }}
              </button>

              <button
                :disabled="!nextLesson"
                class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
                aria-label="Go to next lesson"
                @click="goToNext"
              >
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </template>

        <template #fallback>
          <div
            class="py-36 flex flex-col items-center justify-center"
            role="status"
            aria-label="Loading lesson"
            aria-live="polite"
          >
            <LoadingSpinner message="Checking access..." />
          </div>
        </template>
      </ClientOnly>
    </template>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import LessonVideo from '~/components/lesson/LessonVideo.vue'
import LessonContent from '~/components/lesson/LessonContent.vue'
import LessonSidebar from '~/components/lesson/LessonSidebar.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const route = useRoute()

// ───── Route Params ─────
const courseSlug = computed(() => route.params.courseSlug as string)
const lessonSlug = computed(() => route.params.lessonSlug as string)

// ───── Fetch Lesson Access (isLocked check) ─────
const { lessonData, isLoading: isAccessLoading, error: accessError, fetchLessonAccess } = useLessonAccess(courseSlug, lessonSlug)

// ───── Fetch Progress ─────
const progressStore = useLessonProgressStore()
await progressStore.fetchProgress()

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

// ───── Redirect if lesson is locked (Layer 3: Direct URL protection) ─────
watch(lessonData, (newData) => {
  if (newData?.isLocked && import.meta.client) {
    // Redirect to course page if user doesn't have access
    navigateTo(`/courses/${courseSlug.value}`)
  }
})

// ───── Local UI State ─────
const isCompletingLesson = ref(false)

// ───── Computed ─────
const courseLink = computed(() => `/courses/${courseSlug.value}`)

// ───── Methods ─────
async function handleToggleComplete() {
  isCompletingLesson.value = true
  try {
    await toggleComplete()
  }
  finally {
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

// ───── Keyboard Shortcuts ─────
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    if (e.key === 'ArrowRight' && nextLesson.value) goToNext()
    if (e.key === 'ArrowLeft' && prevLesson.value) goToPrev()
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
