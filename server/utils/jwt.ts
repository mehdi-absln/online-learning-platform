import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from '~/types/auth'

const secret = process.env.JWT_SECRET

if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production')
}

const JWT_SECRET = new TextEncoder().encode(secret || 'dev-only-secret')

export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  }
  catch {
    return null
  }
}
