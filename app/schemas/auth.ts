import { z } from 'zod'
import {
  AUTH_ERRORS,
  VALIDATION_LIMITS,
  VALIDATION_PATTERNS,
} from '~/constants'

// Sign In schema
export const signInSchema = z.object({
  username: z
    .string()
    .min(1, AUTH_ERRORS.USERNAME_REQUIRED)
    .max(255)
    .refine(
      (value) => {
        // Allow either username (alphanumeric + underscore) or email format
        const usernamePattern = /^[a-zA-Z0-9_]+$/
        const emailPattern = VALIDATION_PATTERNS.EMAIL
        return usernamePattern.test(value) || emailPattern.test(value)
      },
      {
        message: 'Please enter a valid username or email',
      },
    ),
  password: z
    .string()
    .min(VALIDATION_LIMITS.PASSWORD_MIN, AUTH_ERRORS.PASSWORD_TOO_SHORT)
    .max(VALIDATION_LIMITS.PASSWORD_MAX),
  rememberMe: z.boolean().default(false),
})

// Sign Up schema
export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(VALIDATION_LIMITS.USERNAME_MIN, AUTH_ERRORS.USERNAME_TOO_SHORT)
      .max(VALIDATION_LIMITS.USERNAME_MAX)
      .regex(VALIDATION_PATTERNS.USERNAME, AUTH_ERRORS.USERNAME_INVALID_FORMAT),
    email: z.string().email(AUTH_ERRORS.EMAIL_INVALID).max(VALIDATION_LIMITS.EMAIL_MAX),
    password: z
      .string()
      .min(VALIDATION_LIMITS.PASSWORD_MIN, AUTH_ERRORS.PASSWORD_TOO_WEAK)
      .max(VALIDATION_LIMITS.PASSWORD_MAX)
      .regex(VALIDATION_PATTERNS.PASSWORD, AUTH_ERRORS.PASSWORD_TOO_WEAK),
    confirmPassword: z.string().min(1, AUTH_ERRORS.CONFIRM_PASSWORD_REQUIRED),
    termsAccepted: z
      .boolean()
      .refine(value => value === true, { message: AUTH_ERRORS.TERMS_NOT_ACCEPTED }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: AUTH_ERRORS.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  })

// Type exports for form data
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
