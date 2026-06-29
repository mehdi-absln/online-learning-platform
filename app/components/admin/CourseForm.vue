<template>
  <div class="bg-dark-surface p-6 rounded-lg border border-dark-divider">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-dark-divider">
      <div class="w-10 h-10 bg-dark-bg rounded-lg flex items-center justify-center">
        <IconBookOpen
          class="w-5 h-5 text-primary"
          aria-hidden="true"
        />
      </div>
      <div>
        <h2 class="text-xl font-bold text-white">
          {{ initialData ? 'Edit Course' : 'Create Course' }}
        </h2>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ initialData ? `Editing "${initialData.title}"` : 'Fill in the details for your new course.' }}
        </p>
      </div>
    </div>

    <form
      class="space-y-6"
      @submit.prevent="handleSubmit"
    >
      <!-- Title -->
      <div>
        <label
          for="title"
          class="block text-sm font-medium text-gray-300 mb-1"
        >Title *</label>
        <input
          id="title"
          :value="courseForm.title"
          type="text"
          required
          aria-required="true"
          minlength="3"
          class="w-full bg-dark-bg border rounded-md px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
          :class="getError('title') ? 'border-red-500' : 'border-dark-divider'"
          placeholder="e.g. Vue Mastery"
          @input="onTitleInput($event)"
          @blur="handleBlur('title')"
        >
        <p
          v-if="getError('title')"
          role="alert"
          class="text-red-400 text-sm mt-1"
        >
          {{ getError('title') }}
        </p>
      </div>

      <!-- Slug -->
      <div>
        <label
          for="slug"
          class="block text-sm font-medium text-gray-300 mb-1"
        >Slug *</label>
        <div class="flex items-center gap-2">
          <input
            id="slug"
            :value="courseForm.slug"
            type="text"
            required
            aria-required="true"
            aria-describedby="slug-hint"
            minlength="3"
            class="w-full min-w-0 bg-dark-bg border rounded-md px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
            :class="getError('slug') ? 'border-red-500' : 'border-dark-divider'"
            placeholder="e.g. vue-mastery"
            @input="onSlugInput($event)"
            @blur="handleBlur('slug')"
          >
          <span
            id="slug-hint"
            class="text-xs text-gray-500 whitespace-nowrap hidden sm:inline"
          >
            {{ initialData ? '(enter custom slug)' : '(auto-generate)' }}
          </span>
        </div>
        <p
          v-if="getError('slug')"
          role="alert"
          class="text-red-400 text-sm mt-1"
        >
          {{ getError('slug') }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-300 mb-1"
        >Description *</label>
        <textarea
          id="description"
          :value="courseForm.description"
          required
          aria-required="true"
          rows="4"
          class="w-full bg-dark-bg border rounded-md px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
          :class="getError('description') ? 'border-red-500' : 'border-dark-divider'"
          placeholder="Detailed course description..."
          @input="onDescriptionInput($event)"
          @blur="handleBlur('description')"
        />
        <p
          v-if="getError('description')"
          role="alert"
          class="text-red-400 text-sm mt-1"
        >
          {{ getError('description') }}
        </p>
      </div>

      <!-- Price & Status Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Price -->
        <div>
          <label
            for="price"
            class="block text-sm font-medium text-gray-300 mb-1"
          >Price *</label>
          <div class="relative">
            <span
              class="absolute left-3 top-2 text-gray-400"
              aria-hidden="true"
            >$</span>
            <input
              id="price"
              :value="courseForm.price"
              type="number"
              step="0.01"
              min="0"
              required
              aria-required="true"
              class="w-full bg-dark-bg border rounded-md pl-8 pr-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
              :class="getError('price') ? 'border-red-500' : 'border-dark-divider'"
              placeholder="0.00"
              @input="onPriceInput($event)"
              @blur="handleBlur('price')"
            >
          </div>
          <p
            v-if="getError('price')"
            role="alert"
            class="text-red-400 text-sm mt-1"
          >
            {{ getError('price') }}
          </p>
        </div>

        <!-- Status -->
        <fieldset>
          <legend class="block text-sm font-medium text-gray-300 mb-2">
            Status
          </legend>
          <div class="flex items-center gap-6">
            <!-- Published -->
            <label class="flex items-center cursor-pointer group">
              <div class="relative mr-3">
                <input
                  type="radio"
                  name="status"
                  :checked="courseForm.isPublished === true"
                  class="sr-only peer"
                  @change="handleChange('isPublished', true)"
                >
                <span
                  class="w-5 h-5 rounded-full border transition-colors flex items-center justify-center peer-focus:ring-2 peer-focus:ring-primary/50 peer-focus:ring-offset-2 peer-focus:ring-offset-dark-surface"
                  :class="courseForm.isPublished === true
                    ? 'border-primary bg-primary'
                    : 'border-dark-divider bg-dark-surface group-hover:border-gray-500'"
                >
                  <svg
                    v-show="courseForm.isPublished === true"
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </div>
              <span class="text-sm text-white">Published</span>
            </label>

            <!-- Draft -->
            <label class="flex items-center cursor-pointer group">
              <div class="relative mr-3">
                <input
                  type="radio"
                  name="status"
                  :checked="courseForm.isPublished === false"
                  class="sr-only peer"
                  @change="handleChange('isPublished', false)"
                >
                <span
                  class="w-5 h-5 rounded-full border transition-colors flex items-center justify-center peer-focus:ring-2 peer-focus:ring-primary/50 peer-focus:ring-offset-2 peer-focus:ring-offset-dark-surface"
                  :class="courseForm.isPublished === false
                    ? 'border-primary bg-primary'
                    : 'border-dark-divider bg-dark-surface group-hover:border-gray-500'"
                >
                  <svg
                    v-show="courseForm.isPublished === false"
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </div>
              <span class="text-sm text-white">Draft</span>
            </label>
          </div>
        </fieldset>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 pt-4 border-t border-dark-divider">
        <button
          type="button"
          class="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded focus:outline-none focus:ring-2 focus:ring-white/50"
          :disabled="isLoading"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <UiSubmitButton
          :loading="isLoading"
          :disabled="isLoading || !isValid"
          text="Save Course"
          loading-text="Saving..."
          :block="false"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CourseFormInitialData } from '~/types/forms/course-form'
import IconBookOpen from '~/components/icons/IconBookOpen.vue'
import { useZodValidation } from '~/composables/useZodValidation'
import { courseSchema, type CourseFormData } from '~/schemas/admin'

const props = defineProps<{
  initialData?: CourseFormInitialData | null
  isLoading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: CourseFormData]
  cancel: []
}>()

const {
  form: courseForm,
  isValid,
  getError,
  validateAll,
  handleBlur,
  handleChange,
  reset,
} = useZodValidation(courseSchema, {
  title: '',
  slug: '',
  description: '',
  price: 0,
  isPublished: true,
}, {
  autoValidate: true,
  validateOnBlur: true,
  debounceMs: 400,
})

// Slug generation helpers
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Event handlers for inputs to sync with composable's form
const onTitleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  handleChange('title', value)

  // Auto-generate slug only in create mode
  if (!props.initialData) {
    const newSlug = generateSlug(value)
    handleChange('slug', newSlug)
  }
}

const onSlugInput = (event: Event) => {
  handleChange('slug', (event.target as HTMLInputElement).value)
}

const onDescriptionInput = (event: Event) => {
  handleChange('description', (event.target as HTMLTextAreaElement).value)
}

const onPriceInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement).value
  const num = parseFloat(rawValue)
  handleChange('price', isNaN(num) ? rawValue : num)
}

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    reset({
      title: newVal.title,
      slug: newVal.slug,
      description: newVal.description || '',
      price: newVal.price || 0,
      isPublished: newVal.isPublished ?? true,
    })
  }
  else {
    reset()
  }
  nextTick(() => {
    validateAll()
  })
}, { immediate: true })

const handleSubmit = () => {
  const valid = validateAll()
  if (!valid) return
  emit('submit', { ...courseForm })
}
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
