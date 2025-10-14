import { z } from 'zod'
import { reactive, computed, watch, ref } from 'vue'
import type { Ref } from 'vue'
import type { UseZodValidationOptions, ValidationResult } from '~/types/types'

export function useZodValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialData: T,
  options: UseZodValidationOptions = {}
): ValidationResult<T> {
  const { autoValidate = false, validateOnBlur = true, validateOnChange = false } = options

  // Create the reactive form state
  const form = reactive({ ...initialData }) as T

  // Track touched fields
  const touchedFields = new Set<keyof T>()

  // Create reactive errors object with the same keys as the form data
  const errors = ref<Partial<Record<keyof T, string>>>(
    Object.keys(initialData).reduce(
      (acc, key) => {
        acc[key as keyof T] = ''
        return acc
      },
      {} as Partial<Record<keyof T, string>>
    )
  ) as Ref<Partial<Record<keyof T, string>>>

  // Computed property to check if the form is valid (for error display purposes)
  const isValid = computed(() => {
    // When no fields have been touched, form is considered valid (prevents early error display)
    if (touchedFields.size === 0) {
      return true
    }

    // Check if all field-specific errors are empty
    const noFieldErrors = Object.values(errors.value).every((error) => !error)

    // Validate the entire form against the schema to handle cross-field validations
    const result = schema.safeParse(form)
    if (result.success) {
      return noFieldErrors
    } else {
      // If there are schema-level errors (like cross-field validations), form is invalid
      return false
    }
  })

  // Computed property to check if the form is valid regardless of whether fields have been touched (for button enabling/disabling)
  const isFormValid = computed(() => {
    // Check if all field-specific errors are empty
    const noFieldErrors = Object.values(errors.value).every((error) => !error)

    // Validate the entire form against the schema to handle cross-field validations
    const result = schema.safeParse(form)
    if (result.success) {
      return noFieldErrors
    } else {
      // If there are schema-level errors (like cross-field validations), form is invalid
      return false
    }
  })

  // Computed property to check if form is dirty (any field has been modified)
  const isDirty = computed(() => {
    return Object.keys(initialData).some((key) => {
      const initialValue = initialData[key as keyof T]
      const currentValue = form[key as keyof T]
      return initialValue !== currentValue
    })
  })

  // Helper to get error for a specific field
  const getError = (field: keyof T): string => {
    return errors.value[field] || ''
  }

  // Manually set an error for a field
  const setFieldError = (field: keyof T, error: string) => {
    errors.value[field] = error
  }

  // Mark a field as touched
  const markFieldAsTouched = (field: keyof T) => {
    touchedFields.add(field)
  }

  // Validate a single field using Zod
  const validateField = (fieldName: keyof T, value: any) => {
    markFieldAsTouched(fieldName)

    // Create a temporary object with the updated value
    const tempData = { ...form, [fieldName]: value }

    // Use safeParse to avoid throwing exceptions
    const result = schema.safeParse(tempData)

    if (result.success) {
      // Clear error if validation passes
      errors.value[fieldName] = ''
    } else {
      // Find errors related to the current field
      const fieldIssues = result.error.issues.filter(
        (issue: z.ZodIssue) =>
          issue &&
          typeof issue === 'object' &&
          'path' in issue &&
          issue.path &&
          Array.isArray(issue.path) &&
          issue.path[0] === fieldName
      )

      if (
        fieldIssues.length > 0 &&
        fieldIssues[0] &&
        typeof fieldIssues[0] === 'object' &&
        'message' in fieldIssues[0]
      ) {
        // Set the first error message for this field
        errors.value[fieldName] =
          typeof fieldIssues[0].message === 'string' ? fieldIssues[0].message : 'Validation error'
      } else {
        // Clear error if validation fails but not for this specific field
        errors.value[fieldName] = ''
      }
    }
  }

  // Validate the entire form
  const validateAll = (): boolean => {
    // Mark all fields as touched
    Object.keys(initialData).forEach((key) => {
      touchedFields.add(key as keyof T)
    })

    const result = schema.safeParse(form)

    if (result.success) {
      // Clear all errors if validation passes
      Object.keys(errors.value).forEach((key) => {
        errors.value[key as keyof T] = ''
      })
      return true
    } else {
      // Clear all errors first
      Object.keys(errors.value).forEach((key) => {
        errors.value[key as keyof T] = ''
      })

      // Set errors based on Zod validation errors
      result.error.issues.forEach((issue: z.ZodIssue) => {
        if (
          issue &&
          typeof issue === 'object' &&
          'path' in issue &&
          'message' in issue &&
          issue.path &&
          Array.isArray(issue.path)
        ) {
          const fieldKey = issue.path[0] as keyof T
          if (fieldKey in errors.value) {
            errors.value[fieldKey] =
              typeof issue.message === 'string' ? issue.message : 'Validation error'
          }
        }
      })
    }

    return result.success
  }

  // Reset the form to initial state
  const reset = () => {
    Object.keys(initialData).forEach((key) => {
      form[key as keyof T] = initialData[key as keyof T]
      errors.value[key as keyof T] = ''
    })
    touchedFields.clear()
  }

  // Auto-validation watcher
  if (autoValidate) {
    watch(
      form,
      () => {
        if (touchedFields.size > 0) {
          validateAll()
        }
      },
      { deep: true }
    )
  }

  return {
    form,
    errors,
    isValid,
    isFormValid,
    isDirty,
    touchedFields,
    validateField,
    validateAll,
    getError,
    reset,
    setFieldError,
    markFieldAsTouched
  }
}
