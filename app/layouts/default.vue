<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="flex-none">
      <MainNav />
    </header>
    <!-- Main content -->
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
// Layout configuration
</script>
<style scoped>
/* Add any global layout styles here */
</style>
