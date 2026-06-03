// ──────────────────────────────────────
// Authentication & User identity types
// ──────────────────────────────────────

export type UserRole = 'student' | 'instructor' | 'admin' | 'superadmin'

export interface User {
  id: number
  username: string
  email: string
  role: UserRole
}

export interface JWTPayload {
  userId: number
  username: string
  email: string
  iat?: number
  exp?: number
}
