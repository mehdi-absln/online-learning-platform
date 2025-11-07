export default defineEventHandler(async (event) => {
  try {
    // Clear cookies
    deleteCookie(event, 'accessToken')
    deleteCookie(event, 'refreshToken')

    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error: unknown) {
    console.error('Logout error:', error)
    return {
      success: false,
      message: 'Logout failed',
      error: (error as Error).message
    }
  }
})
