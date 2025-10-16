<template>
    <div class="fixed top-0 left-0 right-0 z-50 py-10 flex justify-between items-center bg-transparent container">
      <NuxtLink to="/home" class="text-xl font-bold text-white drop-shadow-lg">
        ONLINE LEARNING PLATFORM
      </NuxtLink>
      <ul class="flex space-x-8">
        <li>
          <NuxtLink to="/home" class="font-semibold text-white hover:text-primary transition-colors duration-200">
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/courses" class="font-semibold text-white hover:text-primary transition-colors duration-200">
            Courses
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/dashboard" class="font-semibold text-white hover:text-primary transition-colors duration-200">
            Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/pages" class="font-semibold text-white hover:text-primary transition-colors duration-200">
            Pages
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/blog" class="font-semibold text-white hover:text-primary transition-colors duration-200">
            Blog
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contact" class="font-semibold text-white hover:text-primary transition-colors duration-200">
            Contact
          </NuxtLink>
        </li>
      </ul>
      <div class="flex items-center space-x-4">
        <NuxtLink to="/auth"
          class="px-6 py-2.5 font-medium text-white hover:text-primary transition-colors duration-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:text-primary" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Login</span>
        </NuxtLink>
        <div class="h-6 w-px bg-white/20" />
        <button class="p-2.5 text-white rounded-full hover:bg-white/10 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <div class="h-6 w-px bg-white/20" />
        <button class="relative p-2.5 text-white rounded-full hover:bg-white/10 transition-colors duration-200 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span
            class="absolute top-1 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">0</span>
        </button>
      </div>
    </div>
</template>

<script setup lang="ts"></script>
