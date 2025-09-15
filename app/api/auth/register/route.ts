import { NextRequest, NextResponse } from 'next/server'
import { registerUser, setAuthCookie } from '@/lib/auth'
import { initDatabase } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    // Initialize database if needed
    await initDatabase()

    const { email, name, password } = await request.json()

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Register user
    const user = await registerUser(email, name, password)

    // Set auth cookie
    await setAuthCookie(user)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_plan: user.subscription_plan,
        subscription_status: user.subscription_status
      }
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
