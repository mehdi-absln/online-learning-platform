import type { User } from './auth'

// Interfaces for user creation that can be shared between client and server
export interface CreateUserRequest {
  username: string
  email: string
  password: string
}

// For when we need to represent user data without sensitive fields
export interface PublicUser extends User {
  createdAt: Date
  updatedAt: Date
}