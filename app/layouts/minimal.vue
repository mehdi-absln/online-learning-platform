<template>
  <div class="min-h-screen flex flex-col bg-dark-bg text-white">
    <!-- Skip to main content link -->
    <a
      href="#main-content"
      class="sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded focus:block focus:w-auto focus:h-auto focus:overflow-visible focus:clip-auto focus:whitespace-normal focus:border-0 focus:m-0 focus:no-underline"
    >
      Skip to main content
    </a>

    <!-- Minimal Header -->
    <header class="py-10 border-b border-white/5 bg-dark-surface/30 backdrop-blur-sm sticky top-0 z-50">
      <div class="container px-4 flex justify-center items-center">
        <NuxtLink
          to="/home"
          class="text-xl font-bold tracking-tight hover:text-primary transition-colors duration-300"
          aria-label="Home page"
        >
          {{ SITE_NAME }}
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main
      id="main-content"
      class="flex-grow py-16"
      tabindex="-1"
    >
      <div class="container px-4">
        <slot />
      </div>
    </main>

    <!-- Minimal Footer -->
    <footer class="py-8 border-t border-white/5 bg-dark-surface/30 mt-auto">
      <div class="container px-4 text-center">
        <p class="text-white/70 text-sm">
          &copy; {{ new Date().getFullYear() }} {{ SITE_NAME }}. Secure Simulation System.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { SITE_NAME } from '~/constants/index'
</script>

<style scoped></style>
