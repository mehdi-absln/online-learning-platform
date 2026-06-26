// server/utils/auth-helpers.ts
import type { H3Event } from 'h3'
import { verifyToken } from './jwt'
import { db } from '../db/index'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

import { createError } from 'h3'

export async function requireAuth(event: H3Event) {
  const token = getCookie(event, 'accessToken')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  const payload = await verifyToken(token)

  if (!payload || !payload.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found',
    })
  }

  return user
}

export async function requireInstructor(event: H3Event) {
  const token = getCookie(event, 'accessToken')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  const payload = await verifyToken(token)

  if (!payload || !payload.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found',
    })
  }

  // Allow admin, superadmin, and instructor
  if (user.role !== 'instructor' && user.role !== 'admin' && user.role !== 'superadmin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only instructors, admins or superadmins can perform this action',
    })
  }

  return user
}

export const isPurchasingRestrictedRole = (role?: string | null) => {
  return role === 'admin' || role === 'superadmin'
}

export const requirePurchaser = async (event: H3Event) => {
  const user = await requireAuth(event)

  if (isPurchasingRestrictedRole(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Administrative accounts cannot perform purchase actions',
    })
  }

  return user
}
