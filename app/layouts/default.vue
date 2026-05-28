<template>
  <div class="min-h-screen flex flex-col bg-dark-gray overflow-x-hidden">
    <!-- Skip to main content link -->
    <a
      href="#main-content"
      class="sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-6 focus:py-3 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-white focus:block focus:w-auto focus:h-auto focus:overflow-visible focus:clip-auto focus:whitespace-normal focus:border-0 focus:m-0 focus:no-underline"
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
      class="flex-grow"
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
