import { eq, or } from 'drizzle-orm'
import { db } from './index'
import { users } from './schema'
import bcrypt from 'bcrypt'
import type { CreateUserRequest } from '../../app/types/shared/users'

// Server-side User interface with sensitive fields
export interface DatabaseUser {
  id: number
  username: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  static async createUser(data: CreateUserRequest): Promise<DatabaseUser> {
    const passwordHash = await bcrypt.hash(data.password, 12)

    const [user] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    return user
  }

  static async findByUsernameOrEmail(usernameOrEmail: string): Promise<DatabaseUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, usernameOrEmail), eq(users.email, usernameOrEmail)))
      .limit(1)

    return user || null
  }

  static async findById(id: number): Promise<DatabaseUser | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)

    return user || null
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
