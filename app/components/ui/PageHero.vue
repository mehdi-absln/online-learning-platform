<template>
  <section
    class="flex flex-col items-center justify-center text-center py-36 gap-y-4 bg-hero-shimmer"
    :aria-labelledby="heroTitleId"
  >
    <h1
      :id="heroTitleId"
      class="text-4xl md:text-5xl font-bold text-white mb-4"
    >
      {{ title }}
    </h1>

    <p
      v-if="subtitle"
      class="text-gray-300 text-lg max-w-2xl mx-auto mb-4"
    >
      {{ subtitle }}
    </p>

    <Breadcrumb :crumbs="breadcrumbCrumbs" />
  </section>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'

interface Props {
  title: string
  subtitle?: string
  breadcrumbCrumbs: { name: string, path: string }[]
}
const heroTitleId = useId()

defineProps<Props>()
</script>
