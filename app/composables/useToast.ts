interface ToastOptions {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  actionLink?: string
  actionText?: string
  duration?: number
}

const toastState = reactive({
  isVisible: false,
  message: '',
  type: 'info' as ToastOptions['type'],
  actionLink: '',
  actionText: '',
  duration: 5000,
})

export const useToast = () => {
  const show = (options: ToastOptions) => {
    toastState.message = options.message
    toastState.type = options.type || 'info'
    toastState.actionLink = options.actionLink || ''
    toastState.actionText = options.actionText || ''
    toastState.duration = options.duration ?? 5000
    toastState.isVisible = true
  }

  const hide = () => {
    toastState.isVisible = false
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
    state: readonly(toastState),
    show,
    hide,
    showLoginRequired,
  }
}
