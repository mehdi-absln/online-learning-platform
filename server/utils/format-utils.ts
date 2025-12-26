/**
 * Utility functions for formatting data
 */

/**
 * Format instructor username to a more readable format
 * Converts from snake_case or lowercase to Title Case
 * Example: 'john_doe' -> 'John Doe'
 */
export function formatInstructorName(username: string): string {
  return username
    .split('_')  // Split on underscores
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())  // Capitalize first letter of each part
    .join(' ');  // Join with spaces
}