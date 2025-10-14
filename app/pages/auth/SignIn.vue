<template>
  <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
    <div class="text-center">
      <h3 class="text-2xl font-bold text-white mb-2">Sign In</h3>
      <p class="text-white">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary hover:underline"> Sign up</NuxtLink>
      </p>
    </div>
    <div class="rounded-md shadow-sm space-y-6 pt-4">
      <div>
        <label for="username" class="sr-only">Email or username</label>
        <input id="username" v-model="form.username" name="username" type="text" autocomplete="username" required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': getError('username') }" placeholder="Email or username" @blur="handleFieldBlur('username', form.username)" />
        <p v-if="getError('username')" class="text-red-500 text-sm mt-1">{{ getError('username') }}</p>
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input id="password" v-model="form.password" name="password" type="password" autocomplete="current-password"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': getError('password') }" placeholder="Password" @blur="handleFieldBlur('password', form.password)" />
        <p v-if="getError('password')" class="text-red-500 text-sm mt-1">{{ getError('password') }}</p>
        <p class="text-gray-400 text-xs mt-1">Password must be at least 6 characters</p>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input id="remember-me" v-model="form.rememberMe" name="remember-me" type="checkbox"
          class="h-4 w-4 appearance-none border-primary border-2 rounded focus:ring-primary checked:bg-primary checked:border-primary" />
        <label for="remember-me" class="ml-2 block text-sm text-gray-200"> Remember me </label>
      </div>

      <div class="text-sm">
        <NuxtLink to="/auth/forgot-password" class="font-medium text-primary">
          Forgot your password?
        </NuxtLink>
      </div>
    </div>

    <div>
      <button type="submit"
        class="bg-primary w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isFormValid || isLoading">
        <span v-if="isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </span>
        <span v-else>Sign in</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SigninFormData, AuthResponse } from '~/types/types'
import { z } from 'zod'
import { useZodValidation } from '~/composables/useZodValidation'
import { AUTH_ERRORS, SHARED_AUTH_ERRORS, VALIDATION_LIMITS, VALIDATION_PATTERNS } from '~/constants'

definePageMeta({
  layout: 'auth',
  title: 'Sign In'
})

// Define Zod schema for validation
const signInSchema = z.object({
  username: z.string().min(1, AUTH_ERRORS.USERNAME_REQUIRED).max(255)
    .refine(value => {
      // Allow either username (alphanumeric + underscore) or email format
      const usernamePattern = /^[a-zA-Z0-9_]+$/;
      const emailPattern = VALIDATION_PATTERNS.EMAIL;
      return usernamePattern.test(value) || emailPattern.test(value);
    }, {
      message: 'Please enter a valid username or email'
    }),
  password: z.string().min(VALIDATION_LIMITS.PASSWORD_MIN, AUTH_ERRORS.PASSWORD_TOO_SHORT).max(VALIDATION_LIMITS.PASSWORD_MAX),
  rememberMe: z.boolean().default(false)
})

const userStore = useUserStore()

// Redirect authenticated users away from auth pages
onMounted(() => {
  if (userStore.isAuthenticated) {
    navigateTo('/home')
  }
})
// Use the enhanced validation composable
const { form, errors, isValid, isFormValid, validateField, validateAll, getError, reset } = useZodValidation<SigninFormData>(
  signInSchema,
  {
    username: '',
    password: '',
    rememberMe: false
  }
)

// Loading state
const isLoading = ref(false)

// Handle field blur with validation
const handleFieldBlur = (fieldName: keyof SigninFormData, value: any) => {
  validateField(fieldName, value)
}

const handleSubmit = async () => {
  if (!validateAll()) {
    return
  }

  // Clear any previous error messages before attempting sign in
  errors.value.password = ''
  
  isLoading.value = true
  
  try {
    // Call the sign in method from the store
    const result: AuthResponse = await userStore.signIn({
      username: form.username,
      password: form.password,
      rememberMe: form.rememberMe
    })

    if (!result.success) {
      // Handle sign in failure with specific error message routing
      if (result.error?.includes(SHARED_AUTH_ERRORS.INVALID_CREDENTIALS)) {
        errors.value.password = SHARED_AUTH_ERRORS.INVALID_CREDENTIALS
      } else if (result.error?.includes(SHARED_AUTH_ERRORS.USERNAME_REQUIRED) && result.error?.includes(SHARED_AUTH_ERRORS.PASSWORD_REQUIRED)) {
        // For missing fields, we'll set a general error since the validation should catch this client-side
        errors.value.username = SHARED_AUTH_ERRORS.USERNAME_REQUIRED
        errors.value.password = SHARED_AUTH_ERRORS.PASSWORD_REQUIRED
      } else {
        // General error fallback
        errors.value.password = result.error || 'Sign in failed. Please try again.'
      }
    } else {
      // Sign in successful - ensure error messages are cleared
      errors.value.username = ''
      errors.value.password = ''
      console.log('Sign in successful:', result)
      // Redirect to home or dashboard after successful authentication
      await navigateTo('/home')
    }
  } catch (error) {
    console.error('Unexpected error during sign in:', error)
    errors.value.password = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>