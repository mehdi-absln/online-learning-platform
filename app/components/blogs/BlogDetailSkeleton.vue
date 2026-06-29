<template>
  <div
    class="min-h-screen bg-dark-gray animate-pulse"
    aria-hidden="true"
  >
    <!-- Hero Section -->
    <section class="bg-hero-shimmer py-12">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 mb-8">
          <div class="h-4 w-12 bg-dark-divider rounded" />
          <div class="h-4 w-4 bg-dark-divider rounded" />
          <div class="h-4 w-40 bg-dark-divider rounded" />
        </div>
        <!-- Title -->
        <div class="space-y-4 mb-6">
          <div class="h-10 md:h-12 bg-dark-divider rounded w-3/4" />
          <div class="h-10 md:h-12 bg-dark-divider rounded w-1/2" />
        </div>
        <!-- Meta -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-dark-divider" />
            <div class="space-y-2">
              <div class="h-4 w-28 bg-dark-divider rounded" />
              <div class="h-3 w-20 bg-dark-divider rounded" />
            </div>
          </div>
          <div class="w-1.5 h-1.5 rounded-full bg-dark-divider hidden sm:block" />
          <div class="h-4 w-24 bg-dark-divider rounded" />
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container py-12">
      <!-- Cover Image -->
      <div class="mb-12 h-[300px] md:h-[400px] bg-dark-divider rounded-2xl" />
      <!-- Article Body -->
      <div class="max-w-none space-y-6">
        <div class="h-5 w-full bg-dark-divider rounded" />
        <div class="h-5 w-5/6 bg-dark-divider rounded" />
        <div class="h-5 w-full bg-dark-divider rounded" />
        <div class="h-5 w-4/6 bg-dark-divider rounded" />
        <div class="h-8 w-48 bg-dark-divider rounded mt-8" />
        <div class="h-5 w-full bg-dark-divider rounded" />
        <div class="h-5 w-full bg-dark-divider rounded" />
        <div class="h-5 w-3/4 bg-dark-divider rounded" />
        <div class="h-8 w-40 bg-dark-divider rounded mt-8" />
        <div class="h-5 w-full bg-dark-divider rounded" />
        <div class="h-5 w-5/6 bg-dark-divider rounded" />
        <div class="h-5 w-full bg-dark-divider rounded" />
        <div class="h-5 w-2/3 bg-dark-divider rounded" />
      </div>
    </div>

    <!-- Footer -->
    <footer class="container mt-16 py-8 border-t border-dark-divider">
      <div class="flex justify-between items-center">
        <div class="h-5 w-32 bg-dark-divider rounded" />
        <div class="flex gap-2">
          <div class="w-9 h-9 bg-dark-divider rounded-full" />
          <div class="w-9 h-9 bg-dark-divider rounded-full" />
          <div class="w-9 h-9 bg-dark-divider rounded-full" />
          <div class="w-9 h-9 bg-dark-divider rounded-full" />
        </div>
      </div>
    </footer>
  </div>
</template>
