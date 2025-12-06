import type { Ref } from 'vue'

export interface KeyboardFocusOptions<T> {
  items: Ref<T[]>
  isDisabled?: (item: T, index: number) => boolean
}

export interface KeyboardFocusReturn {
  getNextFocusableIndex: (currentIndex: number, direction: 1 | -1, total: number) => number
  getFirstFocusableIndex: (total: number) => number
  getLastFocusableIndex: (total: number) => number
  isFocusable: (idx: number) => boolean
  handleKeyDown: (
    event: KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    focusCallback: (index: number) => void
  ) => void
}

export function useKeyboardFocus<T>({ items, isDisabled }: KeyboardFocusOptions<T>): KeyboardFocusReturn {
  const isFocusable = (idx: number): boolean => {
    if (!isDisabled) return true
    const item = items.value[idx]
    return item !== undefined && !isDisabled(item, idx)
  }

  const getNextFocusableIndex = (currentIndex: number, direction: 1 | -1, total: number): number => {
    let targetIndex = currentIndex
    let attempts = 0

    do {
      targetIndex = (targetIndex + direction + total) % total
      attempts++
    } while (!isFocusable(targetIndex) && attempts < total)

    return isFocusable(targetIndex) ? targetIndex : currentIndex
  }

  const getFirstFocusableIndex = (total: number): number => {
    for (let i = 0; i < total; i++) {
      if (isFocusable(i)) return i
    }
    return -1
  }

  const getLastFocusableIndex = (total: number): number => {
    for (let i = total - 1; i >= 0; i--) {
      if (isFocusable(i)) return i
    }
    return -1
  }

  const handleKeyDown = (
    event: KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    focusCallback: (index: number) => void,
  ) => {
    const { key } = event

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight': // For horizontal navigation like tabs
        event.preventDefault()
        focusCallback(getNextFocusableIndex(currentIndex, 1, totalItems))
        break
      case 'ArrowUp':
      case 'ArrowLeft': // For horizontal navigation like tabs
        event.preventDefault()
        focusCallback(getNextFocusableIndex(currentIndex, -1, totalItems))
        break
      case 'Home':
        event.preventDefault()
        {
          const firstIndex = getFirstFocusableIndex(totalItems)
          if (firstIndex >= 0) focusCallback(firstIndex)
        }
        break
      case 'End':
        event.preventDefault()
        {
          const lastIndex = getLastFocusableIndex(totalItems)
          if (lastIndex >= 0) focusCallback(lastIndex)
        }
        break
    }
  }

  return {
    getNextFocusableIndex,
    getFirstFocusableIndex,
    getLastFocusableIndex,
    isFocusable,
    handleKeyDown,
  }
}
