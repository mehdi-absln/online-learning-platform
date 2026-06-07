<template>
  <section
    aria-labelledby="main-heading"
    class="relative w-full overflow-hidden"
  >
    <!-- Decorative shapes -->
    <div
      aria-hidden="true"
      class="absolute bottom-[-60px] right-[-300px] z-10 -rotate-[40deg] hidden xl:block"
    >
      <div class="w-[1200px] h-[140px] bg-[#E05243] mb-6" />
      <div class="w-[1200px] h-[140px] bg-[#E05243]" />
    </div>

    <div class="relative w-full aspect-video min-h-[450px] md:min-h-0 overflow-hidden">
      <div class="absolute inset-0 w-full h-full">
        <NuxtImg
          src="/images/banner.jpg"
          alt="Students learning online"
          class="w-full h-full object-cover object-center absolute inset-0"
          priority
          fetchpriority="high"
          sizes="100vw"
          :placeholder="[20, 12, 75, 5]"
        />
        <div
          class="absolute inset-0 bg-black/80 z-0"
          aria-hidden="true"
        />
      </div>
      <div class="relative h-full flex items-center container pt-32 lg:pt-40 xl:pt-44 z-10">
        <div class="lg:w-[60%] w-full space-y-6 md:space-y-10 text-center md:text-start px-4 md:px-0">
          <h1
            id="main-heading"
            class="text-3xl font-antonio md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white"
          >
            <span class="text-primary">GROW YOUR MIND</span>
            <span class="block">SHAPE YOUR FUTURE</span>
          </h1>
          <p class="text-sm md:text-base text-white max-w-prose mx-auto md:mx-0">
            The key to learning is consistency — nothing more, nothing less. There's no secret
            formula, and it's never out of reach. Every skill starts with a single step.
          </p>
          <NuxtLink
            to="/courses"
            class="btn-primary relative font-antonio group overflow-hidden inline-flex items-center text-xs sm:text-sm md:text-base px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3"
          >
            <span class="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-500" />
            <span class="relative z-10 flex items-center">
              GET STARTED NOW
              <span
                class="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >→</span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
