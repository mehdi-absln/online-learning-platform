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
        <input
          id="username"
          v-model="form.username"
          name="username"
          type="text"
          autocomplete="username"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.username }"
          placeholder="Email or username"
          @blur="validateUsername"
        />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.password }"
          placeholder="Password"
          @blur="validatePassword"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="form.rememberMe"
          name="remember-me"
          type="checkbox"
          class="h-4 w-4 appearance-none border-primary border-2 rounded focus:ring-primary checked:bg-primary checked:border-primary"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-200"> Remember me </label>
      </div>

      <div class="text-sm">
        <NuxtLink to="/auth/forgot-password" class="font-medium text-primary">
          Forgot your password?
        </NuxtLink>
      </div>
    </div>

    <div>
      <button
        type="submit"
        class="bg-primary w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isFormValid"
      >
        Sign in
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SigninFormData } from '~/types/types'

definePageMeta({
  layout: 'auth',
  title: 'Sign In'
})
const form = reactive<SigninFormData>({
  username: '',
  password: '',
  rememberMe: false
})
const errors = reactive({
  username: '',
  password: ''
})

const validateUsername = () => {
  if (!form.username.trim()) {
    errors.username = 'Username or email is required'
    return false
  }

  if (form.username.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.username)) {
      errors.username = 'Please enter a valid email address'
      return false
    }
  }

  errors.username = ''
  return true
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }

  errors.password = ''
  return true
}

const isFormValid = computed(() => {
  return (
    form.username &&
    form.password &&
    form.password.length >= 6 &&
    !errors.username &&
    !errors.password
  )
})

const handleSubmit = async () => {
  const isUsernameValid = validateUsername()
  const isPasswordValid = validatePassword()

  if (!isUsernameValid || !isPasswordValid) {
    return
  }

  try {
    const { data, error } = await useFetch('/api/auth/signin', {
      method: 'POST',
      body: {
        username: form.username,
        password: form.password,
        rememberMe: form.rememberMe
      }
    })

    if (error.value) {
      if (error.value.statusCode === 401) {
        errors.password = 'Invalid username or password'
      } else {
        console.error('Sign in error:', error.value)
        errors.password = 'An error occurred. Please try again.'
      }
    } else {
      console.log('Sign in successful:', data.value)

      const token = useCookie('auth_token')
      token.value = data.value.token
      await navigateTo('/')
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    errors.password = 'An unexpected error occurred'
  }
}
</script>
