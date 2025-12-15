import type { User, AuthResponse } from './shared/auth'

export interface SignInFormData {
  username: string
  password: string
  rememberMe: boolean
  [key: string]: unknown // Allow any additional properties for use in useZodValidation composable
}

export interface SignUpFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
  [key: string]: unknown // Allow any additional properties for use in useZodValidation composable
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface SignInResponse {
  success: boolean
  user?: User
  message?: string
  error?: string
}

export interface SignUpResponse {
  success: boolean
  user?: User
  message?: string
  error?: string
}

// Re-export shared types for backward compatibility
export type { User, AuthResponse }

export interface SignInFormErrors {
  username: string
  password: string
}

export interface SignUpFormErrors {
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: string
}

// Validation composable interfaces
export interface UseZodValidationOptions {
  autoValidate?: boolean // Enable/disable auto-validation
  validateOnBlur?: boolean // Validate fields on blur
  validateOnChange?: boolean // Validate field on change
  debounceMs?: number // Debounce time in milliseconds for validation
}

export interface ValidationResult<T> {
  form: T
  errors: Ref<Record<keyof T, string>>
  isValid: Ref<boolean>
  isFormValid: Ref<boolean>
  isDirty: Ref<boolean>
  touchedFields: Set<keyof T> // This is reactive via the composable's reactive wrapper
  validateField: (field: keyof T, value?: unknown) => boolean
  validateAll: () => boolean
  getError: (field: keyof T) => string
  reset: (newData?: Partial<T>) => void
  setFieldError: (field: keyof T, error: string) => void
  markFieldAsTouched: (field: keyof T) => void
  handleBlur: (field: keyof T) => void
  handleChange: (field: keyof T, value: unknown) => void
  isFieldTouched: (field: keyof T) => boolean
  clearErrors: () => void
  clearFieldError: (field: keyof T) => void
  setFormValues: (values: Partial<T>) => void
}
