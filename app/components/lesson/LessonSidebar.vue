<template>
  <aside class="lg:col-span-1">
    <div class="sticky top-32 space-y-6">
      <!-- Course Progress Card -->
      <div class="bg-dark-surface rounded-xl p-4 border border-dark-divider">
        <h3 class="font-bold text-white mb-3">Course Progress</h3>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">
              {{ completedLessonsCount }} of {{ totalLessons }} lessons
            </span>
            <span class="text-sm font-medium text-primary">
              {{ Math.round(courseProgress) }}%
            </span>
          </div>
          <div class="h-2 bg-dark-bg rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary rounded-full transition-all duration-500"
              :style="{ width: `${courseProgress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Lessons List -->
      <div class="bg-dark-surface rounded-xl border border-dark-divider overflow-hidden">
        <div class="p-4 border-b border-dark-divider">
          <h3 class="font-bold text-white">Course Content</h3>
        </div>
        <!-- Debug info - remove after testing -->
        <div v-if="!hasContent" class="p-4 bg-yellow-500/10 border-b border-dark-divider">
          <p class="text-yellow-400 text-sm">
            ⚠️ Debug: courseContent is {{ course?.courseContent ? 'defined but empty' : 'undefined' }}
          </p>
          <p class="text-yellow-400 text-sm">
            Sections: {{ course?.courseContent?.length || 0 }}
          </p>
        </div>

        <div class="max-h-[500px] overflow-y-auto custom-scrollbar">
          <!-- When we have content -->
          <div v-if="hasContent">
            <div
              v-for="(section, sIndex) in course?.courseContent"
              :key="section.id || sIndex"
              class="border-b border-dark-divider last:border-0"
            >
              <!-- Section Header -->
              <button
                @click="toggleSection(sIndex)"
                class="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-bg transition text-right"
              >
                <div class="flex-1 min-w-0">
                  <span class="font-medium text-white block truncate">
                    {{ section.title }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ section.content?.length || 0 }} lessons
                  </span>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 transition-transform flex-shrink-0 mr-2"
                  :class="{ 'rotate-180': expandedSections.includes(sIndex) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Section Lessons -->
              <div
                v-show="expandedSections.includes(sIndex)"
                class="bg-dark-bg/50"
              >
                <NuxtLink
                  v-for="lesson in section.content"
                  :key="lesson.id || lesson.slug"
                  :to="`/courses/${courseSlug}/lessons/${lesson.slug}`"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-dark-bg transition"
                  :class="{
                    'bg-primary/10 border-r-2 border-primary': lesson.slug === currentLessonSlug
                  }"
                >
                  <!-- Status Icon -->
                  <div class="flex-shrink-0">
                    <!-- Completed -->
                    <svg
                      v-if="isLessonCompleted(lesson.id)"
                      class="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                    </svg>
                    <!-- Current -->
                    <svg
                      v-else-if="lesson.slug === currentLessonSlug"
                      class="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clip-rule="evenodd" />
                    </svg>
                    <!-- Not started -->
                    <div
                      v-else
                      class="w-5 h-5 rounded-full border-2 border-dark-divider"
                    />
                  </div>

                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm truncate"
                      :class="lesson.slug === currentLessonSlug
                        ? 'font-medium text-primary'
                        : 'text-gray-400'"
                    >
                      {{ lesson.title }}
                    </p>
                    <p v-if="lesson.duration" class="text-xs text-gray-500">
                      {{ lesson.duration }}
                    </p>
                  </div>

                  <!-- Free badge -->
                  <span
                    v-if="lesson.isFree"
                    class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded"
                  >
                    Free
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- When we don't have content -->
          <div v-else class="p-8 text-center">
            <svg class="w-12 h-12 mx-auto mb-3 text-dark-divider" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p class="text-gray-500">No content available for this course</p>
            <p class="text-gray-600 text-sm mt-1">Will be added soon</p>
          </div>
        </div>
      </div>

      <!-- Instructor Card -->
      <div 
        v-if="course?.instructor" 
        class="bg-dark-surface rounded-xl p-4 border border-dark-divider"
      >
        <h3 class="font-bold text-white mb-3">Course Instructor</h3>
        <div class="flex items-center gap-3">
          <img 
            :src="course.instructor.avatar || '/images/default-avatar.png'" 
            :alt="course.instructor.name"
            class="w-12 h-12 rounded-full object-cover bg-dark-bg"
          />
          <div>
            <p class="font-medium text-white">{{ course.instructor.name }}</p>
            <p class="text-sm text-gray-400">{{ course.instructor.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Accordion from '~/components/ui/Accordion.vue'
import type { DetailedCourse } from '~/types/shared/courses'

interface Props {
  course: DetailedCourse | null
  currentLessonSlug: string
  courseSlug: string
  completedLessonIds: number[]
  courseProgress: number
  completedLessonsCount: number
  totalLessons: number
}

const props = withDefaults(defineProps<Props>(), {
  completedLessonIds: () => []
})

// State for expanded sections
const expandedSections = ref<number[]>([])

// Check if we have content
const hasContent = computed(() => {
  return props.course?.courseContent && props.course.courseContent.length > 0
})

// Auto-expand current section on mount
onMounted(() => {
  if (props.course?.courseContent) {
    const currentSectionIndex = props.course.courseContent.findIndex(section =>
      section.content?.some(lesson => lesson.slug === props.currentLessonSlug)
    )
    if (currentSectionIndex > -1) {
      expandedSections.value = [currentSectionIndex]
    } else {
      // Expand first section by default
      expandedSections.value = [0]
    }
  }
})

// Watch for course changes
watch(() => props.course?.courseContent, (newContent) => {
  if (newContent && newContent.length > 0 && expandedSections.value.length === 0) {
    expandedSections.value = [0]
  }
}, { immediate: true })

function toggleSection(index: number) {
  const idx = expandedSections.value.indexOf(index)
  if (idx > -1) {
    expandedSections.value.splice(idx, 1)
  } else {
    expandedSections.value.push(index)
  }
}

function isLessonCompleted(lessonId?: number): boolean {
  if (!lessonId) return false
  if (!props.completedLessonIds) return false
  return props.completedLessonIds.includes(lessonId)
}
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