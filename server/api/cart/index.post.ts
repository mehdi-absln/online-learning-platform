import { requireAuth } from '../../utils/auth-helpers'
import { addToCart } from '../../db/cart-service'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)

    if (!body.courseId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Course ID is required',
      })
    }

    const result = await addToCart(user.id, body.courseId)

    return successResponse('Course added to cart', result)
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number, statusMessage?: string, message?: string }
    // If it's a known error from addToCart (throw createError), use its status
    const statusMessage = err.statusMessage || 'Internal server error'

    return errorResponse(statusMessage, err.message)
  }
})
