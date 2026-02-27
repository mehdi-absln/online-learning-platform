<script setup lang="ts">
defineProps<{
  title: string
  message?: string
  actionLabel?: string
  actionTo?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <section
    role="status"
    aria-labelledby="empty-state-title"
    class="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    <!-- Icon Slot (default: book icon) -->
    <div
      class="w-20 h-20 mb-6 text-primary/30"
      aria-hidden="true"
    >
      <slot name="icon">
        <IconBookOpen class="w-full h-full" />
      </slot>
    </div>

    <!-- Title -->
    <h2
      id="empty-state-title"
      class="text-xl font-bold text-white mb-2"
    >
      {{ title }}
    </h2>

    <!-- Optional Message -->
    <p
      v-if="message"
      class="text-gray-400 mb-6 max-w-md"
    >
      {{ message }}
    </p>

    <!-- Action: Link or Button -->
    <NuxtLink
      v-if="actionTo"
      :to="actionTo"
      class="btn-primary"
    >
      {{ actionLabel || 'Get Started' }}
    </NuxtLink>

    <button
      v-else-if="actionLabel"
      class="btn-primary"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </section>
</template>
