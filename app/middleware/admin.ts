// app/middleware/admin.ts
export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()

  // 1. اگر اصلاً لاگین نیست → صفحه لاگین
  if (!userStore.isAuthenticated) {
    return navigateTo('/auth/signin')
  }

  const role = userStore.user?.role

  // 2. اگر نقش قابل قبول برای پنل ادمین نیست → داشبورد
  if (role !== 'admin' && role !== 'superadmin' && role !== 'instructor') {
    return navigateTo('/dashboard')
  }

  // 3. اگر مدرس (instructor) قصد ورود به مدیریت کاربران را دارد → ادمین اصلی
  if (role === 'instructor' && to.path.startsWith('/admin/users')) {
    return navigateTo('/admin') // یا return navigateTo('/dashboard')
  }
})
