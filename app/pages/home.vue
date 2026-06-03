<template>
  <div>
    <HomeHero />
    <HomeAbout />
    <HomePopularClasses
      :courses="popularCourses"
      :is-loading="isCoursesLoading"
      :has-error="hasCoursesError"
      :error-message="coursesErrorMessage"
      @retry="refreshCourses"
    />
    <HomeStats />
    <HomeTrainers />
    <HomeTestimonials />
    <HomeBlog
      :posts="latestPosts"
      :is-loading="isBlogLoading"
      :has-error="hasBlogError"
      :error-message="blogErrorMessage"
      @retry="refreshBlog"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SITE_NAME } from '~/constants'
import type { Blog } from '~/types/blog'
import type { Course } from '~/types/course'

// SEO
useSeoMeta({
  title: `Home - ${SITE_NAME}`,
  ogTitle: `Home - ${SITE_NAME}`,
  description:
    'Start your learning journey with our comprehensive online courses taught by expert instructors.',
  ogDescription:
    'Start your learning journey with our comprehensive online courses taught by expert instructors.',
  ogImage: '/images/banner.jpg',
})

// Popular Courses Data Fetching
const {
  data: coursesData,
  pending: isCoursesLoading,
  error: coursesError,
  refresh: refreshCourses,
} = useFetch<{ success: boolean, data: Course[] }>('/api/courses', {
  query: { limit: 10, page: 1 },
})

const hasCoursesError = computed(() => !!coursesError.value)
const coursesErrorMessage = computed(() =>
  coursesError.value ? 'Failed to load popular courses. Please try again.' : '',
)

// Sort courses by student count (descending) to display the most popular ones
const popularCourses = computed(() => {
  const raw = coursesData.value?.data ?? []
  return [...raw].sort((a, b) => (b.stats?.students ?? 0) - (a.stats?.students ?? 0))
})

// Blog Section Data Fetching
const {
  data: blogData,
  pending: isBlogLoading,
  error: blogError,
  refresh: refreshBlog,
} = useFetch<{
  success: boolean
  data: Blog[]
  message?: string
}>('/api/blogs', {
  query: { limit: 3, page: 1 },
})

const latestPosts = computed(() => blogData.value?.data ?? [])
const hasBlogError = computed(() => !!blogError.value)
const blogErrorMessage = computed(() =>
  blogError.value ? 'Failed to load latest articles. Please try again.' : '',
)
</script>
