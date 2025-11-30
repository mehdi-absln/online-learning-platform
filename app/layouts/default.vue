<template>
  <div class="min-h-screen flex flex-col bg-dark-gray">
    <!-- Header - Using height of 0 to account for fixed navigation -->
    <header class="flex-none h-0">
      <nav>
        <MainNav />
      </nav>
    </header>
    <!-- Main content - Adding padding to account for fixed navigation on non-home pages -->
    <main
      class="flex-grow min-h-screen"
      :class="{ 'pt-40': route.path !== '/' && route.path !== '/home' }"
    >
      <slot />
    </main>
    <footer class="flex-none">
      <MainFooter />
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
