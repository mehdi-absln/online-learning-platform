<template>
  <div role="tablist" class="w-full">
    <div
      v-for="(item, index) in items"
      :key="item.id || item.title || index"
      class="border border-gray-200 rounded-lg mb-2 overflow-hidden"
      role="presentation"
    >
      <h3 class="m-0">
        <button
          :id="`accordion-header-${index}`"
          :aria-expanded="isOpen(index) ? 'true' : 'false'"
          :aria-controls="`accordion-content-${index}`"
          role="tab"
          class="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          @click="toggleAccordion(index)"
          @keydown="handleKeyDown($event, index)"
        >
          <div>
            <span class="font-medium text-gray-800">{{ item.title }}</span>
            <div v-if="item.description" class="text-sm text-gray-600 mt-1">
              {{ item.description }}
            </div>
          </div>
          <svg
            :class="{ 'rotate-180': isOpen(index) }"
            class="w-5 h-5 text-gray-600 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>

      <div
        v-show="isOpen(index)"
        :id="`accordion-content-${index}`"
        :aria-labelledby="`accordion-header-${index}`"
        role="tabpanel"
        class="p-4 bg-white border-t border-gray-200"
      >
        <div v-if="item.lessons && item.lessons.length > 0" class="space-y-2">
          <div
            v-for="(lesson, lessonIndex) in item.lessons"
            :key="lesson.id || lessonIndex"
            class="flex items-center p-2 rounded group hover:bg-gray-50"
          >
            <svg
              class="w-4 h-4 text-primary mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="flex-1 min-w-0">
              <div class="text-gray-700 truncate">{{ lesson.title }}</div>
              <div v-if="lesson.duration" class="text-xs text-gray-500">
                {{ lesson.duration }}
              </div>
            </div>

            <!-- Video icon if video URL is available - emits an event -->
            <button
              v-if="lesson.videoUrl"
              class="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :aria-label="`Watch video for ${lesson.title}`"
              @click="goToLesson(index, lessonIndex, lesson)"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 10.15l-4.83-2.83a1 1 0 00-1.5 1.159l4.828 2.829m-5.131 4.829L9.92 14.25a1 1 0 011.159 1.5l-4.83 2.83M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-else class="text-gray-500 italic p-2">No lessons available in this section.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionProps, CourseContentLesson } from '~/types/components/accordion'

interface Emits {
  'update:modelValue': [index: number]
  'lesson-click': [
    payload: { sectionIndex: number; lessonIndex: number; lesson: CourseContentLesson }
  ]
}

const props = withDefaults(defineProps<AccordionProps>(), {
  exclusive: false,
  modelValue: -1,
  courseId: undefined,
  courseSlug: undefined
})

const emit = defineEmits<Emits>()

// Track which accordion items are open using their IDs or indices if no ID is provided
const openItemIds = ref<Set<string | number>>(new Set())

// Initialize the open state based on modelValue prop
onMounted(() => {
  if (props.modelValue >= 0 && props.modelValue < props.items.length) {
    const item = props.items[props.modelValue]
    const itemId = item.id ?? props.modelValue
    openItemIds.value.add(itemId)
  }
})

// Check if an accordion item is open
const isOpen = (index: number) => {
  const item = props.items[index]
  const itemId = item.id ?? index
  return openItemIds.value.has(itemId)
}

// Toggle the accordion item at the specified index
const toggleAccordion = (index: number) => {
  const item = props.items[index]
  const itemId = item.id ?? index

  if (props.exclusive) {
    // If exclusive mode, close all and open only the clicked item
    openItemIds.value.clear()
    openItemIds.value.add(itemId)
  } else {
    // Toggle the state of the clicked item
    if (openItemIds.value.has(itemId)) {
      openItemIds.value.delete(itemId)
    } else {
      openItemIds.value.add(itemId)
    }
  }

  // Emit the index of the currently open item (or -1 if none open in non-exclusive mode)
  const openIndex =
    Array.from(openItemIds.value).length > 0
      ? props.items.findIndex((item, idx) => openItemIds.value.has(item.id ?? idx))
      : -1
  emit('update:modelValue', openIndex)
}

// Handle keyboard events for accessibility
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault()
      toggleAccordion(index)
      break
    case 'ArrowDown':
      event.preventDefault()
      focusNext(index)
      break
    case 'ArrowUp':
      event.preventDefault()
      focusPrevious(index)
      break
    case 'Home':
      event.preventDefault()
      focusFirst()
      break
    case 'End':
      event.preventDefault()
      focusLast()
      break
  }
}

// Helper functions for keyboard navigation
const focusElement = (index: number) => {
  const element = document.getElementById(`accordion-header-${index}`)
  if (element) {
    element.focus()
  }
}

const focusNext = (currentIndex: number) => {
  const nextIndex = (currentIndex + 1) % props.items.length
  focusElement(nextIndex)
}

const focusPrevious = (currentIndex: number) => {
  const prevIndex = (currentIndex - 1 + props.items.length) % props.items.length
  focusElement(prevIndex)
}

const focusFirst = () => {
  focusElement(0)
}

const focusLast = () => {
  focusElement(props.items.length - 1)
}

// Function to navigate to lesson page
const goToLesson = (sectionIndex: number, lessonIndex: number, lesson: CourseContentLesson) => {
  // Use the lesson ID if available, otherwise fall back to position-based approach
  const lessonId = lesson.id ?? lessonIndex + 1

  try {
    let url: string

    // If courseSlug is provided, use slug-based URL, otherwise fallback to ID-based
    if (props.courseSlug) {
      const lessonSlug = lesson.title ? generateSlug(lesson.title) : lessonId.toString()
      url = `/courses/${props.courseSlug}/lessons/${lessonSlug}`
    } else if (props.courseId !== undefined) {
      url = `/courses/${props.courseId}/lessons/${lessonId}`
    } else {
      // If neither courseSlug nor courseId is provided, emit lesson-click event
      emit('lesson-click', {
        sectionIndex,
        lessonIndex,
        lesson
      })
      return
    }

    navigateTo(url)
  } catch (error: unknown) {
    console.error('Error navigating to lesson:', error)
    // Emit the lesson-click event for external handling if navigation fails
    emit('lesson-click', {
      sectionIndex,
      lessonIndex,
      lesson
    })
  }
}
</script>
