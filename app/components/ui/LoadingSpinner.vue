<template>
  <div
    class="flex flex-col items-center justify-center"
    role="status"
    aria-live="polite"
    :aria-label="props.label || 'Loading'"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"
      aria-hidden="true"
    />
    <p class="text-white">
      {{ props.message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface LoadingSpinnerProps {
  message?: string
  label?: string
}

const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  message: 'Loading...',
  label: undefined,
})
</script>
