// Utility functions for handling course images
export function validateAndProcessImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null
  }

  // Basic validation for image URLs
  try {
    const url = new URL(imageUrl)
    const allowedProtocols = ['http:', 'https:']
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

    if (!allowedProtocols.includes(url.protocol)) {
      throw new Error('Invalid URL protocol')
    }

    // Check if URL has a valid image extension
    const pathname = url.pathname.toLowerCase()
    const hasValidExtension = allowedExtensions.some(ext => pathname.endsWith(ext))

    if (!hasValidExtension) {
      // For now we allow any path since many image hosting services don't use file extensions
      // In a production app, you might want to validate the content-type header instead
    }

    return imageUrl
  }
  catch (error) {
    console.error(`Invalid image URL: ${imageUrl}`, error)
    return null
  }
}

// Function to generate avatar URL using a service like ui-avatars
export function generateAvatarUrl(name: string, size: number = 64): string {
  // Using ui-avatars.com service to generate avatar based on name
  const encodedName = encodeURIComponent(name)
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=random`
}

// Function to process and validate course image
export function processCourseImage(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/images/default-course-image.jpg'
  }

  const validatedUrl = validateAndProcessImageUrl(imageUrl)
  return validatedUrl || '/images/default-course-image.jpg'
}

// Function to process and validate instructor avatar
export function processInstructorAvatar(
  avatarUrl: string | null | undefined,
  instructorName: string,
): string {
  if (avatarUrl) {
    const validatedUrl = validateAndProcessImageUrl(avatarUrl)
    if (validatedUrl) {
      return validatedUrl
    }
  }

  // Generate avatar based on instructor name if no image provided
  return generateAvatarUrl(instructorName)
}

// Default image URL to use when no image is provided
export const DEFAULT_COURSE_IMAGE = '/images/default-course-image.jpg'
export const DEFAULT_INSTRUCTOR_AVATAR = '/images/default-avatar.jpg'
