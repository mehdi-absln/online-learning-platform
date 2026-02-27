<template>
  <div
    class="relative overflow-hidden bg-dark-surface border border-dark-divider/50 rounded-2xl p-6 transition-all duration-300 hover:border-dark-divider hover:shadow-lg hover:shadow-black/20 group"
  >
    <!-- Subtle gradient glow -->
    <div
      class="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
      :class="glowColor"
    />

    <!-- Icon -->
    <div
      class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
      :class="iconBg"
      role="img"
      :aria-label="`Icon for ${label}`"
    >
      <span class="text-xl" aria-hidden="true">{{ icon }}</span>
    </div>

    <!-- Value -->
    <p class="text-3xl font-bold text-white mb-1 tabular-nums">
      {{ displayValue }}
    </p>

    <!-- Label -->
    <p class="text-sm text-gray-400 font-medium">
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: number
  color?: 'primary' | 'green' | 'blue' | 'amber'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const colorMap = {
  primary: {
    iconBg: 'bg-primary/15 text-primary',
    glow: 'bg-primary',
  },
  green: {
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    glow: 'bg-emerald-500',
  },
  blue: {
    iconBg: 'bg-blue-500/15 text-blue-400',
    glow: 'bg-blue-500',
  },
  amber: {
    iconBg: 'bg-amber-500/15 text-amber-400',
    glow: 'bg-amber-500',
  },
}

const iconBg = computed(() => colorMap[props.color].iconBg)
const glowColor = computed(() => colorMap[props.color].glow)

// Animated counter
const displayValue = ref(0)

onMounted(() => {
  const duration = 800
  const start = performance.now()
  const target = props.value

  function animate(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.round(eased * target)
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
})

// Watch for value changes
watch(() => props.value, (newVal) => {
  displayValue.value = newVal
})
</script>
