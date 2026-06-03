<script setup lang="ts">
import type { CourseContentLesson } from '~/types/course'
import IconSpinner from '~/components/icons/IconSpinner.vue'
import IconCheckCircle from '~/components/icons/IconCheckCircle.vue'
import IconChevronLeft from '~/components/icons/IconChevronLeft.vue'
import IconChevronRight from '~/components/icons/IconChevronRight.vue'
import IconLock from '~/components/icons/IconLock.vue'

defineProps<{
  prevLesson: CourseContentLesson | null
  nextLesson: CourseContentLesson | null
  nextLessonAccessible: boolean
  isCompletingLesson: boolean
  isLessonCompleted: boolean
  variant: 'desktop' | 'mobile'
}>()

const emit = defineEmits<{
  'prev': []
  'next': []
  'toggle-complete': []
}>()
</script>

<template>
  <!-- Desktop Navigation -->
  <nav
    v-if="variant === 'desktop'"
    class="flex items-center gap-2"
    aria-label="Lesson navigation"
  >
    <button
      :disabled="!prevLesson"
      class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
      title="Previous lesson (←)"
      aria-label="Go to previous lesson"
      @click="emit('prev')"
    >
      <IconChevronLeft class="w-5 h-5 text-white/90" />
    </button>

    <button
      :disabled="!nextLessonAccessible"
      class="p-2 rounded-lg border border-dark-divider transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg hover:border-gray-500"
      :title="nextLessonAccessible ? 'Next lesson (→)' : 'Purchase course to unlock'"
      aria-label="Go to next lesson"
      @click="emit('next')"
    >
      <IconLock
        v-if="!nextLessonAccessible"
        class="w-5 h-5 text-white/90"
      />
      <IconChevronRight
        v-else
        class="w-5 h-5 text-white/90"
      />
    </button>
  </nav>

  <!-- Mobile Navigation (Fixed Bottom) -->
  <nav
    v-else
    class="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-divider p-4 z-50"
    aria-label="Mobile lesson navigation"
  >
    <div class="flex items-center gap-3">
      <button
        :disabled="!prevLesson"
        class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
        aria-label="Go to previous lesson"
        @click="emit('prev')"
      >
        <IconChevronLeft class="w-5 h-5 text-gray-400" />
      </button>

      <button
        :disabled="isCompletingLesson"
        :aria-busy="isCompletingLesson"
        :aria-pressed="isLessonCompleted"
        class="flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
        :class="isLessonCompleted
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-primary text-white'"
        @click="emit('toggle-complete')"
      >
        <IconSpinner
          v-if="isCompletingLesson"
          class="w-5 h-5"
        />
        <IconCheckCircle
          v-else
          class="w-5 h-5"
        />
        {{ isLessonCompleted ? 'Completed' : 'Complete' }}
      </button>

      <button
        :disabled="!nextLessonAccessible"
        class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
        :aria-label="nextLessonAccessible ? 'Go to next lesson' : 'Purchase course to unlock'"
        @click="emit('next')"
      >
        <IconLock
          v-if="!nextLessonAccessible"
          class="w-5 h-5 text-gray-400"
        />
        <IconChevronRight
          v-else
          class="w-5 h-5 text-gray-400"
        />
      </button>
    </div>
  </nav>
</template>
