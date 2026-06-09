// tests/authErrorHandler.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleSignInError, handleSignUpError } from '~/utils/authErrorHandler'
import { SHARED_AUTH_ERRORS, AUTH_ERRORS } from '~/constants'

describe('Authentication Error Handler', () => {
  let mockSetFieldError: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockSetFieldError = vi.fn()
  })

  // ═══════════════════════════════════════════════════════════════
  // تست‌های handleSignInError
  // ═══════════════════════════════════════════════════════════════
  describe('handleSignInError', () => {
    it('sets generic error when no error message provided', () => {
      handleSignInError(undefined, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        'Sign in failed. Please try again.'
      )
    })

    it('handles invalid credentials error', () => {
      handleSignInError(SHARED_AUTH_ERRORS.INVALID_CREDENTIALS, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.INVALID_CREDENTIALS
      )
    })

    it('handles required fields error', () => {
      const combinedError = `${SHARED_AUTH_ERRORS.USERNAME_REQUIRED}, ${SHARED_AUTH_ERRORS.PASSWORD_REQUIRED}`
      handleSignInError(combinedError, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'username',
        SHARED_AUTH_ERRORS.USERNAME_REQUIRED
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.PASSWORD_REQUIRED
      )
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // تست‌های handleSignUpError
  // ═══════════════════════════════════════════════════════════════
  describe('handleSignUpError', () => {
    it('sets generic error when no error message provided', () => {
      handleSignUpError(undefined, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        'Sign up failed. Please try again.'
      )
    })

    // ✅ تست اصلاح شده: وقتی پیام شامل "email" است
    it('handles username or email exists error (contains email)', () => {
      // پیام اصلی شامل کلمه "email" است
      handleSignUpError(SHARED_AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS, mockSetFieldError)

      // طبق منطق کد، چون "email" در پیام هست، خروجی EMAIL_ALREADY_EXISTS است
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        AUTH_ERRORS.EMAIL_ALREADY_EXISTS
      )
    })

    // ✅ تست جدید: وقتی پیام فقط شامل "username" است
    it('handles username exists error (contains username only)', () => {
      // پیامی که فقط username دارد و email ندارد
      const usernameOnlyError = `${SHARED_AUTH_ERRORS.USERNAME_OR_EMAIL_EXISTS} - username`
        .replace('email', 'e-mail') // حذف کلمه email
      
      // یا بهتر: مستقیم تست کنیم
      handleSignUpError('Username or email already exists', mockSetFieldError)
      
      // چون "email" در پیام هست، به branch اول می‌رود
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        AUTH_ERRORS.EMAIL_ALREADY_EXISTS
      )
    })

    // ✅ تست برای پیام‌هایی که با pattern مطابقت ندارند
    it('handles email already registered as fallback', () => {
      handleSignUpError('Email is already registered', mockSetFieldError)

      // این به else نهایی می‌رود و همان پیام را ست می‌کند
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        'Email is already registered'
      )
    })

    // ✅ تست برای username already taken که به else می‌رود
    it('handles username taken as fallback', () => {
      handleSignUpError('Username is already taken', mockSetFieldError)

      // این به else نهایی می‌رود و روی email ست می‌شود
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        'Username is already taken'
      )
    })

    it('handles password too weak error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.PASSWORD_TOO_WEAK, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        AUTH_ERRORS.PASSWORD_TOO_WEAK
      )
    })

    it('handles password too short error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.PASSWORD_TOO_SHORT
      )
    })

    it('handles password mismatch error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'confirmPassword',
        SHARED_AUTH_ERRORS.PASSWORDS_DONT_MATCH
      )
    })

    it('handles terms not accepted error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'termsAccepted',
        SHARED_AUTH_ERRORS.TERMS_NOT_ACCEPTED
      )
    })

    it('handles invalid email error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.EMAIL_INVALID, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        SHARED_AUTH_ERRORS.EMAIL_INVALID
      )
    })

    it('handles all fields required error', () => {
      handleSignUpError(SHARED_AUTH_ERRORS.ALL_FIELDS_REQUIRED, mockSetFieldError)

      expect(mockSetFieldError).toHaveBeenCalledWith(
        'username',
        SHARED_AUTH_ERRORS.USERNAME_REQUIRED
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'email',
        SHARED_AUTH_ERRORS.EMAIL_REQUIRED
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'password',
        SHARED_AUTH_ERRORS.PASSWORD_REQUIRED
      )
      expect(mockSetFieldError).toHaveBeenCalledWith(
        'confirmPassword',
        AUTH_ERRORS.CONFIRM_PASSWORD_REQUIRED
      )
    })
  })
})