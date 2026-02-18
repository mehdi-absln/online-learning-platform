import { requireAuth } from '../../utils/auth-helpers'
import { removeFromCart } from '../../db/cart-service'
import { successResponse } from '../../utils/response'

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
    throw createError(error as Error)
  }
})
