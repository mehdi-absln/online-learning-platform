<template>
  <div
    class="relative"
    :class="wrapperClass"
  >
    <label
      :for="inputId"
      class="sr-only"
    >
      {{ label }}
    </label>

    <!-- Search Icon -->
    <svg
      class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>

    <!-- Input -->
    <input
      :id="inputId"
      ref="inputRef"
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-disabled="disabled"
      :aria-label="ariaLabel"
      :aria-describedby="loading ? `${inputId}-status` : undefined"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      class="w-full px-4 py-3 pl-11 pr-10
             bg-dark-surface border border-dark-divider rounded-lg
             text-white placeholder-gray-500
             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors"
      :class="inputClass"
      @input="handleInput"
      @keydown.escape="handleClear"
    >

    <!-- Loading Spinner -->
    <div
      v-if="loading"
      :id="`${inputId}-status`"
      class="absolute right-3 top-1/2 -translate-y-1/2"
      role="status"
      aria-live="polite"
    >
      <svg
        class="w-5 h-5 text-primary animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
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
      <span class="sr-only">Searching...</span>
    </div>

    <!-- Clear Button -->
    <button
      v-else-if="modelValue && !disabled"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2
             text-gray-500 hover:text-white
             transition-colors p-0.5 rounded
             focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Clear search"
      @click="handleClear"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  label?: string
  ariaLabel?: string
  debounce?: number
  loading?: boolean
  disabled?: boolean
  wrapperClass?: string
  inputClass?: string
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  label: 'Search',
  ariaLabel: undefined,
  debounce: 300,
  loading: false,
  disabled: false,
  wrapperClass: '',
  inputClass: '',
  autofocus: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
  'clear': []
}>()

// Generate unique ID for input
const inputId = useId()

const inputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Handle input with debounce
function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)

  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Set new timer
  debounceTimer = setTimeout(() => {
    emit('search', value)
  }, props.debounce)
}

// Handle clear
function handleClear() {
  emit('update:modelValue', '')
  emit('clear')

  // Clear pending debounce
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Focus input after clear
  inputRef.value?.focus()
}

// Focus method for parent access
function focus() {
  inputRef.value?.focus()
}

// Autofocus on mount
onMounted(() => {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
})

// Cleanup
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})

// Expose focus method
defineExpose({ focus })
</script>

<style scoped>
/* Hide browser's default search cancel button */
input[type="search"]::-webkit-search-cancel-button {
  display: none;
}

input[type="search"]::-moz-search-clear-button {
  display: none;
}
</style>
