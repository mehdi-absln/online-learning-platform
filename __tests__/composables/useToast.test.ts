import { describe, it, expect, beforeEach } from 'vitest'
import { useToast } from '~/composables/useToast'

describe('useToast', () => {
  beforeEach(() => {
    const toast = useToast()
    toast.hide()
  })

  // ═══════════════════════════════════════
  // show
  // ═══════════════════════════════════════
  describe('show', () => {
    it('should show toast with message', () => {
      const toast = useToast()

      toast.show({ message: 'Test message' })

      expect(toast.state.isVisible).toBe(true)
      expect(toast.state.message).toBe('Test message')
    })

    it('should set type correctly', () => {
      const toast = useToast()

      toast.show({ message: 'Error!', type: 'error' })

      expect(toast.state.type).toBe('error')
    })

    it('should set default type to info', () => {
      const toast = useToast()

      toast.show({ message: 'Info' })

      expect(toast.state.type).toBe('info')
    })

    it('should set action link and text', () => {
      const toast = useToast()

      toast.show({
        message: 'Login required',
        actionLink: '/login',
        actionText: 'Sign in',
      })

      expect(toast.state.actionLink).toBe('/login')
      expect(toast.state.actionText).toBe('Sign in')
    })

    it('should set custom duration', () => {
      const toast = useToast()

      toast.show({ message: 'Quick', duration: 1000 })

      expect(toast.state.duration).toBe(1000)
    })

    it('should use default duration of 5000ms', () => {
      const toast = useToast()

      toast.show({ message: 'Default' })

      expect(toast.state.duration).toBe(5000)
    })
  })

  // ═══════════════════════════════════════
  // hide
  // ═══════════════════════════════════════
  describe('hide', () => {
    it('should hide toast', () => {
      const toast = useToast()

      toast.show({ message: 'Test' })
      toast.hide()

      expect(toast.state.isVisible).toBe(false)
    })
  })

  // ═══════════════════════════════════════
  // showLoginRequired
  // ═══════════════════════════════════════
  describe('showLoginRequired', () => {
    it('should show login required toast with custom action', () => {
      const toast = useToast()

      toast.showLoginRequired('bookmark lessons')

      expect(toast.state.isVisible).toBe(true)
      expect(toast.state.message).toBe('Please sign in to bookmark lessons')
      expect(toast.state.type).toBe('warning')
      expect(toast.state.actionLink).toBe('/auth/SignIn')
    })

    it('should use default action text', () => {
      const toast = useToast()

      toast.showLoginRequired()

      expect(toast.state.message).toBe('Please sign in to continue')
    })
  })

  // ═══════════════════════════════════════
  // Singleton behavior
  // ═══════════════════════════════════════
  describe('singleton', () => {
    it('should share state between instances', () => {
      const toast1 = useToast()
      const toast2 = useToast()

      toast1.show({ message: 'From toast1' })

      expect(toast2.state.message).toBe('From toast1')
      expect(toast2.state.isVisible).toBe(true)
    })
  })
})
