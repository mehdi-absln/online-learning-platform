<template>
  <section class="relative w-full overflow-hidden">
    <div class="absolute top-0 left-0 z-10 pointer-events-none flex flex-col items-start">
      <div class="w-[320px] h-[250px] bg-[#E05243] [clip-path:polygon(0_0,100%_0,0_100%)] z-10" />
      <div
        class="w-[550px] h-[55px] bg-black/50 -rotate-[37deg] origin-left z-0 mb-5"
      />
      <div
        class="w-[1900px] h-[550px] bg-black/10 -rotate-[37deg] origin-left z-0"
      />
    </div>
    <div class="absolute bottom-[-60px] right-[-300px] z-10 -rotate-[40deg]">
      <div class="w-[1200px] h-[140px] bg-[#E05243] mb-6" />
      <div class="w-[1200px] h-[140px] bg-[#E05243]" />
    </div>
    <div
      class="relative w-full aspect-video overflow-hidden"
      role="banner"
      aria-label="Hero banner"
    >
      <div class="absolute inset-0 w-full h-full">
        <div
          class="w-full h-full bg-cover bg-center bg-no-repeat bg-[url('@/public/images/banner.jpg')]"
        >
          <div class="absolute inset-0 bg-black bg-opacity-80" aria-hidden="true" />
        </div>
      </div>
      <div class="relative h-full flex items-center container">
        <div class="w-[60%] space-y-10">
          <h1
            id="main-heading"
            class="text-4xl font-antonio md:text-6xl lg:text-8xl font-bold text-white"
          >
            <span class="text-primary">GROW YOUR MIND</span>
            <span class="block">SHAPE YOUR FUTURE</span>
          </h1>
          <p class="text-base text-white">
            The key to learning is consistency — nothing more, nothing less. There's no secret
            formula, and it's never out of reach. Every skill starts with a single step.
          </p>
          <button
            class="relative font-antonio px-6 py-3 font-semibold text-white bg-gradient-to-r from-primary to-primary/90 group overflow-hidden"
          >
            <span
              class="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-500"
            />
            <span class="relative z-10 flex items-center">
              GET STARTED NOW
              <span class="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                >→</span
              >
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
