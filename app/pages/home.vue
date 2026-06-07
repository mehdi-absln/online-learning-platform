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
import { SITE_NAME } from '~/constants'
import type { Blog } from '~/types/blog'
import type { Course } from '~/types/course'

// SEO
useSeoMeta({
  title: SITE_NAME,
  ogTitle: `${SITE_NAME} — Online Learning Platform`,
  description:
    'Start your learning journey with our comprehensive online courses taught by expert instructors.',
  ogDescription:
    'Start your learning journey with our comprehensive online courses taught by expert instructors.',
  ogImage: '/images/banner.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// Parallel data fetching for better performance
const [coursesResult, blogResult] = await Promise.all([
  useFetch<{ success: boolean, data: Course[] }>('/api/courses', {
    query: { limit: 10, page: 1 },
    default: () => ({ success: false, data: [] }),
  }),
  useFetch<{ success: boolean, data: Blog[], message?: string }>('/api/blogs', {
    query: { limit: 3, page: 1 },
    default: () => ({ success: false, data: [] }),
  }),
])

const { data: coursesData, pending: isCoursesLoading, error: coursesError, refresh: refreshCourses } = coursesResult
const { data: blogData, pending: isBlogLoading, error: blogError, refresh: refreshBlog } = blogResult

const hasCoursesError = computed(() => !!coursesError.value)
const coursesErrorMessage = computed(() =>
  coursesError.value ? 'Failed to load popular courses. Please try again.' : '',
)

const hasBlogError = computed(() => !!blogError.value)
const blogErrorMessage = computed(() =>
  blogError.value ? 'Failed to load latest articles. Please try again.' : '',
)

const popularCourses = computed(() => {
  const raw = coursesData.value?.data ?? []
  return [...raw]
    .filter(course => course && course.id)
    .sort((a, b) => (b.stats?.students ?? 0) - (a.stats?.students ?? 0))
})

const latestPosts = computed(() => blogData.value?.data ?? [])
</script>
