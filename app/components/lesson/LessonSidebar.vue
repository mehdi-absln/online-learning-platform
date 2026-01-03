<template>
  <aside class="lg:col-span-1">
    <div class="sticky top-32 space-y-6">
      <!-- Course Progress Card (قبلاً LessonProgress بود) -->
      <div class="bg-dark-surface rounded-xl p-4 border border-dark-divider">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-white">Course Progress</h3>
          <span class="text-lg font-bold text-primary">
            {{ Math.round(courseProgress.percentage) }}%
          </span>
        </div>

        <div class="h-3 bg-dark-bg rounded-full overflow-hidden mb-3">
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
          <span v-else class="text-green-400 font-medium">
            ✓ Completed
          </span>
        </div>
      </div>

      <!-- Lessons List -->
      <div class="bg-dark-surface rounded-xl border border-dark-divider overflow-hidden">
        <div class="p-4 border-b border-dark-divider">
          <h3 class="font-bold text-white">Course Content</h3>
        </div>

        <div class="max-h-[500px] overflow-y-auto custom-scrollbar">
          <div v-if="hasContent">
            <div
              v-for="(section, sIndex) in course?.courseContent"
              :key="section.id || sIndex"
              class="border-b border-dark-divider last:border-0"
            >
              <!-- Section Header -->
              <button
                class="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-bg transition text-right"
                @click="toggleSection(sIndex)"
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
                    <svg
                      v-if="progressStore.isCompleted(lesson.id)"
                      class="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                    </svg>
                    <svg
                      v-else-if="lesson.slug === currentLessonSlug"
                      class="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clip-rule="evenodd" />
                    </svg>
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

          <!-- Empty State -->
          <div v-else class="p-8 text-center">
            <svg class="w-12 h-12 mx-auto mb-3 text-dark-divider" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p class="text-gray-500">No content available</p>
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
interface Props {
  currentLessonSlug: string
  courseSlug: string
}

const props = defineProps<Props>()

// ───── Stores ─────
const coursesStore = useCoursesStore()
const progressStore = useLessonProgressStore()

// ───── Computed from Store ─────
const course = computed(() => coursesStore.detailedCourse)
const hasContent = computed(() => coursesStore.allLessons.length > 0)

const courseProgress = computed(() =>
  progressStore.getProgressForCourse(coursesStore.allLessonIds)
)

// ───── Local State ─────
const expandedSections = ref<number[]>([])

// ───── Auto-expand current section ─────
const expandCurrentSection = () => {
  if (!course.value?.courseContent) return

  const currentSectionIndex = course.value.courseContent.findIndex(section =>
    section.content?.some(lesson => lesson.slug === props.currentLessonSlug)
  )

  if (currentSectionIndex > -1 && !expandedSections.value.includes(currentSectionIndex)) {
    expandedSections.value = [currentSectionIndex]
  } else if (expandedSections.value.length === 0) {
    expandedSections.value = [0]
  }
}

// اجرا در mount و وقتی course تغییر کنه
onMounted(expandCurrentSection)
watch(() => course.value?.courseContent, expandCurrentSection)

// ───── Methods ─────
function toggleSection(index: number) {
  const idx = expandedSections.value.indexOf(index)
  if (idx > -1) {
    expandedSections.value.splice(idx, 1)
  } else {
    expandedSections.value.push(index)
  }
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