import { NextRequest, NextResponse } from 'next/server'
import { loginUser, setAuthCookie } from '@/lib/auth'
import { initDatabase } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    // Initialize database if needed
    await initDatabase()

    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Login user
    const user = await loginUser(email, password)

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
    console.error('Login error:', error)
    
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
