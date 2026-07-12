export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  // ───── Hydrate user state only when there is a real session to verify ─────
  // Skip the fetch entirely for visitors that have no accessToken cookie and no
  // previously-hydrated store state — saves one round-trip per navigation.
  if (!userStore.isAuthenticated) {
    const accessToken = useCookie('accessToken')
    if (accessToken.value) {
      await userStore.fetchUser()
    }
  }

  // ───── Fast path for unauthenticated users trying to access protected pages ─────
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Immediately redirect to sign in (don't wait for fetchUser)
    return navigateTo('/auth/signin?redirected=please_login')
  }

  // If going to /auth pages while authenticated, redirect to home
  if (to.path.startsWith('/auth') && userStore.isAuthenticated) {
    return navigateTo('/home')
  }
})
