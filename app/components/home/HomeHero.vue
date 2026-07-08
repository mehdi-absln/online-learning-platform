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

    <div class="relative min-h-[450px] w-full overflow-hidden md:aspect-video md:min-h-0">
      <div class="absolute inset-0">
        <NuxtImg
          src="/images/banner.jpg"
          alt="Students learning online"
          width="1920"
          height="1080"
          sizes="100vw xl:1920px"
          loading="eager"
          fetchpriority="high"
          preload
          class="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          class="absolute inset-0 bg-black/80"
        />
      </div>
      <div class="container relative z-20 flex h-full items-center pt-32 lg:pt-40 xl:pt-44">
        <div class="mx-auto w-full max-w-full space-y-6 px-4 text-center md:mx-0 md:space-y-10 md:px-0 md:text-start lg:w-[60%]">
          <h1
            id="main-heading"
            class="font-antonio text-3xl font-bold text-white md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span class="text-primary">GROW YOUR MIND</span>
            <span class="block">SHAPE YOUR FUTURE</span>
          </h1>
          <p class="mx-auto max-w-prose text-sm text-white md:mx-0 md:text-base">
            The key to learning is consistency — nothing more, nothing less.
            There&apos;s no secret formula, and it&apos;s never out of reach.
            Every skill starts with a single step.
          </p>
          <NuxtLink
            to="/courses"
            class="btn-primary group relative inline-flex items-center overflow-hidden px-4 py-2 font-antonio text-xs sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-3 md:text-base"
          >
            <span class="absolute inset-0 w-0 bg-white/10 transition-all duration-500 group-hover:w-full" />
            <span class="relative z-10 flex items-center">
              GET STARTED NOW
              <span
                aria-hidden="true"
                class="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
