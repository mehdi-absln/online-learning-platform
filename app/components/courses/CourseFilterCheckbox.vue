<template>
  <label
    :for="id"
    class="flex items-center cursor-pointer group"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <div class="relative mr-3">
      <input
        :id="id"
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        :name="id"
        :aria-checked="isChecked"
        :aria-describedby="`${id}-description`"
        class="sr-only peer"
        @change="handleChange"
      >
      <span
        aria-hidden="true"
        class="w-4 h-4 flex items-center justify-center rounded border transition-colors"
        :class="checkboxClasses"
      >
        <svg
          v-show="isChecked"
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
      :class="isChecked ? 'text-primary' : 'text-gray-300'"
    >
      {{ label }}
      <span :id="`${id}-description`" class="sr-only">
        {{ isChecked ? 'Selected' : 'Not selected' }}
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BaseProps {
  id: string
  label: string
  disabled?: boolean
}

type Props = BaseProps & (
  | { modelValue: boolean, value?: never }
  | { modelValue: string[], value: string }
  )

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string[]]
}>()

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.value ? props.modelValue.includes(props.value) : false
  }
  return props.modelValue
})

const checkboxClasses = computed(() => ({
  'border-primary bg-primary': isChecked.value,
  'border-dark-divider bg-dark-surface group-hover:border-gray-500': !isChecked.value,
}))

const handleChange = (event: Event) => {
  if (props.disabled) return

  const target = event.target as HTMLInputElement

  if (Array.isArray(props.modelValue) && props.value) {
    const newValue = target.checked
      ? [...props.modelValue, props.value]
      : props.modelValue.filter(v => v !== props.value)
    emit('update:modelValue', newValue)
  }
  else {
    emit('update:modelValue', target.checked)
  }
}
</script>
