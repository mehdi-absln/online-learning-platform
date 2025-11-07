import { H3Event } from 'h3'
import { UserService } from '../../../server/db/user-service'
import { getRouterParam, setResponseStatus } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    
    if (isNaN(id) || id <= 0) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Invalid user ID',
      }
    }
    
    const user = await UserService.findById(id)
    
    if (!user) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'User not found',
      }
    }
    
    // Return only public information about the user
    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        name: user.username, // In a real app, we might have a separate name field
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random` // Using ui-avatars service
      }
    }
  } catch (error: unknown) {
    console.error(`Detailed error in GET /api/users/[id]:`, error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch user',
      error: (error as Error).message || 'Unknown error occurred',
    }
  }
})