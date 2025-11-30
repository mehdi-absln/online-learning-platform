<template>
  <div
    class="flex flex-col items-center justify-center text-center py-36 gap-y-4 bg-gradient-to-r from-[#1F1F1E] via-[#282828] to-primary/60 shadow-[inset_0_0_40px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm rounded-2xl"
  >
    <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Courses</h1>
    <Breadcrumb :crumbs="breadcrumbCrumbs" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  breadcrumbCrumbs: { name: string; path: string }[]
}

defineProps<Props>()
</script>
