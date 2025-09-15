import Razorpay from 'razorpay'

// Initialize Razorpay only if keys are available
export const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 999, // ₹9.99
    currency: 'INR',
    interval: 'monthly',
    features: [
      'Access to all 10 sections',
      'Project saving and loading',
      'PDF downloads',
      'Basic AI features',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium Plan',
    price: 1999, // ₹19.99
    currency: 'INR',
    interval: 'monthly',
    features: [
      'Everything in Basic',
      'Advanced AI features',
      'Priority support',
      'Custom branding',
      'API access',
      'Team collaboration'
    ]
  }
}

// Create Razorpay order
export async function createOrder(amount: number, currency: string = 'INR') {
  try {
    if (!razorpay) {
      throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `order_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

// Create Razorpay customer
export async function createCustomer(email: string, name: string) {
  try {
    if (!razorpay) {
      throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
    }

    const customer = await razorpay.customers.create({
      name,
      email,
    })
    return customer
  } catch (error) {
    console.error('Error creating Razorpay customer:', error)
    throw error
  }
}

// Create Razorpay subscription
export async function createSubscription(planId: string, customerId: string) {
  try {
    if (!razorpay) {
      throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: 12, // 12 months
      quantity: 1,
    })
    return subscription
  } catch (error) {
    console.error('Error creating Razorpay subscription:', error)
    throw error
  }
}

// Verify payment signature
export function verifyPaymentSignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): boolean {
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  return expectedSignature === razorpay_signature
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    if (!razorpay) {
      throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
    }

    const subscription = await razorpay.subscriptions.fetch(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error fetching subscription:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    if (!razorpay) {
      throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
    }

    const subscription = await razorpay.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}
