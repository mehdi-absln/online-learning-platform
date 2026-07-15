// tests/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { signInSchema, signUpSchema } from '~/schemas/auth'
import { AUTH_ERRORS } from '~/constants'
import FormInput from '~/components/ui/FormInput.vue'
import FormCheckbox from '~/components/ui/FormCheckbox.vue'
import SubmitButton from '~/components/ui/SubmitButton.vue'

const { mockNavigateTo, mockFetch, mockRoute, mockToast } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn(() => Promise.resolve()),
  mockFetch: vi.fn(),
  mockRoute: {
    query: {},
  },
  mockToast: {
    success: vi.fn(),
    error: vi.fn(),
    showLoginRequired: vi.fn(),
    show: vi.fn(),
  },
}))

vi.stubGlobal('$fetch', mockFetch)

describe('Authentication System', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mockFetch.mockReset()
    mockFetch.mockImplementation(async (url: string) => {
      if (url === '/api/auth/me') {
        return { success: false }
      }
      return { success: false }
    })
    mockNavigateTo.mockReset()
    mockNavigateTo.mockImplementation(() => Promise.resolve())
    mockRoute.query = {}
    mockToast.success.mockReset()
    mockToast.error.mockReset()
    mockToast.showLoginRequired.mockReset()
    mockToast.show.mockReset()

    vi.doMock('#imports', async () => {
      const actual = await vi.importActual<Record<string, unknown>>('#imports')
      return {
        ...actual,
        definePageMeta: vi.fn(),
        navigateTo: mockNavigateTo,
        useHead: vi.fn(),
        useRoute: () => mockRoute,
      }
    })

    vi.doMock('#app/composables/router', async importOriginal => ({
      ...(await importOriginal()),
      navigateTo: mockNavigateTo,
      useRoute: () => mockRoute,
      useRouter: () => ({
        push: mockNavigateTo,
        afterEach: vi.fn(),
        beforeEach: vi.fn(),
      }),
    }))

    vi.doMock('~/composables/useToast', () => ({
      useToast: () => mockToast,
    }))

    vi.doMock('~/stores/cart', () => ({
      useCartStore: () => ({
        mergeGuestCart: vi.fn().mockResolvedValue(undefined),
      }),
    }))
  })

  describe('Form Validation Schemas', () => {
    describe('Sign In Schema', () => {
      it('should validate valid username and password', () => {
        const result = signInSchema.safeParse({
          username: 'testuser',
          password: 'Password123',
          rememberMe: false,
        })
        expect(result.success).toBe(true)
      })

      it('should validate valid email and password', () => {
        const result = signInSchema.safeParse({
          username: 'test@example.com',
          password: 'Password123',
          rememberMe: false,
        })
        expect(result.success).toBe(true)
      })

      it('should not validate with empty username', () => {
        const result = signInSchema.safeParse({
          username: '',
          password: 'Password123',
          rememberMe: false,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(AUTH_ERRORS.USERNAME_REQUIRED)
        }
      })

      it('should not validate with short password', () => {
        const result = signInSchema.safeParse({
          username: 'testuser',
          password: 'pass',
          rememberMe: false,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(AUTH_ERRORS.PASSWORD_TOO_SHORT)
        }
      })

      it('should not validate with invalid username format', () => {
        const result = signInSchema.safeParse({
          username: 'inv@lid user',
          password: 'Password123',
          rememberMe: false,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Please enter a valid username or email')
        }
      })
    })

    describe('Sign Up Schema', () => {
      it('should validate valid sign up data', () => {
        const result = signUpSchema.safeParse({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          termsAccepted: true,
        })
        expect(result.success).toBe(true)
      })

      it('should not validate with mismatched passwords', () => {
        const result = signUpSchema.safeParse({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'Password123',
          confirmPassword: 'Different123',
          termsAccepted: true,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['confirmPassword'])
          expect(result.error.issues[0].message).toBe('Passwords do not match')
        }
      })

      it('should not validate with terms not accepted', () => {
        const result = signUpSchema.safeParse({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          termsAccepted: false,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('You must accept the terms and conditions')
        }
      })

      it('should not validate with weak password', () => {
        const result = signUpSchema.safeParse({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'weakpass',
          confirmPassword: 'weakpass',
          termsAccepted: true,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Password must contain at least one uppercase letter, one lowercase letter, and one number')
        }
      })

      it('should not validate with invalid email', () => {
        const result = signUpSchema.safeParse({
          username: 'newuser',
          email: 'invalid-email',
          password: 'Password123',
          confirmPassword: 'Password123',
          termsAccepted: true,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Please enter a valid email address')
        }
      })
    })
  })

  describe('Sign In Page', () => {
    const createWrapper = async () => {
      const { default: SignInPage } = await import('~/pages/auth/SignIn.vue')
      return mount(SignInPage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              stubActions: false,
            }),
          ],
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>',
            },
          },
        },
      })
    }

    it('renders correctly', async () => {
      const wrapper = await createWrapper()

      expect(wrapper.find('h1').text()).toBe('Sign In')
      expect(wrapper.findAll('input')).toHaveLength(3)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('initializes form data correctly', async () => {
      const wrapper = await createWrapper()

      await nextTick()

      const vm = wrapper.vm as any
      expect(vm.form.username).toBe('')
      expect(vm.form.password).toBe('')
      expect(vm.form.rememberMe).toBe(false)
      expect(vm.isFormValid).toBe(false)
    })

    it('validates form correctly', async () => {
      const wrapper = await createWrapper()

      const usernameInput = wrapper.find('input[name="username"]')
      await usernameInput.setValue('testuser')

      const passwordInput = wrapper.find('input[name="password"]')
      await passwordInput.setValue('Password123')

      await flushPromises()

      const vm = wrapper.vm as any
      expect(vm.isFormValid).toBe(true)
    })

    it('shows errors on invalid input', async () => {
      const wrapper = await createWrapper()

      const usernameInput = wrapper.find('input[name="username"]')
      await usernameInput.setValue('')

      const passwordInput = wrapper.find('input[name="password"]')
      await passwordInput.setValue('123')

      await usernameInput.trigger('blur')
      await passwordInput.trigger('blur')

      await flushPromises()

      const errorElements = wrapper.findAll('.text-red-500')
      expect(errorElements.length).toBeGreaterThanOrEqual(1)
    })

    it('submits form when validation passes', async () => {
      mockFetch.mockResolvedValueOnce({
        success: true,
        data: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
        },
      })

      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('Password123')

      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signin', {
        method: 'POST',
        body: {
          username: 'testuser',
          password: 'Password123',
          rememberMe: false,
        },
      })
    })

    it('handles sign in success', async () => {
      mockFetch.mockResolvedValueOnce({
        success: true,
        data: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
        },
      })

      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('Password123')

      await flushPromises()

      const vm = wrapper.vm as any
      await vm.handleSubmit()
      await flushPromises()

      expect(mockNavigateTo).toHaveBeenCalledWith('/home')
    })

    it('handles sign in failure', async () => {
      mockFetch.mockResolvedValueOnce({
        success: false,
        message: AUTH_ERRORS.INVALID_CREDENTIALS,
      })

      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('Password123')

      await flushPromises()

      const vm = wrapper.vm as any
      await vm.handleSubmit()
      await flushPromises()

      expect(wrapper.find('.text-red-500').exists()).toBe(true)
      expect(wrapper.text()).toContain(AUTH_ERRORS.INVALID_CREDENTIALS)
    })
  })

  describe('Sign Up Page', () => {
    const createWrapper = async () => {
      const { default: SignUpPage } = await import('~/pages/auth/SignUp.vue')
      return mount(SignUpPage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              stubActions: false,
            }),
          ],
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>',
            },
          },
        },
      })
    }

    it('renders correctly', async () => {
      const wrapper = await createWrapper()

      expect(wrapper.find('h1').text()).toBe('Sign Up')
      expect(wrapper.findAll('input')).toHaveLength(5)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('initializes form data correctly', async () => {
      const wrapper = await createWrapper()

      await nextTick()

      const vm = wrapper.vm as any
      expect(vm.form.username).toBe('')
      expect(vm.form.email).toBe('')
      expect(vm.form.password).toBe('')
      expect(vm.form.confirmPassword).toBe('')
      expect(vm.form.termsAccepted).toBe(false)
      expect(vm.isFormValid).toBe(false)
    })

    it('validates form correctly', async () => {
      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('newuser')
      await wrapper.find('input[name="email"]').setValue('newuser@example.com')
      await wrapper.find('input[name="password"]').setValue('Password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('Password123')
      await wrapper.find('input[type="checkbox"]').setValue(true)

      await flushPromises()

      const vm = wrapper.vm as any
      expect(vm.isFormValid).toBe(true)
    })

    it('shows errors on invalid input', async () => {
      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('ab')
      await wrapper.find('input[name="email"]').setValue('invalid-email')
      await wrapper.find('input[name="password"]').setValue('weak')
      await wrapper.find('input[name="confirmPassword"]').setValue('different')

      await wrapper.find('input[name="username"]').trigger('blur')
      await wrapper.find('input[name="email"]').trigger('blur')
      await wrapper.find('input[name="password"]').trigger('blur')
      await wrapper.find('input[name="confirmPassword"]').trigger('blur')

      await flushPromises()

      const errorElements = wrapper.findAll('.text-red-500')
      expect(errorElements.length).toBeGreaterThanOrEqual(1)
    })

    it('submits form when validation passes', async () => {
      mockFetch.mockResolvedValueOnce({
        success: true,
        data: {
          user: { id: 1, username: 'newuser', email: 'newuser@example.com' },
        },
      })

      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('newuser')
      await wrapper.find('input[name="email"]').setValue('newuser@example.com')
      await wrapper.find('input[name="password"]').setValue('Password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('Password123')
      await wrapper.find('input[type="checkbox"]').setValue(true)

      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        body: {
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          termsAccepted: true,
        },
      })
    })

    it('handles sign up success', async () => {
      mockFetch.mockResolvedValueOnce({
        success: true,
        data: {
          user: { id: 1, username: 'newuser', email: 'newuser@example.com' },
        },
      })

      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('newuser')
      await wrapper.find('input[name="email"]').setValue('newuser@example.com')
      await wrapper.find('input[name="password"]').setValue('Password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('Password123')
      await wrapper.find('input[type="checkbox"]').setValue(true)

      await flushPromises()

      const vm = wrapper.vm as any
      await vm.handleSubmit()
      await flushPromises()

      expect(mockNavigateTo).toHaveBeenCalledWith('/home')
    })

    it('handles sign up failure', async () => {
      mockFetch.mockResolvedValueOnce({
        success: false,
        message: AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS,
      })

      const wrapper = await createWrapper()

      await wrapper.find('input[name="username"]').setValue('newuser')
      await wrapper.find('input[name="email"]').setValue('newuser@example.com')
      await wrapper.find('input[name="password"]').setValue('Password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('Password123')
      await wrapper.find('input[type="checkbox"]').setValue(true)

      await flushPromises()

      const vm = wrapper.vm as any
      await vm.handleSubmit()
      await flushPromises()

      expect(wrapper.find('.text-red-500').exists()).toBe(true)
      expect(wrapper.text()).toContain(AUTH_ERRORS.EMAIL_ALREADY_EXISTS)
    })
  })

  describe('Form Components', () => {
    describe('FormInput', () => {
      it('renders correctly with props', () => {
        const wrapper = mount(FormInput, {
          props: {
            id: 'test-input',
            modelValue: 'test value',
            label: 'Test Label',
            type: 'text',
            name: 'testName',
            placeholder: 'Test Placeholder',
            error: 'Test Error',
          },
        })

        expect(wrapper.find('input').attributes('id')).toBe('test-input')
        expect(wrapper.find('input').attributes('type')).toBe('text')
        expect(wrapper.find('input').attributes('name')).toBe('testName')
        expect(wrapper.find('input').attributes('placeholder')).toBe('Test Placeholder')
        expect(wrapper.find('input').element).toBeInstanceOf(HTMLInputElement)
        expect(wrapper.text()).toContain('Test Error')
      })

      it('emits update:modelValue on input', async () => {
        const wrapper = mount(FormInput, {
          props: {
            id: 'test-input',
            modelValue: '',
            label: 'Test Label',
          },
        })

        const input = wrapper.find('input')
        await input.setValue('new value')

        expect(wrapper.emitted('update:modelValue')).toEqual([['new value']])
      })

      it('applies error class when error prop is provided', () => {
        const wrapper = mount(FormInput, {
          props: {
            id: 'test-input',
            modelValue: '',
            label: 'Test Label',
            error: 'Test Error',
          },
        })

        expect(wrapper.find('input').classes()).toContain('border-red-500')
      })
    })

    describe('FormCheckbox', () => {
      it('renders correctly with props', () => {
        const wrapper = mount(FormCheckbox, {
          props: {
            id: 'test-checkbox',
            modelValue: false,
            name: 'testName',
            error: 'Test Error',
          },
          slots: {
            default: 'Test Label',
          },
        })

        expect(wrapper.find('input[type="checkbox"]').attributes('id')).toBe('test-checkbox')
        expect(wrapper.find('input[type="checkbox"]').attributes('name')).toBe('testName')
        expect(wrapper.text()).toContain('Test Label')
        expect(wrapper.text()).toContain('Test Error')
      })

      it('emits update:modelValue on change', async () => {
        const wrapper = mount(FormCheckbox, {
          props: {
            id: 'test-checkbox',
            modelValue: false,
            name: 'testName',
          },
          slots: {
            default: 'Test Label',
          },
        })

        const checkbox = wrapper.find('input[type="checkbox"]')
        await checkbox.setValue(true)

        expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
      })

      it('applies error class when error prop is provided', () => {
        const wrapper = mount(FormCheckbox, {
          props: {
            id: 'test-checkbox',
            modelValue: false,
            name: 'testName',
            error: 'Test Error',
          },
          slots: {
            default: 'Test Label',
          },
        })

        expect(wrapper.find('input[type="checkbox"]').classes()).toContain('border-red-500')
      })
    })

    describe('SubmitButton', () => {
      it('renders correctly with props', () => {
        const wrapper = mount(SubmitButton, {
          props: {
            text: 'Submit',
            loadingText: 'Submitting...',
            loading: false,
            disabled: false,
          },
        })

        expect(wrapper.text()).toContain('Submit')
        expect(wrapper.find('button').attributes('type')).toBe('submit')
      })

      it('shows loading state', () => {
        const wrapper = mount(SubmitButton, {
          props: {
            text: 'Submit',
            loadingText: 'Submitting...',
            loading: true,
            disabled: false,
          },
        })

        expect(wrapper.text()).toContain('Submitting...')
        expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
      })

      it('is disabled when loading', () => {
        const wrapper = mount(SubmitButton, {
          props: {
            text: 'Submit',
            loadingText: 'Submitting...',
            loading: true,
            disabled: false,
          },
        })

        const button = wrapper.find('button')
        expect((button.element as HTMLButtonElement).disabled).toBe(true)
      })

      it('is disabled when disabled prop is true', () => {
        const wrapper = mount(SubmitButton, {
          props: {
            text: 'Submit',
            loadingText: 'Submitting...',
            loading: false,
            disabled: true,
          },
        })

        const button = wrapper.find('button')
        expect((button.element as HTMLButtonElement).disabled).toBe(true)
      })
    })
  })
})
