<template>
  <main
    class="error-page"
    aria-labelledby="error-title"
  >
    <div class="error-content">
      <!-- Error Code (Decorative) -->
      <div
        class="error-code"
        aria-hidden="true"
      >
        {{ error?.statusCode || 500 }}
      </div>

      <!-- Title -->
      <h1
        id="error-title"
        class="error-title"
      >
        {{ errorTitle }}
      </h1>

      <!-- Message -->
      <p class="error-message">
        {{ errorMessage }}
      </p>

      <!-- Actions -->
      <div class="error-actions">
        <button
          class="btn-primary"
          @click="handleGoHome"
        >
          Go to Homepage
        </button>

        <a
          href="/courses"
          class="browse-link"
        >
          Browse Courses <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const errorTitle = computed(() => {
  const code = props.error?.statusCode || 500
  return code === 404 ? 'Page Not Found' : 'Something Went Wrong'
})

const errorMessage = computed(() => {
  const code = props.error?.statusCode || 500
  return code === 404
    ? 'The page you\'re looking for doesn\'t exist or has been moved.'
    : 'An unexpected error occurred. Please try again later.'
})

const handleGoHome = () => clearError({ redirect: '/' })

useSeoMeta({
  title: () => `${errorTitle.value} — Online Learning Platform`,
  robots: 'noindex, nofollow',
})
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #191918;
  padding: 1.5rem;
}

.error-content {
  text-align: center;
  max-width: 480px;
}

.error-code {
  font-family: 'Antonio', sans-serif;
  font-size: 8rem;
  font-weight: 700;
  line-height: 1;
  color: #EC5252;
  margin: 0 0 0.5rem;
}

.error-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 0.75rem;
}

.error-message {
  font-size: 1rem;
  color: #9ca3af;
  line-height: 1.6;
  margin: 0 0 2.5rem;
}

.error-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.browse-link {
  color: #EC5252;
  font-weight: 500;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.browse-link:hover {
  color: #ff4830;
}

/* Focus states for accessibility */
.btn-primary:focus-visible,
.browse-link:focus-visible {
  outline: 2px solid #EC5252;
  outline-offset: 3px;
  border-radius: 4px;
}

@media (min-width: 640px) {
  .error-code {
    font-size: 10rem;
  }

  .error-title {
    font-size: 2rem;
  }
}
</style>
