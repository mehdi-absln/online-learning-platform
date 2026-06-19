// ──────────────────────────────────────
// Authentication error messages
// ──────────────────────────────────────
export const AUTH_ERRORS = {
  // Shared (server + client)
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
  SIGNIN_SUCCESS: 'Sign in successful',

  // Client-specific
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters',
  USERNAME_INVALID_FORMAT: 'Username can only contain letters, numbers and underscores',
  EMAIL_ALREADY_EXISTS: 'Email is already registered',
  USERNAME_ALREADY_EXISTS: 'Username is already taken',
} as const

// Alias — برای فایل‌هایی که از SHARED_AUTH_ERRORS استفاده می‌کنن
export const SHARED_AUTH_ERRORS = AUTH_ERRORS

// Client-specific validation errors (برای فرم‌ها)
export const CLIENT_VALIDATION_ERRORS = {
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

// Validation regex patterns
export const VALIDATION_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
} as const

// Validation limits
export const VALIDATION_LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
  EMAIL_MAX: 255,
} as const

// Brand
export const SITE_NAME = 'Online Learning Platform' as const

// Assets
export const PLACEHOLDER_COURSE_IMAGE = '/images/placeholder-course.svg' as const
export const PLACEHOLDER_AVATAR = '/images/placeholder-avatar.svg' as const
export const PLACEHOLDER_BLOG_COVER = '/images/placeholder-blog.svg' as const
