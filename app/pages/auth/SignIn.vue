<template>
  <main
    role="main"
    aria-labelledby="signin-heading"
  >
    <!-- ARIA live region for announcements -->
    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ announcement }}
    </div>

    <form
      class="space-y-6"
      aria-label="Sign in form"
      @submit.prevent="handleSubmit"
    >
      <div class="text-center">
        <h1
          id="signin-heading"
          tabindex="-1"
          class="text-2xl font-bold text-white mb-2 mt-4"
        >
          Sign In
        </h1>
        <p class="text-white">
          Don't have an account?
          <NuxtLink
            to="/auth/signup"
            class="text-primary hover:underline"
          >Sign up</NuxtLink>
        </p>
      </div>

      <div class="rounded-md shadow-sm space-y-6 pt-4">
        <FormInput
          id="username"
          v-model="form.username"
          label="Email or username"
          name="username"
          autocomplete="username"
          placeholder="Email or username"
          required
          :error="getError('username')"
          hint="Enter your email address or username"
          @blur="handleBlur('username')"
        />

        <FormInput
          id="password"
          v-model="form.password"
          type="password"
          label="Password"
          name="password"
          autocomplete="current-password"
          placeholder="Password"
          required
          :error="getError('password')"
          hint="Password must be at least 6 characters"
          @blur="handleBlur('password')"
        />
      </div>

      <div class="flex items-center justify-between">
        <FormCheckbox
          id="remember-me"
          v-model="form.rememberMe"
          name="remember-me"
          :label-class="'ml-2 block text-sm text-gray-200'"
        >
          Remember me
        </FormCheckbox>
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm font-medium text-primary"
        >
          Forgot your password?
        </NuxtLink>
      </div>

      <SubmitButton
        :loading="isLoading"
        :disabled="!isFormValid || isLoading"
        text="Sign in"
        loading-text="Signing in..."
      />
    </form>

    <nav
      aria-label="Authentication navigation"
      class="mt-6 text-center"
    >
      <p class="text-sm text-gray-400">
        <NuxtLink
          to="/home"
          class="text-primary hover:underline"
        >
          Browse courses without signing in
        </NuxtLink>
      </p>
    </nav>
  </main>
</template>

<script setup lang="ts">
// Import necessary types and schemas for authentication
import type { ApiResponse } from '~/types/api'; import type { User } from '~/types/auth'; type AuthResponse = ApiResponse<{ user: User }>
import { signInSchema, type SignInFormData } from '~/schemas/auth'
import { handleSignInError } from '~/utils/auth-error-handler-helpers'

// Import custom form components
import FormInput from '~/components/ui/FormInput.vue'
import FormCheckbox from '~/components/ui/FormCheckbox.vue'
import SubmitButton from '~/components/ui/SubmitButton.vue'

// Define page metadata
definePageMeta({ layout: 'auth', title: 'Sign In' })

import { SITE_NAME } from '~/constants'
// SEO metadata
useHead({
  title: `Sign In - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: `Sign in to access your courses, track progress, and continue learning on our ${SITE_NAME}.` },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
  link: [
    { rel: 'canonical', href: 'https://onlinelearningplatform.com/auth/signin' },
  ],
})

// Get user store instance to manage authentication state
const userStore = useUserStore()

// Announcement for screen readers (ARIA live region)
const announcement = ref('')

// Toast notification for redirects
const route = useRoute()
const toast = useToast()

// Show toast if redirected from a protected page
if (import.meta.client && route.query.redirected === 'please_login') {
  onMounted(() => {
    toast.showLoginRequired('access this page')
  })
}

// Initialize form state and validation functions using Zod schema
const { form, isFormValid, validateAll, getError, handleBlur, setFieldError, clearErrors }
  = useZodValidation<SignInFormData>(signInSchema, {
    username: '',
    password: '',
    rememberMe: false,
  })

// Loading state for submit button
const isLoading = ref(false)

/**
 * Handle form submission for user sign in
 * - Validates form fields
 * - Calls sign in API via user store
 * - Shows success/error messages
 */
const handleSubmit = async () => {
  // Skip submission if validation fails
  if (!validateAll()) return

  // Clear previous errors and set loading state
  clearErrors()
  isLoading.value = true
  announcement.value = 'Signing in, please wait...'

  try {
    // Attempt to authenticate user with provided credentials
    const result: AuthResponse = await userStore.signIn({
      username: form.username,
      password: form.password,
      rememberMe: form.rememberMe,
    })

    // Handle sign in response
    if (!result.success) {
      // Display specific error messages for each field
      handleSignInError(result.error, setFieldError)
      announcement.value = 'Sign in failed. Please check your credentials.'
    }
    else {
      // Announce success and navigate to home page
      announcement.value = 'Sign in successful. Redirecting to home page.'
      await navigateTo('/home')
    }
  }
  catch (error) {
    // Log unexpected errors in development mode
    if (import.meta.dev) {
      console.error('Unexpected error:', error)
    }
    // Set generic error message on password field
    setFieldError('password', 'An unexpected error occurred.')
    announcement.value = 'An unexpected error occurred. Please try again.'
  }
  finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>
