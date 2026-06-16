export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  // ───── Ensure user state is loaded first ─────
  if (!userStore.isAuthenticated) {
    await userStore.fetchUser()
  }

  // ───── Fast path for unauthenticated users trying to access protected pages ─────
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Immediately redirect to sign in (don't wait for fetchUser)
    return navigateTo('/auth/signin?redirected=please_login')
  }

  // Fetch enrollments if authenticated and not already fetched (needed for lesson access checks)
  if (userStore.isAuthenticated && !userStore.enrollmentsFetched) {
    await userStore.fetchEnrollments()
  }

  // If going to /auth pages while authenticated, redirect to home
  if (to.path.startsWith('/auth') && userStore.isAuthenticated) {
    return navigateTo('/home')
  }
})
