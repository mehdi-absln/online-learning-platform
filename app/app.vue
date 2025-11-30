<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Main app component with TypeScript support
useSeoMeta({
  title: 'Online Learning Platform',
  description:
    'Empowering learners worldwide with quality education and innovative learning solutions.',
  ogTitle: 'Online Learning Platform',
  ogDescription:
    'Empowering learners worldwide with quality education and innovative learning solutions.',
  ogImage: '/images/banner.jpg',
  ogType: 'website',
  ogUrl: 'https://your-learning-platform.com',
  twitterCard: 'summary_large_image'
})
</script>
