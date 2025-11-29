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
              @click="navigateToLesson(index, lessonIndex, lesson)"
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
import { navigateTo } from '#app'

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

const openItemIds = ref<Set<string | number>>(new Set())

onMounted(() => {
  if (props.modelValue >= 0 && props.modelValue < props.items.length) {
    const item = props.items[props.modelValue]
    const itemId = item.id ?? props.modelValue
    openItemIds.value.add(itemId)
  }
})

const isOpen = (index: number) => {
  const item = props.items[index]
  const itemId = item.id ?? index
  return openItemIds.value.has(itemId)
}

const toggleAccordion = (index: number) => {
  const item = props.items[index]
  const itemId = item.id ?? index

  if (props.exclusive) {
    openItemIds.value.clear()
    openItemIds.value.add(itemId)
  } else {
    if (openItemIds.value.has(itemId)) {
      openItemIds.value.delete(itemId)
    } else {
      openItemIds.value.add(itemId)
    }
  }

  const openIndex =
    Array.from(openItemIds.value).length > 0
      ? props.items.findIndex((item, idx) => openItemIds.value.has(item.id ?? idx))
      : -1
  emit('update:modelValue', openIndex)
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const keyActions: Record<string, () => void> = {
    ' ': () => toggleAccordion(index),
    Enter: () => toggleAccordion(index),
    ArrowDown: () => {
      event.preventDefault()
      focusNext(index)
    },
    ArrowUp: () => {
      event.preventDefault()
      focusPrevious(index)
    },
    Home: () => {
      event.preventDefault()
      focusFirst()
    },
    End: () => {
      event.preventDefault()
      focusLast()
    }
  }

  const action = keyActions[event.key]
  if (action) {
    event.preventDefault()
    action()
  }
}

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

const createLessonUrl = (lesson: CourseContentLesson, lessonIndex: number, courseSlug?: string) => {
  // Ensure lesson slug exists, as it's a required field
  if (!lesson.slug) {
    throw new Error(`Lesson at index ${lessonIndex} is missing required slug property`)
  }

  if (courseSlug) {
    // Use pre-generated slug from the lesson data
    return `/courses/${courseSlug}/lessons/${lesson.slug}`
  }

  // If no course slug is provided, we cannot create a proper URL since we're using slugs only
  return null
}

const navigateToLesson = (
  sectionIndex: number,
  lessonIndex: number,
  lesson: CourseContentLesson
) => {
  try {
    const url = createLessonUrl(lesson, lessonIndex, props.courseSlug)

    if (url) {
      navigateTo(url)
    } else {
      emit('lesson-click', {
        sectionIndex,
        lessonIndex,
        lesson
      })
    }
  } catch (error: unknown) {
    console.error('Error creating lesson URL:', error)
    emit('lesson-click', {
      sectionIndex,
      lessonIndex,
      lesson
    })
  }
}
</script>
