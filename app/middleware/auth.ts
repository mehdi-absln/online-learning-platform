export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  const requiresAuth = to.meta.requiresAuth === true
  if (userStore.isAuthenticated && userStore.user) {
    return
  }
  await userStore.fetchUser()
  if (requiresAuth && !userStore.isAuthenticated) {
    return navigateTo('/auth')
  }
  if (to.path.startsWith('/auth') && userStore.isAuthenticated) {
    return navigateTo('/home')
  }
})
