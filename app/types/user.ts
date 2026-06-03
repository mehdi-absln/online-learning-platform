// ──────────────────────────────────────
// User management types
// ──────────────────────────────────────

import type { User } from './auth'

export interface CreateUserRequest {
  username: string
  email: string
  password: string
}

export interface PublicUser extends User {
  createdAt: Date
  updatedAt: Date
}
