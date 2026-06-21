<template>
  <section
    class="py-16 md:py-32 overflow-hidden"
    aria-labelledby="about-heading"
  >
    <div class="container flex flex-col lg:flex-row justify-between items-center gap-y-12 lg:gap-12">
      <!-- Image column -->
      <div class="w-full lg:w-[45%] relative">
        <NuxtImg
          src="/images/laptop-near-whilte-book.jpg"
          alt="Laptop near a white book"
          class="h-auto xl:h-full w-full xl:w-[95%] object-cover z-20 ml-auto block relative"
          sizes="100vw sm:100vw md:50vw"
        />
        <!-- Responsive decorative triangle using clip-path -->
        <div
          aria-hidden="true"
          class="absolute left-0 -bottom-[50px] w-[25%] md:w-[30%] pt-[20%] md:pt-[25%] bg-[#E05243] clip-triangle hidden lg:block"
        />
      </div>

      <!-- Text column -->
      <div class="w-full lg:w-[45%]">
        <h2
          id="about-heading"
          class="text-3xl md:text-4xl xl:text-5xl font-antonio font-semibold text-white leading-snug md:leading-tight lg:leading-tight xl:leading-[4.7rem]"
        >
          Empowering learners with knowledge and tools
          <span class="text-primary">for success</span>
        </h2>
        <p class="text-[#C2C2C2] text-sm md:text-base py-6">
          The first thing to remember about success is that it is a process – nothing more,
          nothing less. There is really no magic to it and it's not reserved only for a select few
          people.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <div
            v-for="(feature, index) in FEATURES"
            :key="index"
            class="bg-dark-bg py-4 px-4 md:px-6 grid grid-cols-[auto_1fr] items-center gap-x-3 md:gap-x-5"
          >
            <div class="flex-shrink-0">
              <NuxtImg
                :src="feature.icon"
                alt=""
                role="presentation"
                loading="lazy"
                width="40"
                height="40"
                class="w-10 h-10 md:w-auto md:h-auto"
              />
            </div>
            <p class="font-antonio font-bold text-white text-sm md:text-base">
              {{ feature.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const FEATURES = [
  { icon: '/icon/UPST0182.png', text: 'Supportive and inspiring learning' },
  { icon: '/icon/UPST0181.png', text: 'Learning experience that is rewarding and meaningful' },
  { icon: '/icon/UPST0180.png', text: 'Bringing together knowledge, skills, and growth' },
  { icon: '/icon/UPST0179.png', text: 'We help you achieve your learning goals' },
] as const
</script>

<style scoped lang="postcss">
.clip-triangle {
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}
</style>
