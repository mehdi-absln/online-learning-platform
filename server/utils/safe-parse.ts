/**
 * Safely parses a value to number, returning undefined if invalid
 */
export function safeParseInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  
  const parsed = parseInt(String(value), 10)
  
  // Check if the parsed value is a valid number
  if (isNaN(parsed)) {
    return undefined
  }
  
  return parsed
}

/**
 * Safely converts a value to string, returning undefined if invalid
 */
export function safeParseString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }
  
  const strValue = String(value).trim()
  
  // Return undefined for empty strings
  if (strValue === '') {
    return undefined
  }
  
  return strValue
}