<template>
  <NuxtImg
    v-bind="$attrs"
    :src="finalSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PLACEHOLDER_BLOG_COVER } from '~/constants'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  src?: string | null
  alt?: string
  fallbackSrc?: string
  width?: number
  height?: number
  sizes?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: null,
  alt: '',
  fallbackSrc: PLACEHOLDER_BLOG_COVER,
  width: 400,
  height: 225,
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
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

watch(() => props.src, () => {
  hasError.value = false
})
</script>
