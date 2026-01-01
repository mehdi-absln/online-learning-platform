<template>
  <div class="bg-dark-surface rounded-xl p-4 border border-dark-divider">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-bold text-white">Course Progress</h3>
      <span class="text-lg font-bold text-primary">{{ Math.round(progress) }}%</span>
    </div>
    
    <!-- Progress Bar -->
    <div class="h-3 bg-dark-bg rounded-full overflow-hidden mb-3">
      <div 
        class="h-full bg-gradient-to-r from-primary to-primary-alt rounded-full transition-all duration-700 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
    
    <!-- Stats -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-400">
        <span class="text-white font-medium">{{ completed }}</span> of {{ total }} lessons
      </span>
      <span v-if="remaining > 0" class="text-gray-400">
        {{ remaining }} lessons remaining
      </span>
      <span v-else class="text-green-400 font-medium">
        ✓ Completed
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number
  completed: number
  total: number
}

const props = defineProps<Props>()

const remaining = computed(() => props.total - props.completed)
</script>