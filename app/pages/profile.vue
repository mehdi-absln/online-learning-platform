<template>
  <main
    id="main-content"
    class="container py-8"
    aria-labelledby="profile-heading"
  >
    <h1
      id="profile-heading"
      class="text-2xl font-bold text-white mb-8 flex items-center gap-2"
    >
      <span
        class="w-1 h-6 bg-primary rounded-full"
        aria-hidden="true"
      />
      Your Profile
    </h1>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- کارت اطلاعات کاربری -->
      <section
        class="bg-dark-surface border border-dark-divider rounded-lg p-6"
        aria-labelledby="account-heading"
      >
        <h2
          id="account-heading"
          class="text-lg font-semibold text-white mb-4"
        >
          Account Details
        </h2>

        <dl class="space-y-3">
          <div>
            <dt class="text-gray-400 text-sm">
              Username
            </dt>
            <dd class="text-white font-medium">
              {{ userStore.user?.username || '—' }}
            </dd>
          </div>
          <div>
            <dt class="text-gray-400 text-sm">
              Email
            </dt>
            <dd class="text-white font-medium">
              {{ userStore.user?.email || '—' }}
            </dd>
          </div>
          <div>
            <dt class="text-gray-400 text-sm">
              Role
            </dt>
            <dd class="text-white font-medium capitalize">
              {{ userStore.user?.role || 'student' }}
            </dd>
          </div>
        </dl>
      </section>

      <!-- کارت تغییر رمز عبور -->
      <section
        class="bg-dark-surface border border-dark-divider rounded-lg p-6"
        aria-labelledby="password-heading"
      >
        <h2
          id="password-heading"
          class="text-lg font-semibold text-white mb-4"
        >
          Change Password
        </h2>

        <form
          class="space-y-4"
          @submit.prevent="onSubmit"
        >
          <FormInput
            id="currentPassword"
            v-model="form.currentPassword"
            label="Current Password"
            type="password"
            :error="errors.currentPassword"
            required
            @blur="handleBlur('currentPassword')"
          />

          <FormInput
            id="newPassword"
            v-model="form.newPassword"
            label="New Password"
            type="password"
            :error="errors.newPassword"
            required
            @blur="handleBlur('newPassword')"
          />

          <FormInput
            id="confirmPassword"
            v-model="form.confirmPassword"
            label="Confirm New Password"
            type="password"
            :error="errors.confirmPassword"
            required
            @blur="handleBlur('confirmPassword')"
          />

          <!-- پیام موفقیت -->
          <div
            v-if="successMessage"
            role="status"
            class="text-green-500 text-sm"
          >
            {{ successMessage }}
          </div>

          <!-- پیام خطا -->
          <div
            v-if="errorMessage"
            role="alert"
            class="text-primary text-sm"
          >
            {{ errorMessage }}
          </div>

          <SubmitButton
            text="Update Password"
            :loading="isChangingPassword"
            :disabled="!isFormValid || isChangingPassword"
            loading-text="Updating..."
          />
        </form>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useToast } from '~/composables/useToast'
import { getErrorMessage } from '~/utils/error-helpers'
import { useZodValidation } from '~/composables/useZodValidation'
import { changePasswordSchema } from '~/schemas/auth'
import type { ChangePasswordFormData } from '~/schemas/auth'
import FormInput from '~/components/ui/FormInput.vue'
import SubmitButton from '~/components/ui/SubmitButton.vue'

definePageMeta({
  requiresAuth: true,
})

useHead({
  title: 'Profile - Online Learning Platform',
  meta: [
    { name: 'description', content: 'Manage your profile and change your password' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const userStore = useUserStore()
const toast = useToast()

// مقادیر اولیه فرم
const initialData: ChangePasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const {
  form,
  errors,
  validateAll,
  handleBlur,
  isFormValid,
  reset,
} = useZodValidation(changePasswordSchema, initialData, {
  validateOnBlur: true,
})

const isChangingPassword = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const onSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  const isValid = validateAll()
  if (!isValid) return

  isChangingPassword.value = true
  try {
    const response = await $fetch<{ success: boolean, message?: string, error?: string }>(
      '/api/auth/change-password',
      {
        method: 'POST',
        body: {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      },
    )

    if (response?.success) {
      successMessage.value = 'Password updated successfully.'
      toast.success('Password changed')
      reset()
    }
    else {
      errorMessage.value = response.message || response.error || 'Failed to change password.'
    }
  }
  catch (error: unknown) {
    errorMessage.value = getErrorMessage(error)
  }
  finally {
    isChangingPassword.value = false
  }
}
</script>
