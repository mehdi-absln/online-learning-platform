<template>
  <NuxtImg
    v-bind="$attrs"
    :src="finalSrc"
    :alt="alt"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PLACEHOLDER_COURSE_IMAGE } from '~/constants'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  src?: string | null
  alt?: string
  fallbackSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: null,
  alt: '',
  fallbackSrc: PLACEHOLDER_COURSE_IMAGE,
})

const hasError = ref(false)

const finalSrc = computed(() => {
  if (hasError.value || !props.src) {
    return props.fallbackSrc
  }
  return props.src
})

const handleError = () => {
  hasError.value = true
}

// Reset error state when src changes
watch(() => props.src, () => {
  hasError.value = false
})
</script>
