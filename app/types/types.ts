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