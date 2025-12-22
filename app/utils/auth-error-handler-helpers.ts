import {
  SHARED_AUTH_ERRORS,
  AUTH_ERRORS,
} from '~/constants'
import type { SignInFormData, SignUpFormData } from '~/schemas/auth'

type SetFieldError<T = Record<string, unknown>> = (field: keyof T, error: string) => void

export function handleSignInError(
  error: string | undefined,
  setFieldError: SetFieldError<SignInFormData>,
): void {
  if (!error) {
    setFieldError('password', 'Sign in failed. Please try again.')
    return
  }

  // Directly implement the logic to avoid type casting
  if (error.includes(SHARED_AUTH_ERRORS.INVALID_CREDENTIALS)) {
    setFieldError('password', SHARED_AUTH_ERRORS.INVALID_CREDENTIALS)
    return
  }

  if (error.includes(SHARED_AUTH_ERRORS.USERNAME_REQUIRED) && error.includes(SHARED_AUTH_ERRORS.PASSWORD_REQUIRED)) {
    setFieldError('username', SHARED_AUTH_ERRORS.USERNAME_REQUIRED)
    setFieldError('password', SHARED_AUTH_ERRORS.PASSWORD_REQUIRED)
    return
  }

  setFieldError('password', error || 'Sign in failed. Please try again.')
}

export function handleSignUpError(
  error: string | undefined,
  setFieldError: SetFieldError<SignUpFormData>,
): void {
  if (!error) {
    setFieldError('email', 'Sign up failed. Please try again.')
    return
  }

  // Directly implement the logic to avoid type casting
  if (error.includes(SHARED_AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS)) {
    if (error.toLowerCase().includes('email')) {
      setFieldError('email', AUTH_ERRORS.EMAIL_ALREADY_EXISTS)
    }
    else if (error.toLowerCase().includes('username')) {
      setFieldError('username', AUTH_ERRORS.USERNAME_ALREADY_EXISTS)
    }
    else {
      setFieldError('email', SHARED_AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS)
    }
    return
  }

  if (error.includes(SHARED_AUTH_ERRORS.PASSWORD_TOO_WEAK)) {
    setFieldError('password', AUTH_ERRORS.PASSWORD_TOO_WEAK)
    return
  }

  if (error.includes(SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT)) {
    setFieldError('password', SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT)
    return
  }

  if (error.includes(SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH)) {
    setFieldError('confirmPassword', SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH)
    return
  }

  if (error.includes(SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED)) {
    setFieldError('termsAccepted', SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED)
    return
  }

  if (error.includes(SHARED_AUTH_ERRORS.EMAIL_INVALID)) {
    setFieldError('email', SHARED_AUTH_ERRORS.EMAIL_INVALID)
    return
  }

  if (error.includes(SHARED_AUTH_ERRORS.ALL_FIELDS_REQUIRED)) {
    setFieldError('username', SHARED_AUTH_ERRORS.USERNAME_REQUIRED)
    setFieldError('email', SHARED_AUTH_ERRORS.EMAIL_REQUIRED)
    setFieldError('password', SHARED_AUTH_ERRORS.PASSWORD_REQUIRED)
    setFieldError('confirmPassword', AUTH_ERRORS.CONFIRM_PASSWORD_REQUIRED)
    return
  }

  setFieldError('email', error || 'Sign up failed. Please try again.')
}
