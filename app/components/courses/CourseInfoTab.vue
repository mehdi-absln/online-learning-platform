<template>
  <div class="space-y-10">
    <!-- About Section -->
    <section aria-labelledby="about-heading">
      <h2
        id="about-heading"
        class="text-xl font-bold text-primary font-antonio"
      >
        About Course
      </h2>
      <p class="text-white/90 mt-4">
        "{{ course.description }}"
      </p>
    </section>

    <!-- Learning Objectives Section -->
    <section aria-labelledby="learning-heading">
      <h2
        id="learning-heading"
        class="text-xl font-bold text-primary font-antonio"
      >
        What Will You Learn?
      </h2>
      <ul class="list-none text-white/90 space-y-2 mt-4">
        <li
          v-for="(learningItem, index) in course.learningObjectives"
          :key="index"
          class="relative"
        >
          <span
            class="text-primary"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          {{ learningItem }}
        </li>
      </ul>
    </section>

    <!-- Course Content Section -->
    <section
      aria-labelledby="content-heading"
      class="pt-4"
    >
      <h2
        id="content-heading"
        class="text-xl font-bold text-primary font-antonio"
      >
        Course Content
      </h2>
      <div
        v-if="course.courseContent"
        class="mt-4"
      >
        <Accordion :items="accordionItems">
          <template #default="{ item }">
            <ul class="p-2 sm:p-4 space-y-2 divide-y divide-dark-divider">
              <template
                v-for="(lesson, lessonIndex) in (item.content as CourseContentLesson[])"
                :key="lessonIndex"
              >
                <!-- Accessible/Clickable Lesson -->
                <template v-if="lesson.isFree || userStore.isEnrolled(course.id) || userStore.isAdminLike || isOwnCourse">
                  <li
                    class="flex items-center p-2 group hover:rounded hover:bg-primary/85 duration-200 transition-all cursor-pointer"
                    tabindex="0"
                    role="button"
                    @click="goToLessonPage(lesson)"
                    @keydown.enter="goToLessonPage(lesson)"
                  >
                    <!-- Play Icon -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-primary group-hover:text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span class="text-white/90 ml-2">{{ lesson.title }}</span>
                    <span class="ml-auto text-xs sm:text-sm text-white/70 shrink-0">
                      <time>{{ lesson.duration }}</time>
                    </span>
                    <!-- Free Badge -->
                    <span
                      v-if="lesson.isFree && !userStore.isEnrolled(course.id)"
                      class="ml-2 sm:ml-3 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded shrink-0"
                    >
                      🆓 Free
                    </span>
                  </li>
                </template>

                <!-- Locked Lesson (Not Clickable) -->
                <template v-else>
                  <li
                    class="flex items-center p-2 opacity-50 cursor-not-allowed relative group"
                    role="button"
                    aria-disabled="true"
                    :aria-label="`${lesson.title} - Purchase course to unlock`"
                  >
                    <!-- Lock Icon -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span class="text-gray-500 ml-2 text-sm sm:text-base">{{ lesson.title }}</span>
                    <span class="ml-auto text-xs sm:text-sm text-gray-600 shrink-0">
                      <time>{{ lesson.duration }}</time>
                    </span>
                    <!-- Locked Badge -->
                    <span class="ml-2 sm:ml-3 text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded shrink-0">
                      🔒 Locked
                    </span>

                    <!-- Tooltip -->
                    <div
                      class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-dark-surface border border-dark-divider text-white text-xs px-3 py-2 rounded-lg shadow-xl z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      role="tooltip"
                    >
                      <p>Purchase course to unlock</p>
                    </div>
                  </li>
                </template>
              </template>
            </ul>
          </template>
        </Accordion>
      </div>
      <EmptyState
        v-else
        title="Course content not available"
        message="Course content is not available yet."
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import Accordion from '~/components/ui/Accordion.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { CourseContentLesson, CourseContentSection, DetailedCourse } from '~/types/course'
import type { AccordionItem } from '~/types/components/accordion'

const props = defineProps<{
  course: DetailedCourse
}>()

const userStore = useUserStore()
const courseSlug = computed(() => props.course.slug)

const isOwnCourse = computed(() => {
  if (!userStore.isAuthenticated) return false
  if (userStore.user?.role !== 'instructor') return false
  return userStore.user?.id === props.course.instructor?.userId
})

// Create properly typed Accordion items for course content sections
interface AccordionSection {
  title: string
  description: string | undefined
  lessons: CourseContentLesson[]
}

const courseAccordionItems = computed<AccordionSection[]>(() => {
  if (!props.course.courseContent) return []

  return props.course.courseContent.map((section: CourseContentSection) => ({
    title: section.title,
    description: section.description || undefined,
    lessons: section.content || [],
  }))
})

const accordionItems = computed<AccordionItem[]>(() =>
  courseAccordionItems.value.map((item: AccordionSection) => ({
    title: item.title,
    description: item.description,
    content: item.lessons,
  })),
)

const goToLessonPage = async (lesson: CourseContentLesson) => {
  if (!lesson.slug || !courseSlug.value) {
    console.warn('Invalid lesson or course slug')
    return
  }

  try {
    const lessonUrl = `/courses/${courseSlug.value}/lessons/${lesson.slug}`
    await navigateTo(lessonUrl)
  }
  catch (navigationError) {
    console.error('Navigation failed:', navigationError)
  }
}
</script>
