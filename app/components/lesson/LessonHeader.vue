<template>
  <header 
    class="bg-dark-surface border-b border-dark-divider sticky top-0 z-40 transition-shadow duration-300"
    :class="{ 'shadow-lg shadow-black/20': isScrolled }"
  >
    <div class="container mx-auto px-4">
      <!-- Breadcrumb -->
      <Breadcrumb :crumbs="breadcrumbs" class="py-2 border-b border-dark-divider/50" />

      <!-- Progress & Navigation -->
      <div class="py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 min-w-0">
          <NuxtLink 
            :to="`/courses/${course?.slug}`"
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
              {{ lesson?.title }}
            </h1>
          </div>
        </div>

        <!-- Lesson Navigation (Desktop) -->
        <div class="hidden sm:flex items-center gap-2">
          <button
            @click="$emit('go-prev')"
            :disabled="!prevLesson"
            class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
            title="Previous lesson (→)"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            @click="$emit('go-next')"
            :disabled="!nextLesson"
            class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
            title="Next lesson (←)"
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
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import type { DetailedCourse, DetailedLesson, CourseContentLesson } from '~/types/shared/courses'

interface Props {
  course: DetailedCourse | null
  lesson: DetailedLesson | null
  currentIndex: number
  totalLessons: number
  progressPercentage: number
  prevLesson: CourseContentLesson | null
  nextLesson: CourseContentLesson | null
  isScrolled: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'go-prev': []
  'go-next': []
}>()

const breadcrumbs = computed(() => [
  { name: 'Courses', path: '/courses' },
  { name: props.course?.title || '...', path: `/courses/${props.course?.slug}` },
  { name: props.lesson?.title || '...', path: '#' },
])
</script>