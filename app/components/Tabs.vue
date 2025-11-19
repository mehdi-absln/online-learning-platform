<template>
  <div class="w-full">
    <div role="tablist" class="flex border-b border-gray-700" :aria-label="ariaLabel">
      <button
        v-for="(tab, index) in tabData"
        :key="index"
        :ref="(el) => setTabRef(el, index)"
        :id="`tab-${tab.id}`"
        type="button"
        role="tab"
        :aria-selected="activeIndex === index"
        :aria-controls="`tabpanel-${tab.id}`"
        :tabindex="activeIndex === index ? 0 : -1"
        @click="changeTab(index)"
        @keydown="handleKeydown($event, index)"
        :class="[
          'px-4 py-2 font-medium text-base focus:outline-none transition-colors duration-200',
          activeIndex === index
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-400 hover:text-primary'
        ]"
      >
        {{ tab.title }}
      </button>
    </div>
    <div
      v-for="(tab, index) in tabData"
      :key="tab.id"
      :id="`tabpanel-${tab.id}`"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.id}`"
      :hidden="activeIndex !== index"
      :class="['pt-12', activeIndex === index ? 'block' : 'hidden']"
    >
      <slot :name="tab.slotName" v-if="activeIndex === index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabItem, TabsProps, TabsEmits } from '~/types/tabs-types'

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: 0,
  ariaLabel: 'Tabs',
  tabs: () => []
})

const emit = defineEmits<TabsEmits>()

const activeIndex = ref(props.modelValue)
const tabRefs = ref<HTMLElement[]>([])

// Convert provided tabs to internal format
const tabData = computed<TabItem[]>(() => {
  return props.tabs.map((tab, index) => ({
    id: `tab-${index}`,
    title: tab.title,
    slotName: tab.name
  }))
})

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== activeIndex.value && newValue < tabData.value.length) {
      activeIndex.value = newValue
    }
  }
)

const setTabRef = (el: any, index: number) => {
  if (el) tabRefs.value[index] = el
}

const changeTab = (index: number) => {
  if (index >= 0 && index < tabData.value.length) {
    activeIndex.value = index
    emit('update:modelValue', index)
    // Focus the activated tab for accessibility
    nextTick(() => {
      if (tabRefs.value[index]) {
        tabRefs.value[index].focus()
      }
    })
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      focusTab(index > 0 ? index - 1 : tabData.value.length - 1)
      break
    case 'ArrowRight':
      event.preventDefault()
      focusTab(index < tabData.value.length - 1 ? index + 1 : 0)
      break
    case 'Home':
      event.preventDefault()
      focusTab(0)
      break
    case 'End':
      event.preventDefault()
      focusTab(tabData.value.length - 1)
      break
    default:
      break
  }
}

const focusTab = (index: number) => {
  changeTab(index)
  if (tabRefs.value[index]) {
    tabRefs.value[index].focus()
  }
}
</script>
