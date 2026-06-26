<template>
  <section
    class="container"
    aria-labelledby="edit-course-heading"
  >
    <div class="mb-2">
      <Breadcrumb
        :crumbs="[
          { name: 'Admin', path: '/admin' },
          { name: 'Edit Course', path: '' },
        ]"
      />
    </div>

    <div class="max-w-3xl mx-auto py-4">
      <!-- Loading -->
      <div
        v-if="isFetching"
        class="flex justify-center items-center min-h-[calc(100vh-200px)]"
      >
        <LoadingSpinner message="Loading course..." />
      </div>

      <!-- Edit Form -->
      <template v-else-if="courseForForm">
        <h1
          id="edit-course-heading"
          class="text-2xl font-bold text-white mb-6"
        >
          Edit Course
        </h1>
        <CourseForm
          :initial-data="courseForForm"
          :is-loading="isLoading"
          @submit="handleUpdate"
          @cancel="goBack"
        />
      </template>

      <!-- Error State -->
      <div
        v-else
        class="py-16"
      >
        <ErrorState
          message="Failed to load course details."
          @retry="fetchCourse"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CourseApiResponse } from '~/types/course'
import type { CourseFormInitialData } from '~/types/forms/course-form'
import { useToast } from '~/composables/useToast'
import CourseForm from '~/components/admin/CourseForm.vue'
import type { CourseFormData } from '~/schemas/admin'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import { getErrorMessage } from '~/utils/error-helpers'

useHead({
  title: 'Edit Course - Admin Panel',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

definePageMeta({
  middleware: ['admin'],
})

const route = useRoute()
const toast = useToast()
const isLoading = ref(false)
const isFetching = ref(true)
const course = ref<CourseApiResponse>()

const courseId = route.params.id as string

const fetchCourse = async () => {
  isFetching.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data?: CourseApiResponse
      message?: string
    }>(`/api/admin/courses/${courseId}`)

    if (response.success && response.data) {
      course.value = response.data
    }
    else {
      toast.error(response.message || 'Course not found')
      await navigateTo('/admin')
    }
  }
  catch {
    course.value = undefined
  }
  finally {
    isFetching.value = false
  }
}

onMounted(() => {
  if (courseId) {
    fetchCourse()
  }
  else {
    navigateTo('/admin')
  }
})

const courseForForm = computed<CourseFormInitialData | null>(() => {
  if (!course.value) return null
  return {
    id: course.value.id,
    title: course.value.title,
    slug: course.value.slug,
    description: course.value.description || '',
    price: course.value.price,
    isPublished: course.value.isPublished ?? true,
  }
})

const handleUpdate = async (formData: CourseFormData) => {
  isLoading.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data?: CourseApiResponse
      message?: string
    }>(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      body: formData,
    })

    if (response.success) {
      toast.success('Course updated successfully!')
      await navigateTo('/admin')
    }
    else {
      toast.error(response.message || 'Failed to update course')
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
