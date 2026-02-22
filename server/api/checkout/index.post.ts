import { requireAuth } from '../../utils/auth-helpers'
import { processCheckout } from '../../db/order-service'

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user - this checks the accessToken cookie
    const user = await requireAuth(event)

    const body = await readBody(event)
    const { simulationType } = body

    if (!simulationType || !['success', 'fail'].includes(simulationType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid simulation type',
      })
    }

    const result = await processCheckout(user.id, simulationType as 'success' | 'fail')

    if (!result.success && simulationType === 'fail') {
      return {
        success: false,
        message: 'Payment has been declined by the simulated bank.',
        orderId: result.orderId,
      }
    }

    return {
      success: true,
      message: 'Payment simulated successfully!',
      orderId: result.orderId,
    }
  }
  catch (error: unknown) {
    console.error('Checkout error:', error)
    throw createError(error as Error)
  }
})
