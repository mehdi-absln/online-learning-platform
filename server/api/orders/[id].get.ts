import { requireAuth } from '../../utils/auth-helpers'
import { getOrderDetails } from '../../db/order-service'

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user - this checks the accessToken cookie
    const user = await requireAuth(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID is required',
      })
    }

    const orderId = parseInt(id)
    if (isNaN(orderId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Order ID',
      })
    }

    const order = await getOrderDetails(orderId, user.id)

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found',
      })
    }

    return {
      success: true,
      order,
    }
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number, statusMessage?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    })
  }
})
