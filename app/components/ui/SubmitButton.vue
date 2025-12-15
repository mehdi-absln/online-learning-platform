<template>
  <button
    type="submit"
    class="bg-primary w-full flex justify-center py-3 px-4 border
           border-transparent text-sm font-medium rounded-md text-white
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
           disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span
      v-if="loading"
      class="flex items-center"
    >

      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {{ loadingText }}
    </span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  disabled?: boolean
  text: string
  loadingText: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
})
</script>
