<template>
  <div
    class="space-y-8 animate-pulse"
    aria-hidden="true"
  >
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-dark-surface border border-dark-divider/50 rounded-2xl p-6"
      >
        <div class="w-12 h-12 bg-dark-bg rounded-xl mb-4" />
        <div class="w-16 h-8 bg-dark-bg rounded mb-1" />
        <div class="w-24 h-4 bg-dark-bg rounded" />
      </div>
    </div>
    <div class="bg-dark-surface border border-dark-divider/50 rounded-2xl p-8">
      <div class="flex gap-6">
        <div class="w-56 h-32 bg-dark-bg rounded-xl hidden sm:block" />
        <div class="flex-1 space-y-4">
          <div class="w-32 h-4 bg-dark-bg rounded" />
          <div class="w-48 h-6 bg-dark-bg rounded" />
          <div class="w-full h-2.5 bg-dark-bg rounded-full" />
          <div class="w-36 h-10 bg-dark-bg rounded-xl" />
        </div>
      </div>
    </div>
  </div>
</template>
