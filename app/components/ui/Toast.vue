<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed top-24 right-6 z-[100] max-w-sm w-full shadow-2xl overflow-hidden rounded-2xl border border-dark-divider bg-dark-surface/90 backdrop-blur-md"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <!-- Progress Bar -->
        <div
          v-if="duration > 0"
          class="absolute bottom-0 left-0 h-1 bg-primary/30 w-full"
        >
          <div
            class="h-full bg-primary transition-all linear"
            :style="{ width: `${progress}%`, transitionDuration: `${tickInterval}ms` }"
          />
        </div>

        <div class="p-5 flex items-start gap-4">
          <!-- Icon Container -->
          <div
            class="flex-shrink-0 p-2 rounded-xl"
            :class="iconBgClass"
          >
            <!-- Success Icon -->
            <svg
              v-if="type === 'success'"
              class="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <!-- Error Icon -->
            <svg
              v-else-if="type === 'error'"
              class="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <!-- Warning Icon -->
            <svg
              v-else-if="type === 'warning'"
              class="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <!-- Info Icon -->
            <svg
              v-else
              class="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Text Content -->
          <div class="flex-1 min-w-0 pt-0.5">
            <h4
              class="text-sm font-bold text-white uppercase tracking-wider mb-1"
            >
              {{ typeLabel }}
            </h4>
            <p class="text-[15px] text-white/80 leading-relaxed">
              {{ message }}
            </p>
            <NuxtLink
              v-if="actionLink"
              :to="actionLink"
              class="mt-3 inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
              @click="hide"
            >
              {{ actionText }}
              <svg
                class="ml-1 w-4 h-4 transform transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </NuxtLink>
          </div>

          <!-- Close Button -->
          <button
            class="flex-shrink-0 -mt-1 -mr-1 p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            aria-label="Close notification"
            @click="hide"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  actionLink?: string
  actionText?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
})

const isVisible = defineModel<boolean>({ default: false })

const typeLabel = computed(() => {
  switch (props.type) {
    case 'success': return 'Success'
    case 'error': return 'Error'
    case 'warning': return 'Warning'
    default: return 'Information'
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-500 shadow-lg shadow-green-500/20'
    case 'error': return 'bg-red-500 shadow-lg shadow-red-500/20'
    case 'warning': return 'bg-yellow-500 shadow-lg shadow-yellow-500/20'
    default: return 'bg-primary shadow-lg shadow-primary/20'
  }
})

// Progress bar logic
const progress = ref(100)
const tickInterval = 50
let timer: ReturnType<typeof setInterval> | null = null

function hide() {
  isVisible.value = false
  if (timer) clearInterval(timer)
}

function startTimer() {
  if (props.duration <= 0) return

  progress.value = 100
  const step = (tickInterval / props.duration) * 100

  if (timer) clearInterval(timer)

  timer = setInterval(() => {
    progress.value -= step
    if (progress.value <= 0) {
      hide()
    }
  }, tickInterval)
}

watch(isVisible, (visible) => {
  if (visible) {
    startTimer()
  }
  else if (timer) {
    clearInterval(timer)
  }
})

// Reset timer if a new message arrives while toast is already visible
watch(() => props.message, () => {
  if (isVisible.value) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.linear {
  transition-timing-function: linear;
}
</style>
