<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="flex-none">
      <nav>
        <MainNav />
      </nav>
    </header>
    <!-- Main content -->
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="flex-none">
      <MainFooter />
    </footer>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
