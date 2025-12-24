<template>
  <div class="space-y-10">
    <h3 class="text-xl font-bold text-primary font-antonio">
      Student Ratings & Reviews
    </h3>

    <!-- Rating Summary -->
    <div
      v-if="reviews && reviews.length > 0"
      class="flex flex-col md:flex-row items-start md:items-center gap-6"
    >
      <!-- Average Rating Box -->
      <div class="bg-dark-bg p-8 border border-dark-divider rounded-2xl flex flex-col items-center justify-center">
        <div class="text-6xl font-semibold text-primary">
          {{ averageRating }}
        </div>
        <div class="flex items-center mt-4">
          <StarRating :rating="parseFloat(averageRating)" />
        </div>
        <div class="text-base text-white/90 mt-2 capitalize">
          total {{ reviews.length }} ratings
        </div>
      </div>

      <!-- Rating Distribution -->
      <div class="space-y-4 flex-1 w-full">
        <div
          v-for="star in STAR_LEVELS"
          :key="star"
          class="flex items-center"
        >
          <StarRating
            :rating="0"
            :max-stars="1"
            :show-empty="true"
            class="mx-2"
          />
          <span class="text-sm text-white/70 w-4">{{ star }}</span>
          <div class="flex-1 bg-dark-bg rounded-full h-2">
            <div
              class="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${getStarPercentage(star)}%` }"
            />
          </div>
          <span class="text-sm text-white/70 ml-4 min-w-[80px] text-right">
            {{ ratingDistribution[star] }}&nbsp;Ratings
          </span>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div
      v-if="reviews && reviews.length > 0"
      class="space-y-6"
    >
      <div class="divide-y divide-dark-divider">
        <article
          v-for="review in reviews"
          :key="review.date"
          class="flex flex-col md:flex-row md:items-start gap-4 py-8"
        >
          <!-- Reviewer Info -->
          <div class="flex-shrink-0 md:w-40">
            <h4 class="font-semibold text-white">
              {{ review.reviewerName }}
            </h4>
            <time
              :datetime="review.date"
              class="text-white/70 text-sm mt-1 block"
            >
              {{ formatDate(review.date) }}
            </time>
          </div>

          <!-- Review Content -->
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <StarRating :rating="review.rating" />
            </div>
            <p class="text-white/90 leading-relaxed">
              {{ review.comment }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-white/30 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <p class="text-white/70">
        No reviews yet for this course.
      </p>
      <p class="text-white/50 text-sm mt-2">
        Be the first to share your experience!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarRating from '~/components/ui/StarRating.vue'
import type { Review } from '~/types/shared/courses'

interface Props {
  reviews: Review[] | undefined
}

const props = defineProps<Props>()

// Constants
const STAR_LEVELS = [5, 4, 3, 2, 1] as const

// Computed
const averageRating = computed(() => {
  if (!props.reviews || props.reviews.length === 0) return '0.0'
  const total = props.reviews.reduce((sum, review) => sum + review.rating, 0)
  return (total / props.reviews.length).toFixed(1)
})

const ratingDistribution = computed(() => {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  if (props.reviews) {
    props.reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating] = (distribution[review.rating] ?? 0) + 1
      }
    })
  }

  return distribution
})

// Methods
const getStarPercentage = (star: number): string => {
  if (!props.reviews || props.reviews.length === 0) return '0'
  const count = ratingDistribution.value[star] ?? 0
  return ((count / props.reviews.length) * 100).toFixed(1)
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>
