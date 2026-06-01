import { eq, or } from 'drizzle-orm'
import { db } from './index'
import { users, type User } from './schema'
import bcrypt from 'bcrypt'
import type { CreateUserRequest } from '../../app/types/shared/users'

export type DatabaseUser = User

export async function createUser(data: CreateUserRequest): Promise<DatabaseUser> {
  const passwordHash = await bcrypt.hash(data.password, 12)

  const [user] = await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  if (!user) {
    throw new Error('Failed to create user - no result returned')
  }

  return user
}

export async function findByUsernameOrEmail(usernameOrEmail: string): Promise<DatabaseUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.username, usernameOrEmail), eq(users.email, usernameOrEmail)))
    .limit(1)

  return user || null
}

export async function findById(id: number): Promise<DatabaseUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  return user || null
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
