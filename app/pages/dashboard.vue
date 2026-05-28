<template>
  <div class="min-h-screen">
    <div
      class="container py-8 lg:py-12 space-y-8 lg:space-y-10 animate-fade-in"
    >
      <!-- ═══ 1. Welcome Header ═══ -->
      <section aria-labelledby="dashboard-heading">
        <h1
          id="dashboard-heading"
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
        >
          Welcome back, {{ userName }}! 👋
        </h1>
        <p class="text-gray-400 mt-2 text-sm sm:text-base">
          {{ greeting }}
        </p>
        <div
          v-if="userStore.user?.role === 'admin' || userStore.user?.role === 'instructor' || userStore.user?.role === 'superadmin'"
          class="mt-4"
        >
          <NuxtLink
            to="/admin/courses/create"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <IconPlus
              class="w-4 h-4"
              aria-hidden="true"
            />
            Create New Course
          </NuxtLink>
        </div>
      </section>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="space-y-8"
        aria-busy="true"
        aria-live="polite"
      >
        <!-- Stats skeleton -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div
            v-for="i in 4"
            :key="i"
            class="bg-dark-surface border border-dark-divider/50 rounded-2xl p-6 animate-pulse"
            role="presentation"
          >
            <div class="w-12 h-12 bg-dark-bg rounded-xl mb-4" />
            <div class="w-16 h-8 bg-dark-bg rounded mb-1" />
            <div class="w-24 h-4 bg-dark-bg rounded" />
          </div>
        </div>
        <!-- Course skeleton -->
        <div
          class="bg-dark-surface border border-dark-divider/50 rounded-2xl p-8 animate-pulse"
          role="presentation"
        >
          <div class="flex gap-6">
            <div class="w-56 h-32 bg-dark-bg rounded-xl hidden sm:block" />
            <div class="flex-1 space-y-4">
              <div class="w-32 h-4 bg-dark-bg rounded" />
              <div class="w-48 h-6 bg-dark-bg rounded" />
              <div class="w-full h-2.5 bg-dark-bg rounded-full" />
              <div class="w-36 h-10 bg-dark-bg rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <template v-else-if="data">
        <!-- ═══ 2. Stats Cards ═══ -->
        <section aria-label="Learning statistics">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <!-- Note: Ensure DashboardStatsCard uses aria-hidden on icon -->
            <DashboardStatsCard
              icon="📚"
              label="Enrolled Courses"
              :value="stats.totalEnrolled"
              color="primary"
            />
            <DashboardStatsCard
              icon="✅"
              label="Completed Lessons"
              :value="stats.totalCompleted"
              color="green"
            />
            <DashboardStatsCard
              icon="🔄"
              label="In Progress"
              :value="stats.inProgress"
              color="blue"
            />
            <DashboardStatsCard
              icon="🔖"
              label="Bookmarked"
              :value="stats.totalBookmarked"
              color="amber"
            />
          </div>
        </section>

        <!-- ═══ 3. Continue Learning ═══ -->
        <section
          v-if="continueLearnCourse"
          aria-labelledby="continue-heading"
        >
          <h2
            id="continue-heading"
            class="text-xl font-bold text-white mb-4 flex items-center gap-2"
          >
            <span
              class="text-primary"
              aria-hidden="true"
            >▶</span>
            Continue Learning
          </h2>
          <ContinueLearningCard :course="continueLearnCourse" />
        </section>

        <!-- ═══ 4. My Courses ═══ -->
        <section
          v-if="enrolledCourses.length > 0"
          aria-labelledby="courses-heading"
        >
          <h2
            id="courses-heading"
            class="text-xl font-bold text-white mb-4"
          >
            My Courses
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <DashboardCourseCard
              v-for="course in enrolledCourses"
              :key="course.id"
              :course="course"
            />
          </div>
        </section>

        <!-- ═══ 5. Bookmarked Lessons ═══ -->
        <section
          v-if="bookmarkedLessons.length > 0"
          aria-labelledby="bookmarks-heading"
        >
          <h2
            id="bookmarks-heading"
            class="text-xl font-bold text-white mb-4"
          >
            <span aria-hidden="true">🔖</span> Bookmarked Lessons
          </h2>
          <div class="bg-dark-surface border border-dark-divider/50 rounded-2xl divide-y divide-dark-divider/50 overflow-hidden">
            <NuxtLink
              v-for="bookmark in bookmarkedLessons"
              :key="bookmark.lessonId"
              :to="`/courses/${bookmark.courseSlug}/lessons/${bookmark.lessonSlug}`"
              class="flex items-center gap-4 px-5 py-4 hover:bg-dark-bg/50 transition-colors group"
            >
              <span
                class="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                📖
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                  {{ bookmark.lessonTitle }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                  {{ bookmark.courseTitle }}
                </p>
              </div>
              <span
                class="text-gray-400 group-hover:text-primary transition-colors flex-shrink-0"
                aria-hidden="true"
              >
                →
              </span>
            </NuxtLink>
          </div>
        </section>

        <!-- ═══ 6. Recent Orders ═══ -->
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

        <!-- ═══ Empty State ═══ -->
        <section
          v-if="enrolledCourses.length === 0"
          aria-label="No enrolled courses"
        >
          <EmptyState
            title="Start Your Learning Journey!"
            message="Explore our courses and begin your path to mastery."
            action-to="/courses"
            action-label="Browse Courses"
          />
          <p class="text-sm text-gray-400 mt-6 text-center">
            Check out our
            <NuxtLink
              to="/courses?featured=true"
              class="text-primary hover:underline"
            >
              featured courses
            </NuxtLink>
            to get started
          </p>
        </section>
      </template>

      <!-- Error State -->
      <ErrorState
        v-else-if="error"
        message="Failed to load dashboard data."
        @retry="() => refresh()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconPlus from '~/components/icons/IconPlus.vue'

import { SITE_NAME } from '~/constants'

definePageMeta({
  requiresAuth: true,
})
useSeoMeta({
  title: `Dashboard — ${SITE_NAME}`,
  description: 'Track your learning progress...',
  robots: 'noindex, nofollow',
})

const userStore = useUserStore()
const {
  data,
  loading,
  error,
  refresh,
  enrolledCourses,
  stats,
  recentOrders,
  bookmarkedLessons,
  continueLearnCourse,
} = useDashboard()

const userName = computed(() => {
  return userStore.user?.username || 'Learner'
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready to learn something new today?'
  if (hour < 17) return 'Good afternoon! Keep the momentum going.'
  return 'Good evening! Great time to wrap up a lesson.'
})

// Order helpers
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
