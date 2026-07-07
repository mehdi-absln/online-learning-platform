<template>
  <section
    ref="sectionRef"
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
            {{ displayed[index] }}
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

interface StatMeta {
  target: number
  hasComma: boolean
  suffix: string
}

const sectionRef = ref<HTMLElement | null>(null)
// Seed with the real values so SSR / no-JS still shows the correct numbers.
const displayed = ref<string[]>(STATS.map(s => s.value))
const animating = ref(false)

const meta: StatMeta[] = STATS.map((s) => {
  const hasPercent = s.value.trim().endsWith('%')
  const numericPart = s.value.replace(/[^0-9.]/g, '')
  return {
    target: Number(numericPart) || 0,
    hasComma: s.value.includes(','),
    suffix: hasPercent ? '%' : '',
  }
})

function format(value: number, m: StatMeta): string {
  const rounded = Math.round(value)
  const base = m.hasComma ? rounded.toLocaleString('en-US') : String(rounded)
  return base + m.suffix
}

function animate(): void {
  if (animating.value) return
  animating.value = true

  const duration = 1500
  const start = performance.now()
  // ease-out cubic: fast start, gentle finish.
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

  const step = (now: number): void => {
    const elapsed = now - start
    const t = Math.min(elapsed / duration, 1)
    const eased = easeOut(t)
    displayed.value = meta.map(m => format(m.target * eased, m))
    if (t < 1) {
      requestAnimationFrame(step)
    }
    else {
      animating.value = false
    }
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  const el = sectionRef.value
  if (!el) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animate()
        observer.disconnect()
        break
      }
    }
  }, { threshold: 0.3 })

  observer.observe(el)
})
</script>
