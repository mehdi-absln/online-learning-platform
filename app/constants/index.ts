// Import shared error constants that are consistent between client and server
import { AUTH_ERRORS as SHARED_AUTH_ERRORS } from '~/types/auth-errors'

// Client-specific authentication error messages (for validation, not API responses)
export const AUTH_ERRORS = {
  USERNAME_REQUIRED: 'Username or email is required',
  USERNAME_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  EMAIL_INVALID: 'Please enter a valid email address',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions',
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters',
  USERNAME_INVALID_FORMAT: 'Username can only contain letters, numbers and underscores',
  PASSWORD_TOO_WEAK:
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  EMAIL_ALREADY_EXISTS: 'Email is already registered',
  USERNAME_ALREADY_EXISTS: 'Username is already taken',
} as const

// Export the shared errors for use in API response handling
export { SHARED_AUTH_ERRORS }

// Validation regex patterns
export const VALIDATION_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, // Requires uppercase, lowercase, and number
} as const

// Validation limits
export const VALIDATION_LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
  EMAIL_MAX: 255,
} as const
