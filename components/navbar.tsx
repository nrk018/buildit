"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Lightbulb,
  TrendingUp,
  Building2,
  Users,
  Rocket,
  Scale,
  DollarSign,
  Target,
  BarChart3,
  Leaf,
  ArrowRight,
  CheckCircle,
  User,
  LogOut,
  Crown,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const roadmapSteps = [
  { href: "/idea", label: "Idea", icon: Lightbulb, step: 1 },
  { href: "/market", label: "Market", icon: TrendingUp, step: 2 },
  { href: "/business-model", label: "Business Model", icon: Building2, step: 3 },
  { href: "/team", label: "Team", icon: Users, step: 4 },
  { href: "/mvp", label: "MVP", icon: Rocket, step: 5 },
  { href: "/legals", label: "Legals", icon: Scale, step: 6 },
  { href: "/funding", label: "Funding", icon: DollarSign, step: 7 },
  { href: "/strategy", label: "Strategy", icon: Target, step: 8 },
  { href: "/scaling", label: "Scaling", icon: BarChart3, step: 9 },
  { href: "/sustainability", label: "Sustainability", icon: Leaf, step: 10 },
]

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const currentStepIndex = roadmapSteps.findIndex((step) => step.href === pathname)
  const currentStep = roadmapSteps[currentStepIndex]
  const nextStep = roadmapSteps[currentStepIndex + 1]
  const isHomePage = pathname === "/"
  const isAuthPage = pathname === "/auth"
  const isDashboardPage = pathname === "/dashboard"
  const isPricingPage = pathname === "/pricing"

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-background" />
                </div>
                <span className="text-2xl font-bold text-foreground">buildit</span>
              </motion.div>
            </Link>

            {/* Roadmap Progress - Only show on project pages */}
            {!isAuthPage && !isDashboardPage && !isPricingPage && (
              <div className="hidden lg:flex items-center space-x-2">
                {roadmapSteps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = currentStepIndex > index
                  const isCurrent = step.href === pathname

                  return (
                    <div key={step.href} className="flex items-center">
                      <Link href={step.href}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-foreground text-background"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                          )}
                        >
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </motion.div>
                      </Link>
                      {index < roadmapSteps.length - 1 && (
                        <div
                          className={cn("w-8 h-0.5 mx-1 transition-colors", isCompleted ? "bg-green-500" : "bg-border")}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* User subscription status */}
                  <div className="hidden sm:flex items-center space-x-2">
                    {user.subscription_plan === 'free' ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/pricing">
                          <Star className="h-4 w-4 mr-2" />
                          Free Plan
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-600">
                        <Crown className="h-4 w-4 mr-2" />
                        {user.subscription_plan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
                      </Button>
                    )}
                  </div>

                  {/* User menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        {user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/pricing">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade Plan
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/pricing">Pricing</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {!isHomePage && currentStep && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-secondary/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-background">{currentStep.step}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{currentStep.label}</span>
                </div>

                {nextStep && (
                  <>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Link href={nextStep.href} className="group">
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center group-hover:bg-secondary/80">
                          <span className="text-xs font-bold">{nextStep.step}</span>
                        </div>
                        <span className="text-sm font-medium">{nextStep.label}</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Step {currentStep.step} of {roadmapSteps.length}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
