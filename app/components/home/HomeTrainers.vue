<template>
  <section
    class="py-16 md:py-32"
    aria-labelledby="trainers-heading"
  >
    <div class="container">
      <div class="text-center pb-10 md:pb-14">
        <p class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-2 md:pb-4">
          Trainers
        </p>
        <h2
          id="trainers-heading"
          class="text-3xl md:text-5xl font-antonio font-semibold text-white leading-snug md:leading-[4.7rem]"
        >
          Meet our top trainers
        </h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 md:gap-6">
        <div
          v-for="trainer in TRAINERS"
          :key="trainer.id"
          class="relative overflow-hidden group rounded-xl aspect-[3/4]"
        >
          <!-- Using NuxtImg for trainers -->
          <NuxtImg
            :src="trainer.image"
            :alt="trainer.name"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw sm:50vw lg:25vw"
          />
          <div class="absolute inset-0 bg-black/60 transition-all duration-300 p-6 flex flex-col items-start justify-end h-full">
            <div class="relative overflow-hidden group z-20 py-6 px-6 flex flex-col w-full">
              <div class="text-center w-full">
                <h3 class="text-white text-lg md:text-xl font-bold font-antonio cursor-pointer hover:text-[#021E40] transition-colors duration-300 line-clamp-1">
                  {{ trainer.name }}
                </h3>
                <span class="text-white text-xs uppercase pt-1 line-clamp-1">{{ trainer.role }}</span>
              </div>
              <div
                aria-hidden="true"
                class="absolute inset-0 w-1/5 h-full bg-primary transition-all duration-300 group-hover:w-full -z-10"
              />
              <div class="flex justify-center space-x-3 pt-4 w-full">
                <template
                  v-for="(social, index) in trainer.social"
                  :key="index"
                >
                  <a
                    v-if="socialIconMap[social.name]"
                    :href="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white transition-transform duration-300 hover:-translate-y-1"
                    :aria-label="social.name"
                  >
                    <component :is="socialIconMap[social.name]" />
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { TRAINERS } from '~/constants/home'
import IconFacebook from '~/components/icons/IconFacebook.vue'
import IconTwitter from '~/components/icons/IconTwitter.vue'
import IconLinkedIn from '~/components/icons/IconLinkedIn.vue'

const socialIconMap: Record<string, Component> = {
  Facebook: IconFacebook,
  Twitter: IconTwitter,
  LinkedIn: IconLinkedIn,
}
</script>
