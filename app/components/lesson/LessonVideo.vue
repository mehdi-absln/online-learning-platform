<template>
  <div class="rounded-xl overflow-hidden shadow-lg border border-dark-divider">
    <!-- Video Player -->
    <div v-if="videoUrl" class="aspect-video bg-black relative">
      <iframe
        :src="embedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        class="absolute inset-0 w-full h-full"
        :title="title"
      />
    </div>

    <!-- No Video Placeholder -->
    <div 
      v-else 
      class="aspect-video bg-gradient-to-br from-dark-surface to-dark-bg flex items-center justify-center"
    >
      <div class="text-center">
        <svg class="w-16 h-16 text-dark-divider mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500">This lesson contains only text content</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  videoUrl?: string
  title?: string
}

const props = defineProps<Props>()

const embedUrl = computed(() => {
  if (!props.videoUrl) return ''

  let url = props.videoUrl

  // Convert youtube.com/watch?v= format
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
  }

  // Convert youtu.be/ format
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
  }

  // Already embed format or other
  return url
})
</script>