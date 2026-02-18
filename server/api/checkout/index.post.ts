import { processCheckout } from '../../db/order-service'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event)
  const { simulationType } = body

  if (!simulationType || !['success', 'fail'].includes(simulationType)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid simulation type',
    })
  }

  try {
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
    throw createError(error as Error)
  }
})
