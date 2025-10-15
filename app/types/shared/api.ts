export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  user?: T; // For auth-specific responses
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  success: boolean;
  message: string;
  errors: ValidationError[];
}