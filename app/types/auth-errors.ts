// Authentication error messages (shared between client and server for consistency)
export const AUTH_ERRORS = {
  ALL_FIELDS_REQUIRED: 'All fields are required',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORD_TOO_WEAK:
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions',
  EMAIL_INVALID: 'Please enter a valid email address',
  USERNAME_OR_EMAIL_EXISTS: 'Username or email already exists',
  USERNAME_REQUIRED: 'Username is required',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  INVALID_CREDENTIALS: 'Incorrect username or password',
  ACCOUNT_CREATED_SUCCESS: 'Account created successfully',
  SIGNIN_SUCCESS: 'Sign in successful'
} as const
