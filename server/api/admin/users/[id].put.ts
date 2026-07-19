import { setResponseStatus } from 'h3'
import { db } from '../../../db'
import { users, instructors } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { errorResponse, successResponse } from '../../../utils/response'
import { verifyToken } from '../../../utils/jwt'
import { findById } from '../../../db/user-service'
import { adminUserUpdateSchema } from '../../../../app/schemas/admin'

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
      throw createError({ statusCode: 400, statusMessage: 'You cannot change your own role' })
    }

    const body = await readBody(event)
    const validated = adminUserUpdateSchema.safeParse(body)
    if (!validated.success) {
      throw createError({
        statusCode: 422,
        statusMessage: validated.error.issues[0]?.message ?? 'Invalid role',
      })
    }

    const newRole = validated.data.role
    const targetUser = await findById(userId)
    if (!targetUser) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    // Only a superadmin may grant the admin role (or modify an existing admin).
    // Note: the request schema only allows admin/instructor/student, so superadmin
    // cannot be created through this endpoint — that is intentional.
    if (newRole === 'admin' && authUser.role !== 'superadmin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only a superadmin can assign the admin role.',
      })
    }

    // Also block a non-superadmin from demoting/modifying an existing admin.
    if (targetUser.role === 'admin' && authUser.role !== 'superadmin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only a superadmin can modify another admin.',
      })
    }

    // If new role is instructor, ensure instructor record exists
    if (newRole === 'instructor') {
      const [existingInstructor] = await db
        .select({ id: instructors.id })
        .from(instructors)
        .where(eq(instructors.userId, userId))
        .limit(1)

      if (!existingInstructor) {
        const [targetUserData] = await db
          .select({ username: users.username })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)

        if (!targetUserData) {
          throw createError({ statusCode: 404, statusMessage: 'User not found' })
        }

        await db.insert(instructors).values({
          userId,
          name: targetUserData.username,
          title: '',
          bio: '',
          createdAt: new Date(),
        })
      }
    }

    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId))

    return successResponse('User role updated successfully')
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
