// server/utils/text-helpers.ts

/**
 * Calculate reading time in minutes from content
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 1

  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)

  return Math.max(1, minutes)
}
