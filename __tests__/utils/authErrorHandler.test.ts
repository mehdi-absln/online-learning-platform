// tests/authErrorHandler.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleSignInError, handleSignUpError } from '~/utils/auth-error-handler-helpers'
import { SHARED_AUTH_ERRORS, AUTH_ERRORS } from '~/constants'

describe('Authentication Error Handler', () => {
  let mockSetFieldError: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockSetFieldError = vi.fn()
  })


  describe('handleSignInError', () => {
    it('sets generic error when no error message provided', () => {
      handleSignInError(undefined, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        'Sign in failed. Please try again.',
      )
    })

    it('handles invalid credentials error', () => {
      handleSignInError(SHARED_AUTH_ERRORS.INVALID_CREDENTIALS, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.INVALID_CREDENTIALS,
      )
    })

    it('handles required fields error', () => {
      const combinedError = `${SHARED_AUTH_ERRORS.USERNAME_REQUIRED}, ${SHARED_AUTH_ERRORS.PASSWORD_REQUIRED}`
      handleSignInError(combinedError, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'username',
        SHARED_AUTH_ERRORS.USERNAME_REQUIRED,
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.PASSWORD_REQUIRED,
      )
    })
  })


  describe('handleSignUpError', () => {
    it('sets generic error when no error message provided', () => {
      handleSignUpError(undefined, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        'Sign up failed. Please try again.',
      )
    })

    it('handles username or email exists error (contains email)', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        AUTH_ERRORS.EMAIL_ALREADY_EXISTS,
      )
    })

    it('handles username exists error (contains username only)', () => {
      const _usernameOnlyError = `${SHARED_AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS} - username`
        .replace('email', 'e-mail')

      handleSignUpError('Username or email already exists', mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        AUTH_ERRORS.EMAIL_ALREADY_EXISTS,
      )
    })

    it('handles email already registered as fallback', () => {
      handleSignUpError('Email is already registered', mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        'Email is already registered',
      )
    })

    it('handles username taken as fallback', () => {
      handleSignUpError('Username is already taken', mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        'Username is already taken',
      )
    })

    it('handles password too weak error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.PASSWORD_TOO_WEAK, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        AUTH_ERRORS.PASSWORD_TOO_WEAK,
      )
    })

    it('handles password too short error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT,
      )
    })

    it('handles password mismatch error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'confirmPassword',
        SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH,
      )
    })

    it('handles terms not accepted error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'termsAccepted',
        SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED,
      )
    })

    it('handles invalid email error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.EMAIL_INVALID, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        SHARED_AUTH_ERRORS.EMAIL_INVALID,
      )
    })

    it('handles all fields required error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.ALL_FIELDS_REQUIRED, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'username',
        SHARED_AUTH_ERRORS.USERNAME_REQUIRED,
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        SHARED_AUTH_ERRORS.EMAIL_REQUIRED,
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.PASSWORD_REQUIRED,
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'confirmPassword',
        AUTH_ERRORS.CONFIRM_PASSWORD_REQUIRED,
      )
    })
  })
})
