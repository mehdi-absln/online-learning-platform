export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  // If not authenticated, fetch user to check session
  if (!userStore.isAuthenticated) {
    await userStore.fetchUser()
  }

  // FIRST: If going to /auth pages while authenticated, redirect to home
  if (to.path.startsWith('/auth') && userStore.isAuthenticated) {
    return navigateTo('/home')
  }

  // SECOND: If route requires auth and user is not authenticated, redirect to /auth
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return navigateTo('/auth')
  }
})
