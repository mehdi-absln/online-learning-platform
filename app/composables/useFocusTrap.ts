import type { Ref } from 'vue'

export interface FocusTrapOptions {
  /** Reactive flag controlling whether the trap is active */
  isActive: Ref<boolean>
  /** Ref to the container element that holds the focusable children */
  target: Ref<HTMLElement | null>
  /** Called when the user presses Escape while the trap is active */
  onEscape?: () => void
  /** Called when the user presses Tab on the last element (default: cycle to first) */
  onTabOut?: () => void
  /**
   * Selector used to locate focusable elements inside the container.
   * Mirrors the selector already used in ConfirmModal.vue.
   */
  focusableSelector?: string
}

const DEFAULT_FOCUSABLE_SELECTOR
  = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Trap keyboard focus inside a container element while it is active.
 *
 * - On activation: remembers the previously focused element and moves focus to
 *   the first focusable child of the container.
 * - While active: Tab / Shift+Tab cycle only within the container.
 * - Escape triggers the optional `onEscape` callback.
 * - On deactivation: returns focus to the element that was focused before
 *   activation (e.g. the hamburger button).
 *
 * SSR-safe: all DOM access is guarded so the composable can be imported on
 * the server without throwing.
 */
export function useFocusTrap(options: FocusTrapOptions) {
  const {
    isActive,
    target,
    onEscape,
    onTabOut,
    focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
  } = options

  // Element that was focused right before the trap engaged — restored on exit.
  let previouslyFocused: HTMLElement | null = null

  const getFocusableElements = (): HTMLElement[] => {
    const root = target.value
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      el => el.offsetParent !== null || el === document.activeElement,
    )
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (!isActive.value) return

    if (event.key === 'Escape') {
      event.preventDefault()
      onEscape?.()
      return
    }

    if (event.key !== 'Tab') return

    const focusables = getFocusableElements()
    if (focusables.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (!first || !last) {
      event.preventDefault()
      return
    }
    const active = document.activeElement as HTMLElement | null

    if (event.shiftKey) {
      // Shift+Tab on the first element → wrap to the last (or leave)
      if (active === first || !rootContains(active)) {
        event.preventDefault()
        if (onTabOut) {
          onTabOut()
        }
        else {
          last.focus()
        }
      }
    }
    else {
      // Tab on the last element → wrap to the first (or leave)
      if (active === last || !rootContains(active)) {
        event.preventDefault()
        if (onTabOut) {
          onTabOut()
        }
        else {
          first.focus()
        }
      }
    }
  }

  const rootContains = (el: HTMLElement | null): boolean => {
    if (!el) return false
    return target.value?.contains(el) ?? false
  }

  const activate = () => {
    if (typeof document === 'undefined') return
    previouslyFocused = document.activeElement as HTMLElement | null

    document.addEventListener('keydown', onKeydown, true)

    // Move focus to the first focusable child on the next tick so the DOM
    // has had a chance to render (e.g. after a v-if transition).
    nextTick(() => {
      const first = getFocusableElements()[0]
      first?.focus()
    })
  }

  const deactivate = () => {
    if (typeof document === 'undefined') return
    document.removeEventListener('keydown', onKeydown, true)

    // Restore focus to whatever opened the trap (hamburger button, etc.)
    nextTick(() => {
      previouslyFocused?.focus?.()
      previouslyFocused = null
    })
  }

  watch(
    isActive,
    (active) => {
      if (active) {
        activate()
      }
      else {
        deactivate()
      }
    },
  )

  // Clean up listeners if the component unmounts while the trap is active.
  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', onKeydown, true)
    }
  })

  return {
    activate,
    deactivate,
  }
}
