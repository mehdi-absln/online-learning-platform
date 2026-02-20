<template>
  <div class="relative">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-200 mb-1"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      :type="showPassword ? 'text' : type"
      :name="name"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600
             focus:border-primary focus:ring-primary appearance-none rounded-lg
             relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500
             focus:border-primary-500 focus:z-10 sm:text-sm"
      :class="{ 'border-red-500': error }"
      :aria-invalid="!!error"
      :aria-describedby="getAriaDescribedBy()"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    >
    <!-- Password visibility toggle -->
    <button
      v-if="type === 'password'"
      type="button"
      class="absolute right-3 top-[34px] text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
      @click="showPassword = !showPassword"
    >
      <svg
        v-if="!showPassword"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    </button>
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="text-red-500 text-sm mt-1"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="`${id}-hint`"
      class="text-gray-400 text-xs mt-1"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue: string
  label?: string
  type?: string
  name?: string
  autocomplete?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()

// Password visibility toggle state
const showPassword = ref(false)

/**
 * Get the aria-describedby value based on current state
 * Priority: error > hint > undefined
 */
function getAriaDescribedBy() {
  if (props.error) return `${props.id}-error`
  if (props.hint) return `${props.id}-hint`
  return undefined
}
</script>
