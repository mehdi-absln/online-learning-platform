<template>
  <div class="min-h-screen relative container bg-dark-gray flex items-center justify-center">
    <NuxtLink
      to="/home"
      class="text-xl font-bold text-white drop-shadow-lg absolute top-4 left-4 z-50"
    >
      ONLINE LEARNING PLATFORM
    </NuxtLink>
    <div class="w-full max-w-md">
      <div class="bg-[#1F1F1F] rounded-2xl shadow-xl p-8">
        <div class="flex justify-center">
          <NuxtLink
            to="/auth/signin"
            class="whitespace-nowrap py-2 px-7 font-semibold text-[15px] first:rounded-s-sm last:rounded-e-sm transition-colors bg-[#2A2A2A] text-[#B5B5B5]"
            active-class="bg-primary text-white"
            exact-active-class="bg-primary text-white"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/auth/signup"
            class="whitespace-nowrap py-2 px-7 font-semibold text-[15px] first:rounded-s-sm last:rounded-e-sm transition-colors bg-[#2A2A2A] text-[#B5B5B5]"
            active-class="bg-primary text-white"
            exact-active-class="bg-primary text-white"
          >
            Sign Up
          </NuxtLink>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
