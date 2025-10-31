<template>
  <div
    class="w-full h-full rounded-3xl overflow-hidden transition-all duration-500 ease-in-out group flex flex-col"
  >
    <div class="relative">
      <div class="relative">
        <div class="relative h-56 overflow-hidden">
          <div
            class="absolute inset-0 bg-black/40 z-10 transition-all duration-500 group-hover:bg-black/20"
          />
          <img
            :src="course.image"
            :alt="course.title"
            class="w-full h-full object-cover relative transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>
      <div class="absolute top-6 flex items-center justify-between w-full px-4 z-10">
        <span
          class="bg-primary text-white text-[13px] px-5 py-1.5 rounded-full font-medium transition-all duration-300 group-hover:scale-105"
        >
          {{ course.category }}
        </span>
        <button
          class="bg-white rounded-full p-1.5 shadow transition-all duration-300 ease-in-out group-hover:bg-primary group-hover:text-white group-hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-[18px] w-[18px] text-primary group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
      <div
        class="absolute bottom-3 left-4 flex items-center space-x-3 z-10 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 opacity-90 translate-y-2"
      >
        <img
          :src="course.instructor.avatar"
          :alt="course.instructor.name"
          class="w-10 h-10 rounded-full border-2 border-solid border-white"
        />
        <span class="font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {{ course.instructor.name }}
        </span>
      </div>
    </div>

    <div class="px-4 bg-[#282828] flex-1 flex flex-col">
      <h3
        class="text-[22px] font-semibold text-white py-6 flex-1 flex items-center transition-colors duration-300"
        :title="course.title"
      >
        {{ course.title }}
      </h3>
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-1">
          <div
            class="w-9 h-9 flex items-center justify-center bg-transparent border border-white rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <span class="text-white text-sm font-medium pl-1">
            {{ course.stats.students }} Students
          </span>
        </div>
        <div class="flex items-center gap-1">
          <div
            class="w-9 h-9 flex items-center justify-center bg-transparent border border-white rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-[#f8a406]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.21 3.726a1 1 0 00.95.69h3.905c.969 0 1.371 1.24.588 1.81l-3.158 2.295a1 1 0 00-.364 1.118l1.21 3.726c.3.921-.755 1.688-1.54 1.118l-3.158-2.295a1 1 0 00-1.176 0l-3.158 2.295c-.785.57-1.84-.197-1.54-1.118l1.21-3.726a1 1 0 00-.364-1.118L2.396 9.153c-.783-.57-.38-1.81.588-1.81h3.905a1 1 0 00.95-.69l1.21-3.726z"
              />
            </svg>
          </div>
          <span class="text-white font-medium text-base pl-2">{{ course.rating }}</span>
        </div>
      </div>
      <hr class="my-6 border-gray-700 block" />
      <div class="flex items-center justify-between pb-6 mt-auto">
        <span class="text-base font-semibold text-primary-alt">${{ course.price }}</span>
        <NuxtLink
          :to="`/courses/${course.id}`"
          class="relative font-medium text-white transition-all duration-300"
        >
          <span class="relative z-10"> Explore Now </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseCardProps } from '~/types/types-components'

defineProps<CourseCardProps>()
</script>
