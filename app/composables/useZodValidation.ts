import { reactive, ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { z } from 'zod'
import type { UseZodValidationOptions } from '~/types/types'

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

export interface ValidationResult<T extends Record<string, unknown>> {
  // State
  form: T
  errors: Ref<Record<string, string>>
  touchedFields: Ref<Set<string>>

  // Computed
  isValid: ComputedRef<boolean>
  isFormValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>

  // Validation
  validateField: (fieldName: keyof T, value?: unknown) => boolean
  debouncedValidateField: (fieldName: keyof T, value?: unknown) => void
  validateAll: () => boolean

  // Field helpers
  getError: (field: keyof T) => string
  setFieldError: (field: keyof T, error: string) => void
  clearFieldError: (field: keyof T) => void
  clearErrors: () => void

  // Touch helpers
  markFieldAsTouched: (field: keyof T) => void
  isFieldTouched: (field: keyof T) => boolean

  // Form helpers
  reset: (newData?: Partial<T>) => void
  setFormValues: (values: Partial<T>) => void

  // Event handlers
  handleBlur: (field: keyof T) => void
  handleChange: (field: keyof T, value: unknown) => void
}

// ═══════════════════════════════════════════════════════════
// Composable
// ═══════════════════════════════════════════════════════════

export function useZodValidation<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  initialData: T,
  options: UseZodValidationOptions = {},
): ValidationResult<T> {
  const {
    autoValidate = false,
    validateOnBlur = true,
    validateOnChange = false,
    debounceMs = 300,
  } = options

  // ═══════════════════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════════════════

  // ✅ Cast to T to avoid Reactive<T> issues
  const form = reactive<T>({ ...initialData }) as T

  // ✅ Use ref instead of reactive for Set
  const touchedFields = ref(new Set<string>())

  // ✅ Use string keys to avoid keyof T issues with ref
  const errors = ref<Record<string, string>>(
    Object.fromEntries(Object.keys(initialData).map(key => [key, ''])),
  )

  // ═══════════════════════════════════════════════════════════
  // Computed (Cached)
  // ═══════════════════════════════════════════════════════════

  const schemaValidation = computed(() => schema.safeParse(form))

  const hasNoFieldErrors = computed(() =>
    Object.values(errors.value).every(error => !error),
  )

  const isValid = computed(() => {
    if (touchedFields.value.size === 0) return true
    return schemaValidation.value.success && hasNoFieldErrors.value
  })

  const isFormValid = computed(() => schemaValidation.value.success)

  const isDirty = computed(() =>
    Object.keys(initialData).some(
      key => initialData[key] !== form[key as keyof T],
    ),
  )

  // ═══════════════════════════════════════════════════════════
  // Core Methods
  // ═══════════════════════════════════════════════════════════

  const markFieldAsTouched = (field: keyof T): void => {
    touchedFields.value.add(field as string)
  }

  const isFieldTouched = (field: keyof T): boolean => {
    return touchedFields.value.has(field as string)
  }

  const getError = (field: keyof T): string => {
    return errors.value[field as string] || ''
  }

  const setFieldError = (field: keyof T, error: string): void => {
    errors.value[field as string] = error
  }

  const clearFieldError = (field: keyof T): void => {
    errors.value[field as string] = ''
  }

  const clearErrors = (): void => {
    Object.keys(errors.value).forEach((key) => {
      errors.value[key] = ''
    })
  }

  // ═══════════════════════════════════════════════════════════
  // Validation Methods
  // ═══════════════════════════════════════════════════════════

  const validateField = (fieldName: keyof T, value?: unknown): boolean => {
    markFieldAsTouched(fieldName)

    const dataToValidate = value !== undefined
      ? { ...form, [fieldName]: value }
      : form

    const result = schema.safeParse(dataToValidate)

    if (result.success) {
      errors.value[fieldName as string] = ''
      return true
    }

    const fieldError = result.error.issues.find(
      issue => issue.path[0] === fieldName,
    )
    errors.value[fieldName as string] = fieldError?.message || ''

    return !fieldError
  }

  const _debouncedValidate = useDebounceFn(
    (fieldName: keyof T, value?: unknown) => validateField(fieldName, value),
    debounceMs,
  )

  const debouncedValidateField = (fieldName: keyof T, value?: unknown): void => {
    void _debouncedValidate(fieldName, value)
  }

  const validateAll = (): boolean => {
    Object.keys(initialData).forEach(key => touchedFields.value.add(key))

    const result = schema.safeParse(form)
    clearErrors()

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldKey = issue.path[0] as string
        if (fieldKey in errors.value && !errors.value[fieldKey]) {
          errors.value[fieldKey] = issue.message
        }
      })
    }

    return result.success
  }

  // ═══════════════════════════════════════════════════════════
  // Form Helpers
  // ═══════════════════════════════════════════════════════════

  const reset = (newData?: Partial<T>): void => {
    const resetData = { ...initialData, ...newData }
    Object.keys(resetData).forEach((key) => {
      ;(form as Record<string, unknown>)[key] = resetData[key as keyof T]
    })
    clearErrors()
    touchedFields.value.clear()
  }

  const setFormValues = (values: Partial<T>): void => {
    Object.entries(values).forEach(([key, value]) => {
      if (key in form) {
        ;(form as Record<string, unknown>)[key] = value
      }
    })
  }

  // ═══════════════════════════════════════════════════════════
  // Event Handlers
  // ═══════════════════════════════════════════════════════════

  const handleBlur = (field: keyof T): void => {
    if (validateOnBlur) {
      validateField(field)
    }
  }

  const handleChange = (field: keyof T, value: unknown): void => {
    ;(form as Record<string, unknown>)[field as string] = value
    if (validateOnChange) {
      debouncedValidateField(field, value)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // Watchers
  // ═══════════════════════════════════════════════════════════

  if (autoValidate && !validateOnChange) {
    watch(
      () => ({ ...form }),
      (newVal, oldVal) => {
        if (touchedFields.value.size === 0) return

        Object.keys(newVal).forEach((key) => {
          if (newVal[key] !== oldVal?.[key] && touchedFields.value.has(key)) {
            debouncedValidateField(key as keyof T)
          }
        })
      },
      { deep: true },
    )
  }

  // ═══════════════════════════════════════════════════════════
  // Return
  // ═══════════════════════════════════════════════════════════

  return {
    form,
    errors,
    touchedFields,
    isValid,
    isFormValid,
    isDirty,
    validateField,
    debouncedValidateField,
    validateAll,
    getError,
    setFieldError,
    clearFieldError,
    clearErrors,
    markFieldAsTouched,
    isFieldTouched,
    reset,
    setFormValues,
    handleBlur,
    handleChange,
  }
}
