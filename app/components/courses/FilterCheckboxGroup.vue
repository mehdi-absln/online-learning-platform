<template>
  <div class="space-y-2">
    <label
      v-for="option in options"
      :key="option.value"
      :for="`${name}-${option.value}`"
      class="flex items-center cursor-pointer group"
    >
      <div class="relative mr-3">
        <input
          :id="`${name}-${option.value}`"
          type="checkbox"
          :name="name"
          :value="option.value"
          :checked="modelValue.includes(option.value)"
          class="sr-only peer"
          @change="handleChange(option.value, $event)"
        >
        <span
          class="w-4 h-4 rounded border transition-colors flex items-center justify-center"
          :class="modelValue.includes(option.value)
            ? 'border-primary bg-primary'
            : 'border-dark-divider bg-dark-surface group-hover:border-gray-500'"
        >
          <svg
            v-show="modelValue.includes(option.value)"
            class="w-3 h-3 text-dark-surface"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      </div>
      <span
        class="text-sm transition-colors"
        :class="modelValue.includes(option.value) ? 'text-primary' : 'text-gray-300'"
      >
        {{ option.label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string
}

const props = defineProps<{
  name: string
  options: Option[]
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const handleChange = (value: string, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  const newValue = checked
    ? [...props.modelValue, value]
    : props.modelValue.filter(v => v !== value)
  emit('update:modelValue', newValue)
}
</script>