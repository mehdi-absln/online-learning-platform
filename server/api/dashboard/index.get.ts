import { requireAuth } from '../../utils/auth-helpers'
import { getDashboardData } from '../../db/dashboard-service'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const dashboardData = await getDashboardData(user.id)

    return successResponse('Dashboard data retrieved successfully', dashboardData)
  }
  catch (error: unknown) {
    const err = error as { statusMessage?: string, message?: string }
    return errorResponse(err.statusMessage || 'Failed to fetch dashboard data', err.message)
  }
})
