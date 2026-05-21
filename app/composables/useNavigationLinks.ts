export function useNavigationLinks() {
  const userStore = useUserStore()

  const mainLinks = computed(() => {
    const links = [
      { to: '/home', label: 'Home' },
      { to: '/courses', label: 'Courses' },
    ]

    if (userStore.isAuthenticated) {
      links.push({ to: '/dashboard', label: 'Dashboard' })

      const role = userStore.user?.role
      if (role === 'instructor' || role === 'admin' || role === 'superadmin') {
        links.push({ to: '/admin', label: 'Admin' })
      }
    }

    links.push({ to: '/blogs', label: 'Blogs' }, { to: '/about', label: 'About' })

    return links
  })

  return { mainLinks }
}
