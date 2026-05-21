import { db } from '../../../db'
import { users } from '../../../db/schema'
import { errorResponse, successResponse } from '../../../utils/response'
import { verifyToken } from '../../../utils/jwt'
import { findById } from '../../../db/user-service'

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, 'accessToken')
    if (!accessToken) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const payload = await verifyToken(accessToken)
    if (!payload) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const user = await findById(payload.userId)
    // Accept admin and superadmin
    if (!user || (user.role !== 'admin' && user.role !== 'ADMIN' && user.role !== 'superadmin')) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admins only' })
    }

    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    })

    return successResponse('Users retrieved successfully', allUsers)
  }
  catch (error: any) {
    if (error.statusCode) {
      return errorResponse(error.statusMessage, error.message, error.statusCode)
    }
    console.error('Admin Fetch Users Error:', error)
    return errorResponse('Internal server error', error.message)
  }
})
