// app/middleware/admin.ts
export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()

  if (!userStore.isAuthenticated) {
    return navigateTo('/auth/signin')
  }

  const role = userStore.user?.role

  if (role !== 'admin' && role !== 'superadmin' && role !== 'instructor') {
    return navigateTo('/dashboard')
  }

  if (role === 'instructor' && to.path.startsWith('/admin/users')) {
    return navigateTo('/admin')
  }
})
