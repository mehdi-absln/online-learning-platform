<template>
  <div class="w-full">
    <div
      role="tablist"
      class="flex border-b border-gray-700"
      :aria-label="ariaLabel"
    >
      <button
        v-for="(tab, index) in tabData"
        :id="`tab-${tab.id}`"
        :key="index"
        :ref="(el) => setTabRef(el, index)"
        type="button"
        role="tab"
        :aria-selected="activeIndex === index"
        :aria-controls="`tabpanel-${tab.id}`"
        :tabindex="activeIndex === index ? 0 : -1"
        :disabled="tab.disabled"
        :class="[
          'px-4 py-2 font-medium text-base focus:outline-none transition-colors duration-200',
          activeIndex === index
            ? 'text-primary border-b-2 border-primary'
            : tab.disabled
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-400 hover:text-primary',
        ]"
        @click="changeTab(index)"
        @keydown="handleKeydown($event, index)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div
      v-for="(tab, index) in tabData"
      :id="`tabpanel-${tab.id}`"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.id}`"
      :hidden="activeIndex !== index"
      :class="['pt-12', activeIndex === index ? 'block' : 'hidden']"
    >
      <slot
        v-if="activeIndex === index"
        :name="tab.slotName"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabItem, TabsProps, TabsEmits } from '~/types/components/tabs-types'
import { useKeyboardFocus } from '~/composables/useKeyboardFocus'

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: 0,
  ariaLabel: 'Tabs',
  tabs: () => [],
})

const emit = defineEmits<TabsEmits>()

const activeIndex = ref(props.modelValue)
const tabRefs = ref<(Element | ComponentPublicInstance | null)[]>([])

// Convert provided tabs to internal format
const tabData = computed<TabItem[]>(() => {
  return props.tabs.map((tab, index) => ({
    id: `tab-${index}`,
    title: tab.title,
    slotName: tab.name,
    disabled: tab.disabled || false,
  }))
})

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== activeIndex.value && newValue < tabData.value.length) {
      activeIndex.value = newValue
    }
  },
)

const setTabRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) tabRefs.value[index] = el as HTMLElement
}

const changeTab = (index: number) => {
  if (index >= 0 && index < tabData.value.length) {
    const tab = tabData.value[index]
    if (tab && !tab.disabled) {
      activeIndex.value = index
      emit('update:modelValue', index)
      // Focus the activated tab for accessibility
      nextTick(() => {
        const tabEl = tabRefs.value[index]
        if (tabEl && (tabEl as HTMLElement).focus) {
          (tabEl as HTMLElement).focus()
        }
      })
    }
  }
}

// Use the keyboard focus composable
const { handleKeyDown: handleKeyboardNavigation } = useKeyboardFocus({
  items: tabData,
  isDisabled: (tab: TabItem) => {
    return !!tab.disabled
  },
})

const handleKeydown = (event: KeyboardEvent, index: number) => {
  handleKeyboardNavigation(
    event,
    index,
    tabData.value.length,
    (newIndex) => {
      const tabEl = tabRefs.value[newIndex]
      if (tabEl && (tabEl as HTMLElement).focus) {
        (tabEl as HTMLElement).focus()
      }
    },
  )
}
</script>
