<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-divider p-4 z-50">
    <div class="flex items-center gap-3">
      <button
        @click="$emit('go-prev')"
        :disabled="!prevLesson"
        class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <button
        @click="$emit('toggle-complete')"
        :disabled="isCompleting"
        class="flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
        :class="isCompleted 
          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
          : 'bg-primary text-white'"
      >
        <svg v-if="isCompleting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ isCompleted ? 'Completed' : 'Complete Lesson' }}
      </button>
      
      <button
        @click="$emit('go-next')"
        :disabled="!nextLesson"
        class="p-3 rounded-xl border border-dark-divider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-bg transition"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseContentLesson } from '~/types/shared/courses'

interface Props {
  prevLesson: CourseContentLesson | null
  nextLesson: CourseContentLesson | null
  isCompleted: boolean
  isCompleting: boolean
}

defineProps<Props>()

defineEmits<{
  'go-prev': []
  'go-next': []
  'toggle-complete': []
}>()
</script>