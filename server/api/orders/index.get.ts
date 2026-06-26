import { requireAuth } from '../../utils/auth-helpers'
import { getUserOrders } from '../../db/order-service'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const orders = await getUserOrders(user.id)

    return successResponse('Orders retrieved successfully', {
      orders,
    })
  }
  catch (error: unknown) {
    const err = error as { statusMessage?: string, message?: string }
    return errorResponse(err.statusMessage || 'Failed to fetch orders', err.message)
  }
})
