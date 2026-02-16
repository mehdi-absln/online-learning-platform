export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  // Check if the route requires authentication
  const requiresAuth = to.meta.requiresAuth === true

  // If user is already authenticated, continue
  if (userStore.isAuthenticated && userStore.user) {
    // User is authenticated, allow access
    return
  }

  // Try to fetch user if we have tokens in cookies (user might have been logged in from previous session)
  // This works both on client and server (if headers are forwarded in store)
  await userStore.fetchUser()

  // If still not authenticated and trying to access protected route
  if (requiresAuth && !userStore.isAuthenticated) {
    // Redirect to auth page
    return navigateTo('/auth')
  }

  // If user going to auth page but already authenticated, redirect to home
  if (to.path.startsWith('/auth') && userStore.isAuthenticated) {
    return navigateTo('/home')
  }
})
