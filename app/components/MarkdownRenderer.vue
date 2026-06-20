<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="sanitizedHtml" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

interface Props {
  content?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
})

const { $purify } = useNuxtApp()

const sanitizedHtml = computed(() => {
  if (!props.content) return ''
  const rawHtml = marked.parse(props.content)
  if (typeof rawHtml !== 'string') return ''
  return $purify(rawHtml)
})
</script>
