<template>
  <div class="min-h-screen bg-dark-gray">
    <UiPageHero
      title="About Us"
      subtitle="Learn more about our mission, values, and the team behind the platform"
      :breadcrumb-crumbs="[{ name: 'About', path: '/about' }]"
    />

    <section
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-labelledby="about-content-title"
    >
      <h2
        id="about-content-title"
        class="sr-only"
      >
        About Our Platform
      </h2>

      <!-- Introduction -->
      <div class="bg-dark-surface border border-dark-divider rounded-lg p-6 md:p-8 mb-8">
        <p class="text-gray-300 leading-relaxed text-lg">
          Welcome to <span class="text-white font-semibold">{{ SITE_NAME }}</span> —
          your destination for high-quality online education. We believe that learning
          should be accessible, engaging, and tailored to your needs. Our platform
          brings together expert instructors and passionate learners from around the world.
        </p>
      </div>

      <!-- Mission -->
      <div
        class="bg-dark-surface border border-dark-divider rounded-lg p-6 md:p-8 mb-8"
        aria-labelledby="mission-heading"
      >
        <h3
          id="mission-heading"
          class="text-xl font-semibold text-white mb-4 flex items-center gap-2 font-antonio"
        >
          <span
            class="w-1 h-5 bg-primary rounded-full"
            aria-hidden="true"
          />
          Our Mission
        </h3>
        <p class="text-gray-300 leading-relaxed">
          To empower learners worldwide by providing a flexible, interactive,
          and career-focused learning experience. We partner with industry experts
          to deliver courses that make a real difference in people's lives.
        </p>
      </div>

      <!-- Values -->
      <div
        class="bg-dark-surface border border-dark-divider rounded-lg p-6 md:p-8"
        aria-labelledby="values-heading"
      >
        <h3
          id="values-heading"
          class="text-xl font-semibold text-white mb-6 flex items-center gap-2 font-antonio"
        >
          <span
            class="w-1 h-5 bg-primary rounded-full"
            aria-hidden="true"
          />
          Our Values
        </h3>

        <div class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="value in values"
            :key="value.title"
            class="bg-dark-bg border border-dark-divider rounded-lg p-4"
          >
            <h4 class="text-white font-semibold mb-1">
              {{ value.title }}
            </h4>
            <p class="text-gray-400 text-sm">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { SITE_NAME } from '~/constants/index'

// SEO Meta Tags
useHead({
  title: `About - ${SITE_NAME}`,
  meta: [
    {
      name: 'description',
      content: `Learn more about the ${SITE_NAME}, our mission, and our values.`,
    },
    {
      property: 'og:title',
      content: `About - ${SITE_NAME}`,
    },
    {
      property: 'og:description',
      content: `Learn more about the ${SITE_NAME}, our mission, and our values.`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    { name: 'robots', content: 'index, follow' },
  ],
})

const values = [
  {
    title: 'Quality First',
    description: 'Every course is reviewed by experts to ensure the highest standard of content.',
  },
  {
    title: 'Accessibility',
    description: 'We design our platform to be usable by everyone, regardless of ability.',
  },
  {
    title: 'Community',
    description: 'Learning is better together. Join a global community of passionate learners.',
  },
  {
    title: 'Innovation',
    description: 'We constantly update our platform with the latest technology and teaching methods.',
  },
]
</script>
