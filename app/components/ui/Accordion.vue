<template>
  <div class="w-full space-y-2 accordion">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      class="overflow-hidden "
    >
      <!-- Header -->
      <button
        :id="`accordion-header-${index}`"
        :ref="(el) => setHeaderRef(el, index)"
        :aria-expanded="isOpen(index)"
        :aria-controls="`accordion-content-${index}`"
        :disabled="item.disabled"
        :class="[
          'flex items-center justify-between w-full p-4 text-start group hover:bg-primary/95',
          'bg-dark-bg transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset border border-dark-divider rounded-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          props.headerClass,
        ]"
        @click="toggleAccordion(index)"
        @keydown="handleKeyDown($event, index)"
      >
        <slot
          name="header"
          :item="item"
          :index="index"
          :is-open="isOpen(index)"
        >
          <div class="flex flex-col pointer-events-none">
            <h4
              class="text-lg font-semibold text-white leading-6"
              :aria-describedby="item.description ? `accordion-description-${index}` : undefined"
            >
              {{ item.title }}
            </h4>
            <span
              v-if="item.description"
              :id="`accordion-description-${index}`"
              class="mt-1 text-sm font-normal text-white/70 group-hover:text-white/90 transition-colors duration-200"
            >
              {{ item.description }}
            </span>
          </div>
          <svg
            v-if="showIcon"
            class="stroke-white/70 group-hover:stroke-white/90"
            :class="[
              iconClass || 'w-5 h-5 text-gray-500',
              'transition-transform duration-300 shrink-0',
              isOpen(index) ? (iconRotateClass || 'rotate-180') : '',
            ]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

      <Transition
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
      >
        <div
          v-show="isOpen(index)"
          :id="`accordion-content-${index}`"
          role="region"
          :aria-labelledby="`accordion-header-${index}`"
          :class="[
            'overflow-hidden',
            props.contentClass,
          ]"
        >
          <!-- Content -->
          <div
            role="group"
            :aria-labelledby="`accordion-header-${index}`"
          >
            <slot
              :item="item"
              :index="index"
              :is-open="isOpen(index)"
            >
              <!-- Empty State -->
              <slot
                name="empty"
                :item="item"
                :index="index"
              >
                {{ props.emptyText }}
              </slot>
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionProps, AccordionEmits } from '~/types/components/accordion'

const props = withDefaults(defineProps<AccordionProps>(), {
  exclusive: false,
  modelValue: () => [],
  emptyText: 'No Content',
  transitionDuration: 300,
  headerClass: '',
  contentClass: '',
  showIcon: true,
  iconClass: 'w-5 h-5 text-gray-500',
  iconRotateClass: 'rotate-180',
})

const emit = defineEmits<AccordionEmits>()

const { openItemIds, toggle: toggleAccordion, isOpen } = useAccordion(props, emit)

const onBeforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
  element.style.opacity = '0'
  element.style.overflow = 'hidden'
}

const onEnter = (el: Element, done: () => void) => {
  const element = el as HTMLElement

  requestAnimationFrame(() => {
    const height = element.scrollHeight

    element.style.transition = `height ${props.transitionDuration}ms ease-out, opacity ${props.transitionDuration}ms ease-out`

    element.style.height = `${height}px`
    element.style.opacity = '1'

    setTimeout(done, props.transitionDuration)
  })
}

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
  element.style.overflow = ''
  element.style.transition = ''
}

const onBeforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
  element.style.overflow = 'hidden'
}

const onLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement

  void element.offsetHeight

  element.style.transition = `height ${props.transitionDuration}ms ease-in, opacity ${props.transitionDuration}ms ease-in`

  element.style.height = '0'
  element.style.opacity = '0'

  setTimeout(done, props.transitionDuration)
}

const onAfterLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.opacity = ''
  element.style.overflow = ''
  element.style.transition = ''
}

const headerRefs = ref<Map<number, HTMLElement>>(new Map())

onBeforeUpdate(() => {
  headerRefs.value.clear()
})

const setHeaderRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el instanceof HTMLElement) {
    headerRefs.value.set(index, el)
  }
  else {
    headerRefs.value.delete(index)
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    openItemIds.value.clear()
    if (newVal == null) return

    if (typeof newVal === 'number' && newVal >= 0) {
      openItemIds.value.add(newVal)
    }
    else if (Array.isArray(newVal)) {
      newVal.forEach(id => openItemIds.value.add(id))
    }
  },
  { immediate: true },
)

const { handleKeyDown: handleKeyboardNavigation } = useKeyboardFocus({
  items: computed(() => props.items),
  isDisabled: (item: typeof props.items[number]) => !!item.disabled,
})

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  handleKeyboardNavigation(
    event,
    index,
    props.items.length,
    (newIndex: number) => {
      if (newIndex >= 0) {
        const element = headerRefs.value.get(newIndex)
        element?.focus()
      }
    },
  )
}
</script>
