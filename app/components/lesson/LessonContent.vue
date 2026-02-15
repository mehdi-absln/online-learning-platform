<template>
  <div class="bg-dark-surface rounded-xl border border-dark-divider overflow-hidden">
    <Tabs
      :tabs="[
        { name: 'content', title: 'Lesson Content' },
        { name: 'resources', title: 'Attachments' },
        { name: 'notes', title: 'My Notes' },
      ]"
      aria-label="Lesson content sections"
      tab-list-class="border-b border-dark-divider"
      tab-class="px-6 py-4 font-medium transition-colors duration-200 focus:outline-none"
      active-tab-class="text-primary border-b-2 border-primary"
      inactive-tab-class="text-gray-400 hover:text-white"
      panel-class="p-6"
    >
      <template #content>
        <div
          v-if="lesson?.content"
          class="prose prose-invert prose-lg max-w-none text-white"
          v-html="renderedContent"
        />
        <p
          v-else
          class="text-gray-400"
          role="status"
        >
          Content for this lesson will be added soon...
        </p>
      </template>

      <template #resources>
        <ul
          v-if="sampleResources"
          class="space-y-3"
          role="list"
          aria-label="Downloadable resources"
        >
          <li
            v-for="resource in sampleResources"
            :key="resource.id"
          >
            <a
              :href="resource.url"
              download
              class="flex items-center gap-3 p-4 rounded-lg border border-dark-divider hover:bg-dark-bg transition group"
              :aria-label="`Download ${resource.name} (${resource.size})`"
            >
              <div
                class="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition"
                aria-hidden="true"
              >
                <svg
                  class="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 00-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-white truncate">{{ resource.name }}</p>
                <p class="text-sm text-gray-400">{{ resource.size }}</p>
              </div>
              <svg
                class="w-5 h-5 text-gray-500 group-hover:text-primary transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
          </li>
        </ul>
        <div
          v-else
          class="text-center py-12"
          role="status"
        >
          <svg
            class="w-12 h-12 mx-auto mb-3 text-dark-divider"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <p class="text-gray-500">
            No resources available for this lesson
          </p>
        </div>
      </template>

      <template #notes>
        <div class="space-y-4">
          <label
            for="lesson-notes"
            class="sr-only"
          >
            Your notes for this lesson
          </label>
          <textarea
            id="lesson-notes"
            v-model="localNotes"
            placeholder="Write your notes here..."
            rows="6"
            class="w-full px-4 py-3 bg-transparent border border-dark-divider rounded-xl resize-none
              text-white placeholder-gray-500
              focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          <div class="flex justify-end">
            <button
              :disabled="isSaving || !localNotes.trim()"
              class="px-5 py-2.5 bg-primary text-white rounded-lg font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-primary/90 transition"
              @click="saveNotes"
            >
              {{ isSaving ? 'Saving...' : 'Save Notes' }}
            </button>
          </div>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import Tabs from '~/components/ui/Tabs.vue'
import type { DetailedLesson } from '~/types/shared/courses'
import type { LessonAttachment } from '~/types/shared/lessons'

interface Props {
  lesson: DetailedLesson | null
}

const props = defineProps<Props>()

// ───── Store ─────
const progressStore = useLessonProgressStore()

// ───── Notes ─────
const localNotes = ref('')
const isSaving = ref(false)

watch(
  () => props.lesson?.id,
  (lessonId) => {
    if (lessonId) {
      localNotes.value = progressStore.getNote(lessonId)
    }
  },
  { immediate: true },
)

async function saveNotes() {
  if (!props.lesson) return

  isSaving.value = true
  try {
    await progressStore.saveNote(props.lesson.id, localNotes.value)
  }
  finally {
    isSaving.value = false
  }
}

// ───── Content ─────
const renderedContent = computed(() => {
  if (!props.lesson?.content) return ''
  return marked.parse(props.lesson.content)
})

const sampleResources: LessonAttachment[] = [
  { id: 1, name: 'Project Source Code', url: '#', size: '2.4 MB', type: 'zip', createdAt: new Date() },
  { id: 2, name: 'Presentation Slides', url: '#', size: '1.1 MB', type: 'pdf', createdAt: new Date() },
]
</script>
