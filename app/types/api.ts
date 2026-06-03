// ──────────────────────────────────────
// Shared API response types
// ──────────────────────────────────────

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: PaginationMeta
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationErrorResponse {
  success: boolean
  message: string
  errors: ValidationError[]
}
