import { ref } from 'vue'
import type { AccordionProps } from '~/types/components/accordion'

export function useAccordion(
  props: AccordionProps,
  emit: (e: 'update:modelValue', value: number | number[] | null) => void,
) {
  const openItemIds = ref<Set<number>>(new Set())

  const toggle = (index: number) => {
    if (props.exclusive) {
      const wasOpen = openItemIds.value.has(index)
      openItemIds.value.clear()
      if (!wasOpen) openItemIds.value.add(index)
    }
    else {
      if (openItemIds.value.has(index)) {
        openItemIds.value.delete(index)
      }
      else {
        openItemIds.value.add(index)
      }
    }

    emitUpdate()
  }

  const emitUpdate = () => {
    const newValue = props.exclusive
      ? (openItemIds.value.values().next().value ?? null)
      : [...openItemIds.value]

    emit('update:modelValue', newValue)
  }

  return {
    openItemIds,
    toggle,
    isOpen: (i: number) => openItemIds.value.has(i),
    emitUpdate,
  }
}
