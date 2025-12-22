<template>
  <form
    class="mt-8 space-y-6"
    @submit.prevent="handleSubmit"
  >
    <div class="text-center">
      <h3 class="text-2xl font-bold text-white mb-2">
        Sign In
      </h3>
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
</template>

<script setup lang="ts">
// Import necessary types and schemas for authentication
import type { AuthResponse } from '~/types/types'
import { signInSchema, type SignInFormData } from '~/schemas/auth'
import { handleSignInError } from '~/utils/auth-error-handler-helpers'

// Import custom form components
import FormInput from '~/components/ui/FormInput.vue'
import FormCheckbox from '~/components/ui/FormCheckbox.vue'
import SubmitButton from '~/components/ui/SubmitButton.vue'

// Define page metadata
definePageMeta({ layout: 'auth', title: 'Sign In' })

// Get user store instance to manage authentication state
const userStore = useUserStore()

// Redirect authenticated users to home page
onMounted(() => {
  if (userStore.isAuthenticated) navigateTo('/home')
})

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
    }
    else {
      // Navigate to home page on successful sign in
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
  }
  finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>
