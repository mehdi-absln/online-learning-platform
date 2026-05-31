<template>
  <section
    class="py-10 md:py-20"
    aria-label="Platform statistics"
  >
    <div class="container">
      <div class="flex flex-wrap justify-center gap-6 md:gap-8 text-center">
        <div
          v-for="(stat, index) in STATS"
          :key="index"
          class="flex-1 min-w-[140px] max-w-[300px] p-4 md:p-6"
          :aria-labelledby="`stat${index}-value stat${index}-desc`"
        >
          <div
            :id="`stat${index}-value`"
            class="text-3xl md:text-5xl font-bold text-primary mb-2 font-antonio"
          >
            {{ stat.value }}
          </div>
          <p
            :id="`stat${index}-desc`"
            class="text-white text-sm md:text-base pt-2"
          >
            {{ stat.description }}
          </p>
        </div>
      </div>
      <hr class="my-6 border-gray-700 block w-full">
    </div>
  </section>
</template>

<script setup lang="ts">
import { STATS } from '~/constants/home'
</script>
