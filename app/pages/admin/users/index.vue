<template>
  <section
    class="container py-8"
    aria-labelledby="user-management-heading"
  >
    <AdminTabs />
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1
        id="user-management-heading"
        class="text-2xl font-bold text-white flex items-center gap-2"
      >
        <IconUsers
          class="w-6 h-6"
          aria-hidden="true"
        />
        User Management
      </h1>
      <SearchInput
        v-model="searchQuery"
        wrapper-class="w-full sm:w-64"
        placeholder="Search by username..."
        label="Search users by username"
        :debounce="0"
      />
    </div>

    <div class="bg-dark-surface rounded-lg border border-dark-divider overflow-hidden">
      <!-- Loading -->
      <div
        v-if="isLoading"
        class="py-36 flex flex-col items-center justify-center"
      >
        <LoadingSpinner
          message="Loading users..."
          label="Loading users"
        />
      </div>

      <!-- Error -->
      <div
        v-else-if="fetchError"
        class="py-16"
      >
        <ErrorState
          :message="fetchError"
          @retry="fetchUsers"
        />
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredUsers.length === 0"
        class="py-16 text-center"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-bg border border-dark-divider mb-4">
          <IconUsers
            class="w-8 h-8 text-gray-500"
            aria-hidden="true"
          />
        </div>
        <h3 class="text-xl font-medium text-white mb-2">
          No users found
        </h3>
        <p class="text-gray-400">
          {{ searchQuery ? 'No users match your search.' : 'The user list is empty.' }}
        </p>
      </div>

      <div
        v-else
        class="overflow-x-auto"
      >
        <table
          class="w-full text-left text-sm text-gray-300"
          aria-label="User list"
        >
          <caption class="sr-only">
            List of all registered users
          </caption>
          <thead class="bg-dark-bg border-b border-dark-divider text-gray-400">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 font-medium"
              >
                Username
              </th>
              <th
                scope="col"
                class="px-6 py-4 font-medium"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-4 font-medium"
              >
                Role
              </th>
              <th
                scope="col"
                class="px-6 py-4 font-medium"
              >
                Joined
              </th>
              <th
                scope="col"
                class="px-6 py-4 font-medium text-right"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-dark-divider hover:bg-dark-bg/50 transition-colors last:border-0"
            >
              <td class="px-6 py-4 font-medium text-white truncate max-w-[120px]">
                {{ user.username }}
              </td>
              <td class="px-6 py-4">
                {{ user.email }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium border"
                  :class="roleBadgeClass(user.role)"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-4 items-center">
                  <template v-if="canManageUser(user)">
                    <button
                      class="text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline"
                      :aria-label="`Change role for ${user.username}`"
                      @click="openRoleModal(user)"
                    >
                      Change Role
                    </button>
                    <button
                      class="text-red-400 hover:text-red-300 transition-colors underline-offset-2 hover:underline"
                      :aria-label="`Delete ${user.username}`"
                      @click="openDeleteModal(user)"
                    >
                      Delete
                    </button>
                  </template>
                  <span
                    v-else-if="user.id !== currentAdminId && user.role === 'admin'"
                    class="text-gray-500 text-xs"
                  >(Admin)</span>
                  <span
                    v-else
                    class="text-gray-500 text-xs"
                  >(You)</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete User"
      :message="deleteWarningMessage"
      confirm-label="Delete"
      cancel-label="Keep User"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isRoleModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="role-modal-title"
          @keydown.escape="closeRoleModal"
        >
          <div class="bg-dark-surface border border-dark-divider rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3
              id="role-modal-title"
              class="text-lg font-semibold text-white mb-3"
            >
              Change Role for {{ selectedUser?.username }}
            </h3>
            <div class="mb-4">
              <label
                for="role-select"
                class="block text-sm font-medium text-gray-300 mb-2"
              >New Role</label>
              <select
                id="role-select"
                v-model="selectedNewRole"
                class="w-full bg-dark-bg border border-dark-divider rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                aria-required="true"
              >
                <option
                  v-for="role in availableRoles"
                  :key="role"
                  :value="role"
                >
                  {{ role }}
                </option>
              </select>
            </div>
            <div class="flex justify-end gap-3">
              <button
                class="px-4 py-2 rounded-lg text-gray-300 bg-dark-bg border border-dark-divider hover:bg-dark-bg/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                @click="closeRoleModal"
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="confirmRoleChange"
              >
                Change to {{ selectedNewRole }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import AdminTabs from '~/components/admin/AdminTabs.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import IconUsers from '~/components/icons/IconUsers.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import { useToast } from '~/composables/useToast'
import { getErrorMessage } from '~/utils/error-helpers'
import { useUserStore } from '~/stores/user'

interface UserItem {
  id: number
  username: string
  email: string
  role: 'admin' | 'instructor' | 'student' | 'superadmin'
  createdAt: string
}

useHead({
  title: 'User Management - Admin Panel',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

definePageMeta({
  middleware: ['admin'],
})

const toast = useToast()
const userStore = useUserStore()

const currentAdminId = computed(() => userStore.user?.id ?? null)
const isSuperAdmin = computed(() => userStore.user?.role === 'superadmin')

const allUsers = ref<UserItem[]>([])
const isLoading = ref(true)
const fetchError = ref<string | null>(null)
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return allUsers.value
  const q = searchQuery.value.toLowerCase().trim()
  return allUsers.value.filter(u => u.username.toLowerCase().includes(q))
})

const fetchUsers = async () => {
  isLoading.value = true
  fetchError.value = null
  try {
    const response = await $fetch<{ success: boolean, data?: UserItem[], message?: string }>('/api/admin/users')
    if (response.success && response.data) {
      allUsers.value = response.data
    }
    else {
      fetchError.value = response.message || 'Failed to fetch users'
    }
  }
  catch (error: unknown) {
    fetchError.value = getErrorMessage(error)
  }
  finally {
    isLoading.value = false
  }
}

// wait for auth
onMounted(() => {
  if (userStore.isAuthenticated) {
    fetchUsers()
  }
  else {
    const unwatch = watch(() => userStore.isAuthenticated, (authed) => {
      if (authed) {
        fetchUsers()
        unwatch()
      }
    })
  }
})

// ================== Helper: canManageUser ==================
function canManageUser(user: UserItem) {
  if (user.id === currentAdminId.value) return false
  // Only superadmin can manage other admins (including superadmin? we'll block via API anyway)
  if (user.role === 'admin' && !isSuperAdmin.value) return false
  // a superadmin can manage anyone except himself (already handled)
  return true
}

// ================== Delete user ==================
const isDeleteModalOpen = ref(false)
const selectedUserId = ref<number | null>(null)
const selectedUsername = ref('')
const deleteWarningMessage = ref('')

const openDeleteModal = (user: UserItem) => {
  selectedUserId.value = user.id
  selectedUsername.value = user.username

  if (user.role === 'instructor') {
    deleteWarningMessage.value = `Are you sure you want to delete ${user.username}? This user is an instructor. Deleting will remove their instructor profile, unassign them from all courses, and delete all their reviews, orders, and progress. This action cannot be undone.`
  }
  else {
    deleteWarningMessage.value = `Are you sure you want to delete ${user.username}? All their data (reviews, orders, progress) will be permanently removed. This action cannot be undone.`
  }

  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedUserId.value = null
  selectedUsername.value = ''
  deleteWarningMessage.value = ''
}

const confirmDelete = async () => {
  if (!selectedUserId.value) return
  try {
    const response = await $fetch<{ success: boolean, message?: string }>(
      `/api/admin/users/${selectedUserId.value}`,
      { method: 'DELETE' },
    )
    if (response.success) {
      toast.success('User deleted successfully')
      allUsers.value = allUsers.value.filter(u => u.id !== selectedUserId.value)
    }
    else {
      toast.error(response.message || 'Failed to delete user')
    }
  }
  catch (error: unknown) {
    toast.error(getErrorMessage(error))
  }
  finally {
    closeDeleteModal()
  }
}

// ================== Role change ==================
const availableRoles = ['admin', 'instructor', 'student'] as const

const isRoleModalOpen = ref(false)
const selectedUser = ref<UserItem | null>(null)
const selectedNewRole = ref<string>('student')

const openRoleModal = (user: UserItem) => {
  selectedUser.value = user
  selectedNewRole.value = user.role
  isRoleModalOpen.value = true

  nextTick(() => {
    document.getElementById('role-select')?.focus()
  })
}

const closeRoleModal = () => {
  isRoleModalOpen.value = false
  selectedUser.value = null
}

const confirmRoleChange = async () => {
  if (!selectedUser.value || !selectedNewRole.value) return
  try {
    const response = await $fetch<{ success: boolean, message?: string }>(
      `/api/admin/users/${selectedUser.value.id}`,
      {
        method: 'PUT',
        body: { role: selectedNewRole.value },
      },
    )
    if (response.success) {
      toast.success(`User role updated to ${selectedNewRole.value}`)
      const user = allUsers.value.find(u => u.id === selectedUser.value!.id)
      if (user) user.role = selectedNewRole.value as UserItem['role']
    }
    else {
      toast.error(response.message || 'Failed to update role')
    }
  }
  catch (error: unknown) {
    toast.error(getErrorMessage(error))
  }
  finally {
    closeRoleModal()
  }
}

const roleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-primary/20 text-primary border-primary/30'
    case 'instructor': return 'bg-blue-900/50 text-blue-400 border-blue-800'
    case 'student': return 'bg-green-900/50 text-green-400 border-green-800'
    default: return 'bg-gray-800 text-gray-400 border-dark-divider'
  }
}
</script>
