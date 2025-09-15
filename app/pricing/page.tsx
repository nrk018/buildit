"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Star, Zap, Users, Shield, ArrowRight } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  subscription_plan: string
  subscription_status: string
}

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Access to basic features',
      '1 project',
      'Basic AI assistance',
      'Community support'
    ],
    limitations: [
      'Limited AI features',
      'No PDF downloads',
      'No project saving'
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outline' as const,
    popular: false
  },
  {
    name: 'Basic',
    price: 999,
    period: 'month',
    description: 'For serious entrepreneurs',
    features: [
      'Everything in Free',
      'Unlimited projects',
      'Advanced AI features',
      'PDF downloads',
      'Project saving & loading',
      'Email support',
      'Priority features'
    ],
    limitations: [],
    buttonText: 'Upgrade to Basic',
    buttonVariant: 'default' as const,
    popular: true
  },
  {
    name: 'Premium',
    price: 1999,
    period: 'month',
    description: 'For growing startups',
    features: [
      'Everything in Basic',
      'Premium AI features',
      'Custom branding',
      'API access',
      'Team collaboration',
      'Priority support',
      'Advanced analytics',
      'White-label options'
    ],
    limitations: [],
    buttonText: 'Upgrade to Premium',
    buttonVariant: 'default' as const,
    popular: false
  }
]

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
      }
    } catch (error) {
      // User is not authenticated
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth'
      return
    }

    setProcessing(plan)

    try {
      // Create Razorpay order
      const response = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (data.success) {
        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'BuildIt',
          description: `${data.plan.name} Subscription`,
          order_id: data.order.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch('/api/subscription/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Update user state
              setUser(prev => prev ? {
                ...prev,
                subscription_plan: plan,
                subscription_status: 'active'
              } : null)
              
              // Redirect to dashboard
              window.location.href = '/dashboard'
            } else {
              alert('Payment verification failed')
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#3B82F6',
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        alert('Failed to create order')
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start building your startup with AI-powered tools. Upgrade anytime to unlock more features and grow your business.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      {plan.name === 'Free' ? (
                        <Star className="h-8 w-8 text-gray-600" />
                      ) : plan.name === 'Basic' ? (
                        <Zap className="h-8 w-8 text-blue-600" />
                      ) : (
                        <Crown className="h-8 w-8 text-yellow-600" />
                      )}
                    </div>
                    
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ₹{plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                      
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="flex items-start text-muted-foreground">
                          <span className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0">•</span>
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      variant={plan.buttonVariant}
                      disabled={
                        processing === plan.toLowerCase() ||
                        (user && user.subscription_plan === plan.name.toLowerCase())
                      }
                      onClick={() => handleUpgrade(plan.name.toLowerCase())}
                    >
                      {processing === plan.toLowerCase() ? (
                        'Processing...'
                      ) : user && user.subscription_plan === plan.name.toLowerCase() ? (
                        'Current Plan'
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Feature Comparison
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Features</h3>
                <div className="space-y-3 text-sm">
                  <div>Projects</div>
                  <div>AI Features</div>
                  <div>PDF Downloads</div>
                  <div>Project Saving</div>
                  <div>Support</div>
                  <div>API Access</div>
                  <div>Team Collaboration</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-center">Free</h3>
                <div className="space-y-3 text-sm text-center">
                  <div>1</div>
                  <div>Basic</div>
                  <div>❌</div>
                  <div>❌</div>
                  <div>Community</div>
                  <div>❌</div>
                  <div>❌</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-center">Basic</h3>
                <div className="space-y-3 text-sm text-center">
                  <div>Unlimited</div>
                  <div>Advanced</div>
                  <div>✅</div>
                  <div>✅</div>
                  <div>Email</div>
                  <div>❌</div>
                  <div>❌</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-center">Premium</h3>
                <div className="space-y-3 text-sm text-center">
                  <div>Unlimited</div>
                  <div>Premium</div>
                  <div>✅</div>
                  <div>✅</div>
                  <div>Priority</div>
                  <div>✅</div>
                  <div>✅</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can start with our free plan and upgrade when you need more features.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel your subscription anytime. You'll continue to have access until the end of your billing period.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
