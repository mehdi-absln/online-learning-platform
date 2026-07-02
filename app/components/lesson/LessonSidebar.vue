<template>
  <aside
    class="lg:col-span-1"
    aria-label="Course sidebar"
  >
    <div class="sticky top-32 space-y-6">
      <!-- Course Progress Card -->
      <section
        class="bg-dark-surface rounded-xl p-4 border border-dark-divider"
        aria-label="Course progress"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-bold text-white">
            Course Progress
          </h2>
          <span
            class="text-lg font-bold text-primary"
            aria-hidden="true"
          >
            {{ Math.round(courseProgress.percentage) }}%
          </span>
        </div>

        <div
          role="progressbar"
          :aria-valuenow="Math.round(courseProgress.percentage)"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Course progress: ${courseProgress.completed} of ${courseProgress.total} lessons completed`"
          class="h-3 bg-dark-bg rounded-full overflow-hidden mb-3"
        >
          <div
            class="h-full bg-gradient-to-r from-primary to-primary-alt rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${courseProgress.percentage}%` }"
          />
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-400">
            <span class="text-white font-medium">{{ courseProgress.completed }}</span>
            of {{ courseProgress.total }} lessons
          </span>
          <span
            v-if="courseProgress.completed < courseProgress.total"
            class="text-gray-400"
          >
            {{ courseProgress.total - courseProgress.completed }} remaining
          </span>
          <span
            v-else
            class="text-green-400 font-medium"
            role="status"
          >
            ✓ Completed
          </span>
        </div>
      </section>

      <!-- Lessons List with Accordion -->
      <section
        class="bg-dark-surface rounded-xl border border-dark-divider overflow-hidden"
        aria-label="Course content"
      >
        <div class="p-4 border-b border-dark-divider">
          <h2 class="font-bold text-white">
            Course Content
          </h2>
        </div>

        <div class="max-h-[500px] overflow-y-auto custom-scrollbar">
          <template v-if="hasContent">
            <UiAccordion
              v-model="expandedSections"
              :items="accordionItems"
              :exclusive="false"
              header-class="!bg-dark-surface hover:!bg-dark-bg !border-0 !rounded-none border-b !border-dark-divider"
              content-class="!bg-dark-bg/50"
            >
              <template #header="{ item, isOpen }">
                <div class="flex justify-between w-full">
                  <div class="flex-1 min-w-0 text-left">
                    <span class="font-medium text-white block truncate">
                      {{ (item as SectionAccordionItem).title }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ (item as SectionAccordionItem).lessonCount }} lessons
                    </span>
                  </div>
                  <svg
                    class="w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 mt-1 block"
                    :class="{ 'rotate-180': isOpen }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </template>

              <template #default="{ item }">
                <nav aria-label="Section lessons">
                  <template
                    v-for="lesson in (item as SectionAccordionItem).lessons"
                    :key="lesson.id || lesson.slug"
                  >
                    <!-- Accessible/Clickable Lesson -->
                    <template v-if="lesson.isFree || userStore.isEnrolled(props.courseId) || userStore.isAdminLike || isOwnCourse">
                      <NuxtLink
                        :to="`/courses/${courseSlug}/lessons/${lesson.slug}`"
                        class="flex items-center gap-3 px-4 py-3 hover:bg-dark-bg transition"
                        :class="{
                          'bg-primary/10 border-r-2 border-primary': lesson.slug === currentLessonSlug,
                        }"
                        :aria-current="lesson.slug === currentLessonSlug ? 'page' : undefined"
                        :aria-label="getLessonAriaLabel(lesson)"
                      >
                        <!-- Status Icon - Completed -->
                        <svg
                          v-if="progressStore.isCompleted(lesson.id || 0)"
                          class="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clip-rule="evenodd"
                          />
                        </svg>

                        <!-- Status Icon - Current -->
                        <svg
                          v-else-if="lesson.slug === currentLessonSlug"
                          class="w-5 h-5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
                            clip-rule="evenodd"
                          />
                        </svg>

                        <!-- Status Icon - Not started (enrolled or free) -->
                        <div
                          v-else
                          class="w-5 h-5 rounded-full border-2 border-dark-divider"
                          aria-hidden="true"
                        />

                        <div class="flex-1 min-w-0">
                          <p
                            class="text-sm truncate"
                            :class="lesson.slug === currentLessonSlug
                              ? 'font-medium text-primary'
                              : 'text-gray-400'"
                          >
                            {{ lesson.title }}
                          </p>
                          <p
                            v-if="lesson.duration"
                            class="text-xs text-gray-500"
                          >
                            <span class="sr-only">Duration:</span>
                            {{ lesson.duration }}
                          </p>
                        </div>

                        <!-- Badges -->
                        <div class="flex items-center gap-1.5">
                          <span
                            v-if="lesson.isFree && !userStore.isEnrolled(props.courseId)"
                            class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded"
                          >
                            🆓 Free
                          </span>
                        </div>
                      </NuxtLink>
                    </template>

                    <!-- Locked Lesson (Not Clickable) -->
                    <template v-else>
                      <div
                        class="flex items-center gap-3 px-4 py-3 opacity-50 cursor-not-allowed"
                        role="button"
                        :aria-label="`${lesson.title} - Purchase course to unlock`"
                        aria-disabled="true"
                      >
                        <!-- Lock Icon -->
                        <svg
                          class="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>

                        <div class="flex-1 min-w-0">
                          <p class="text-sm truncate text-gray-500">
                            {{ lesson.title }}
                          </p>
                          <p
                            v-if="lesson.duration"
                            class="text-xs text-gray-600"
                          >
                            <span class="sr-only">Duration:</span>
                            {{ lesson.duration }}
                          </p>
                        </div>

                        <!-- Locked Badge -->
                        <span class="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
                          🔒 Locked
                        </span>

                        <!-- Tooltip -->
                        <div
                          class="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
                          role="tooltip"
                        >
                          <div class="bg-dark-surface border border-dark-divider text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                            Purchase course to unlock
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </nav>
              </template>

              <template #empty>
                <p
                  class="p-4 text-gray-500 text-sm"
                  role="status"
                >
                  No lessons in this section
                </p>
              </template>
            </UiAccordion>
          </template>

          <!-- Empty State -->
          <div
            v-else
            role="status"
          >
            <UiEmptyState
              title="No content available"
              message="Course content will be added soon."
            >
              <template #icon>
                <svg
                  class="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </template>
            </UiEmptyState>
          </div>
        </div>
      </section>

      <!-- Instructor Card -->
      <section
        v-if="course?.instructor"
        class="bg-dark-surface rounded-xl p-4 border border-dark-divider"
        aria-label="Course instructor"
      >
        <h2 class="font-bold text-white mb-3">
          Course Instructor
        </h2>
        <div class="flex items-center gap-3">
          <AvatarImage
            :src="course.instructor.avatar"
            :alt="`${course.instructor.name} profile picture`"
            width="48"
            height="48"
            class="w-12 h-12 rounded-full object-cover bg-dark-bg"
          />
          <div>
            <p class="font-medium text-white">
              {{ course.instructor.name }}
            </p>
            <p class="text-sm text-gray-400">
              {{ course.instructor.title }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import type { CourseContentLesson } from '~/types/course'
import type { AccordionItem } from '~/types/components/accordion'

// ───── Types ─────
interface SectionAccordionItem extends AccordionItem {
  id: number
  lessonCount: number
  lessons: CourseContentLesson[]
}

interface Props {
  currentLessonSlug: string
  courseSlug: string
  courseId: number
}

const props = defineProps<Props>()

// ───── Stores ─────
const coursesStore = useCoursesStore()
const progressStore = useLessonProgressStore()
const userStore = useUserStore()

// ───── Computed from Store ─────
const course = computed(() => coursesStore.detailedCourse)

const isOwnCourse = computed(() => {
  if (!userStore.isAuthenticated) return false
  if (userStore.user?.role !== 'instructor') return false
  return userStore.user?.id === course.value?.instructor?.userId
})
const hasContent = computed(() => coursesStore.allLessons.length > 0)

const courseProgress = computed(() =>
  progressStore.getProgressForCourse(coursesStore.allLessonIds),
)

// ───── Transform course content to Accordion items ─────
const accordionItems = computed((): SectionAccordionItem[] => {
  if (!course.value?.courseContent) return []

  return course.value.courseContent.map((section, index) => ({
    id: section.id || index,
    title: section.title,
    description: undefined,
    lessonCount: section.content?.length || 0,
    lessons: section.content || [],
  }))
})

// ───── Expanded Sections ─────
const expandedSections = ref<number[]>([])

// ───── Auto-expand current section ─────
const expandCurrentSection = () => {
  if (!course.value?.courseContent) return

  const currentSectionIndex = course.value.courseContent.findIndex(section =>
    section.content?.some(lesson => lesson.slug === props.currentLessonSlug),
  )

  if (currentSectionIndex > -1 && !expandedSections.value.includes(currentSectionIndex)) {
    expandedSections.value = [currentSectionIndex]
  }
  else if (expandedSections.value.length === 0) {
    expandedSections.value = [0]
  }
}

// ───── Helpers ─────
function getLessonAriaLabel(lesson: CourseContentLesson): string {
  const status = progressStore.isCompleted(lesson.id || 0)
    ? 'Completed'
    : lesson.slug === props.currentLessonSlug
      ? 'Currently playing'
      : 'Not started'

  const free = lesson.isFree ? ', Free lesson' : ''
  const duration = lesson.duration ? `, Duration: ${lesson.duration}` : ''

  return `${lesson.title}, ${status}${free}${duration}`
}

onMounted(expandCurrentSection)
watch(() => course.value?.courseContent, expandCurrentSection)
watch(() => props.currentLessonSlug, expandCurrentSection)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: theme('colors.dark-bg');
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.dark-divider');
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: theme('colors.gray.500');
}
</style>
