<template>
  <!-- Loading State -->
  <BlogsBlogDetailSkeleton v-if="isLoading" />

  <!-- Error State -->
  <div
    v-else-if="error || !blog"
    class="py-36 flex flex-col items-center justify-center animate-fade-in"
    role="alert"
  >
    <UiErrorState
      message="Error: Article not found"
      :hide-retry="true"
    />
    <div class="mt-6">
      <NuxtLink
        to="/blogs"
        class="btn-primary inline-flex items-center gap-2"
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
    class="min-h-screen bg-dark-gray animate-fade-in"
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
                  <AvatarImage
                    :src="blog.author?.avatar"
                    :alt="`Avatar of ${blog.author?.name || 'Author'}`"
                    width="48"
                    height="48"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
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
          class="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-dark-divider"
        >
          <BlogsBlogImage
            :src="blog.coverImage"
            :alt="`Cover image for ${blog.title}`"
            width="1200"
            height="600"
            sizes="100vw lg:1200px"
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
            prose-code:text-cyan-300
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
          <LazyMarkdownRenderer :content="blog.content" />
        </section>
      </div>

      <!-- Article Footer -->
      <LazyBlogsArticleFooter
        :twitter-share-url="twitterShareUrl"
        :linkedin-share-url="linkedinShareUrl"
        :facebook-share-url="facebookShareUrl"
        @copy="copyToClipboard"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
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
  ogImage: () => blog.value?.coverImage || '/images/placeholder-blog.svg',
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
      content: () => blog.value?.coverImage || '/images/placeholder-blog.svg',
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
        'image': blog.value?.coverImage || '/images/placeholder-blog.svg',
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
  catch {
    toast.error('Failed to copy link')

    // Announce error to screen readers
    if (liveRegion.value) {
      liveRegion.value.textContent = 'Failed to copy link to clipboard'
    }
  }
}
</script>
