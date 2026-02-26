<template>
  <article
    class="w-full h-full rounded-3xl overflow-hidden transition-all duration-500 ease-in-out group flex flex-col"
  >
    <!-- Image Section -->
    <div class="relative">
      <div class="relative h-56 overflow-hidden">
        <div
          class="absolute inset-0 bg-black/40 z-10 transition-all duration-500 group-hover:bg-black/20"
        />
        <img
          :src="course.thumbnail ?? undefined"
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
          @error="handleImageError"
        >
        <span class="font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {{ course.instructor.name }}
        </span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="px-4 bg-dark-bg flex-1 flex flex-col">
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

      <hr class="my-6 border-gray-700">

      <!-- Footer -->
      <div class="flex items-center justify-between pb-6 mt-auto gap-4">
        <!-- ✅ ENROLLED -->
        <template v-if="userStore.isAuthenticated && userStore.isEnrolled(course.id)">
          <span class="text-sm text-white/50 line-through">
            ${{ course.price }}
          </span>
          <NuxtLink
            :to="`/courses/${course.slug}/lessons`"
            class="flex items-center gap-2 text-sm font-semibold text-primary
                   hover:text-white transition-all duration-300 group/learn"
          >
            <span
              class="flex items-center justify-center w-8 h-8
                     bg-primary/10 rounded-lg
                     group-hover/learn:bg-primary
                     transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-primary group-hover/learn:text-white
                       transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            Continue Learning
          </NuxtLink>
        </template>

        <!-- ❌ NOT ENROLLED or loading enrollments -->
        <template v-else>
          <span class="text-base font-semibold text-primary-alt">
            ${{ course.price }}
          </span>

          <div class="flex items-center gap-2">
            <button
              v-if="!isInCart(course.id)"
              class="p-2.5 bg-primary/10 hover:bg-primary text-primary
                     hover:text-white rounded-xl transition-all duration-300
                     focus:outline-none focus-visible:ring-2
                     focus-visible:ring-primary"
              aria-label="Add to cart"
              @click.prevent="handleAddToCart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>

            <button
              v-else
              class="p-2.5 bg-primary text-white rounded-xl
                     transition-all duration-300
                     focus:outline-none focus-visible:ring-2
                     focus-visible:ring-primary"
              aria-label="View in cart"
              @click.prevent="openCart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            <NuxtLink
              v-if="courseLink"
              :to="courseLink"
              class="font-medium text-white transition-all duration-300
                     hover:text-primary whitespace-nowrap"
            >
              Explore Now
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { useUserStore } from '~/stores/user'
import type { Course as AuthCourse } from '~/types/shared/auth'
import type { Course } from '~/types/shared/courses'

interface Props {
  course: Course
}

const props = defineProps<Props>()
const { addItem, isInCart, openCart } = useCart()
const userStore = useUserStore()

defineEmits<{
  bookmark: [courseId: number]
}>()

const handleAddToCart = () => {
  // Convert course to the format expected by the store if necessary
  addItem(props.course as unknown as AuthCourse)
  openCart()
}

const courseLink = computed(() => {
  if (!props.course.slug) {
    console.warn(`Course slug is missing for: ${props.course.title}`)
    return ''
  }
  return `/courses/${props.course.slug}`
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.src.includes('placeholder-course')) {
    return
  }
  if (img.alt === props.course.instructor.name) {
    img.src = '/images/placeholder-avatar.svg'
  }
  else {
    img.src = '/images/placeholder-course.svg'
  }
}
</script>
