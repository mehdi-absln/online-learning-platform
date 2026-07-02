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
        class="relative testimonial-carousel-wrapper"
        aria-label="Testimonials carousel"
        role="region"
      >
        <Carousel
          :items-to-show="1"
          :breakpoints="{ 640: { itemsToShow: 2 } }"
          :wrap-around="false"
          :mouse-drag="true"
          :touch-drag="true"
          snap-align="start"
        >
          <Slide
            v-for="testimonial in TESTIMONIALS"
            :key="testimonial.id"
          >
            <div class="bg-transparent p-4 md:p-8 border-2 border-dark-divider rounded-2xl text-center mx-2 md:mx-4 relative overflow-hidden before:content-['\201C'] before:absolute before:top-4 before:right-4 before:text-[#3a3a3a] before:text-6xl md:before:text-9xl before:font-serif before:leading-none before:opacity-20 before:pointer-events-none w-full">
              <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full overflow-hidden border-2 border-primary">
                <AvatarImage
                  :src="testimonial.avatar"
                  :alt="testimonial.name"
                  loading="lazy"
                  width="80"
                  height="80"
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
import { TESTIMONIALS } from '~/constants/home'
</script>

<style scoped>
.testimonial-carousel-wrapper :deep(.carousel__pagination) {
  margin-top: 2rem;
  padding: 0;
  gap: 0.75rem;
  position: relative;
  z-index: 10;
}

.testimonial-carousel-wrapper :deep(.carousel__pagination-button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.testimonial-carousel-wrapper :deep(.carousel__pagination-button:hover) {
  background-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.testimonial-carousel-wrapper :deep(.carousel__pagination-button--active) {
  background-color: #EC5252;
  width: 32px;
  border-radius: 6px;
}

 @media (min-width: 768px) {
  .testimonial-carousel-wrapper :deep(.carousel__pagination) {
    margin-top: 3rem;
  }

  .testimonial-carousel-wrapper :deep(.carousel__pagination-button) {
    width: 14px;
    height: 14px;
  }

  .testimonial-carousel-wrapper :deep(.carousel__pagination-button--active) {
    width: 40px;
  }
}
</style>
