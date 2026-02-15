/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return ''
  if (text.length <= maxLength) return text

  // Find last space before maxLength
  const truncated = text.slice(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  // If there's a space, cut there. Otherwise just cut at maxLength
  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + '...'
  }

  return truncated + '...'
}
