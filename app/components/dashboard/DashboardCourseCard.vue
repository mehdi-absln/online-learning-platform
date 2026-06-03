<template>
  <div class="bg-dark-surface border border-dark-divider/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-dark-divider hover:shadow-lg hover:shadow-black/20 group">
    <!-- Thumbnail -->
    <div class="aspect-video overflow-hidden bg-dark-bg relative">
      <CourseImage
        :src="course.thumbnail"
        :alt="course.title"
        loading="lazy"
        sizes="100vw sm:50vw md:33vw"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Completion badge -->
      <div
        v-if="isCompleted"
        class="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full"
      >
        <span aria-hidden="true">✅</span> Completed
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <h4 class="text-base font-semibold text-white mb-3 truncate group-hover:text-primary transition-colors">
        {{ course.title }}
      </h4>

      <!-- Progress bar -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-gray-400">
            {{ course.completedLessons }}/{{ course.totalLessons }} lessons
          </span>
          <span
            class="text-xs font-bold tabular-nums"
            :class="isCompleted ? 'text-emerald-400' : 'text-primary'"
          >
            {{ course.progressPercentage }}%
          </span>
        </div>
        <div class="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-primary-alt'"
            :style="{ width: `${course.progressPercentage}%` }"
          />
        </div>
      </div>

      <!-- Action -->
      <NuxtLink
        :to="courseLink"
        class="w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 block"
        :class="isCompleted
          ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-dark-divider/50'
          : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'"
      >
        {{ isCompleted ? 'Review Course' : 'Continue' }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardEnrolledCourse } from '~/types/dashboard'
import CourseImage from '~/components/courses/CourseImage.vue'

interface Props {
  course: DashboardEnrolledCourse
}

const props = defineProps<Props>()

const isCompleted = computed(() => props.course.progressPercentage === 100)

const courseLink = computed(() => {
  if (!isCompleted.value && props.course.lastAccessedLesson) {
    return `/courses/${props.course.slug}/lessons/${props.course.lastAccessedLesson.slug}`
  }
  return `/courses/${props.course.slug}`
})
</script>
