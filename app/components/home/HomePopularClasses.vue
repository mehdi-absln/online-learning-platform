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

      <!-- Loading / Error / Empty states -->
      <div
        v-if="isLoading"
        class="text-center py-10"
        role="status"
        aria-live="polite"
      >
        <LoadingSpinner message="Loading popular courses..." />
      </div>
      <div
        v-else-if="hasError"
        class="py-10"
        role="alert"
      >
        <ErrorState
          :message="errorMessage"
          @retry="$emit('retry')"
        />
      </div>
      <div
        v-else-if="courses.length === 0"
        role="status"
        aria-live="polite"
      >
        <EmptyState
          title="No courses available"
          message="Check back soon for new courses"
        />
      </div>

      <!-- Carousel (responsive items-to-show) -->
      <div
        v-else
        aria-label="Popular courses carousel"
        role="region"
      >
        <Carousel
          :items-to-show="1"
          :breakpoints="{ 640: { itemsToShow: 2 }, 1024: { itemsToShow: 3 } }"
          :wrap-around="false"
          :mouse-drag="true"
          :touch-drag="true"
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
import type { Course } from '~/types/course'

defineProps<{
  courses: Course[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string
}>()

defineEmits<{
  retry: []
}>()
</script>
