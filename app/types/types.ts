import type { User, AuthResponse } from './shared/auth'

export interface SigninFormData {
  username: string
  password: string
  rememberMe: boolean
}

export interface SignupFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
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
export { User, AuthResponse }

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

// Breadcrumb component interfaces
export interface BreadcrumbItem {
  name: string
  path: string
}

// Validation composable interfaces
export interface UseZodValidationOptions {
  autoValidate?: boolean // Enable/disable auto-validation
  validateOnBlur?: boolean // Validate fields on blur
  validateOnChange?: boolean // Validate field on change
}

export interface ValidationResult<T> {
  form: T
  errors: Ref<Partial<Record<keyof T, string>>>
  isValid: Ref<boolean>
  isFormValid: Ref<boolean>
  isDirty: Ref<boolean>
  touchedFields: Set<keyof T>
  validateField: (field: keyof T, value: any) => void
  validateAll: () => boolean
  getError: (field: keyof T) => string
  reset: () => void
  setFieldError: (field: keyof T, error: string) => void
  markFieldAsTouched: (field: keyof T) => void
}
