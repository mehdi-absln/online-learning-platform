<template>
  <section
    class="container py-8"
    aria-labelledby="admin-panel-heading"
  >
    <AdminTabs />
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1
        id="admin-panel-heading"
        class="text-2xl font-bold text-white flex items-center gap-2"
      >
        <IconLock
          class="w-6 h-6"
          aria-hidden="true"
        />
        {{ pageTitle }}
      </h1>
      <NuxtLink
        to="/admin/courses/create"
        class="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        <span aria-hidden="true">+</span> Create Course
      </NuxtLink>
    </div>

    <div class="bg-dark-surface rounded-lg border border-dark-divider overflow-hidden">
      <!-- Loading -->
      <div
        v-if="isLoading"
        class="py-36 flex flex-col items-center justify-center"
      >
        <LoadingSpinner
          message="Loading courses..."
          label="Loading courses"
        />
      </div>

      <!-- Error -->
      <div
        v-else-if="fetchError"
        class="py-16"
      >
        <ErrorState
          :message="fetchError"
          @retry="fetchCourses"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="courses.length === 0"
        class="py-16 text-center"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-bg border border-dark-divider mb-4">
          <svg
            class="w-8 h-8 text-gray-500"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-white mb-2">
          No courses yet
        </h3>
        <p class="text-gray-400 mb-6">
          Get started by creating your first course.
        </p>
        <NuxtLink
          to="/admin/courses/create"
          class="inline-flex bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Create Course
        </NuxtLink>
      </div>

      <div
        v-else
        class="overflow-x-auto"
      >
        <table
          class="w-full text-left text-sm text-gray-300"
          aria-label="Course list"
        >
          <caption class="sr-only">
            List of all courses
          </caption>
          <thead class="bg-dark-bg border-b border-dark-divider text-gray-400">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 font-medium"
              >
                Title
              </th>
              <th
                scope="col"
                class="px-6 py-4 font-medium"
              >
                Price
              </th>
              <th
                scope="col"
                class="px-6 py-4 font-medium"
              >
                Status
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
              v-for="course in courses"
              :key="course.id"
              class="border-b border-dark-divider hover:bg-dark-bg/50 transition-colors last:border-0"
            >
              <td class="px-6 py-4 font-medium text-white truncate max-w-xs">
                {{ course.title }}
              </td>
              <td class="px-6 py-4">
                ${{ course.price }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="
                    course.isPublished
                      ? 'bg-green-900/50 text-green-400 border border-green-800'
                      : 'bg-gray-800 text-gray-400 border border-dark-divider'
                  "
                >
                  {{ course.isPublished ? 'Active' : 'Draft' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-4">
                  <NuxtLink
                    :to="`/admin/courses/${course.id}/edit`"
                    :aria-label="`Edit ${course.title}`"
                    class="text-blue-300 hover:text-blue-200 transition-colors underline-offset-2 hover:underline"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    class="text-red-400 hover:text-red-300 transition-colors underline-offset-2 hover:underline"
                    :aria-label="`Delete ${course.title}`"
                    @click="openDeleteModal(course.id, course.title)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Course"
      :message="`Are you sure you want to delete ${selectedCourseTitle}? This action cannot be undone.`"
      confirm-label="Delete"
      cancel-label="Keep Course"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import AdminTabs from '~/components/admin/AdminTabs.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import IconLock from '~/components/icons/IconLock.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import { useToast } from '~/composables/useToast'
import type { CourseApiResponse } from '~/types/course'
import { getErrorMessage } from '~/utils/error-helpers'
import { useUserStore } from '~/stores/user'

import { SITE_NAME } from '~/constants'

definePageMeta({
  middleware: ['admin'],
})

const toast = useToast()
const userStore = useUserStore()

useHead({
  title: () => {
    const role = userStore.user?.role ?? 'student'
    const prefix = role === 'instructor' ? 'My Courses' : 'Admin Panel'
    return `${prefix} - ${SITE_NAME}`
  },
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const courses = ref<CourseApiResponse[]>([])
const isLoading = ref(true)
const fetchError = ref<string | null>(null)

const currentRole = computed(() => userStore.user?.role ?? 'student')
const isInstructor = computed(() => currentRole.value === 'instructor')

const pageTitle = computed(() => (isInstructor.value ? 'My Courses' : 'Admin Panel'))

// Delete modal state
const isDeleteModalOpen = ref(false)
const selectedCourseId = ref<string | null>(null)
const selectedCourseTitle = ref('')

const fetchCourses = async () => {
  isLoading.value = true
  fetchError.value = null
  try {
    const response = await $fetch<{
      success: boolean
      data?: CourseApiResponse[]
      message?: string
    }>('/api/admin/courses')

    if (response.success && response.data) {
      courses.value = response.data
    }
    else {
      fetchError.value = response.message || 'Failed to fetch courses'
    }
  }
  catch (error: unknown) {
    fetchError.value = getErrorMessage(error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCourses()
})

const openDeleteModal = (id: string, title: string) => {
  selectedCourseId.value = id
  selectedCourseTitle.value = title
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedCourseId.value = null
  selectedCourseTitle.value = ''
}

const confirmDelete = async () => {
  if (!selectedCourseId.value) return
  const id = selectedCourseId.value

  try {
    const response = await $fetch<{
      success: boolean
      message?: string
    }>(`/api/admin/courses/${id}`, { method: 'DELETE' })

    if (response.success) {
      toast.success('Course deleted successfully')
      courses.value = courses.value.filter(c => c.id !== id)
    }
    else {
      toast.error(response.message || 'Failed to delete course')
    }
  }
  catch (error: unknown) {
    toast.error(getErrorMessage(error))
  }
  finally {
    closeDeleteModal()
  }
}
</script>
