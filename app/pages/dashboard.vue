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
      <DashboardSkeleton
        v-if="loading"
        aria-busy="true"
        aria-live="polite"
      />

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

        <!-- ═══ 4. My Courses (Lazy loaded - below fold) ═══ -->
        <LazyDashboardMyCourses
          v-if="enrolledCourses.length > 0"
          :enrolled-courses="enrolledCourses"
        />

        <!-- ═══ 5. Bookmarked Lessons (Lazy loaded - below fold) ═══ -->
        <LazyDashboardBookmarks
          v-if="bookmarkedLessons.length > 0"
          :bookmarked-lessons="bookmarkedLessons"
        />

        <!-- ═══ 6. Recent Orders (Lazy loaded - below fold) ═══ -->
        <LazyDashboardOrders
          v-if="recentOrders.length > 0"
          :recent-orders="recentOrders"
        />

        <!-- ═══ Empty State ═══ -->
        <section
          v-if="enrolledCourses.length === 0"
          aria-label="No enrolled courses"
        >
          <UiEmptyState
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
      <UiErrorState
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
</script>
