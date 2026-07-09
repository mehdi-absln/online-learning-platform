export default defineEventHandler(async (event) => {
  try {
    // Clear cookies
    deleteCookie(event, 'accessToken')

    return {
      success: true,
      message: 'Logged out successfully',
    }
  }
  catch (error: unknown) {
    return {
      success: false,
      message: 'Logout failed',
      error: (error as Error).message,
    }
  }
})
