<template>
  <div
    class="w-full space-y-2 accordion"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      class="border border-gray-200 rounded-lg overflow-hidden bg-white"
    >
      <!-- Header with slot -->
      <button
        :id="`accordion-header-${index}`"
        :ref="(el) => setHeaderRef(el, index)"
        :aria-expanded="isOpen(index)"
        :aria-controls="`accordion-content-${index}`"
        :disabled="item.disabled"
        :class="['flex items-center justify-between w-full p-4 text-start bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset disabled:opacity-50 disabled:cursor-not-allowed', props.headerClass]"
        @click="toggleAccordion(index)"
        @keydown="handleKeyDown($event, index)"
      >
        <slot
          name="header"
          :item="item"
          :index="index"
          :is-open="isOpen(index)"
        >
          <span class="flex flex-col flex-1 mr-4 text-start pointer-events-none">
            <span class="text-lg font-medium text-gray-900 leading-6">
              {{ item.title }}
            </span>

            <span
              v-if="item.description"
              class="mt-1 text-sm font-normal text-gray-600 leading-5"
            >
              {{ item.description }}
            </span>
          </span>
        </slot>

        <!-- Chevron slot -->
        <slot
          name="icon"
          :is-open="isOpen(index)"
        >
          <svg
            :class="['w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 fill-none', isOpen(index) ? 'rotate-180' : '']"
            aria-hidden="true"
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
        </slot>
      </button>

      <!-- Content with slot -->
      <Transition
        :enter-active-class="`transition-all duration-${props.transitionDuration} ease-out overflow-hidden`"
        :leave-active-class="`transition-all duration-${props.transitionDuration} ease-in overflow-hidden`"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[--content-height]"
        leave-from-class="opacity-100 max-h-[--content-height]"
        leave-to-class="opacity-0 max-h-0"
        @before-enter="(el) => onBeforeEnter(el, index)"
        @enter="(el) => onEnter(el, index)"
        @leave="(el) => onLeave(el)"
      >
        <div
          v-show="isOpen(index)"
          :id="`accordion-content-${index}`"
          role="region"
          :aria-labelledby="`accordion-header-${index}`"
          :class="['border-t border-gray-200 overflow-hidden', props.contentClass]"
          :style="{ '--content-height': contentHeights[index] + 'px' }"
        >
          <slot
            :item="item"
            :index="index"
            :is-open="isOpen(index)"
          >
            <slot
              name="empty"
              :item="item"
              :index="index"
            >
              {{ props.emptyText }}
            </slot>
          </slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccordion } from '~/composables/useAccordion'
import { useKeyboardFocus } from '~/composables/useKeyboardFocus'
import type { AccordionProps, AccordionEmits } from '~/types/components/accordion'
import { computed } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const props = withDefaults(defineProps<AccordionProps>(), {
  exclusive: false,
  modelValue: () => [],
  emptyText: 'No Content',
  transitionDuration: 300,
  headerClass: '',
  contentClass: '',
})

const emit = defineEmits<AccordionEmits>()

const { openItemIds, toggle: toggleAccordion, isOpen } = useAccordion(props, emit)

// Store content heights for smooth transitions
const contentHeights = ref<number[]>([])

onBeforeUpdate(() => {
  headerRefs.value.clear()
})

// Use a Map for better performance when accessing refs by index
const headerRefs = ref<Map<number, HTMLElement>>(new Map())

const setHeaderRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el instanceof HTMLElement) {
    headerRefs.value.set(index, el)
  }
  else {
    headerRefs.value.delete(index)
  }
}

watch(
  () => props.items.length,
  (len) => {
    contentHeights.value = Array(len).fill(0)
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (newVal) => {
    openItemIds.value.clear()
    if (newVal == null) {
      return
    }
    if (typeof newVal === 'number' && newVal >= 0) {
      openItemIds.value.add(newVal)
    }
    else if (Array.isArray(newVal)) {
      newVal.forEach(id => openItemIds.value.add(id))
    }
  },
  { immediate: true },
)

const onBeforeEnter = (el: Element, index: number) => {
  const element = el as HTMLElement
  element.style.maxHeight = '0px'
  void element.offsetHeight
  contentHeights.value[index] = element.scrollHeight
}

const onEnter = (el: Element, index: number) => {
  const element = el as HTMLElement
  element.style.maxHeight = contentHeights.value[index] + 'px'
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.maxHeight = element.scrollHeight + 'px'
  void element.offsetHeight
  element.style.maxHeight = '0px'
}

// Use the keyboard focus composable
const { handleKeyDown: handleKeyboardNavigation } = useKeyboardFocus({
  items: computed(() => props.items),
  isDisabled: item => !!item.disabled,
})

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  handleKeyboardNavigation(
    event,
    index,
    props.items.length,
    (newIndex) => {
      if (newIndex >= 0) {
        const element = headerRefs.value.get(newIndex)
        if (element) {
          element.focus()
        }
      }
    },
  )
}
</script>
