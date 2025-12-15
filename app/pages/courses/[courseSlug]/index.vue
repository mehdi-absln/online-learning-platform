<template>
  <!-- Loading state -->
  <div
    v-if="isLoading"
    class="py-36 flex flex-col items-center justify-center"
  >
    <LoadingSpinner message="Loading course details..." />
  </div>

  <!-- Error state -->
  <div
    v-else-if="error || !course"
    class="py-36 flex flex-col items-center justify-center"
  >
    <p class="text-red-500 text-lg">
      Error: Course not found
    </p>
    <NuxtLink
      to="/courses"
      class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
    >
      Back to Courses
    </NuxtLink>
  </div>

  <!-- Course details -->
  <div v-else>
    <!-- Hero -->
    <header
      class="min-h-[28rem] py-5 bg-gradient-to-r from-dark-surface via-dark-bg to-primary/60 shadow-[inset_0_0_40px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm rounded-2xl"
    >
      <div class="container relative flex flex-wrap justify-between">
        <div class="w-2/3">
          <Breadcrumb
            :crumbs="breadcrumbCrumbs"
            class="block mb-6"
          />
          <div class="flex flex-col justify-center min-h-[20rem] space-y-8 text-white">
            <h1 class="text-4xl md:text-5xl font-bold text-white">
              {{ course?.title }}
            </h1>
            <p class="text-white">
              {{ course?.description }}
            </p>
            <div class="flex items-center gap-x-4">
              <div class="flex items-center gap-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-[18px] w-[18px] text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{{ course?.instructor?.name }}</span>
              </div>
              <div class="w-px h-6 bg-white/30" />
              <NuxtLink
                to="/wishlist"
                class="flex items-center gap-x-2 text-white hover:text-primary transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-[18px] w-[18px] text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="CurrentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                  />
                </svg>
                <span>Wishlist</span>
              </NuxtLink>
              <div class="w-px h-6 bg-white/30" />
              <div class="flex items-center gap-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-[18px] w-[18px] text-[#f8a406]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="CurrentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
                <span>{{ course?.rating ?? 'N/A' }} Ratings</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-1/3 space-y-10 absolute -bottom-[44rem] right-0">
          <div class="rounded-2xl bg-dark-gray border border-gray-700">
            <div class="relative overflow-hidden">
              <img
                class="rounded-t-2xl w-full h-full object-cover"
                :src="course?.image"
                :alt="course?.title"
                @error="handleImageError"
              >
              <div class="absolute inset-0 bg-black/50 z-10 rounded-t-2xl" />
            </div>
            <div class="px-9 pt-7">
              <h3 class="text-white text-xl font-semibold">
                Course Includes
              </h3>
              <div class="mt-6 space-y-6">
                <div class="flex items-center justify-between pb-4 border-b border-gray-700">
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <span class="text-gray-300">Price</span>
                  </div>
                  <span class="text-white font-medium">${{ course?.price }}</span>
                </div>

                <div class="flex items-center justify-between pb-4 border-b border-gray-700">
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span class="text-gray-300">Level</span>
                  </div>
                  <span class="text-white font-medium">{{
                    course?.level
                  }}</span>
                </div>

                <div class="flex items-center justify-between pb-4 border-b border-gray-700">
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span class="text-gray-300">Students</span>
                  </div>
                  <span class="text-white font-medium">{{
                    course?.stats?.students
                  }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-primary mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span class="text-gray-300">Category</span>
                  </div>
                  <span class="text-white font-medium">{{
                    course?.category
                  }}</span>
                </div>

                <div>
                  <button
                    class="w-full font-antonio px-6 py-3 font-semibold text-white bg-gradient-to-r from-primary to-primary/90 group overflow-hidden relative"
                  >
                    <span
                      class="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-500"
                    />
                    <span class="relative z-10 flex items-center justify-center"> ENROLL NOW </span>
                  </button>
                </div>
              </div>
            </div>
            <div class="pt-7">
              <hr class="border-gray-700 block w-full">
              <div class="px-9 py-7">
                <h3 class="text-white text-xl font-semibold">
                  Share This:
                </h3>
                <div class="flex space-x-4 mt-5">
                  <a
                    href="#"
                    class="group bg-[#1877F2] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                    aria-label="Facebook"
                  >
                    <svg
                      class="w-5 h-5 text-white group-hover:text-[#1877F2] transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="group bg-[#1DA1F2] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                    aria-label="Twitter"
                  >
                    <svg
                      class="w-5 h-5 text-white group-hover:text-[#1DA1F2] transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="group bg-[#0077B5] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                    aria-label="LinkedIn"
                  >
                    <svg
                      class="w-5 h-5 text-white group-hover:text-[#0077B5] transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    class="group bg-[#E4405F] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                    aria-label="Instagram"
                  >
                    <svg
                      class="w-5 h-5 text-white group-hover:text-[#E4405F] transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-2xl bg-dark-gray border border-gray-700">
            <div class="px-9 py-7">
              <h3 class="text-white text-xl font-semibold">
                Tags
              </h3>
              <div class="flex flex-wrap gap-2 pt-4 tags-wrapper">
                <template v-if="course?.tags">
                  <NuxtLink
                    v-for="tag in course.tags.split(',').map((t) => t.trim())"
                    :key="tag"
                    :to="`/courses?tag=${encodeURIComponent(tag)}`"
                    class="px-3 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-primary transition-colors duration-300"
                  >
                    {{ tag }}
                  </NuxtLink>
                </template>
                <span
                  v-else
                  class="text-gray-400 italic"
                > No tags available </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="py-10 container">
      <div class="w-2/3">
        <Tabs
          v-if="course"
          :tabs="[
            { title: 'Course Info', name: 'course-info' },
            { title: 'Reviews', name: 'reviews' },
          ]"
        >
          <template #course-info>
            <div class="space-y-6">
              <div class="space-y-4">
                <h2 class="text-base font-bold text-primary font-antonio">
                  About Course
                </h2>
                <p class="text-gray-300">
                  "{{ course.description }}"
                </p>
              </div>
              <div class="space-y-4">
                <h3 class="text-base font-bold text-primary font-antonio">
                  What Will You Learn?
                </h3>
                <ul class="list-disc pl-5 text-gray-600 space-y-2">
                  <li
                    v-for="(learningItem, index) in course.learningObjectives"
                    :key="index"
                    class="ml-4"
                  >
                    {{ learningItem }}
                  </li>
                </ul>
              </div>
              <div class="space-y-4">
                <h3 class="text-base font-bold text-primary font-antonio">
                  Course Content
                </h3>
                <div v-if="course?.courseContent">
                  <Accordion
                    :items="
                      courseAccordionItems.map((item) => ({
                        title: item.title,
                        description: item.description,
                        content: item.lessons, // Map to the content property expected by AccordionItem
                      }))
                    "
                  >
                    <template #default="{ item }">
                      <div class="p-4 space-y-2">
                        <div
                          v-for="(lesson, lessonIndex) in (item.content as CourseContentLesson[])"
                          :key="lessonIndex"
                          class="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                          @click="goToLessonPage(lesson)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-primary mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{{ lesson.title }}</span>
                          <span class="ml-auto text-sm text-gray-500">{{ lesson.duration }}</span>
                        </div>
                      </div>
                    </template>
                  </Accordion>
                </div>
                <div
                  v-else
                  class="text-center py-10"
                >
                  <p class="text-gray-500">
                    Course content is not available yet.
                  </p>
                </div>
              </div>
            </div>
          </template>

          <template #reviews>
            <div>
              <h3 class="text-base font-bold text-primary font-antonio">
                Student Ratings & Reviews
              </h3>

              <div
                v-if="
                  course.reviews
                    && course.reviews.length > 0
                "
                class="space-y-6"
              >
                <div
                  v-for="(review, index) in course.reviews"
                  :key="index"
                  class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                >
                  <div class="flex items-center mb-2">
                    <div class="flex items-center">
                      <div
                        v-for="starIndex in 5"
                        :key="starIndex"
                        class="mr-1"
                      >
                        <svg
                          :class="starIndex <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      </div>
                    </div>
                    <span class="ml-2 text-gray-600">{{ review.rating }} out of 5</span>
                  </div>

                  <h4 class="font-semibold text-gray-800">
                    {{ review.reviewerName }}
                  </h4>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ formatDate(review.date) }}
                  </p>
                  <p class="text-gray-700 mt-3">
                    {{ review.comment }}
                  </p>
                </div>
              </div>

              <div
                v-else
                class="text-center py-10"
              >
                <p class="text-gray-500">
                  No reviews yet for this course.
                </p>
              </div>
            </div>
          </template>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseContentLesson } from '~/types/shared/courses'

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
const { course, isLoading, error } = useCourse(courseSlug.value)

useHead({
  title: computed(
    () => `${course.value?.title || 'Course'} - Online Learning Platform`,
  ),
  meta: computed(() => [
    { name: 'description', content: course.value?.description || '' },
  ]),
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

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Create properly typed Accordion items for course content sections
const courseAccordionItems = computed(() => {
  if (!course.value?.courseContent) return []

  return course.value.courseContent.map(section => ({
    title: section.title,
    description: section.description || undefined,
    lessons: section.content || [], // Using a more specific property name for lessons
  }))
})

const goToLessonPage = (lesson: CourseContentLesson) => {
  if (lesson.slug && courseSlug.value) {
    const lessonUrl = `/courses/${courseSlug.value}/lessons/${lesson.slug}`
    navigateTo(lessonUrl)
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-course.svg'
}
</script>
