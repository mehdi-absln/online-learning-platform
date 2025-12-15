<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="sr-only"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
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
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    >
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="text-red-500 text-sm mt-1"
    >
      {{ error }}
    </p>
    <p
      v-if="hint"
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

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()
</script>
