import { requireAuth } from '../../utils/auth-helpers'
import { bulkAddToCart } from '../../db/cart-service'
import { successResponse } from '../../utils/response'

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
    throw createError(error as Error)
  }
})
