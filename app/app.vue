<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- Global Toast -->
  <UiToast
    v-model="toast.state.isVisible"
    :message="toast.state.message"
    :type="toast.state.type"
    :action-link="toast.state.actionLink"
    :action-text="toast.state.actionText"
    :duration="toast.state.duration"
  />
</template>

<script setup lang="ts">
import { SITE_NAME } from '~/constants/index'

const toast = useToast()
// Main app component with TypeScript support
useSeoMeta({
  title: `${SITE_NAME}`,
  description:
    'Empowering learners worldwide with quality education and innovative learning solutions.',
  ogTitle: `${SITE_NAME}`,
  ogDescription:
    'Empowering learners worldwide with quality education and innovative learning solutions.',
  ogImage: '/images/banner.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>
