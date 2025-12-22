<template>
  <div class="flex flex-col items-center justify-center">
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"
    />
    <p class="text-white">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface LoadingSpinnerProps {
  message?: string
}

withDefaults(defineProps<LoadingSpinnerProps>(), {
  message: 'Loading...',
})
</script>
