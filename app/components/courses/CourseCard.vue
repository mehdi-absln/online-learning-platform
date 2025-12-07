<template>
  <div
    class="w-full h-full rounded-3xl overflow-hidden transition-all duration-500 ease-in-out group flex flex-col"
  >
    <!-- Image Section -->
    <div class="relative">
      <div class="relative h-56 overflow-hidden">
        <div
          class="absolute inset-0 bg-black/40 z-10 transition-all duration-500 group-hover:bg-black/20"
        />
        <img
          :src="course.image"
          :alt="course.title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          @error="handleImageError"
        >
      </div>

      <!-- Top Bar: Category & Bookmark -->
      <div class="absolute top-6 flex items-center justify-between w-full px-4 z-20">
        <span
          class="bg-primary text-white text-[13px] px-5 py-1.5 rounded-full font-medium transition-all duration-300 group-hover:scale-105"
        >
          {{ course.category }}
        </span>
        <button
          :aria-label="'Bookmark ' + course.title"
          class="group/bookmark bg-white rounded-full p-1.5 shadow transition-all duration-300 ease-in-out hover:bg-primary hover:shadow-lg"
          @click.prevent="$emit('bookmark', course.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-[18px] w-[18px] text-primary transition-colors duration-300 group-hover/bookmark:text-white"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
            />
          </svg>
        </button>
      </div>

      <!-- Instructor Info -->
      <div
        class="absolute bottom-3 start-4 flex items-center gap-3 z-10 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 opacity-90 translate-y-2"
      >
        <img
          :src="course.instructor.avatar"
          :alt="course.instructor.name"
          loading="lazy"
          class="w-10 h-10 rounded-full border-2 border-solid border-white"
        >
        <span class="font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {{ course.instructor.name }}
        </span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="px-4 bg-[#282828] flex-1 flex flex-col">
      <h3
        class="text-[22px] font-semibold text-white py-6 flex-1 flex items-center"
        :title="course.title"
      >
        <NuxtLink
          v-if="courseLink"
          :to="courseLink"
          class="transition-all duration-300 hover:text-primary"
        >
          {{ course.title }}
        </NuxtLink>
        <span
          v-else
          class="cursor-default"
        >
          {{ course.title }}
        </span>
      </h3>

      <!-- Stats -->
      <div class="flex items-center gap-4 text-sm">
        <CourseStatItem
          icon="students"
          :value="`${course.stats.students} Students`"
        />
        <CourseStatItem
          icon="rating"
          :value="course.rating"
        />
      </div>

      <hr class="my-6 border-gray-700">

      <!-- Footer -->
      <div class="flex items-center justify-between pb-6 mt-auto">
        <span class="text-base font-semibold text-primary-alt">
          ${{ course.price }}
        </span>
        <NuxtLink
          v-if="courseLink"
          :to="courseLink"
          class="font-medium text-white transition-all duration-300 hover:text-primary"
        >
          Explore Now
        </NuxtLink>
        <span
          v-else
          class="font-medium text-gray-500"
        >
          Explore Now
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '~/types/shared/courses'

interface Props {
  course: Course
}

const props = defineProps<Props>()

defineEmits<{
  bookmark: [courseId: number]
}>()

const courseLink = computed(() => {
  if (!props.course.slug) {
    console.warn(`Course slug is missing for: ${props.course.title}`)
    return ''
  }
  return `/courses/${props.course.slug}`
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-course.svg'
}
</script>
