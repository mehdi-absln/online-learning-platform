<template>
  <Tabs
    :model-value="activeTabIndex"
    :tabs="adminTabs"
    aria-label="Admin panel navigation"
    @update:model-value="handleTabChange"
  />
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import Tabs from '~/components/ui/Tabs.vue'

const userStore = useUserStore()
const route = useRoute()

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

const activeTabIndex = computed(() => {
  if (route.path.startsWith('/admin/users')) return 1
  return 0
})

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
