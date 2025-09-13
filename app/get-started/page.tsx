"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Lightbulb, Users, Rocket } from "lucide-react"
import Link from "next/link"

export default function GetStartedPage() {
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Get Started</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to build your business? Follow our step-by-step guide to create a comprehensive business plan.
            </p>
          </motion.div>

          {/* Quick Start Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle>Your Business Planning Journey</CardTitle>
                <CardDescription>Complete these sections in order for the best results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      href: "/idea",
                      title: "Define Your Idea",
                      description: "Validate your business concept",
                      icon: Lightbulb,
                    },
                    {
                      href: "/market",
                      title: "Analyze Your Market",
                      description: "Research your target market",
                      icon: Users,
                    },
                    {
                      href: "/business-model",
                      title: "Design Business Model",
                      description: "Plan your revenue strategy",
                      icon: Rocket,
                    },
                    { href: "/team", title: "Build Your Team", description: "Assemble the right people", icon: Users },
                    {
                      href: "/mvp",
                      title: "Plan Your MVP",
                      description: "Define your minimum viable product",
                      icon: Rocket,
                    },
                    {
                      href: "/legals",
                      title: "Handle Legal Requirements",
                      description: "Ensure compliance",
                      icon: CheckCircle,
                    },
                    {
                      href: "/funding",
                      title: "Secure Funding",
                      description: "Plan your financial strategy",
                      icon: CheckCircle,
                    },
                    {
                      href: "/strategy",
                      title: "Develop Strategy",
                      description: "Create go-to-market plan",
                      icon: CheckCircle,
                    },
                    {
                      href: "/scaling",
                      title: "Plan for Scaling",
                      description: "Prepare for growth",
                      icon: CheckCircle,
                    },
                    {
                      href: "/sustainability",
                      title: "Ensure Sustainability",
                      description: "Build for the long term",
                      icon: CheckCircle,
                    },
                  ].map((step, index) => {
                    const Icon = step.icon
                    return (
                      <Link key={step.href} href={step.href}>
                        <div className="flex items-center p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer group">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-4">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <Icon className="h-5 w-5 text-muted-foreground mr-3" />
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {step.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <Link href="/idea">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start with Your Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
