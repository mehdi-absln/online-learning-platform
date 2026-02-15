<template>
  <!-- Loading State -->
  <div
    v-if="isLoading"
    class="py-36 flex flex-col items-center justify-center"
    role="status"
    aria-label="Loading article details"
  >
    <UiLoadingSpinner message="Loading article details..." />
  </div>

  <!-- Error State -->
  <div
    v-else-if="error || !blog"
    class="py-36 flex flex-col items-center justify-center"
    role="alert"
  >
    <div class="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-red-500 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p class="text-red-500 text-lg mb-4">
        Error: Article not found
      </p>
      <NuxtLink
        to="/blogs"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Blog
      </NuxtLink>
    </div>
  </div>

  <!-- Article Content -->
  <div
    v-else
    class="min-h-screen bg-dark-gray"
  >
    <!-- Live Region for Announcements -->
    <div
      ref="liveRegion"
      class="sr-only"
      aria-live="polite"
      aria-atomic="true"
    />

    <article aria-labelledby="article-title">
      <!-- Hero Section -->
      <section class="bg-hero-shimmer py-12">
        <div class="container">
          <!-- Breadcrumb -->
          <UiBreadcrumb
            :crumbs="breadcrumbCrumbs"
            class="mb-8"
          />

          <!-- Article Header -->
          <header>
            <h1
              id="article-title"
              class="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight"
            >
              {{ blog.title }}
            </h1>

            <!-- Meta Information - Using Description List -->
            <dl class="flex flex-wrap items-center gap-6 text-gray-400 text-sm md:text-base">
              <!-- Author & Date -->
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-surface border border-dark-divider overflow-hidden flex-shrink-0">
                  <NuxtImg
                    v-if="blog.author?.avatar"
                    :src="blog.author.avatar"
                    :alt="`Avatar of ${blog.author?.name || 'Author'}`"
                    width="48"
                    height="48"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-white text-lg font-bold bg-primary/20"
                    aria-hidden="true"
                  >
                    {{ blog.author?.name?.charAt(0) || 'A' }}
                  </div>
                </div>
                <div>
                  <dt class="sr-only">
                    Author
                  </dt>
                  <dd class="text-white font-medium">
                    {{ blog.author?.name || 'Anonymous' }}
                  </dd>
                  <dt class="sr-only">
                    Published date
                  </dt>
                  <dd>
                    <time
                      :datetime="blog.publishedAt || blog.createdAt"
                      class="text-gray-500"
                    >
                      {{ formattedDate }}
                    </time>
                  </dd>
                </div>
              </div>

              <!-- Divider -->
              <div
                class="hidden sm:block w-1.5 h-1.5 rounded-full bg-dark-divider"
                aria-hidden="true"
              />

              <!-- Read Time -->
              <div class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <dt class="sr-only">
                  Reading time
                </dt>
                <dd>{{ readTime }}</dd>
              </div>
            </dl>
          </header>
        </div>
      </section>

      <!-- Main Content -->
      <div class="container py-12">
        <!-- Cover Image -->
        <figure
          v-if="blog.coverImage"
          class="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-dark-divider"
        >
          <NuxtImg
            :src="blog.coverImage"
            :alt="`Cover image for ${blog.title}`"
            width="1200"
            height="600"
            class="w-full h-auto max-h-[500px] object-cover"
            loading="lazy"
          />
        </figure>

        <!-- Article Body -->
        <section
          aria-labelledby="article-content-heading"
          class="prose prose-lg prose-invert max-w-none
            prose-headings:text-white
            prose-headings:font-bold
            prose-headings:leading-tight
            prose-h1:text-4xl
            prose-h2:text-3xl
            prose-h2:mt-12
            prose-h2:mb-6
            prose-h2:pb-3
            prose-h2:border-b
            prose-h2:border-dark-divider
            prose-h3:text-2xl
            prose-h3:mt-10
            prose-h3:mb-4
            prose-h4:text-xl
            prose-h4:mt-8
            prose-h4:mb-3
            prose-h4:text-gray-100
            prose-p:text-gray-200
            prose-p:leading-relaxed
            prose-p:mb-6
            prose-strong:text-white
            prose-strong:font-semibold
            prose-em:text-gray-100
            prose-a:text-primary
            prose-a:no-underline
            prose-a:font-medium
            prose-a:transition-colors
            prose-a:duration-200
            hover:prose-a:text-primary-alt
            hover:prose-a:underline
            prose-ul:text-gray-200
            prose-ul:list-disc
            prose-ul:pl-6
            prose-ol:text-gray-200
            prose-ol:list-decimal
            prose-ol:pl-6
            prose-li:mb-2
            prose-li:marker:text-primary
            prose-code:text-primary/90
            prose-code:bg-dark-bg
            prose-code:px-2
            prose-code:py-1
            prose-code:rounded-md
            prose-code:font-normal
            prose-code:text-sm
            prose-code:border
            prose-code:border-dark-divider
            prose-code:before:content-none
            prose-code:after:content-none
            prose-pre:bg-dark-bg
            prose-pre:border
            prose-pre:border-dark-divider
            prose-pre:rounded-xl
            prose-pre:shadow-lg
            prose-pre:overflow-x-auto
            prose-blockquote:border-l-4
            prose-blockquote:border-primary
            prose-blockquote:bg-dark-surface
            prose-blockquote:py-4
            prose-blockquote:px-6
            prose-blockquote:rounded-r-xl
            prose-blockquote:not-italic
            prose-blockquote:text-gray-200
            prose-blockquote:my-8
            prose-img:rounded-xl
            prose-img:shadow-xl
            prose-img:border
            prose-img:border-dark-divider
            prose-img:my-8
            prose-hr:border-dark-divider
            prose-hr:my-12
            prose-table:border-dark-divider
            prose-th:text-white
            prose-th:bg-dark-surface
            prose-th:px-4
            prose-th:py-3
            prose-td:text-gray-200
            prose-td:px-4
            prose-td:py-3
            prose-td:border-dark-divider
            prose-tr:border-dark-divider
          "
        >
          <h2
            id="article-content-heading"
            class="sr-only"
          >
            Article Content
          </h2>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="renderedContent" />
        </section>
      </div>

      <!-- Article Footer -->
      <footer
        class="container mt-16 py-8 border-t border-dark-divider"
        aria-label="Article footer"
      >
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
          <!-- Back to Blog -->
          <NuxtLink
            to="/blogs"
            class="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray rounded-lg p-2"
          >
            <div class="p-2 rounded-full bg-dark-surface group-hover:bg-primary/10 transition-colors">
              <svg
                class="w-5 h-5 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <span class="font-medium">Back to Blog</span>
          </NuxtLink>

          <!-- Social Share -->
          <div class="flex items-center gap-4">
            <span class="text-gray-500 text-sm font-medium uppercase tracking-wide">
              Share
            </span>
            <ul
              class="flex gap-2 list-none"
              aria-label="Share on social media"
            >
              <li>
                <a
                  :href="twitterShareUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded-full bg-dark-surface text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:ring-offset-2 focus:ring-offset-dark-gray"
                  aria-label="Share on Twitter (opens in new tab)"
                >
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  :href="linkedinShareUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded-full bg-dark-surface text-gray-400 hover:bg-[#0077B5] hover:text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:ring-offset-2 focus:ring-offset-dark-gray"
                  aria-label="Share on LinkedIn (opens in new tab)"
                >
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  :href="facebookShareUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded-full bg-dark-surface text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:ring-offset-dark-gray"
                  aria-label="Share on Facebook (opens in new tab)"
                >
                  <svg
                    class="w-5 h-5"
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
                <button
                  type="button"
                  class="p-2 rounded-full bg-dark-surface text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-gray"
                  aria-label="Copy link to clipboard"
                  @click="copyToClipboard"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const route = useRoute()
const toast = useToast()
const liveRegion = ref<HTMLElement | null>(null)

const slug = computed(() => route.params.slug as string)

if (!slug.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog not found',
  })
}

const { blog, isLoading, error } = await useBlog(slug.value)

// SEO
useSeoMeta({
  title: () => `${blog.value?.title || 'Blog'} - Learning Platform`,
  description: () => blog.value?.excerpt || blog.value?.content?.slice(0, 160) || '',

  // Open Graph
  ogTitle: () => blog.value?.title || 'Blog',
  ogDescription: () => blog.value?.excerpt || blog.value?.content?.slice(0, 160) || '',
  ogImage: () => blog.value?.coverImage || '/images/default-blog-og.jpg',
  ogType: 'article',

  // Twitter
  twitterCard: 'summary_large_image',
})

// Meta tags + Structured Data
useHead({
  meta: [
    // Article Meta Tags
    {
      property: 'article:published_time',
      content: () => blog.value?.publishedAt || blog.value?.createdAt || '',
    },
    {
      property: 'article:author',
      content: () => blog.value?.author?.name || 'Anonymous',
    },

    // Twitter Meta Tags
    {
      name: 'twitter:title',
      content: () => blog.value?.title || 'Blog',
    },
    {
      name: 'twitter:description',
      content: () => blog.value?.excerpt || '',
    },
    {
      name: 'twitter:image',
      content: () => blog.value?.coverImage || '/images/default-blog-og.jpg',
    },
  ],

  // Structured Data (JSON-LD)
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': blog.value?.title,
        'description': blog.value?.excerpt,
        'image': blog.value?.coverImage,
        'datePublished': blog.value?.publishedAt || blog.value?.createdAt,
        'author': {
          '@type': 'Person',
          'name': blog.value?.author?.name || 'Anonymous',
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Learning Platform',
        },
      })),
    },
  ],
})

// Computed Properties
const formattedDate = computed(() => {
  const date = blog.value?.publishedAt || blog.value?.createdAt
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const readTime = computed(() => {
  if (!blog.value?.readingTime) return '1 min read'
  return `${blog.value.readingTime} min read`
})

const renderedContent = computed(() => {
  if (!blog.value?.content) return ''
  return marked.parse(blog.value.content)
})

const breadcrumbCrumbs = computed(() => [
  { name: 'Blogs', path: '/blogs' },
  {
    name: blog.value?.title || '',
    path: `/blogs/${slug.value}`,
  },
])

// Share URLs
const currentUrl = computed(() => {
  if (import.meta.client) {
    return window.location.href
  }
  return `https://yoursite.com/blogs/${slug.value}`
})

const encodedUrl = computed(() => encodeURIComponent(currentUrl.value))
const encodedTitle = computed(() => encodeURIComponent(blog.value?.title || ''))

const twitterShareUrl = computed(() =>
  `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
)

const linkedinShareUrl = computed(() =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
)

const facebookShareUrl = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
)

// ✅ Copy to Clipboard with Screen Reader Announcement
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    toast.success('Link copied to clipboard!')

    // Announce to screen readers
    if (liveRegion.value) {
      liveRegion.value.textContent = 'Link copied to clipboard successfully'
    }
  }
  catch (err: unknown) {
    toast.error('Failed to copy link')

    // Announce error to screen readers
    if (liveRegion.value) {
      liveRegion.value.textContent = 'Failed to copy link to clipboard'
    }
    console.error('Failed to copy:', err)
  }
}
</script>
