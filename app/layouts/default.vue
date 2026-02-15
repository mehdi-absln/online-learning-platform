<template>
  <div class="min-h-screen flex flex-col bg-dark-gray">
    <!-- Skip to main content link -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
    >
      Skip to main content
    </a>

    <!-- Header - MainNav -->
    <header>
      <MainNav />
    </header>

    <!-- Main content -->
    <main
      id="main-content"
      tabindex="-1"
      class="flex-grow min-h-screen outline-none"
      :class="{ 'pt-40': !isHomePage }"
    >
      <slot />
    </main>

    <!-- Footer - MainFooter -->
    <MainFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const isHomePage = computed(() => {
  return route.path === '/' || route.path === '/home'
})
</script>
