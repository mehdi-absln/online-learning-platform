<template>
  <form
    class="mt-8 space-y-6"
    @submit.prevent="handleSubmit"
  >
    <div class="text-center">
      <h3 class="text-2xl font-bold text-white mb-2">
        Sign Up
      </h3>
      <p class="text-white">
        Already have an account?
        <NuxtLink
          to="/auth/signin"
          class="text-primary hover:underline"
        >Sign in</NuxtLink>
      </p>
    </div>

    <div class="rounded-md shadow-sm space-y-6 pt-4">
      <FormInput
        id="username"
        v-model="form.username"
        label="Username"
        name="username"
        autocomplete="username"
        placeholder="Username"
        required
        :error="getError('username')"
        @blur="handleBlur('username')"
      />

      <FormInput
        id="email"
        v-model="form.email"
        type="email"
        label="Email"
        name="email"
        autocomplete="email"
        placeholder="Email"
        required
        :error="getError('email')"
        @blur="handleBlur('email')"
      />

      <FormInput
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

      <FormInput
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        label="Confirm Password"
        name="confirmPassword"
        autocomplete="new-password"
        placeholder="Confirm Password"
        required
        :error="getError('confirmPassword')"
        @blur="handleBlur('confirmPassword')"
      />
    </div>

    <FormCheckbox
      id="terms"
      v-model="form.termsAccepted"
      name="terms"
      :error="getError('termsAccepted')"
      @blur="handleBlur('termsAccepted')"
    >
      I accept the
      <NuxtLink
        to="/terms"
        class="text-primary hover:underline"
      >Terms and Conditions</NuxtLink>
    </FormCheckbox>

    <SubmitButton
      :loading="isLoading"
      :disabled="!isFormValid || isLoading"
      text="Sign up"
      loading-text="Signing up..."
    />
  </form>
</template>

<script setup lang="ts">
// Import necessary types and schemas for authentication
import type { AuthResponse } from '~/types/types'
import { signUpSchema, type SignUpFormData } from '~/schemas/auth'
import { handleSignUpError } from '~/utils/authErrorHandler'

// Import custom form components
import SubmitButton from '~/components/ui/SubmitButton.vue'
import FormCheckbox from '~/components/ui/FormCheckbox.vue'
import FormInput from '~/components/ui/FormInput.vue'

// Define page metadata
definePageMeta({ layout: 'auth', title: 'Sign Up' })

// Get user store instance to manage authentication state
const userStore = useUserStore()

// Redirect authenticated users to home page
onMounted(() => {
  if (userStore.isAuthenticated) navigateTo('/home')
})

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
    }
    else {
      // Navigate to home page on successful sign up
      await navigateTo('/home')
    }
  }
  catch (error) {
    // Log unexpected errors in development mode
    if (import.meta.dev) {
      console.error('Unexpected error:', error)
    }
    // Set generic error message on email field
    setFieldError('email', 'An unexpected error occurred.')
  }
  finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>
