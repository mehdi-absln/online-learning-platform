<template>
  <div
    class="animate-pulse"
    aria-hidden="true"
  >
    <!-- Hero Section -->
    <section class="py-8 lg:py-5 bg-hero-shimmer overflow-visible">
      <div class="container">
        <div class="relative flex flex-col lg:flex-row lg:justify-between gap-6">
          <!-- Left: Breadcrumb + Title + Meta -->
          <header class="w-full lg:w-2/3">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-6">
              <div class="h-4 w-16 bg-dark-divider rounded" />
              <div class="h-4 w-4 bg-dark-divider rounded" />
              <div class="h-4 w-32 bg-dark-divider rounded" />
            </div>
            <!-- Title + Description + Meta -->
            <div class="flex flex-col justify-center min-h-[16rem] lg:min-h-[20rem] space-y-6 lg:space-y-8">
              <div class="space-y-4">
                <div class="h-10 sm:h-12 lg:h-14 bg-dark-divider rounded w-3/4" />
                <div class="h-10 sm:h-12 lg:h-14 bg-dark-divider rounded w-1/2" />
              </div>
              <div class="space-y-3">
                <div class="h-4 bg-dark-divider rounded w-full" />
                <div class="h-4 bg-dark-divider rounded w-5/6" />
              </div>
              <div class="flex items-center gap-4">
                <div class="h-5 w-32 bg-dark-divider rounded" />
                <div class="w-px h-6 bg-dark-divider" />
                <div class="h-5 w-24 bg-dark-divider rounded" />
              </div>
            </div>
          </header>

          <!-- Placeholder for sidebar space -->
          <div
            class="hidden lg:block lg:w-1/3"
            aria-hidden="true"
          />

          <!-- Sidebar Skeleton -->
          <aside class="w-full lg:w-1/3 lg:absolute lg:right-0 lg:top-5 space-y-6 lg:space-y-10">
            <!-- Pricing Card -->
            <div class="rounded-2xl bg-dark-gray border border-gray-700">
              <!-- Image -->
              <div class="w-full h-48 bg-dark-divider rounded-t-2xl" />
              <!-- Content -->
              <div class="px-5 sm:px-9 pt-7 pb-7 space-y-6">
                <div class="h-6 w-32 bg-dark-divider rounded" />
                <div class="space-y-6">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="flex items-center justify-between pb-4"
                    :class="i < 4 ? 'border-b border-gray-700' : ''"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-6 h-6 bg-dark-divider rounded" />
                      <div class="h-4 w-16 bg-dark-divider rounded" />
                    </div>
                    <div class="h-4 w-20 bg-dark-divider rounded" />
                  </div>
                </div>
                <!-- Buttons -->
                <div class="space-y-3 mt-6">
                  <div class="h-12 w-full bg-dark-divider rounded-xl" />
                  <div class="h-12 w-full bg-dark-divider rounded-xl" />
                </div>
              </div>
            </div>
            <!-- Tags Card -->
            <div class="rounded-2xl bg-dark-gray border border-gray-700 px-9 py-7">
              <div class="h-6 w-16 bg-dark-divider rounded mb-4" />
              <div class="flex flex-wrap gap-2">
                <div class="h-8 w-16 bg-dark-divider rounded-full" />
                <div class="h-8 w-20 bg-dark-divider rounded-full" />
                <div class="h-8 w-14 bg-dark-divider rounded-full" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-10 container">
      <div class="w-full lg:w-[65%]">
        <!-- Tabs -->
        <div class="flex gap-4 mb-8">
          <div class="h-10 w-28 bg-dark-divider rounded-xl" />
          <div class="h-10 w-24 bg-dark-divider rounded-xl" />
        </div>
        <!-- Tab Content -->
        <div class="space-y-4">
          <div class="h-5 w-48 bg-dark-divider rounded" />
          <div class="h-4 w-full bg-dark-divider rounded" />
          <div class="h-4 w-5/6 bg-dark-divider rounded" />
          <div class="h-4 w-full bg-dark-divider rounded" />
          <div class="h-4 w-2/3 bg-dark-divider rounded" />
        </div>
      </div>

      <!-- Related Courses -->
      <aside class="mt-10">
        <div class="h-8 w-48 bg-dark-divider rounded mb-6" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="i in 3"
            :key="i"
            class="rounded-3xl overflow-hidden border border-dark-divider"
          >
            <div class="h-56 bg-dark-divider" />
            <div class="p-6 space-y-4">
              <div class="h-5 bg-dark-divider rounded w-3/4" />
              <div class="h-5 bg-dark-divider rounded w-1/2" />
              <div class="flex justify-between pt-4">
                <div class="h-6 w-12 bg-dark-divider rounded" />
                <div class="h-10 w-28 bg-dark-divider rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
