import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { createUser, getUserByEmail, getUserById } from './db/schema'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export interface User {
  id: string
  email: string
  name: string
  subscription_plan: string
  subscription_status: string
}

// Create JWT token
export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    
    if (!payload || !payload.userId) {
      return null
    }

    const user = await getUserById(payload.userId as string)
    
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription_plan: user.subscription_plan,
      subscription_status: user.subscription_status
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(user: User) {
  const token = await createToken({ userId: user.id })
  
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  cookies().delete('auth-token')
}

// Register user
export async function registerUser(email: string, name: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await createUser(email, name, passwordHash)
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription_plan: user.subscription_plan,
      subscription_status: user.subscription_status
    }
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    // Get user by email
    const user = await getUserByEmail(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription_plan: user.subscription_plan,
      subscription_status: user.subscription_status
    }
  } catch (error) {
    console.error('Error logging in user:', error)
    throw error
  }
}

// Check if user has access to paid features
export function hasPaidAccess(user: User | null): boolean {
  if (!user) return false
  return user.subscription_plan !== 'free' && user.subscription_status === 'active'
}

// Check if user has premium access
export function hasPremiumAccess(user: User | null): boolean {
  if (!user) return false
  return user.subscription_plan === 'premium' && user.subscription_status === 'active'
}

// Middleware for protected routes
export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  return user
}

// Middleware for paid features
export async function requirePaidAccess(request: NextRequest) {
  const user = await getCurrentUser(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  if (!hasPaidAccess(user)) {
    return NextResponse.json(
      { error: 'Paid subscription required' },
      { status: 403 }
    )
  }
  
  return user
}
