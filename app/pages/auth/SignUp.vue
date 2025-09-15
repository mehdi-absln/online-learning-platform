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
        <input
          id="username"
          v-model="username"
          name="username"
          type="text"
          autocomplete="username"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          placeholder="Username"
        >
      </div>
      
      <div>
        <label for="email" class="sr-only">Email</label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          placeholder="Email"
        >
      </div>
      
      <div>
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          class="bg-[#2A2A2A] text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:ring-primary appearance-none rounded-lg relative block w-full px-3 py-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
          placeholder="Password"
        >
      </div>
    </div>

    <div>
      <button
        type="submit"
        class="bg-primary w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Sign up
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const username = ref('')
const email = ref('')
const password = ref('')

const handleSubmit = () => {
  // Handle form submission here
  console.log('Form submitted:', {
    username: username.value,
    email: email.value,
    password: password.value
  })
}

definePageMeta({
  layout: 'auth',
  title: 'Sign Up'
})
</script>
