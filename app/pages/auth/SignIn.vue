<template>
  <form class="mt-8 space-y-6">
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
          v-model="username"
          name="username"
          type="text"
          autocomplete="username"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          placeholder="Email or username"
        />
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          placeholder="Password"
        />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="rememberMe"
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
        class="bg-primary w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        @click.prevent="handleSubmit"
      >
        Sign in
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleSubmit = () => {
  // Handle form submission here
  console.log('Form submitted:', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
}

definePageMeta({
  layout: 'auth',
  title: 'Sign In'
})
</script>
