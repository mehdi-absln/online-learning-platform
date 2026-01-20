<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4"
        role="alert"
        aria-live="polite"
      >
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border"
          :class="typeClasses"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg
              v-if="type === 'warning'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else-if="type === 'success'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">
              {{ message }}
            </p>
            <NuxtLink
              v-if="actionLink"
              :to="actionLink"
              class="text-sm underline hover:no-underline mt-1 inline-block"
            >
              {{ actionText }}
            </NuxtLink>
          </div>

          <!-- Close -->
          <button
            class="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Close notification"
            @click="hide"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500/90 border-green-400/50 text-white'
    case 'warning':
      return 'bg-yellow-500/90 border-yellow-400/50 text-white'
    case 'error':
      return 'bg-red-500/90 border-red-400/50 text-white'
    default:
      return 'bg-dark-surface border-dark-divider text-white'
  }
})

let timeout: ReturnType<typeof setTimeout>

function hide() {
  isVisible.value = false
}

watch(isVisible, (visible) => {
  if (visible && props.duration > 0) {
    clearTimeout(timeout)
    timeout = setTimeout(hide, props.duration)
  }
})

onUnmounted(() => clearTimeout(timeout))
</script>
