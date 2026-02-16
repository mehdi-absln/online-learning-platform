import { requireAuth } from '../../utils/auth-helpers'
import { removeFromCart } from '../../db/cart-service'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const courseId = getRouterParam(event, 'courseId')

    if (!courseId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Course ID is required',
      })
    }

    await removeFromCart(user.id, parseInt(courseId))

    return successResponse('Item removed from cart')
  }
  catch (error: unknown) {
    const err = error as { statusMessage?: string, message?: string }
    return errorResponse(err.statusMessage || 'Failed to remove item', err.message)
  }
})
