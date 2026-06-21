<template>
  <div class="min-h-screen bg-dark-gray">
    <!-- Combined Loading State -->
    <template v-if="combinedLoading">
      <div

        class="py-36 flex flex-col items-center justify-center"
        role="status"
        aria-label="Loading Lesson"
        aria-live="polite"
      >
        <LoadingSpinner :message="loadingMessage" />
      </div>
    </template>

    <!-- Combined Error State -->
    <ErrorState
      v-else-if="combinedError"
      :message="combinedError"
      @retry="handleRetry"
    />

    <!-- Lesson Content -->
    <template v-else-if="lesson">
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
                <h1
                  id="lesson-title"
                  class="font-bold text-white truncate"
                >
                  {{ lesson.title }}
                </h1>
              </div>
            </div>

            <!-- Desktop Navigation (hidden on mobile) -->
            <div class="hidden lg:block">
              <LessonNav
                variant="desktop"
                :prev-lesson="prevLesson ?? null"
                :next-lesson="nextLesson ?? null"
                :next-lesson-accessible="isNextLessonAccessible"
                :is-completing-lesson="isCompletingLesson"
                :is-lesson-completed="isLessonCompleted"
                @prev="goToPrev"
                @next="goToNext"
                @toggle-complete="handleToggleComplete"
              />
            </div>
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
          <section
            class="lg:col-span-3 space-y-6"
            aria-labelledby="lesson-title"
          >
            <ClientOnly>
              <LessonVideo
                :video-url="lessonData?.isLocked ? undefined : (lesson.videoUrl || undefined)"
                :title="lesson.title"
              />
              <template #fallback>
                <div class="rounded-xl border border-dark-divider bg-dark-surface aspect-video flex items-center justify-center">
                  <LoadingSpinner message="Loading video..." />
                </div>
              </template>
            </ClientOnly>

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
                  <IconClock class="w-4 h-4" />
                  <span class="sr-only">Duration:</span>
                  {{ lesson.duration }}
                </span>
                <span class="flex items-center gap-1.5">
                  <IconCalendar class="w-4 h-4" />
                  <span class="sr-only">Published:</span>
                  <time :datetime="toDateTimeValue(lesson.createdAt)">
                    {{ safeFormatDate(lesson.createdAt) }}
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
                  <IconBookmark
                    class="w-5 h-5"
                    :fill="isLessonBookmarked ? 'currentColor' : 'none'"
                  />
                </button>
                <button
                  class="p-2 rounded-lg hover:bg-dark-bg transition text-gray-400 hover:text-white"
                  aria-label="Share lesson"
                  @click="shareLesson"
                >
                  <IconShare class="w-5 h-5" />
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
                  <IconCheckCircle class="w-5 h-5" />
                  <span v-if="isCompletingLesson">Saving...</span>
                  <span v-else>{{ isLessonCompleted ? 'Completed' : 'Complete Lesson' }}</span>
                </button>
              </div>
            </section>

            <!-- Next Lesson Card -->
            <section
              v-if="nextLesson"
              class="rounded-xl p-6 border border-dark-divider"
              :class="isNextLessonAccessible
                ? 'bg-gradient-to-l from-primary to-primary/80'
                : 'bg-dark-surface opacity-75'"
              aria-label="Next lesson"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-white/80 text-sm mb-2">
                    Next Lesson
                  </p>
                  <h2 class="text-xl font-bold mb-4 text-white">
                    {{ nextLesson.title }}
                  </h2>
                </div>
                <span
                  v-if="!isNextLessonAccessible"
                  class="text-gray-400 text-sm flex items-center gap-1"
                >
                  <IconLock class="w-4 h-4" />
                  Locked
                </span>
              </div>
              <button
                :disabled="!isNextLessonAccessible"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                :class="isNextLessonAccessible
                  ? 'bg-white text-primary hover:bg-gray-100'
                  : 'bg-gray-700 text-gray-400'"
                :aria-label="isNextLessonAccessible ? 'Go to next lesson: ' + nextLesson.title : 'Purchase course to unlock'"
                @click="goToNext"
              >
                <span>{{ isNextLessonAccessible ? 'Go to next lesson' : 'Locked' }}</span>
                <IconChevronRight
                  v-if="isNextLessonAccessible"
                  class="w-4 h-4"
                />
                <IconLock
                  v-else
                  class="w-4 h-4"
                />
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
                <IconCheckCircle class="w-8 h-8" />
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
          </section>

          <!-- Sidebar -->
          <LessonSidebar
            :current-lesson-slug="lessonSlug"
            :course-slug="courseSlug"
            :course-id="courseId"
          />
        </div>
      </div>

      <!-- Mobile Navigation (hidden on desktop) -->
      <div class="lg:hidden">
        <LessonNav
          variant="mobile"
          :prev-lesson="prevLesson ?? null"
          :next-lesson="nextLesson ?? null"
          :next-lesson-accessible="isNextLessonAccessible"
          :is-completing-lesson="isCompletingLesson"
          :is-lesson-completed="isLessonCompleted"
          @prev="goToPrev"
          @next="goToNext"
          @toggle-complete="handleToggleComplete"
        />
      </div>
    </template>

    <ErrorState
      v-else
      message="Lesson could not be loaded."
      @retry="handleRetry"
    />
  </div>
</template>

<script setup lang="ts">
import type { DetailedLesson } from '~/types/lesson'
import ErrorState from '~/components/ui/ErrorState.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import LessonVideo from '~/components/lesson/LessonVideo.vue'
import LessonContent from '~/components/lesson/LessonContent.vue'
import LessonSidebar from '~/components/lesson/LessonSidebar.vue'
import LessonNav from '~/components/lesson/LessonNav.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import IconClock from '~/components/icons/IconClock.vue'
import IconCalendar from '~/components/icons/IconCalendar.vue'
import IconBookmark from '~/components/icons/IconBookmark.vue'
import IconShare from '~/components/icons/IconShare.vue'
import IconCheckCircle from '~/components/icons/IconCheckCircle.vue'
import IconLock from '~/components/icons/IconLock.vue'
import IconChevronRight from '~/components/icons/IconChevronRight.vue'

definePageMeta({
  key: route => `${String(route.params.courseSlug ?? '')}:${String(route.params.lessonSlug ?? '')}`,
})

function toDateTimeValue(date: string | Date | null | undefined) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

function safeFormatDate(date: string | Date | null | undefined) {
  if (!date) return 'N/A'
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(d)
}

const route = useRoute()
const normalizeSlug = (value: string | null | undefined) => value?.trim().toLowerCase() ?? ''

// ───── Route Params ─────
const courseSlug = computed(() => route.params.courseSlug as string)
const lessonSlug = computed(() => route.params.lessonSlug as string)
const normalizedLessonSlug = computed(() => normalizeSlug(lessonSlug.value))

// ───── Fetch Lesson Access (isLocked check) ─────
const { lessonData, isLoading: isAccessLoading, error: accessError, fetchLessonAccess } = useLessonAccess(courseSlug, lessonSlug)

// ───── Composable ─────
const {
  course,
  isLoading,
  error: courseError,
  currentIndex,
  totalLessons,
  prevLesson,
  nextLesson,
  isNextLessonAccessible,
  progressPercentage,
  breadcrumbs,
  goToPrev,
  goToNext,
  isLessonCompleted,
  isLessonBookmarked,
  toggleComplete,
  toggleBookmark,
  shareLesson,
  courseId,
  refreshCourse,
} = useLesson(courseSlug, lessonSlug)

// Use lessonData from API instead of store
const lesson = computed(() => {
  if (!lessonData.value) return null
  return {
    ...lessonData.value,
    id: lessonData.value.id,
    courseId: courseId.value,
    content: lessonData.value.content || lessonData.value.description || '',
    sectionId: 0, // Not available from API, will be 0
    order: currentIndex.value >= 0 ? currentIndex.value : 0,
    createdAt: lessonData.value.createdAt ? new Date(lessonData.value.createdAt) : new Date(0),
    updatedAt: lessonData.value.updatedAt ? new Date(lessonData.value.updatedAt) : new Date(0),
  } as DetailedLesson
})

const hasResolvedLesson = computed(() => normalizeSlug(lesson.value?.slug) === normalizedLessonSlug.value)

// ───── Fetch Progress (non-blocking) ─────
const progressStore = useLessonProgressStore()
const userStore = useUserStore()

// Fetch Progress (non-blocking for authenticated users)
onMounted(() => {
  if (!userStore.isAuthenticated) return

  progressStore.fetchProgress().catch((err) => {
    console.error('Failed to fetch lesson progress:', err)
  })
})

// ───── Combined Loading & Error States ─────
const combinedError = computed(() => {
  const err = courseError.value || accessError.value
  if (!err) return null
  if (typeof err === 'string') return err
  return String(err)
})
const combinedLoading = computed(() =>
  isLoading.value
  || isAccessLoading.value
  || (!combinedError.value && !hasResolvedLesson.value),
)
const loadingMessage = computed(() => isLoading.value ? 'Loading Lesson...' : 'Checking access...')

// ───── Redirect if lesson is locked ─────
watch(
  () => lessonData.value,
  async (resolvedLesson) => {
    if (!import.meta.client || !resolvedLesson) return
    if (normalizeSlug(resolvedLesson.slug) !== normalizedLessonSlug.value) return
    if (!resolvedLesson.isLocked) return

    await navigateTo(`/courses/${courseSlug.value}`, { replace: true })
  },
  { immediate: true },
)

// ───── Local UI State ─────
const isCompletingLesson = ref(false)

// ───── Computed ─────
const courseLink = computed(() => `/courses/${courseSlug.value}`)

// ───── Methods ─────
async function handleRetry() {
  await Promise.allSettled([
    refreshCourse?.(),
    fetchLessonAccess(),
  ])
}

async function handleToggleComplete() {
  isCompletingLesson.value = true
  try {
    await toggleComplete()
  }
  finally {
    isCompletingLesson.value = false
  }
}

// ───── Keyboard Shortcuts ─────
const handleKeydown = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  if (e.key === 'ArrowRight' && nextLesson.value) goToNext()
  if (e.key === 'ArrowLeft' && prevLesson.value) goToPrev()
  if (e.key === 'm' && !e.ctrlKey && !e.metaKey) handleToggleComplete()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// ───── SEO ─────
useSeoMeta({
  title: () => lesson.value?.title
    ? `${lesson.value.title} | ${course.value?.title || 'Course'}`
    : 'Loading...',
  description: () => lesson.value?.content?.slice(0, 160) || 'Lesson content',
})
</script>
