<template>
  <nav
    class="flex px-4 py-2 text-sm"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-300"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
          Home
        </NuxtLink>
      </li>
      <li
        v-for="(crumb, index) in crumbs"
        :key="index"
        class="inline-flex items-center"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <NuxtLink
            :to="crumb.path"
            class="ml-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-300"
            :class="{ 'text-primary': index === crumbs.length - 1 }"
          >
            {{ crumb.name }}
          </NuxtLink>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  path: string
}
interface BreadcrumbProps {
  crumbs: BreadcrumbItem[]
}

defineProps<BreadcrumbProps>()
</script>
