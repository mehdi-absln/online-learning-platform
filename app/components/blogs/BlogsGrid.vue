<template>
  <section aria-label="Blog articles">
    <!-- Loading -->
    <div
      v-if="loading"
      aria-busy="true"
      aria-live="polite"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="i in 3"
          :key="i"
          class="flex"
        >
          <BlogCardSkeleton class="w-full h-full" />
        </article>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="blogs.length === 0"
      role="status"
      aria-live="polite"
    >
      <UiEmptyState
        title="No articles found"
        message="Try adjusting your search or filters"
      >
        <template #icon>
          <svg
            class="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </template>
      </UiEmptyState>
    </div>

    <!-- Grid -->
    <template v-else>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="list"
        :aria-label="`Showing ${blogs.length} blog articles`"
      >
        <article
          v-for="blog in blogs"
          :key="blog.id"
          role="listitem"
          class="flex"
        >
          <BlogCard
            :blog="blog"
            :show-status="showStatus"
            class="w-full h-full"
          />
        </article>
      </div>

      <!-- Results summary for screen readers -->
      <div
        class="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        Showing page {{ currentPage }} of {{ totalPages }},
        {{ blogs.length }} articles displayed
      </div>
    </template>

    <!-- Pagination -->
    <nav
      v-if="blogs.length > 0 && totalPages > 1"
      aria-label="Blog pagination"
      class="mt-12"
    >
      <UiPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :on-page-change="onPageChange"
      />
    </nav>
  </section>
</template>

<script setup lang="ts">
import type { Blog } from '~/types/blog'
import BlogCard from '~/components/blogs/BlogCard.vue'
import BlogCardSkeleton from '~/components/blogs/BlogCardSkeleton.vue'

interface Props {
  blogs: Blog[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
  showStatus?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showStatus: false,
})
</script>
