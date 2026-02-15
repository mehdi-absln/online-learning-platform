// server/utils/auth-helpers.ts
import { H3Event } from 'h3'
import { verifyToken } from './jwt'
import { db } from '../db/index'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export async function requireInstructor(event: H3Event) {
  const token = getCookie(event, 'auth_token')

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

  // ✅ مستقیم از db بخون
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

  if (user.role !== 'instructor' && user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only instructors can perform this action',
    })
  }

  return user
}

export async function requireAuth(event: H3Event) {
  const token = getCookie(event, 'auth_token')

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