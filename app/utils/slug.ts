/**
 * Normalize a slug value by trimming whitespace and lowercasing it.
 * Safe for null/undefined inputs (returns an empty string).
 *
 * Used for case-insensitive slug comparisons across client and server.
 */
export function normalizeSlug(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? ''
}

/**
 * Generate a URL-safe slug from a free-form title/string.
 *
 * Replaces the previously duplicated per-file `generateLessonSlug`
 * implementations in the server API and course service.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
