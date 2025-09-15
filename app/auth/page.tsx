"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Layout } from '@/components/layout'
import { Rocket, Users, Zap, Shield } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        router.push('/dashboard')
      }
    } catch (error) {
      // User is not authenticated
    }
  }

  const handleAuthSuccess = (user: any) => {
    setUser(user)
    router.push('/dashboard')
  }

  const features = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "AI-Powered Startup Builder",
      description: "Build your startup from idea to launch with AI assistance"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Project Management",
      description: "Save and manage multiple startup projects"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Advanced Features",
      description: "Access premium AI features and tools"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your data is secure and private"
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen flex">
        {/* Left side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">
              Build Your Startup with AI
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              From idea to launch, BuildIt helps you create, plan, and execute your startup vision with the power of artificial intelligence.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-blue-100">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {isLogin ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}