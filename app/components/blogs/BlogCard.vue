<template>
  <article
    class="flex flex-col h-full group bg-dark-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-dark-divider"
    :aria-labelledby="`blog-title-${blog.id}`"
  >
    <!-- Image -->
    <header class="relative overflow-hidden">
      <NuxtLink
        :to="`/blogs/${blog.slug}`"
        :aria-label="`Read article: ${blog.title}`"
        class="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-surface"
        tabindex="-1"
      >
        <NuxtImg
          :src="blog.coverImage || '/images/default-blog.jpg'"
          :alt="blog.coverImage ? `Cover image for ${blog.title}` : ''"
          width="400"
          height="225"
          loading="lazy"
          class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </NuxtLink>
      <!-- Status Badge -->
      <div
        v-if="showStatus && blog.status !== 'published'"
        class="absolute top-4 left-4"
      >
        <span
          class="px-3 py-1 text-white text-sm font-medium rounded-full capitalize"
          :class="statusClass"
          role="status"
        >
          <span class="sr-only">Article status: </span>
          {{ blog.status }}
        </span>
      </div>

      <!-- Read Time -->
      <div class="absolute top-4 right-4">
        <span
          class="px-3 py-1 bg-dark-bg/80 backdrop-blur-sm text-white text-sm font-medium rounded-full"
          :aria-label="`Estimated reading time: ${readTime} minutes`"
        >
          <span aria-hidden="true">{{ readTime }} min read</span>
        </span>
      </div>
    </header>

    <!-- Content -->
    <div class="flex flex-col flex-grow p-6">
      <!-- Author & Date -->
      <div class="flex items-center justify-between mb-3">
        <address class="flex items-center space-x-2 not-italic">
          <div
            class="w-8 h-8 rounded-full bg-gray-600 overflow-hidden"
            role="img"
            :aria-label="`${blog.author?.name || 'Anonymous'}'s avatar`"
          >
            <NuxtImg
              v-if="blog.author?.avatar"
              :src="blog.author.avatar"
              :alt="''"
              width="32"
              height="32"
              loading="lazy"
              class="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white text-sm font-medium"
              aria-hidden="true"
            >
              {{ authorInitials }}
            </div>
          </div>
          <span class="text-gray-400 text-sm">
            <span class="sr-only">Written by </span>
            {{ blog.author?.name || 'Anonymous' }}
          </span>
        </address>

        <time
          class="text-gray-500 text-sm"
          :datetime="isoDate"
        >
          <span class="sr-only">Published on </span>
          {{ formattedDate }}
        </time>
      </div>

      <!-- Title -->
      <h3 :id="`blog-title-${blog.id}`">
        <NuxtLink
          :to="`/blogs/${blog.slug}`"
          class="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 focus:outline-none focus-visible:underline focus-visible:text-primary"
        >
          {{ blog.title }}
        </NuxtLink>
      </h3>

      <!-- Excerpt -->
      <p class="text-gray-400 text-sm mb-4 line-clamp-3 mt-2 flex-grow">
        {{ blog.excerpt || truncatedContent }}
      </p>

      <!-- Footer -->
      <footer class="flex items-center justify-between pt-2 mt-auto">
        <!-- Tags -->
        <div class="flex items-center space-x-2">
          <span
            v-if="blog.status === 'published'"
            class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded"
            role="status"
          >
            <span class="sr-only">Status: </span>
            Published
          </span>
        </div>

        <!-- Read More -->
        <NuxtLink
          :to="`/blogs/${blog.slug}`"
          class="text-primary hover:text-primary-alt transition-colors duration-300 font-medium text-sm flex items-center space-x-1 focus:outline-none focus-visible:underline"
          :aria-label="`Continue reading: ${blog.title}`"
        >
          <span>Read More</span>
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NuxtLink>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Blog } from '~/types/blog'
import { truncateText } from '~/utils/text-helpers'

interface Props {
  blog: Blog
  showStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStatus: false,
})

// Read time
const readTime = computed(() => {
  return props.blog.readingTime || 1
})

// Truncated content for excerpt
const truncatedContent = computed(() => {
  if (!props.blog?.content) return ''
  return truncateText(props.blog.content, 120)
})

// Author initials
const authorInitials = computed(() => {
  const name = props.blog.author?.name || 'A'
  return name.charAt(0).toUpperCase()
})

// Formatted date
const formattedDate = computed(() => {
  const date = props.blog.publishedAt || props.blog.createdAt
  if (!date) return ''

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

// ISO date for datetime attribute
const isoDate = computed(() => {
  const date = props.blog.publishedAt || props.blog.createdAt
  if (!date) return ''
  return new Date(date).toISOString()
})

// Status class
const statusClass = computed(() => {
  switch (props.blog.status) {
    case 'draft':
      return 'bg-yellow-500'
    case 'archived':
      return 'bg-gray-500'
    default:
      return 'bg-green-500'
  }
})
</script>

<style scoped></style>
