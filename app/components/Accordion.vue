<template>
  <div
    class="w-full space-y-2 accordion"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      class="border border-gray-200 rounded-lg overflow-hidden bg-white"
    >
      <!-- Header -->
      <h3 :id="`accordion-header-${index}`">
        <button
          :ref="(el) => (headerRefs[index] = el as HTMLElement)"
          :aria-expanded="isOpen(index)"
          :aria-controls="`accordion-content-${index}`"
          :disabled="item.disabled"
          :class="[
            'flex items-center justify-between w-full p-4 text-start bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
            { 'opacity-50 cursor-not-allowed': item.disabled },
          ]"
          @click="toggleAccordion(index)"
          @keydown="handleKeyDown($event, index)"
        >
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">{{ item.title }}</span>
            <span
              v-if="item.description"
              class="text-sm text-gray-600 mt-1"
            >
              {{ item.description }}
            </span>
          </div>

          <!-- Chevron Icon -->
          <svg
            :class="['w-5 h-5 text-gray-500 transition-transform duration-300', isOpen(index) ? 'rotate-180' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

      <!-- Content -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[500px]"
        leave-from-class="opacity-100 max-h-[500px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div
          v-show="isOpen(index)"
          :id="`accordion-content-${index}`"
          role="region"
          :aria-labelledby="`accordion-header-${index}`"
          class="border-t border-gray-200 overflow-hidden"
        >
          <div
            v-if="item.lessons?.length"
            class="p-2 space-y-1 bg-white"
          >
            <div
              v-for="(lesson, lessonIndex) in item.lessons"
              :key="lesson.id || lessonIndex"
              :class="[
                'group flex items-center p-3 rounded-md transition-colors',
                lesson.slug ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed opacity-60',
              ]"
              @click="lesson.slug && handleLessonClick(lesson)"
            >
              <!-- Lesson Icon -->
              <svg
                class="w-5 h-5 text-primary ms-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 10.15l-4.83-2.83a1 1 0 00-1.5 1.159l4.828 2.829m-5.131 4.829L9.92 14.25a1 1 0 011.159 1.5l-4.83 2.83M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <div class="flex-1 min-w-0 px-3">
                <div class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors truncate">
                  {{ lesson.title }}
                </div>
                <div
                  v-if="lesson.duration"
                  class="text-xs text-gray-500 mt-0.5"
                >
                  {{ lesson.duration }}
                </div>
              </div>

              <!-- Action Icon (Optional visual cue) -->
              <svg
                class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
          <div
            v-else
            class="p-4 text-sm text-gray-500 italic text-center"
          >
            No Content
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionProps, AccordionEmits, CourseContentLesson } from '~/types/components/accordion'

const props = withDefaults(defineProps<AccordionProps>(), {
  exclusive: false,
  modelValue: () => [],
  courseSlug: undefined,
})

const emit = defineEmits<AccordionEmits>()

const openItemIds = ref<Set<number>>(new Set())
const headerRefs = ref<HTMLElement[]>([])
onBeforeUnmount(() => {
  headerRefs.value = []
})

watch(
  () => props.modelValue,
  (newVal) => {
    openItemIds.value.clear()
    if (typeof newVal === 'number' && newVal >= 0) {
      openItemIds.value.add(newVal)
    }
    else if (Array.isArray(newVal)) {
      newVal.forEach(id => openItemIds.value.add(id))
    }
  },
  { immediate: true },
)

const isOpen = (index: number) => openItemIds.value.has(index)

const toggleAccordion = (index: number) => {
  if (props.exclusive) {
    const isCurrentlyOpen = openItemIds.value.has(index)
    openItemIds.value.clear()
    if (!isCurrentlyOpen) {
      openItemIds.value.add(index)
    }
  }
  else {
    if (openItemIds.value.has(index)) {
      openItemIds.value.delete(index)
    }
    else {
      openItemIds.value.add(index)
    }
  }

  if (props.exclusive) {
    let val: number
    if (openItemIds.value.size > 0) {
      const firstValue = [...openItemIds.value][0]
      val = firstValue !== undefined ? firstValue : -1
    }
    else {
      val = -1
    }

    emit('update:modelValue', val)
  }
  else {
    emit('update:modelValue', Array.from(openItemIds.value))
  }
}

const handleLessonClick = (lesson: CourseContentLesson) => {
  emit('lesson-click', lesson)
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const { key } = event
  const total = props.items.length

  switch (key) {
    case 'ArrowDown':
      event.preventDefault()
      focusHeader((index + 1) % total)
      break
    case 'ArrowUp':
      event.preventDefault()
      focusHeader((index - 1 + total) % total)
      break
    case 'Home':
      event.preventDefault()
      focusHeader(0)
      break
    case 'End':
      event.preventDefault()
      focusHeader(total - 1)
      break
  }
}
const focusHeader = (index: number) => {
  const el = headerRefs.value[index]
  if (el) el.focus()
}
</script>
