<template>
  <section
    class="bg-dark-surface py-16 md:py-32 relative z-0"
    aria-labelledby="classes-heading"
  >
    <div
      aria-hidden="true"
      class="absolute inset-0 flex justify-center gap-[50%] pointer-events-none items-end -z-10"
    >
      <div class="w-px h-[50%] md:h-[95%] bg-primary transform -skew-x-[25deg]" />
      <div class="w-px h-[50%] md:h-[95%] bg-primary transform -skew-x-[25deg]" />
    </div>
    <div class="container relative z-20">
      <div class="text-center pb-10 md:pb-14">
        <p class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-2 md:pb-4">
          ONLINE CLASSES
        </p>
        <h2
          id="classes-heading"
          class="text-3xl md:text-5xl font-antonio font-semibold text-white leading-snug md:leading-[4.7rem]"
        >
          OUR POPULAR CLASSES
        </h2>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="status"
        aria-live="polite"
      >
        <CoursesCourseCardSkeleton
          v-for="i in 3"
          :key="i"
        />
      </div>

      <!-- Error State -->
      <div
        v-else-if="hasError"
        class="py-10"
        role="alert"
      >
        <UiErrorState
          :message="errorMessage"
          @retry="$emit('retry')"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="courses.length === 0"
        role="status"
        aria-live="polite"
      >
        <UiEmptyState
          title="No courses available"
          message="Check back soon for new courses"
        />
      </div>

      <!-- Carousel -->
      <div
        v-else
        aria-label="Popular courses carousel"
        role="region"
        class="courses-carousel-wrapper"
      >
        <Carousel
          :items-to-show="1"
          :breakpoints="{ 640: { itemsToShow: 2 }, 1024: { itemsToShow: 3 } }"
          :wrap-around="false"
          :mouse-drag="true"
          :touch-drag="true"
          snap-align="start"
        >
          <Slide
            v-for="course in courses"
            :key="course.id"
          >
            <div class="w-[95%] group mx-auto h-full">
              <CourseCard :course="course" />
            </div>
          </Slide>
          <template #addons>
            <Pagination />
          </template>
        </Carousel>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'
import type { Course } from '~/types/course'
import CourseCard from '~/components/courses/CourseCard.vue'

defineProps<{
  courses: Course[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string
}>()

defineEmits<{ retry: [] }>()
</script>

<style scoped>
.courses-carousel-wrapper :deep(.carousel__pagination) {
  margin-top: 2rem;
  padding: 0;
  gap: 0.75rem;
  position: relative;
  z-index: 10;
}

.courses-carousel-wrapper :deep(.carousel__pagination-button) {
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

.courses-carousel-wrapper :deep(.carousel__pagination-button:hover) {
  background-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.courses-carousel-wrapper :deep(.carousel__pagination-button--active) {
  background-color: #EC5252;
  width: 32px;
  border-radius: 6px;
}

 @media (min-width: 768px) {
  .courses-carousel-wrapper :deep(.carousel__pagination) {
    margin-top: 3rem;
  }

  .courses-carousel-wrapper :deep(.carousel__pagination-button) {
    width: 14px;
    height: 14px;
  }

  .courses-carousel-wrapper :deep(.carousel__pagination-button--active) {
    width: 40px;
  }
}
</style>
