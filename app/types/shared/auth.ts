// Define a minimal User interface that can be shared between frontend and backend
export interface User {
  id: number
  username: string
  email: string
}

// Define common auth response interfaces
export interface AuthResponse {
  success: boolean
  user?: User
  message?: string
  error?: string
}