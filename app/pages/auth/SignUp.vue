<template>
  <main
    aria-labelledby="signup-heading"
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
      aria-label="Sign up form"
      @submit.prevent="handleSubmit"
    >
      <div class="text-center">
        <h1
          id="signup-heading"
          tabindex="-1"
          class="text-2xl font-bold text-white mb-2 mt-4"
        >
          Sign Up
        </h1>
        <p class="text-white">
          Already have an account?
          <NuxtLink
            to="/auth/signin"
            class="text-primary hover:underline"
          >Sign in</NuxtLink>
        </p>
      </div>

      <div class="rounded-md shadow-sm space-y-6 pt-4">
        <UiFormInput
          id="username"
          v-model="form.username"
          label="Username"
          name="username"
          autocomplete="username"
          placeholder="Username"
          required
          :error="getError('username')"
          hint="Choose a unique username"
          @blur="handleBlur('username')"
        />

        <UiFormInput
          id="email"
          v-model="form.email"
          type="email"
          label="Email"
          name="email"
          autocomplete="email"
          placeholder="Email"
          required
          :error="getError('email')"
          hint="We'll never share your email with anyone else"
          @blur="handleBlur('email')"
        />

        <UiFormInput
          id="password"
          v-model="form.password"
          type="password"
          label="Password"
          name="password"
          autocomplete="new-password"
          placeholder="Password"
          required
          :error="getError('password')"
          hint="Password must be at least 6 characters with uppercase, lowercase, and number"
          @blur="handleBlur('password')"
        />

        <UiFormInput
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          autocomplete="new-password"
          placeholder="Confirm Password"
          required
          :error="getError('confirmPassword')"
          hint="Re-enter your password to confirm"
          @blur="handleBlur('confirmPassword')"
        />
      </div>

      <UiFormCheckbox
        id="terms"
        v-model="form.termsAccepted"
        name="terms"
        :error="getError('termsAccepted')"
        @blur="handleBlur('termsAccepted')"
      >
        I accept the
        <span class="text-gray-500">Terms and Conditions</span>
      </UiFormCheckbox>

      <UiSubmitButton
        :loading="isLoading"
        :disabled="!isFormValid || isLoading"
        text="Sign up"
        loading-text="Signing up..."
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
          Browse courses without signing up
        </NuxtLink>
      </p>
    </nav>
  </main>
</template>

<script setup lang="ts">
// Import necessary types and schemas for authentication
import type { ApiResponse } from '~/types/api'
import type { User } from '~/types/auth'
import { signUpSchema, type SignUpFormData } from '~/schemas/auth'
import { handleSignUpError } from '~/utils/auth-error-handler-helpers'

import { SITE_NAME } from '~/constants'

type AuthResponse = ApiResponse<{ user: User }>

// Define page metadata
definePageMeta({ layout: 'auth', title: 'Sign Up' })
// SEO metadata
useHead({
  title: `Sign Up - ${SITE_NAME}`,
  meta: [
    { name: 'description', content: `Create a free account to start learning. Access courses, track your progress, and earn certificates on our ${SITE_NAME}.` },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
  link: [
    { rel: 'canonical', href: 'https://onlinelearningplatform.com/auth/signup' },
  ],
})

// Get user store instance to manage authentication state
const userStore = useUserStore()

// Announcement for screen readers (ARIA live region)
const announcement = ref('')

// Initialize form state and validation functions using Zod schema
const { form, isFormValid, validateAll, getError, handleBlur, setFieldError, clearErrors }
  = useZodValidation<SignUpFormData>(signUpSchema, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  })

// Loading state for submit button
const isLoading = ref(false)

/**
 * Handle form submission for user sign up
 * - Validates form fields
 * - Calls sign up API via user store
 * - Shows success/error messages
 */
const handleSubmit = async () => {
  // Skip submission if validation fails
  if (!validateAll()) return

  // Clear previous errors and set loading state
  clearErrors()
  isLoading.value = true
  announcement.value = 'Creating your account, please wait...'

  try {
    // Attempt to register user with provided credentials
    const result: AuthResponse = await userStore.signUp({
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      termsAccepted: form.termsAccepted,
    })

    // Handle sign up response
    if (!result.success) {
      // Display specific error messages for each field
      handleSignUpError(result.error, setFieldError)
      announcement.value = 'Sign up failed. Please check your information.'
    }
    else {
      // Announce success and navigate to home page
      announcement.value = 'Account created successfully. Redirecting to home page.'
      await navigateTo('/home')
    }
  }
  catch {
    // Set generic error message on email field
    setFieldError('email', 'An unexpected error occurred.')
    announcement.value = 'An unexpected error occurred. Please try again.'
  }
  finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>
