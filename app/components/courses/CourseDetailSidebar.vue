<template>
  <aside class="w-full lg:w-1/3 lg:absolute lg:right-0 lg:top-5 space-y-6 lg:space-y-10">
    <!-- Pricing Card -->
    <div class="rounded-2xl bg-dark-gray border border-gray-700">
      <figure class="relative overflow-hidden">
        <CourseImage
          :src="course.thumbnail"
          :alt="course.title"
          :width="600"
          :height="400"
          class="w-full h-auto object-cover"
          sizes="100vw lg:33vw"
          priority
        />
        <div class="absolute inset-0 bg-black/50 z-10 rounded-t-2xl" />
      </figure>

      <div class="px-5 sm:px-9 pt-7">
        <h2 class="text-white text-xl font-semibold">
          Course Includes
        </h2>
        <dl class="mt-6 space-y-6">
          <!-- Price -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-700">
            <dt class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span class="text-gray-300">Price</span>
            </dt>
            <dd class="text-white font-medium">
              {{ '$' + formatPrice(course.price) }}
            </dd>
          </div>

          <!-- Level -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-700">
            <dt class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span class="text-gray-300">Level</span>
            </dt>
            <dd class="text-white font-medium">
              {{ course.level }}
            </dd>
          </div>

          <!-- Students -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-700">
            <dt class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="text-gray-300">Students</span>
            </dt>
            <dd class="text-white font-medium">
              {{ course.stats?.students || 0 }}
            </dd>
          </div>

          <!-- Category -->
          <div class="flex items-center justify-between">
            <dt class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span class="text-gray-300">Category</span>
            </dt>
            <dd class="text-white font-medium">
              {{ course.category || 'N/A' }}
            </dd>
          </div>
        </dl>

        <div class="mt-6 space-y-3">
          <!-- State 1: Already Enrolled ✅ -->
          <template v-if="userStore.isAuthenticated && userStore.isEnrolled(course.id)">
            <NuxtLink
              :to="`/courses/${course.slug}/lessons`"
              class="btn-primary w-full font-antonio text-center block"
            >
              CONTINUE LEARNING
            </NuxtLink>
          </template>

          <!-- State 2: Purchase blocked for admin/superadmin -->
          <template v-else-if="userStore.isAuthenticated && !userStore.canPurchaseCourses">
            <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Administrative accounts cannot purchase courses.
            </div>
          </template>

          <!-- State 3: Instructor viewing own course -->
          <template v-else-if="isOwnCourse">
            <div class="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
              You are the instructor of this course.
            </div>
            <NuxtLink
              :to="`/admin/courses/${course.id}/edit`"
              class="btn-secondary w-full font-antonio text-center block"
            >
              MANAGE COURSE
            </NuxtLink>
          </template>

          <!-- State 4: Already in Cart 🛒 -->
          <template v-else-if="isInCart(course.id)">
            <button
              type="button"
              class="btn-secondary w-full font-antonio"
              @click="openCart"
            >
              VIEW CART
            </button>
            <NuxtLink
              to="/checkout"
              class="btn-primary w-full font-antonio text-center block"
            >
              GO TO CHECKOUT
            </NuxtLink>
          </template>

          <!-- State 5: Not enrolled, not in cart -->
          <template v-else>
            <button
              type="button"
              class="btn-secondary w-full font-antonio"
              @click="handleAddToCart"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              class="btn-primary w-full font-antonio group overflow-hidden relative"
              @click="handleEnrollNow"
            >
              <span class="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-500" />
              <span class="relative z-10">ENROLL NOW</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Share Section -->
      <footer class="pt-7">
        <hr class="border-gray-700 block w-full">
        <div class="px-9 py-7">
          <h3 class="text-white text-xl font-semibold">
            Share This:
          </h3>
          <ul
            aria-label="Share on social media"
            class="flex flex-wrap gap-3 mt-5 list-none"
          >
            <li>
              <a
                href="#"
                class="group bg-[#1877F2] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                aria-label="Share on Facebook"
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
            </li>
            <li>
              <a
                href="#"
                class="group bg-[#1DA1F2] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                aria-label="Share on Twitter"
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
            </li>
            <li>
              <a
                href="#"
                class="group bg-[#0077B5] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                aria-label="Share on LinkedIn"
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
            </li>
            <li>
              <a
                href="#"
                class="group bg-[#E4405F] hover:bg-white transition-colors duration-300 rounded-full p-2.5 flex items-center justify-center"
                aria-label="Share on Instagram"
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
            </li>
          </ul>
        </div>
      </footer>
    </div>

    <!-- Tags Card -->
    <div class="rounded-2xl bg-dark-gray border border-gray-700">
      <div class="px-9 py-7">
        <h3 class="text-white text-xl font-semibold">
          Tags
        </h3>
        <ul
          v-if="courseTags.length > 0"
          class="flex flex-wrap gap-2 pt-4 list-none"
          aria-label="Course tags"
        >
          <li
            v-for="tag in courseTags"
            :key="tag"
          >
            <NuxtLink
              :to="{ path: '/courses', query: { tags: tag } }"
              class="px-3 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-primary transition-colors duration-300"
            >
              {{ tag }}
            </NuxtLink>
          </li>
        </ul>
        <p
          v-else
          class="text-gray-400 italic pt-4"
        >
          No tags available
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import CourseImage from '~/components/courses/CourseImage.vue'
import type { DetailedCourse } from '~/types/course'

const props = defineProps<{
  course: DetailedCourse
}>()

const userStore = useUserStore()
const { addItem, isInCart, openCart } = useCart()
const route = useRoute()

const isOwnCourse = computed(() => {
  if (!userStore.isAuthenticated) return false
  if (userStore.user?.role !== 'instructor') return false
  return userStore.user?.id === props.course.instructor?.userId
})

const courseTags = computed(() => {
  if (!props.course.tags) return []
  return props.course.tags.split(',').map((t: string) => t.trim())
})

const handleAddToCart = async () => {
  const added = await addItem(props.course)
  if (added) {
    openCart()
  }
}

const handleEnrollNow = async () => {
  if (!userStore.isAuthenticated) {
    await navigateTo(`/auth/signin?redirect=${route.fullPath}`)
    return
  }

  if (!userStore.canPurchaseCourses) {
    return
  }

  const added = await addItem(props.course)
  if (!added) return

  await navigateTo('/checkout')
}
</script>
