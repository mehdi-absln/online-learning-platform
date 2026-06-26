import { setResponseStatus } from 'h3'
import { db } from '../../../db'
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
  catch (error: unknown) {
    const err = error as { statusCode?: number, statusMessage?: string, message?: string }

    if (err.statusCode) {
      setResponseStatus(event, err.statusCode)
      return errorResponse(err.statusMessage || 'Request failed', err.message)
    }

    setResponseStatus(event, 500)
    return errorResponse('Internal server error', err.message || 'Unknown error')
  }
})
