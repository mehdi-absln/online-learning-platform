<template>
  <button
    type="submit"
    class="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
    :class="block ? 'w-full' : 'min-w-[140px]'"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <template v-if="loading">
      <IconSpinner class="w-4 h-4 mr-2" />
      {{ loadingText }}
    </template>
    <template v-else>
      {{ text }}
    </template>
  </button>
</template>

<script setup lang="ts">
import IconSpinner from '~/components/icons/IconSpinner.vue'

interface Props {
  loading?: boolean
  disabled?: boolean
  text: string
  loadingText: string
  block?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  block: true,
})
</script>
