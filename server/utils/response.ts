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

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const successAuthResponse = <T>(message: string, user: T): ApiResponse<T> => ({
  success: true,
  message,
  user,
});

export const errorResponse = (message: string, error?: string): ApiResponse => ({
  success: false,
  message,
  error,
});

export const validationErrorResponse = (message: string, errors: ValidationError[]): ValidationErrorResponse => ({
  success: false,
  message,
  errors,
});