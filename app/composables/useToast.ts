import { reactive } from 'vue'

interface ToastOptions {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  actionLink?: string
  actionText?: string
  duration?: number
}

// Module-scoped singleton. Safe because the only consumer (UiToast) is
// rendered client-only, so there is no SSR hydration mismatch.
const toastState = reactive({
  isVisible: false,
  message: '',
  type: 'info' as ToastOptions['type'],
  actionLink: '',
  actionText: '',
  duration: 5000,
})

export const useToast = () => {
  const state = toastState

  const show = (options: ToastOptions) => {
    state.message = options.message
    state.type = options.type || 'info'
    state.actionLink = options.actionLink || ''
    state.actionText = options.actionText || ''
    state.duration = options.duration ?? 5000
    state.isVisible = true
  }

  const hide = () => {
    state.isVisible = false
  }

  const success = (message: string, duration?: number) => {
    show({ message, type: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    show({ message, type: 'error', duration })
  }

  const warning = (message: string, duration?: number) => {
    show({ message, type: 'warning', duration })
  }

  const info = (message: string, duration?: number) => {
    show({ message, type: 'info', duration })
  }

  const showLoginRequired = (action: string = 'continue') => {
    show({
      message: `Please sign in to ${action}`,
      type: 'warning',
      actionLink: '/auth/SignIn',
      actionText: 'Sign in →',
      duration: 5000,
    })
  }

  return {
    state,
    show,
    hide,
    success,
    error,
    warning,
    info,
    showLoginRequired,
  }
}
