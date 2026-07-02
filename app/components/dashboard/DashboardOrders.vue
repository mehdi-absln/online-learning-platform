<template>
  <section
    v-if="recentOrders.length > 0"
    aria-labelledby="orders-heading"
  >
    <h2
      id="orders-heading"
      class="text-xl font-bold text-white mb-4"
    >
      Recent Orders
    </h2>
    <div class="bg-dark-surface border border-dark-divider/50 rounded-2xl overflow-hidden">
      <!-- Desktop table -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-left">
          <caption class="sr-only">
            List of recent orders
          </caption>
          <thead>
            <tr class="border-b border-dark-divider/50">
              <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Order
              </th>
              <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-divider/30">
            <tr
              v-for="order in recentOrders"
              :key="order.id"
              class="hover:bg-dark-bg/30 transition-colors"
            >
              <td class="px-5 py-4 text-sm font-medium text-white">
                #{{ order.id }}
              </td>
              <td class="px-5 py-4 text-sm text-gray-400">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-5 py-4 text-sm font-semibold text-white tabular-nums">
                ${{ Number(order.totalAmount).toFixed(2) }}
              </td>
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                  :class="statusClass(order.status)"
                >
                  <span aria-hidden="true">{{ statusIcon(order.status) }}</span>
                  {{ order.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="sm:hidden divide-y divide-dark-divider/50">
        <div
          v-for="order in recentOrders"
          :key="`mobile-${order.id}`"
          class="px-5 py-4 space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-white">Order #{{ order.id }}</span>
            <span
              class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              :class="statusClass(order.status)"
            >
              <span aria-hidden="true">{{ statusIcon(order.status) }}</span>
              {{ order.status }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ formatDate(order.createdAt) }}</span>
            <span class="text-sm font-semibold text-white tabular-nums">
              ${{ Number(order.totalAmount).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DashboardOrder } from '~/types/dashboard'

interface Props {
  recentOrders: DashboardOrder[]
}

defineProps<Props>()

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const statusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-400'
    case 'pending':
      return 'bg-amber-500/15 text-amber-400'
    case 'failed':
      return 'bg-red-500/15 text-red-400'
    default:
      return 'bg-gray-500/15 text-gray-400'
  }
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return '✅'
    case 'pending':
      return '⏳'
    case 'failed':
      return '❌'
    default:
      return '•'
  }
}
</script>
