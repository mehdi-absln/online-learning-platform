<template>
  <div class="rounded-xl overflow-hidden shadow-lg border border-dark-divider">
    <!-- Video Player -->
    <figure
      v-if="videoUrl"
      class="aspect-video bg-black relative"
      role="group"
      :aria-label="`Video player: ${title || 'Lesson video'}`"
    >
      <iframe
        :src="embedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        class="absolute inset-0 w-full h-full"
        :title="title || 'Lesson video'"
      />
    </figure>

    <!-- No Video Placeholder -->
    <div
      v-else
      class="aspect-video bg-gradient-to-br from-dark-surface to-dark-bg flex items-center justify-center"
      role="status"
      aria-label="No video available for this lesson"
    >
      <div class="text-center">
        <svg
          class="w-16 h-16 text-dark-divider mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-500">
          This lesson contains only text content
        </p>
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

// ───── Constants ─────
const YOUTUBE_EMBED_BASE = 'https://www.youtube.com/embed'
const YOUTUBE_PARAMS = '?rel=0&modestbranding=1'

// ───── Helpers ─────
function extractYouTubeId(url: string): string | null {
  if (url.includes('youtube.com/watch?v=')) {
    try {
      return new URL(url).searchParams.get('v')
    }
    catch {
      return null
    }
  }

  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0] || null
  }

  return null
}

// ───── Computed ─────
const embedUrl = computed(() => {
  if (!props.videoUrl) return ''

  const videoId = extractYouTubeId(props.videoUrl)

  if (videoId) {
    return `${YOUTUBE_EMBED_BASE}/${videoId}${YOUTUBE_PARAMS}`
  }

  return props.videoUrl
})
</script>
