<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-dark-surface to-dark-bg border border-dark-divider/50 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

    <div class="relative flex flex-col sm:flex-row gap-6">
      <!-- Thumbnail -->
      <div class="sm:w-48 lg:w-56 flex-shrink-0">
        <div class="aspect-video rounded-xl overflow-hidden bg-dark-bg">
          <CourseImage
            :src="course.thumbnail"
            :alt="course.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw sm:50vw md:33vw"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Continue Learning
          </p>
          <h3 class="text-xl lg:text-2xl font-bold text-white mb-2 truncate">
            {{ course.title }}
          </h3>
          <p
            v-if="course.lastAccessedLesson"
            class="text-sm text-gray-400 mb-4"
          >
            <span aria-hidden="true">📖</span> {{ course.lastAccessedLesson.title }}
            <span
              class="text-gray-500 mx-1"
              aria-hidden="true"
            >·</span>
            Lesson {{ course.completedLessons + 1 }} of {{ course.totalLessons }}
          </p>
        </div>

        <!-- Progress bar -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-300">Progress</span>
            <span class="text-sm font-bold text-primary tabular-nums">{{ course.progressPercentage }}%</span>
          </div>
          <div class="w-full h-2.5 bg-dark-bg rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary to-primary-alt rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${course.progressPercentage}%` }"
            />
          </div>
        </div>

        <!-- CTA Button -->
        <div>
          <NuxtLink
            :to="lessonLink"
            class="btn-primary text-sm px-6 py-2.5"
          >
            Continue Learning
            <span
              class="ml-1"
              aria-hidden="true"
            >→</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardEnrolledCourse } from '~/types/shared/dashboard'
import CourseImage from '~/components/courses/CourseImage.vue'

interface Props {
  course: DashboardEnrolledCourse
}

const props = defineProps<Props>()

const lessonLink = computed(() => {
  if (props.course.lastAccessedLesson) {
    return `/courses/${props.course.slug}/lessons/${props.course.lastAccessedLesson.slug}`
  }
  return `/courses/${props.course.slug}`
})
</script>
