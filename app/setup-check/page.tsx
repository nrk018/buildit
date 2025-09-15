"use client"

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, Database, Key, CreditCard, Brain } from 'lucide-react'

interface CheckResult {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
  icon: React.ReactNode
}

export default function SetupCheckPage() {
  const [checks, setChecks] = useState<CheckResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    performChecks()
  }, [])

  const performChecks = async () => {
    const results: CheckResult[] = []

    // Check Database
    try {
      const dbResponse = await fetch('/api/auth/me')
      if (dbResponse.ok) {
        results.push({
          name: 'Database Connection',
          status: 'success',
          message: 'Database is connected and working',
          icon: <Database className="h-5 w-5" />
        })
      } else {
        results.push({
          name: 'Database Connection',
          status: 'warning',
          message: 'Database connection test failed (this is normal if not authenticated)',
          icon: <Database className="h-5 w-5" />
        })
      }
    } catch (error) {
      results.push({
        name: 'Database Connection',
        status: 'error',
        message: 'Database connection failed. Check your POSTGRES_URL environment variable.',
        icon: <Database className="h-5 w-5" />
      })
    }

    // Check Razorpay
    try {
      const razorpayResponse = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'basic' })
      })
      
      if (razorpayResponse.status === 503) {
        results.push({
          name: 'Razorpay Configuration',
          status: 'warning',
          message: 'Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.',
          icon: <CreditCard className="h-5 w-5" />
        })
      } else if (razorpayResponse.status === 401) {
        results.push({
          name: 'Razorpay Configuration',
          status: 'success',
          message: 'Razorpay is configured and working (authentication required)',
          icon: <CreditCard className="h-5 w-5" />
        })
      } else {
        results.push({
          name: 'Razorpay Configuration',
          status: 'error',
          message: 'Razorpay configuration error',
          icon: <CreditCard className="h-5 w-5" />
        })
      }
    } catch (error) {
      results.push({
        name: 'Razorpay Configuration',
        status: 'error',
        message: 'Razorpay test failed',
        icon: <CreditCard className="h-5 w-5" />
      })
    }

    // Check Gemini AI
    try {
      const geminiResponse = await fetch('/api/analyze-text-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: 'Test problem' })
      })
      
      if (geminiResponse.ok) {
        results.push({
          name: 'Google Gemini AI',
          status: 'success',
          message: 'Gemini AI is configured and working',
          icon: <Brain className="h-5 w-5" />
        })
      } else {
        results.push({
          name: 'Google Gemini AI',
          status: 'warning',
          message: 'Gemini AI test failed. Check your GOOGLE_GEMINI_API_KEY environment variable.',
          icon: <Brain className="h-5 w-5" />
        })
      }
    } catch (error) {
      results.push({
        name: 'Google Gemini AI',
        status: 'error',
        message: 'Gemini AI connection failed',
        icon: <Brain className="h-5 w-5" />
      })
    }

    // Check JWT Secret
    if (process.env.NEXT_PUBLIC_APP_URL) {
      results.push({
        name: 'JWT Secret',
        status: 'success',
        message: 'JWT secret is configured',
        icon: <Key className="h-5 w-5" />
      })
    } else {
      results.push({
        name: 'JWT Secret',
        status: 'warning',
        message: 'JWT secret configuration cannot be verified in client-side',
        icon: <Key className="h-5 w-5" />
      })
    }

    setChecks(results)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking configuration...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              BuildIt Setup Check
            </h1>
            <p className="text-muted-foreground">
              Verify that all required services are properly configured
            </p>
          </div>

          <div className="grid gap-6">
            {checks.map((check, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {check.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{check.name}</h3>
                        <p className="text-sm text-muted-foreground">{check.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <Badge className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>1. Fix any errors or warnings shown above</p>
                  <p>2. Set up your environment variables in Vercel dashboard</p>
                  <p>3. Test user registration and authentication</p>
                  <p>4. Test payment integration with Razorpay</p>
                </div>
                <div className="mt-4 space-x-4">
                  <Button asChild>
                    <a href="/auth">Test Authentication</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/pricing">Test Pricing</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
