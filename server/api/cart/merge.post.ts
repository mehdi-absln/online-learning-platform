import { requireAuth } from '../../utils/auth-helpers'
import { bulkAddToCart } from '../../db/cart-service'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const { courseIds } = body

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return successResponse('No items to merge')
    }

    const results = await bulkAddToCart(user.id, courseIds)

    return successResponse('Cart merged successfully', results)
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number, statusMessage?: string, message?: string }
    console.error('Cart merge error:', err)
    const message = err.statusMessage || 'Failed to merge cart'
    return errorResponse(message, err.message)
  }
})
