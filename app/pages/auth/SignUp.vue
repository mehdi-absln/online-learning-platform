<template>
  <form
    class="mt-8 space-y-6"
    @submit.prevent="handleSubmit"
  >
    <div class="text-center">
      <h3 class="text-2xl font-bold text-white mb-2">
        Sign up
      </h3>
      <p class="text-white">
        Already have an account?
        <NuxtLink
          to="/auth/signin"
          class="text-primary hover:underline"
        > Sign in</NuxtLink>
      </p>
    </div>
    <div class="rounded-md shadow-sm space-y-6 pt-4">
      <div>
        <label
          for="username"
          class="sr-only"
        >Username</label>
        <input
          id="username"
          v-model="form.username"
          name="username"
          type="text"
          autocomplete="username"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': getError('username') }"
          placeholder="Username"
          @blur="handleBlur('username')"
        >
        <p
          v-if="getError('username')"
          class="text-red-500 text-sm mt-1"
        >
          {{ getError('username') }}
        </p>
      </div>

      <div>
        <label
          for="email"
          class="sr-only"
        >Email</label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': getError('email') }"
          placeholder="Email"
          @blur="handleBlur('email')"
        >
        <p
          v-if="getError('email')"
          class="text-red-500 text-sm mt-1"
        >
          {{ getError('email') }}
        </p>
      </div>

      <div>
        <label
          for="password"
          class="sr-only"
        >Password</label>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': getError('password') }"
          placeholder="Password"
          @blur="handleBlur('password')"
        >
        <p
          v-if="getError('password')"
          class="text-red-500 text-sm mt-1"
        >
          {{ getError('password') }}
        </p>
        <p class="text-gray-400 text-xs mt-1">
          Password must be at least 6 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label
          for="confirmPassword"
          class="sr-only"
        >Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          name="confirmPassword"
          type="password"
          autocomplete="new-password"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': getError('confirmPassword') }"
          placeholder="Confirm Password"
          @blur="handleBlur('confirmPassword')"
        >
        <p
          v-if="getError('confirmPassword')"
          class="text-red-500 text-sm mt-1"
        >
          {{ getError('confirmPassword') }}
        </p>
      </div>
    </div>

    <div class="flex items-center">
      <input
        id="terms"
        v-model="form.termsAccepted"
        name="terms"
        type="checkbox"
        class="h-4 w-4 appearance-none border-primary border-2 rounded focus:ring-primary checked:bg-primary checked:border-primary"
        :class="{ 'border-red-500': getError('termsAccepted') }"
        @blur="handleBlur('termsAccepted')"
      >
      <label
        for="terms"
        class="ml-2 block text-sm text-gray-200"
      >
        I accept the
        <NuxtLink
          to="/terms"
          class="text-primary hover:underline"
        >Terms and Conditions</NuxtLink>
      </label>
    </div>
    <p
      v-if="getError('termsAccepted')"
      class="text-red-500 text-sm mt-1"
    >
      {{ getError('termsAccepted') }}
    </p>

    <div>
      <button
        type="submit"
        class="bg-primary w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isFormValid || isLoading"
      >
        <span
          v-if="isLoading"
          class="flex items-center"
        >
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Signing up...
        </span>
        <span v-else>Sign up</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SignupFormData, AuthResponse } from '~/types/types'
import { z } from 'zod'
import { useZodValidation } from '~/composables/useZodValidation'
import {
  AUTH_ERRORS,
  SHARED_AUTH_ERRORS,
  VALIDATION_LIMITS,
  VALIDATION_PATTERNS,
} from '~/constants'

definePageMeta({
  layout: 'auth',
  title: 'Sign Up',
})

// Define Zod schema for validation
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(VALIDATION_LIMITS.USERNAME_MIN, AUTH_ERRORS.USERNAME_TOO_SHORT)
      .max(VALIDATION_LIMITS.USERNAME_MAX)
      .regex(VALIDATION_PATTERNS.USERNAME, AUTH_ERRORS.USERNAME_INVALID_FORMAT),
    email: z.string().email(AUTH_ERRORS.EMAIL_INVALID).max(VALIDATION_LIMITS.EMAIL_MAX),
    password: z
      .string()
      .min(VALIDATION_LIMITS.PASSWORD_MIN, AUTH_ERRORS.PASSWORD_TOO_WEAK)
      .max(VALIDATION_LIMITS.PASSWORD_MAX)
      .regex(VALIDATION_PATTERNS.PASSWORD, AUTH_ERRORS.PASSWORD_TOO_WEAK),
    confirmPassword: z.string().min(1, AUTH_ERRORS.CONFIRM_PASSWORD_REQUIRED),
    termsAccepted: z
      .boolean()
      .refine(value => value === true, { message: AUTH_ERRORS.TERMS_NOT_ACCEPTED }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: AUTH_ERRORS.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  })

const userStore = useUserStore()

// Redirect authenticated users away from auth pages
onMounted(() => {
  if (userStore.isAuthenticated) {
    navigateTo('/home')
  }
})

// Use the enhanced validation composable
const { form, errors, isFormValid, validateAll, getError, handleBlur }
  = useZodValidation<SignupFormData>(signUpSchema, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  })

// Loading state
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!validateAll()) {
    return
  }

  // Clear any previous error messages before attempting sign up
  ;(Object.keys(errors.value) as (keyof SignupFormData)[]).forEach((key) => {
    errors.value[key] = ''
  })

  isLoading.value = true

  try {
    // Call the sign up method from the store
    const result: AuthResponse = await userStore.signUp({
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      termsAccepted: form.termsAccepted,
    })

    if (!result.success) {
      // Clear previous errors
      ;(Object.keys(errors.value) as (keyof SignupFormData)[]).forEach((key) => {
        errors.value[key] = ''
      })

      // Handle sign up failure with specific error message routing
      if (result.error?.includes(SHARED_AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS)) {
        // Check if it's email or username that already exists
        if (result.error?.toLowerCase().includes('email')) {
          errors.value.email = 'Email is already registered'
        }
        else if (result.error?.toLowerCase().includes('username')) {
          errors.value.username = 'Username is already taken'
        }
        else {
          errors.value.email = 'This email or username is already registered'
        }
      }
      else if (result.error?.includes(SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT)) {
        errors.value.password = SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT
      }
      else if (result.error?.includes(SHARED_AUTH_ERRORS.PASSWORD_TOO_WEAK)) {
        errors.value.password = 'Password must contain uppercase, lowercase, and number'
      }
      else if (result.error?.includes(SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH)) {
        errors.value.confirmPassword = SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH
      }
      else if (result.error?.includes(SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED)) {
        errors.value.termsAccepted = SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED
      }
      else if (result.error?.includes(SHARED_AUTH_ERRORS.EMAIL_INVALID)) {
        errors.value.email = SHARED_AUTH_ERRORS.EMAIL_INVALID
      }
      else if (result.error?.includes(SHARED_AUTH_ERRORS.ALL_FIELDS_REQUIRED)) {
        errors.value.username = SHARED_AUTH_ERRORS.USERNAME_REQUIRED
        errors.value.email = SHARED_AUTH_ERRORS.EMAIL_REQUIRED || 'Email is required'
        errors.value.password = SHARED_AUTH_ERRORS.PASSWORD_REQUIRED
        errors.value.confirmPassword
          = SHARED_AUTH_ERRORS.CONFIRM_PASSWORD_REQUIRED || 'Confirm password is required'
      }
      else {
        // General error fallback
        errors.value.email = result.error || 'Sign up failed. Please try again.'
      }
    }
    else {
      // Sign up successful - ensure error messages are cleared
      ;(Object.keys(errors.value) as (keyof SignupFormData)[]).forEach((key) => {
        errors.value[key] = ''
      })
      console.log('Sign up successful:', result)
      // Redirect to home or dashboard after successful signup
      await navigateTo('/home')
    }
  }
  catch (error) {
    console.error('Unexpected error during sign up:', error)
    errors.value.email = 'An unexpected error occurred. Please try again.'
  }
  finally {
    isLoading.value = false
  }
}
</script>
