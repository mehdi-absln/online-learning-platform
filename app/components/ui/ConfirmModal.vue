<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="`confirm-title-${title}`"
        :aria-describedby="`confirm-desc-${title}`"
        @keydown="onKeydown"
      >
        <div
          ref="dialogRef"
          class="bg-dark-surface border border-dark-divider rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
        >
          <h3
            :id="`confirm-title-${title}`"
            class="text-lg font-semibold text-white mb-3"
          >
            {{ title }}
          </h3>
          <p
            :id="`confirm-desc-${title}`"
            class="text-gray-400 mb-6"
          >
            {{ message }}
          </p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg text-gray-300 bg-dark-bg border border-dark-divider hover:bg-dark-bg/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="emit('cancel')"
            >
              {{ cancelLabel }}
            </button>
            <button
              class="px-4 py-2 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              :class="variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-400' : 'bg-primary text-white hover:bg-opacity-90 focus-visible:outline-primary'"
              @click="emit('confirm')"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'default',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// Focus trap & Escape key
const dialogRef = ref<HTMLElement | null>(null)

watchEffect(() => {
  if (props.isOpen) {
    nextTick(() => {
      const firstFocusable
        = dialogRef.value?.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
      firstFocusable?.focus()
    })
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('cancel')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
