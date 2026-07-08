<template>
  <div class="bg-dark-surface rounded-xl border border-dark-divider overflow-hidden">
    <UiTabs
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
        <MarkdownRenderer
          v-if="lesson?.content"
          :content="lesson.content"
          class="prose prose-invert prose-lg max-w-none text-white
            prose-code:text-cyan-300
            prose-code:bg-dark-bg
            prose-code:px-2
            prose-code:py-1
            prose-code:rounded-md
            prose-code:border
            prose-code:border-dark-divider
            prose-code:before:content-none
            prose-code:after:content-none
            prose-pre:bg-dark-bg
            prose-pre:border
            prose-pre:border-dark-divider
            prose-pre:rounded-xl
            prose-pre:shadow-lg"
        />
        <UiEmptyState
          v-else
          title="No content yet"
          message="Content for this lesson will be added soon..."
        />
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
          role="status"
        >
          <UiEmptyState
            title="No resources available"
            message="No resources available for this lesson"
          >
            <template #icon>
              <svg
                class="w-full h-full"
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
            </template>
          </UiEmptyState>
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
    </UiTabs>
  </div>
</template>

<script setup lang="ts">
import type { DetailedLesson, LessonAttachment } from '~/types/lesson'

interface Props {
  lesson: DetailedLesson | null
}

const props = defineProps<Props>()

// ───── Store ─────
const progressStore = useLessonProgressStore()

// ───── Notes ─────
const localNotes = ref('')
const isSaving = ref(false)

// Load notes from the store whenever the lesson changes OR the stored note updates
// (e.g. after fetchProgress resolves on refresh). We guard against overwriting the
// textarea while the user is actively typing.
watch(
  () => [props.lesson?.id, progressStore.getNote(props.lesson?.id ?? -1)],
  ([id]) => {
    if (id) {
      localNotes.value = progressStore.getNote(id as number)
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

const sampleResources: LessonAttachment[] = [
  { id: 1, name: 'Project Source Code', url: '#', size: '2.4 MB', type: 'zip', createdAt: new Date() },
  { id: 2, name: 'Presentation Slides', url: '#', size: '1.1 MB', type: 'pdf', createdAt: new Date() },
]
</script>
