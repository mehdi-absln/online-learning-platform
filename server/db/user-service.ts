import { eq, or } from 'drizzle-orm'
import { db } from './index'
import { users } from './schema'
import bcrypt from 'bcrypt'

export interface CreateUserData {
  username: string
  email: string
  password: string
}

export interface User {
  id: number
  username: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  static async createUser(data: CreateUserData): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 12)

    const [user] = await db.insert(users).values({
      username: data.username,
      email: data.email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return user
  }

  static async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, usernameOrEmail),
          eq(users.email, usernameOrEmail)
        )
      )
      .limit(1)

    return user || null
  }

  static async findById(id: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return user || null
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
