<template>
  <Tabs
    :model-value="activeTabIndex"
    :tabs="adminTabs"
    aria-label="Admin panel navigation"
    @update:model-value="handleTabChange"
  />
  <!--
    محتوای tabpanel نمایش داده نمی‌شود چون هر تب به یک صفحه جداگانه می‌رود.
    کامپوننت Tabs در اینجا فقط برای UI و accessibility استفاده شده است.
  -->
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import Tabs from '~/components/ui/Tabs.vue'

const userStore = useUserStore()
const route = useRoute()

/**
 * تب‌ها بر اساس نقش کاربر فیلتر می‌شوند:
 * - instructor فقط Courses را می‌بیند
 * - admin / superadmin هر دو تب را می‌بینند
 */
const adminTabs = computed(() => {
  const role = userStore.user?.role ?? 'student'
  const tabs: { name: string, title: string, disabled?: boolean }[] = []

  if (['instructor', 'admin', 'superadmin'].includes(role)) {
    tabs.push({ name: 'courses', title: 'Courses' })
  }

  if (['admin', 'superadmin'].includes(role)) {
    tabs.push({ name: 'users', title: 'Users' })
  }

  return tabs
})

/**
 * ایندکس تب فعال بر اساس مسیر جاری
 */
const activeTabIndex = computed(() => {
  if (route.path.startsWith('/admin/users')) return 1
  return 0
})

/**
 * با کلیک روی هر تب، به مسیر متناظر هدایت می‌شویم
 */
const handleTabChange = (index: number) => {
  const tabs = adminTabs.value
  if (!tabs || index < 0 || index >= tabs.length) return

  const tab = tabs[index]
  if (tab) {
    const path = tab.name === 'courses' ? '/admin' : '/admin/users'
    navigateTo(path)
  }
}
</script>
