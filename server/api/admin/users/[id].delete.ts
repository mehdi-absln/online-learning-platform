import { setResponseStatus } from 'h3'
import { db } from '../../../db'
import { users, instructors, reviews, courses } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { errorResponse, successResponse } from '../../../utils/response'
import { verifyToken } from '../../../utils/jwt'
import { findById } from '../../../db/user-service'

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, 'accessToken')
    if (!accessToken) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const payload = await verifyToken(accessToken)
    if (!payload) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const authUser = await findById(payload.userId)
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'ADMIN' && authUser.role !== 'superadmin')) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admins only' })
    }

    const userIdStr = getRouterParam(event, 'id')
    if (!userIdStr) throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
    const userId = parseInt(userIdStr, 10)

    if (authUser.id === userId) {
      throw createError({ statusCode: 400, statusMessage: 'You cannot delete yourself' })
    }

    const targetUser = await findById(userId)
    if (!targetUser) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    // Only superadmin can delete another admin
    if (targetUser.role === 'admin' && authUser.role !== 'superadmin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only a superadmin can delete another admin.',
      })
    }

    // Clean up related data
    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.userId, userId))
      .limit(1)

    if (instructor) {
      await db.update(courses)
        .set({ instructorId: null })
        .where(eq(courses.instructorId, instructor.id))
      await db.delete(instructors).where(eq(instructors.id, instructor.id))
    }

    await db.delete(reviews).where(eq(reviews.userId, userId))

    const deleted = await db.delete(users).where(eq(users.id, userId)).returning({ id: users.id })

    if (!deleted.length) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    return successResponse('User deleted successfully')
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number, statusMessage?: string, message?: string }

    if (err.statusCode) {
      setResponseStatus(event, err.statusCode)
      return errorResponse(err.statusMessage || 'Request failed', err.message)
    }

    console.error('Admin Delete User Error:', error)
    setResponseStatus(event, 500)
    return errorResponse('Internal server error', err.message || 'Unknown error')
  }
})
