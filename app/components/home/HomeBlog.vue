<template>
  <section
    class="py-10 md:py-16"
    aria-labelledby="blog-heading"
  >
    <div class="container">
      <div class="text-center pb-10 md:pb-14">
        <p class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-2 md:pb-4">
          Latest tips & news
        </p>
        <h2
          id="blog-heading"
          class="text-3xl md:text-5xl font-antonio font-semibold text-white leading-snug md:leading-[4.7rem]"
        >
          Have a look at our news
        </h2>
      </div>

      <div
        v-if="isLoading"
        class="text-center py-10"
        role="status"
        aria-live="polite"
      >
        <LoadingSpinner message="Loading latest articles..." />
      </div>
      <div
        v-else-if="hasError"
        class="py-10"
        role="alert"
      >
        <ErrorState
          :message="errorMessage"
          @retry="$emit('retry')"
        />
      </div>
      <div
        v-else-if="posts.length === 0"
        role="status"
        aria-live="polite"
      >
        <EmptyState
          title="No articles yet"
          message="Check back soon for new articles"
        />
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        role="list"
        :aria-label="`Showing ${posts.length} latest blog articles`"
      >
        <article
          v-for="post in posts"
          :key="post.id"
          role="listitem"
          class="flex"
        >
          <BlogCard
            :blog="post"
            class="w-full h-full"
          />
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BlogCard from '~/components/blogs/BlogCard.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { Blog } from '~/types/blog'

defineProps<{
  posts: Blog[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string
}>()

defineEmits<{
  retry: []
}>()
</script>
