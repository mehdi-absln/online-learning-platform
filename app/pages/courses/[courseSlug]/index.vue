<template>
  <!-- Loading state -->
  <div
    v-if="isLoading"
    class="py-36 flex flex-col items-center justify-center animate-fade-in"
    role="status"
    aria-label="Loading course details"
  >
    <UiLoadingSpinner message="Loading course details..." />
  </div>

  <!-- Error state -->
  <div
    v-else-if="error || !course"
    class="py-36 flex flex-col items-center justify-center animate-fade-in"
    role="alert"
  >
    <UiErrorState
      message="Error: Course not found"
      :hide-retry="true"
    />
    <div class="mt-6">
      <NuxtLink
        to="/courses"
        class="btn-primary"
      >
        Back to Courses
      </NuxtLink>
    </div>
  </div>

  <!-- Course details -->
  <div
    v-else
    class="animate-fade-in"
  >
    <!-- Hero Section -->
    <section
      aria-labelledby="course-title"
      class="py-8 lg:py-5 bg-hero-shimmer overflow-visible"
    >
      <div class="container">
        <div class="relative flex flex-col lg:flex-row lg:justify-between gap-6">
          <!-- Course Header Info -->
          <header class="w-full lg:w-2/3">
            <UiBreadcrumb
              :crumbs="breadcrumbCrumbs"
              class="block mb-6"
            />
            <div class="flex flex-col justify-center min-h-[16rem] lg:min-h-[20rem] space-y-6 lg:space-y-8 text-white">
              <h1
                id="course-title"
                class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
              >
                {{ course?.title }}
              </h1>
              <p class="text-white text-sm sm:text-base">
                {{ course?.description }}
              </p>
              <!-- Meta info -->
              <ul class="flex flex-wrap items-center gap-x-4 gap-y-2 list-none">
                <li class="flex items-center gap-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-[18px] w-[18px] text-primary shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="text-sm sm:text-base">{{ course?.instructor?.name }}</span>
                </li>
                <li
                  aria-hidden="true"
                  class="w-px h-6 bg-white/30"
                />
                <li class="flex items-center gap-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-[18px] w-[18px] text-[#f8a406] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                  <span class="text-sm sm:text-base">{{ course?.rating ?? 'N/A' }} Ratings</span>
                </li>
              </ul>
            </div>
          </header>

          <!-- Placeholder to preserve flex space — only on lg+ -->
          <div
            class="hidden lg:block lg:w-1/3"
            aria-hidden="true"
          />

          <!-- Sidebar - Course Card & Tags -->
          <CourseDetailSidebar :course="course" />
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-10 container">
      <div class="w-full lg:w-[65%]">
        <UiTabs
          v-if="course"
          :tabs="[
            { title: 'Course Info', name: 'course-info' },
            { title: 'Reviews', name: 'reviews' },
          ]"
        >
          <template #course-info>
            <CourseInfoTab :course="course" />
          </template>

          <template #reviews>
            <CourseReviews :reviews="course?.reviews" />
          </template>
        </UiTabs>
      </div>

      <!-- Related Courses -->
      <aside class="mt-10">
        <RelatedCourses
          v-if="course?.id"
          :course-id="course.id.toString()"
          title="Similar Courses"
        />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import CourseReviews from '~/components/courses/CourseReviews.vue'
import RelatedCourses from '~/components/courses/RelatedCourses.vue'
import CourseInfoTab from '~/components/courses/CourseInfoTab.vue'
import CourseDetailSidebar from '~/components/courses/CourseDetailSidebar.vue'

import { SITE_NAME } from '~/constants'

const route = useRoute()

const courseSlug = computed(() => route.params.courseSlug as string)

// Validate course slug
if (!courseSlug.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Course not found',
  })
}

// Use the new composable
const { course, isLoading, error } = useCourse(courseSlug)

useSeoMeta({
  title: () => `${course.value?.title || 'Course'} - ${SITE_NAME}`,
  description: () => course.value?.description || '',
  ogTitle: () => course.value?.title || 'Course',
  ogDescription: () => course.value?.description || '',
  ogImage: () => course.value?.thumbnail || '/default-og.jpg',
})

const breadcrumbCrumbs = computed(() => [
  { name: 'Courses', path: '/courses' },
  {
    name: course.value?.title || '',
    path: course.value?.slug
      ? `/courses/${course.value.slug}`
      : `/courses/${courseSlug.value}`,
  },
])
</script>
