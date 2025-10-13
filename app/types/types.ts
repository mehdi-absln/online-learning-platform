export interface SigninFormData {
  username: string
  password: string
  rememberMe: boolean
}

export interface SignupFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

export interface User {
  id: number
  username: string
  email: string
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface SignInResponse {
  success: boolean
  user?: User
  message?: string
  error?: string
}

export interface SignUpResponse {
  success: boolean
  user?: User
  message?: string
  error?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface SignInFormErrors {
  username: string
  password: string
}

export interface SignUpFormErrors {
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: string
}
