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
import type { TabItem, TabsProps, TabsEmits } from '~/types/components/tabs-types'
import { useKeyboardFocus } from '~/composables/useKeyboardFocus'

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

// Use the keyboard focus composable
const { handleKeyDown: handleKeyboardNavigation } = useKeyboardFocus({
  items: tabData,
  isDisabled: (tab: TabItem, index: number) => {
    // Determine if a tab is disabled (if there's a way to define this)
    // For now, we'll assume all tabs are enabled
    // You can modify this logic based on your requirements
    return false
  }
})

const handleKeydown = (event: KeyboardEvent, index: number) => {
  handleKeyboardNavigation(
    event,
    index,
    tabData.value.length,
    (newIndex) => {
      if (tabRefs.value[newIndex]) {
        tabRefs.value[newIndex].focus()
      }
    }
  )
}
</script>
