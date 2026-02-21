export default defineNuxtRouteMiddleware(async (to) => {
  console.log('🔵 ============ AUTH MIDDLEWARE ============')
  console.log('🔵 Going to:', to.path)

  const userStore = useUserStore()
  console.log('🔵 isAuthenticated BEFORE fetch:', userStore.isAuthenticated)
  console.log('🔵 user BEFORE fetch:', userStore.user)

  if (!userStore.isAuthenticated) {
    console.log('🔵 Fetching user...')
    await userStore.fetchUser()
  }

  console.log('🟢 isAuthenticated AFTER fetch:', userStore.isAuthenticated)
  console.log('🟢 user AFTER fetch:', userStore.user)

  // Check /auth route
  console.log('🔵 Checking if /auth route...')
  if (to.path.startsWith('/auth')) {
    console.log('🟡 YES, going to /auth')
    if (userStore.isAuthenticated) {
      console.log('🔴 User is authenticated! Redirecting to /home...')
      return navigateTo('/home')
    }
  }

  console.log('🟢 Middleware finished, no redirect')

  // SECOND: If route requires auth and user is not authenticated, redirect to /auth
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return navigateTo('/auth')
  }
})
