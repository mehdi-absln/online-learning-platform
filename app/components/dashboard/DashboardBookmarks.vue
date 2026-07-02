<template>
  <section
    v-if="bookmarkedLessons.length > 0"
    aria-labelledby="bookmarks-heading"
  >
    <h2
      id="bookmarks-heading"
      class="text-xl font-bold text-white mb-4"
    >
      <span aria-hidden="true">🔖</span> Bookmarked Lessons
    </h2>
    <div class="bg-dark-surface border border-dark-divider/50 rounded-2xl divide-y divide-dark-divider/50 overflow-hidden">
      <NuxtLink
        v-for="bookmark in bookmarkedLessons"
        :key="bookmark.lessonId"
        :to="`/courses/${bookmark.courseSlug}/lessons/${bookmark.lessonSlug}`"
        class="flex items-center gap-4 px-5 py-4 hover:bg-dark-bg/50 transition-colors group"
      >
        <span
          class="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform"
          aria-hidden="true"
        >
          📖
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
            {{ bookmark.lessonTitle }}
          </p>
          <p class="text-xs text-gray-400 truncate">
            {{ bookmark.courseTitle }}
          </p>
        </div>
        <span
          class="text-gray-400 group-hover:text-primary transition-colors flex-shrink-0"
          aria-hidden="true"
        >
          →
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DashboardBookmark } from '~/types/dashboard'

interface Props {
  bookmarkedLessons: DashboardBookmark[]
}

defineProps<Props>()
</script>
