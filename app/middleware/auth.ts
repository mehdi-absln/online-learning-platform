import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side since Pinia doesn't work server-side in middleware
  if (process.client) {
    const userStore = useUserStore()
    
    // Check if the route requires authentication
    const requiresAuth = to.meta.requiresAuth === true
    
    // If user is already authenticated, continue
    if (userStore.isAuthenticated && userStore.user) {
      // User is authenticated, allow access
      return
    }

    // Try to fetch user if we have tokens in cookies (user might have been logged in from previous session)
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
  }
})