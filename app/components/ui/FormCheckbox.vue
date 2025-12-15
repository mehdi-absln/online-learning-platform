<template>
  <div class="flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="id"
        :checked="modelValue"
        :name="name"
        :required="required"
        :disabled="disabled"
        type="checkbox"
        class="h-4 w-4 appearance-none border border-gray-300 rounded
               focus:ring-primary checked:bg-primary checked:border-primary"
        :class="{ 'border-red-500': error }"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        @blur="$emit('blur')"
      >
    </div>

    <label
      :for="id"
      :class="labelClass"
    >
      <slot />
    </label>
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="text-red-500 text-sm mt-1 col-span-2"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue: boolean
  name?: string
  required?: boolean
  disabled?: boolean
  error?: string
  labelClass?: string
}

withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  labelClass: 'ml-2 block text-sm text-gray-200',
})

defineEmits<{
  'update:modelValue': [value: boolean]
  'blur': []
}>()
</script>
