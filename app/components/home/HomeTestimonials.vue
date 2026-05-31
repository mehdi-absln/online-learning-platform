<template>
  <section
    class="pt-10 md:pt-16 pb-16 md:pb-24"
    aria-labelledby="testimonials-heading"
  >
    <div class="container">
      <div class="text-center pb-10 md:pb-14">
        <p class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-2 md:pb-4">
          Testimonials
        </p>
        <h2
          id="testimonials-heading"
          class="text-3xl md:text-5xl font-antonio font-semibold text-white leading-snug md:leading-[4.7rem]"
        >
          What they say about us
        </h2>
      </div>
      <div
        class="relative"
        aria-label="Testimonials carousel"
        role="region"
      >
        <Carousel
          :items-to-show="1"
          :breakpoints="{ 640: { itemsToShow: 2 } }"
          :wrap-around="false"
          :mouse-drag="true"
          :touch-drag="true"
          class="testimonial-carousel"
        >
          <Slide
            v-for="testimonial in TESTIMONIALS"
            :key="testimonial.id"
          >
            <div class="bg-transparent p-4 md:p-8 border-2 border-dark-divider rounded-2xl text-center mx-2 md:mx-4 relative overflow-hidden before:content-['\201C'] before:absolute before:top-4 before:right-4 before:text-[#3a3a3a] before:text-6xl md:before:text-9xl before:font-serif before:leading-none before:opacity-20 before:pointer-events-none w-full">
              <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full overflow-hidden border-2 border-primary">
                <!-- Using NuxtImg for testimonial avatars -->
                <NuxtImg
                  :src="testimonial.avatar"
                  :alt="testimonial.name"
                  loading="lazy"
                  class="w-full h-full object-cover"
                  sizes="80px"
                />
              </div>
              <blockquote class="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 line-clamp-4 md:line-clamp-none">
                "{{ testimonial.content }}"
              </blockquote>
              <h4 class="text-white text-lg md:text-xl font-semibold">
                {{ testimonial.name }}
              </h4>
              <p class="text-primary text-xs md:text-sm">
                {{ testimonial.role }}
              </p>
            </div>
          </Slide>
          <template #addons>
            <Pagination
              label="Go to slide"
              active-label="Current slide"
            />
          </template>
        </Carousel>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { TESTIMONIALS } from '~/constants/home'
</script>
