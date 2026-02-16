import { requireAuth } from '../../utils/auth-helpers'
import { getCartItems } from '../../db/cart-service'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const items = await getCartItems(user.id)

    // Calculate total price server-side
    const totalPrice = items.reduce((sum: number, item: any) => {
      // Only include published courses in total
      if (item.isPublished) {
        return sum + (Number(item.price) || 0)
      }
      return sum
    }, 0)

    return successResponse('Cart retrieved successfully', {
      items,
      itemsCount: items.length,
      totalPrice: Number(totalPrice.toFixed(2)),
    })
  }
  catch (error: unknown) {
    const err = error as { statusMessage?: string, message?: string }
    console.error('Fetch cart error:', error)
    return errorResponse(err.statusMessage || 'Failed to fetch cart', err.message)
  }
})
