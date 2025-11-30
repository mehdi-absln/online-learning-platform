<template>
  <div class="relative">
    <input
      :id="id"
      type="checkbox"
      :value="value"
      v-model="selectedValues"
      class="w-4 h-4 text-primary bg-[#1F1F1E] border-[#474746] rounded cursor-pointer opacity-0 absolute z-10"
    />
    <label
      :for="id"
      class="flex items-center cursor-pointer"
      :class="isSelected ? 'text-primary' : 'text-gray-300'"
    >
      <span
        class="w-4 h-4 flex items-center justify-center rounded border mr-3"
        :class="isSelected ? 'border-primary bg-primary' : 'border-[#474746] bg-[#1F1F1E]'"
      >
        <svg
          v-show="isSelected"
          class="w-3 h-3 text-[#1F1F1E] fill-none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </span>
    </label>
  </div>
  <label :for="id" class="ml-1 text-sm text-gray-300 cursor-pointer flex-1 py-1">
    {{ label }}
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  value: string
  modelValue: string[]
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const isSelected = computed(() => props.modelValue.includes(props.value))

const selectedValues = computed({
  get() {
    return props.modelValue
  },
  set(value: string[]) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>
input[type='checkbox']:checked:hover {
  filter: brightness(100%);
  border-color: #e05243; /* Primary color */
  background-color: #e05243; /* Primary color */
}
</style>
