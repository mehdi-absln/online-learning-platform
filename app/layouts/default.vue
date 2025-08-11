<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header>
      <Navbar />
    </header>
    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Default layout with TypeScript support
</script>