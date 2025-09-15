import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { verifyPaymentSignature, SUBSCRIPTION_PLANS } from '@/lib/razorpay'
import { createSubscription, updateUserSubscription, createPayment } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    if (user instanceof NextResponse) {
      return user // Return error response
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      plan 
    } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    const planDetails = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]

    // Create subscription record
    const subscription = await createSubscription(
      user.id,
      plan,
      planDetails.price,
      razorpay_payment_id // Using payment ID as subscription ID for now
    )

    // Update user subscription
    await updateUserSubscription(user.id, plan, 'active')

    // Create payment record
    await createPayment(
      user.id,
      subscription.id,
      razorpay_payment_id,
      planDetails.price,
      'captured'
    )

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        id: subscription.id,
        plan: plan,
        status: 'active'
      }
    })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
