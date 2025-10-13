<template>
  <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
    <div class="text-center">
      <h3 class="text-2xl font-bold text-white mb-2">Sign up</h3>
      <p class="text-white">
        Already have an account?
        <NuxtLink to="/auth/signin" class="text-primary hover:underline"> Sign in</NuxtLink>
      </p>
    </div>
    <div class="rounded-md shadow-sm space-y-6 pt-4">
      <div>
        <label for="username" class="sr-only">Username</label>
        <input id="username" v-model="form.username" name="username" type="text" autocomplete="username" required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.username }" placeholder="Username" @blur="validateUsername" />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
      </div>

      <div>
        <label for="email" class="sr-only">Email</label>
        <input id="email" v-model="form.email" name="email" type="email" autocomplete="email" required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.email }" placeholder="Email" @blur="validateEmail" />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div>
        <label for="password" class="sr-only">Password</label>
        <input id="password" v-model="form.password" name="password" type="password" autocomplete="new-password"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.password }" placeholder="Password" @blur="validatePassword" />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <div>
        <label for="confirmPassword" class="sr-only">Confirm Password</label>
        <input id="confirmPassword" v-model="form.confirmPassword" name="confirmPassword" type="password"
          autocomplete="new-password" required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          :class="{ 'border-red-500': errors.confirmPassword }" placeholder="Confirm Password"
          @blur="validateConfirmPassword" />
        <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
          {{ errors.confirmPassword }}
        </p>
      </div>
    </div>

    <div class="flex items-center">
      <input id="terms" v-model="form.termsAccepted" name="terms" type="checkbox"
        class="h-4 w-4 appearance-none border-primary border-2 rounded focus:ring-primary checked:bg-primary checked:border-primary"
        :class="{ 'border-red-500': errors.termsAccepted }" />
      <label for="terms" class="ml-2 block text-sm text-gray-200">
        I accept the
        <NuxtLink to="/terms" class="text-primary hover:underline">Terms and Conditions</NuxtLink>
      </label>
    </div>
    <p v-if="errors.termsAccepted" class="text-red-500 text-sm mt-1">{{ errors.termsAccepted }}</p>

    <div>
      <button type="submit"
        class="bg-primary w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isFormValid">
        Sign up
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SignupFormData, AuthResponse, SignUpFormErrors } from '~/types/types'

definePageMeta({
  layout: 'auth',
  title: 'Sign Up'
})

const userStore = useUserStore()

// Redirect authenticated users away from auth pages
onMounted(() => {
  if (userStore.isAuthenticated) {
    navigateTo('/home')
  }
})

const form = reactive<SignupFormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false
})

const errors = reactive<SignUpFormErrors>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: ''
})

const validateUsername = () => {
  if (!form.username.trim()) {
    errors.username = 'Username is required'
    return false
  }

  if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    return false
  }

  if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Username can only contain letters, numbers and underscores'
    return false
  }

  errors.username = ''
  return true
}

const validateEmail = () => {
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  errors.email = ''
  return true
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return false
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.password =
      'Password must contain at least one uppercase letter, one lowercase letter and one number'
    return false
  }

  errors.password = ''
  return true
}

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    return false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }

  errors.confirmPassword = ''
  return true
}

const validateTerms = () => {
  if (!form.termsAccepted) {
    errors.termsAccepted = 'You must accept the terms and conditions'
    return false
  }

  errors.termsAccepted = ''
  return true
}

const isFormValid = computed(() => {
  return (
    form.username &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.termsAccepted &&
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.termsAccepted
  )
})

const handleSubmit = async () => {
  const isUsernameValid = validateUsername()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  const isTermsValid = validateTerms()

  if (
    !isUsernameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid ||
    !isTermsValid
  ) {
    return
  }

  // Clear previous errors
  errors.email = ''
  errors.username = ''

  // Call the sign up method from the store
  const result: AuthResponse = await userStore.signUp({
    username: form.username,
    email: form.email,
    password: form.password,
    confirmPassword: form.confirmPassword,
    termsAccepted: form.termsAccepted
  })

  if (!result.success) {
    // Handle sign up failure
    if (result.error?.includes('email')) {
      errors.email = 'Email is already registered'
    } else if (result.error?.includes('username')) {
      errors.username = 'Username is already taken'
    } else if (result.error?.includes('Password') || result.error?.includes('password')) {
      errors.password = result.error
    } else {
      errors.email = result.error || 'Sign up failed'
    }
  } else {
    // Sign up successful
    console.log('Sign up successful:', result)
    // Redirect to home or dashboard after successful signup
    await navigateTo('/home')
  }
}
</script>
