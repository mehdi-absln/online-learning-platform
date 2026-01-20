<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- Global Toast -->
  <Toast
    v-model="toast.state.isVisible"
    :message="toast.state.message"
    :type="toast.state.type"
    :action-link="toast.state.actionLink"
    :action-text="toast.state.actionText"
    :duration="toast.state.duration"
  />
</template>

<script setup lang="ts">
import Toast from '~/components/ui/Toast.vue'

const toast = useToast()
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
  twitterCard: 'summary_large_image',
})
</script>
