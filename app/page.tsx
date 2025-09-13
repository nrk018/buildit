"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
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
  Play,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const roadmapSteps = [
  {
    href: "/idea",
    title: "Idea",
    description: "Define and validate your business concept",
    icon: Lightbulb,
    step: 1,
  },
  {
    href: "/market",
    title: "Market",
    description: "Analyze your target market and competition",
    icon: TrendingUp,
    step: 2,
  },
  {
    href: "/business-model",
    title: "Business Model",
    description: "Structure your revenue and operations",
    icon: Building2,
    step: 3,
  },
  {
    href: "/team",
    title: "Team",
    description: "Build and organize your team structure",
    icon: Users,
    step: 4,
  },
  {
    href: "/mvp",
    title: "MVP",
    description: "Plan your minimum viable product",
    icon: Rocket,
    step: 5,
  },
  {
    href: "/legals",
    title: "Legals",
    description: "Handle legal requirements and compliance",
    icon: Scale,
    step: 6,
  },
  {
    href: "/funding",
    title: "Funding",
    description: "Secure investment and financial planning",
    icon: DollarSign,
    step: 7,
  },
  {
    href: "/strategy",
    title: "Strategy",
    description: "Develop your go-to-market strategy",
    icon: Target,
    step: 8,
  },
  {
    href: "/scaling",
    title: "Scaling",
    description: "Plan for growth and expansion",
    icon: BarChart3,
    step: 9,
  },
  {
    href: "/sustainability",
    title: "Sustainability",
    description: "Build a sustainable business model",
    icon: Leaf,
    step: 10,
  },
]

export default function HomePage() {
  return (
    <Layout>
      <div className="relative">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Your Business Roadmap
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  From Idea to Scale
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Follow our proven 10-step roadmap to build, validate, and scale your business. Each step builds on the
                previous one, guiding you from initial concept to sustainable growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/idea">
                  <Button size="lg" className="px-8 py-3 text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your 10-Step Roadmap</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow this proven path to business success. Each step is designed to build on the previous one.
              </p>
            </motion.div>

            <div className="space-y-8">
              {roadmapSteps.map((step, index) => {
                const Icon = step.icon
                const isEven = index % 2 === 0

                return (
                  <motion.div
                    key={step.href}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className={cn("flex items-center gap-8", isEven ? "flex-row" : "flex-row-reverse")}
                  >
                    {/* Step Number and Connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mb-4">
                        <span className="text-xl font-bold text-background">{step.step}</span>
                      </div>
                      {index < roadmapSteps.length - 1 && <div className="w-0.5 h-16 bg-border" />}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <Link href={step.href}>
                        <Card className="vercel-card vercel-hover cursor-pointer group max-w-md">
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                                <Icon className="h-5 w-5 text-foreground" />
                              </div>
                              <CardTitle className="text-xl">{step.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-base leading-relaxed mb-4">
                              {step.description}
                            </CardDescription>
                            <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                              <span>Start Step {step.step}</span>
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Business Sections Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Business Planning</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Navigate through each essential aspect of building a successful business
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {roadmapSteps.map((section, index) => {
                const Icon = section.icon
                return (
                  <motion.div
                    key={section.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Link href={section.href}>
                      <Card className="vercel-card vercel-hover h-full cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-relaxed">{section.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Our Platform</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for entrepreneurs, by entrepreneurs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Comprehensive Planning",
                  description: "Cover every aspect of your business from initial idea to scaling strategy",
                },
                {
                  title: "Expert Guidance",
                  description: "Built-in best practices and frameworks used by successful companies",
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor your progress and stay on track with clear milestones",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + 0.1 * index }}
                >
                  <Card className="vercel-card text-center p-6">
                    <CardHeader>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
