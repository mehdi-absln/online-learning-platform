// tests/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { signInSchema, signUpSchema } from '~/schemas/auth'
import FormInput from '~/components/ui/FormInput.vue'
import FormCheckbox from '~/components/ui/FormCheckbox.vue'
import SubmitButton from '~/components/ui/SubmitButton.vue'
import SignInPage from '~/pages/auth/SignIn.vue'
import SignUpPage from '~/pages/auth/SignUp.vue'

// ✅ استفاده از vi.hoisted برای رفع مشکل hoisting
const { mockNavigateTo, mockFetch } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn(() => Promise.resolve()),
  mockFetch: vi.fn(),
}))

// ✅ Mock کردن ماژول‌های Nuxt با استفاده از mock های hoisted شده
vi.mock('#app/composables/router', () => ({
  navigateTo: mockNavigateTo,
  useRouter: () => ({
    push: mockNavigateTo,
  }),
}))

vi.mock('#imports', () => ({
  navigateTo: mockNavigateTo,
  useRouter: () => ({
    push: mockNavigateTo,
  }),
  ref: (val: any) => ({ value: val }),
  reactive: (obj: any) => obj,
  computed: (fn: any) => ({ value: fn() }),
}))

// ✅ تنظیم global stubs
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('navigateTo', mockNavigateTo)

describe('Authentication System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
    mockNavigateTo.mockReset()
    mockNavigateTo.mockImplementation(() => Promise.resolve())
  })

  // ═══════════════════════════════════════════════════════════════
  // تست‌های Schema
  // ═══════════════════════════════════════════════════════════════
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
          expect(result.error.issues[0].message).toBe('Username or email is required')
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
          expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
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

  // ═══════════════════════════════════════════════════════════════
  // تست‌های Sign In Page
  // ═══════════════════════════════════════════════════════════════
  describe('Sign In Page', () => {
    const createWrapper = (options = {}) => {
      return mount(SignInPage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              stubActions: false,
              ...options,
            }),
          ],
          components: {
            FormInput,
            FormCheckbox,
            SubmitButton,
          },
          mocks: {
            $fetch: mockFetch,
            navigateTo: mockNavigateTo,
          },
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>',
            },
          },
          provide: {
            $fetch: mockFetch,
            navigateTo: mockNavigateTo,
          },
        },
      })
    }

    it('renders correctly', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('h3').text()).toBe('Sign In')
      expect(wrapper.findAllComponents(FormInput)).toHaveLength(2)
      expect(wrapper.findComponent(SubmitButton).exists()).toBe(true)
      expect(wrapper.findComponent(FormCheckbox).exists()).toBe(true)
    })

    it('initializes form data correctly', async () => {
      const wrapper = createWrapper()

      await nextTick()

      const vm = wrapper.vm as any
      expect(vm.form.username).toBe('')
      expect(vm.form.password).toBe('')
      expect(vm.form.rememberMe).toBe(false)
      expect(vm.isFormValid).toBe(false)
    })

    it('validates form correctly', async () => {
      const wrapper = createWrapper()

      const usernameInput = wrapper.find('input[name="username"]')
      await usernameInput.setValue('testuser')

      const passwordInput = wrapper.find('input[name="password"]')
      await passwordInput.setValue('Password123')

      await flushPromises()

      const vm = wrapper.vm as any
      expect(vm.isFormValid).toBe(true)
    })

    it('shows errors on invalid input', async () => {
      const wrapper = createWrapper()

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

      const wrapper = createWrapper()

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

      const wrapper = createWrapper()

      await wrapper.find('input[name="username"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('Password123')

      await flushPromises()

      // ✅ دسترسی مستقیم به متد submit کامپوننت
      const vm = wrapper.vm as any
      await vm.handleSubmit()

      await flushPromises()

      expect(mockNavigateTo).toHaveBeenCalledWith('/home')
    })

    it('handles sign in failure', async () => {
      mockFetch.mockResolvedValueOnce({
        success: false,
        error: 'Incorrect username or password',
      })

      const wrapper = createWrapper()

      await wrapper.find('input[name="username"]').setValue('testuser')
      await wrapper.find('input[name="password"]').setValue('Password123')

      await flushPromises()

      const vm = wrapper.vm as any
      await vm.handleSubmit()

      await flushPromises()

      expect(wrapper.find('.text-red-500').exists()).toBe(true)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // تست‌های Sign Up Page
  // ═══════════════════════════════════════════════════════════════
  describe('Sign Up Page', () => {
    const createWrapper = (options = {}) => {
      return mount(SignUpPage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              stubActions: false,
              ...options,
            }),
          ],
          components: {
            FormInput,
            FormCheckbox,
            SubmitButton,
          },
          mocks: {
            $fetch: mockFetch,
            navigateTo: mockNavigateTo,
          },
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>',
            },
          },
          provide: {
            $fetch: mockFetch,
            navigateTo: mockNavigateTo,
          },
        },
      })
    }

    it('renders correctly', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('h3').text()).toBe('Sign Up')
      expect(wrapper.findAllComponents(FormInput)).toHaveLength(4)
      expect(wrapper.findComponent(SubmitButton).exists()).toBe(true)
      expect(wrapper.findComponent(FormCheckbox).exists()).toBe(true)
    })

    it('initializes form data correctly', async () => {
      const wrapper = createWrapper()

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
      const wrapper = createWrapper()

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
      const wrapper = createWrapper()

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

      const wrapper = createWrapper()

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

      const wrapper = createWrapper()

      await wrapper.find('input[name="username"]').setValue('newuser')
      await wrapper.find('input[name="email"]').setValue('newuser@example.com')
      await wrapper.find('input[name="password"]').setValue('Password123')
      await wrapper.find('input[name="confirmPassword"]').setValue('Password123')
      await wrapper.find('input[type="checkbox"]').setValue(true)

      await flushPromises()

      // ✅ دسترسی مستقیم به متد submit کامپوننت
      const vm = wrapper.vm as any
      await vm.handleSubmit()

      await flushPromises()

      expect(mockNavigateTo).toHaveBeenCalledWith('/home')
    })

    it('handles sign up failure', async () => {
      mockFetch.mockResolvedValueOnce({
        success: false,
        error: 'Username or email already exists',
      })

      const wrapper = createWrapper()

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
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // تست‌های Form Components
  // ═══════════════════════════════════════════════════════════════
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

        // ✅ روش صحیح بررسی disabled
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

        // ✅ روش صحیح بررسی disabled
        const button = wrapper.find('button')
        expect((button.element as HTMLButtonElement).disabled).toBe(true)
      })
    })
  })
})
