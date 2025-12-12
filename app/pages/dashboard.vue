<template>
  <div class="container py-10">
    <h1 class="text-3xl font-bold text-white mb-6">
      Dashboard
    </h1>
    <p class="text-gray-300 mb-6">
      Welcome to your learning dashboard!
    </p>

    <div class="bg-dark-gray p-6 rounded-lg">
      <h2 class="text-xl font-semibold text-white mb-4">
        Your Courses
      </h2>
      <p class="text-gray-300">
        You haven't enrolled in any courses yet.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  meta: { requiresAuth: true },
})
</script>
