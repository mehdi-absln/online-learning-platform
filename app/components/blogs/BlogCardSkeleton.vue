<template>
  <div
    class="flex flex-col h-full bg-dark-surface rounded-2xl overflow-hidden border border-dark-divider animate-pulse"
    aria-hidden="true"
  >
    <!-- Image Section -->
    <div class="h-48 bg-dark-divider w-full" />
    <!-- Content Section -->
    <div class="flex flex-col flex-grow p-6">
      <!-- Author & Date Placeholder -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-full bg-dark-divider" />
          <div class="h-4 w-24 bg-dark-divider rounded" />
        </div>
        <div class="h-4 w-12 bg-dark-divider rounded" />
      </div>
      <!-- Title Placeholder -->
      <div class="space-y-2 mb-4">
        <div class="h-5 bg-dark-divider rounded w-full" />
        <div class="h-5 bg-dark-divider rounded w-2/3" />
      </div>
      <!-- Excerpt Placeholder -->
      <div class="space-y-2 mt-2 flex-grow">
        <div class="h-3 bg-dark-divider rounded w-full" />
        <div class="h-3 bg-dark-divider rounded w-full" />
        <div class="h-3 bg-dark-divider rounded w-5/6" />
      </div>
      <!-- Footer Placeholder -->
      <div class="flex items-center justify-between pt-2 mt-auto">
        <div class="h-5 w-16 bg-dark-divider rounded" />
        <div class="h-4 w-20 bg-dark-divider rounded" />
      </div>
    </div>
  </div>
</template>
