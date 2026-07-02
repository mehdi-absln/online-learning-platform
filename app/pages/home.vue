<template>
  <div class="animate-fade-in">
    <HomeHero />
    <HomeAbout />
    <HomePopularClasses
      :courses="popularCourses"
      :is-loading="isCoursesLoading"
      :has-error="hasCoursesError"
      :error-message="coursesErrorMessage"
      @retry="refreshCourses"
    />
    <LazyHomeStats />
    <LazyHomeTrainers />
    <LazyHomeTestimonials />
    <LazyHomeBlog
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

// Courses: fetched eagerly (above the fold)
const {
  data: coursesData, pending: isCoursesLoading, error: coursesError, refresh: refreshCourses,
} = useFetch<{ success: boolean, data: Course[] }>('/api/courses', {
  query: { limit: 10, page: 1 },
  default: () => ({ success: false, data: [] }),
})

// Blog: lazy — doesn't block SSR, fetches on client after mount
const {
  data: blogData, pending: isBlogLoading, error: blogError, refresh: refreshBlog,
} = useLazyFetch<{ success: boolean, data: Blog[], message?: string }>('/api/blogs', {
  query: { limit: 3, page: 1 },
  default: () => ({ success: false, data: [] }),
})

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
