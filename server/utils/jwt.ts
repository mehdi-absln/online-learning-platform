import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface JWTPayload {
  userId: number
  username: string
  email: string
  iat?: number
  exp?: number
}

export class JWTService {
  static async generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Token expires in 7 days
      .sign(JWT_SECRET)
  }

  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload as JWTPayload
    } catch (error) {
      return null
    }
  }

  static async generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d') // Refresh token expires in 30 days
      .sign(JWT_SECRET)
  }
}
