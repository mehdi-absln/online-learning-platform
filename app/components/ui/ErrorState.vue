<script setup lang="ts">
interface Props {
  message?: string
  retryLabel?: string
  hideRetry?: boolean
  variant?: 'default' | 'minimal' | 'full'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    role="alert"
    class="bg-dark-surface border border-red-500/30 rounded-2xl p-8 text-center"
  >
    <div class="w-16 h-16 mx-auto mb-4 text-red-400">
      <IconAlertCircle class="w-full h-full" />
    </div>
    <p class="text-red-400 mb-4">
      {{ message || 'Something went wrong. Please try again.' }}
    </p>
    <button
      v-if="!hideRetry"
      class="btn-primary"
      @click="emit('retry')"
    >
      {{ retryLabel || 'Retry' }}
    </button>
  </div>
</template>
