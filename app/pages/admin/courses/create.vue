<template>
  <section
    class="container"
    aria-labelledby="create-course-heading"
  >
    <div class="mb-2">
      <UiBreadcrumb
        :crumbs="[
          { name: 'Admin', path: '/admin' },
          { name: 'Create Course', path: '' },
        ]"
      />
    </div>

    <div class="mx-auto max-w-3xl py-4">
      <h1
        id="create-course-heading"
        class="text-2xl font-bold text-white mb-6"
      >
        Create New Course
      </h1>
      <CourseForm
        :is-loading="isLoading"
        @submit="handleCreate"
        @cancel="goBack"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CourseApiResponse } from '~/types/course'
import { useToast } from '~/composables/useToast'
import CourseForm from '~/components/admin/CourseForm.vue'
import type { CourseFormData } from '~/schemas/admin'
import { getErrorMessage } from '~/utils/error-helpers'

useHead({
  title: 'Create Course - Admin Panel',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

definePageMeta({
  middleware: ['admin'],
})

const toast = useToast()
const isLoading = ref(false)

const handleCreate = async (formData: CourseFormData) => {
  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean, data?: CourseApiResponse, message?: string }>(
      '/api/admin/courses',
      {
        method: 'POST',
        body: formData,
      },
    )

    if (response.success && response.data) {
      toast.success('Course created! Redirecting...')
      await navigateTo('/admin')
    }
    else {
      toast.error(response.message || 'Failed to create course')
    }
  }
  catch (error: unknown) {
    toast.error(getErrorMessage(error))
  }
  finally {
    isLoading.value = false
  }
}

const goBack = () => {
  navigateTo('/admin')
}
</script>
