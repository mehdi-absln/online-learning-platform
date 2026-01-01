<template>
  <div class="bg-dark-surface rounded-xl border border-dark-divider overflow-hidden">
    <!-- Tabs -->
    <div class="border-b border-dark-divider">
      <nav class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('update:activeTab', tab.id)"
          class="px-6 py-4 font-medium transition relative"
          :class="activeTab === tab.id 
            ? 'text-primary' 
            : 'text-gray-400 hover:text-white'"
        >
          <span class="flex items-center gap-2">
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </span>
          <span
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          />
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      <!-- Content Tab -->
      <div v-show="activeTab === 'content'">
        <div 
          v-if="lesson?.content"
          class="prose prose-invert prose-lg max-w-none
            prose-headings:text-white 
            prose-p:text-gray-300 
            prose-a:text-primary 
            prose-strong:text-white
            prose-code:bg-dark-bg prose-code:px-1 prose-code:rounded
            prose-pre:bg-dark-bg prose-pre:border prose-pre:border-dark-divider"
          v-html="renderedContent"
        />
        <p v-else class="text-gray-400">Content for this lesson will be added soon...</p>
      </div>

      <!-- Resources Tab -->
      <div v-show="activeTab === 'resources'">
        <div v-if="hasResources" class="space-y-3">
          <!-- Sample resources - replace with actual data -->
          <a
            v-for="resource in sampleResources"
            :key="resource.id"
            :href="resource.url"
            download
            class="flex items-center gap-3 p-4 rounded-lg border border-dark-divider hover:bg-dark-bg transition group"
          >
            <div class="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 00-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-white truncate">{{ resource.title }}</p>
              <p class="text-sm text-gray-400">{{ resource.size }}</p>
            </div>
            <svg class="w-5 h-5 text-gray-500 group-hover:text-primary transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
        <div v-else class="text-center py-12">
          <svg class="w-12 h-12 mx-auto mb-3 text-dark-divider" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p class="text-gray-500">No resources available for this lesson</p>
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-show="activeTab === 'notes'">
        <div class="space-y-4">
          <textarea
            v-model="userNotes"
            placeholder="Write your notes here..."
            rows="6"
            class="w-full px-4 py-3 bg-dark-bg border border-dark-divider rounded-xl resize-none 
              text-white placeholder-gray-500
              focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          <div class="flex justify-end">
            <button
              @click="saveNotes"
              :disabled="!userNotes.trim()"
              class="px-5 py-2.5 bg-primary text-white rounded-lg font-medium 
                disabled:opacity-50 disabled:cursor-not-allowed 
                hover:bg-primary/90 transition"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import type { DetailedLesson } from '~/types/shared/courses'
import type { LessonAttachment } from '~/types/shared/lessons'

interface Props {
  lesson: DetailedLesson | null
  activeTab: 'content' | 'resources' | 'notes'
}

const props = defineProps<Props>()

defineEmits<{
  'update:activeTab': ['content' | 'resources' | 'notes']
}>()

const userNotes = ref('')

const tabs = [
  { id: 'content' as const, label: 'Lesson Content', icon: 'DocumentTextIcon' },
  { id: 'resources' as const, label: 'Attachments', icon: 'PaperClipIcon' },
  { id: 'notes' as const, label: 'My Notes', icon: 'PencilSquareIcon' },
]

// Render markdown content
const renderedContent = computed(() => {
  if (!props.lesson?.content) return ''
  return marked.parse(props.lesson.content)
})

// Sample resources - replace with actual lesson resources
const hasResources = computed(() => false) // Change when you have actual resources

const sampleResources: LessonAttachment[] = [
  { id: 1, name: 'Project Source Code', url: '#', size: '2.4 MB', type: 'zip', createdAt: new Date() },
  { id: 2, name: 'Presentation Slides', url: '#', size: '1.1 MB', type: 'pdf', createdAt: new Date() },
]

function saveNotes() {
  // TODO: Save notes to API
  console.log('Saving notes:', userNotes.value)
}
</script>