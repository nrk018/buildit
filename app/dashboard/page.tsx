"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain, 
  Lightbulb, 
  Target, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  FileText,
  BarChart3,
  UserPlus,
  TestTube,
  Rocket,
  ArrowRight,
  Loader2,
  Sparkles
} from "lucide-react"

// Types for our AI co-founder system
interface StartupIdea {
  id: string
  title: string
  description: string
  problem: string
  solution: string
  targetMarket: string
  stage: 'idea' | 'validation' | 'mvp' | 'growth'
  progress: number
  createdAt: Date
}

interface ValidationExperiment {
  id: string
  title: string
  description: string
  cost: string
  timeToComplete: string
  successMetrics: string[]
  status: 'pending' | 'in_progress' | 'completed'
}

interface CofounderMatch {
  id: string
  name: string
  skills: string[]
  experience: string
  availability: string
  matchScore: number
  complementarySkills: string[]
}

export default function DashboardPage() {
  // State management
  const [currentIdea, setCurrentIdea] = useState<StartupIdea | null>(null)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [userPrompt, setUserPrompt] = useState('')
  const [startupPlan, setStartupPlan] = useState<any>(null)
  const [validationExperiments, setValidationExperiments] = useState<ValidationExperiment[]>([])
  const [cofounderMatches, setCofounderMatches] = useState<CofounderMatch[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  useEffect(() => {
    // Simulate existing startup ideas
    const mockIdea: StartupIdea = {
      id: '1',
      title: 'AI-Powered Study Buddy',
      description: 'An AI tutor that adapts to individual learning styles and helps students study more effectively',
      problem: 'Students struggle with personalized learning and often feel overwhelmed by traditional study methods',
      solution: 'AI-powered platform that creates custom study plans, tracks progress, and provides adaptive tutoring',
      targetMarket: 'College students aged 18-25',
      stage: 'validation',
      progress: 65,
      createdAt: new Date('2024-01-15')
    }
    setCurrentIdea(mockIdea)

    // Mock validation experiments
    const mockExperiments: ValidationExperiment[] = [
      {
        id: '1',
        title: 'Student Survey',
        description: 'Survey 100+ students about their study habits and pain points',
        cost: '$50',
        timeToComplete: '1 week',
        successMetrics: ['50+ responses', '80% completion rate', 'Clear pain points identified'],
        status: 'completed'
      },
      {
        id: '2',
        title: 'Landing Page Test',
        description: 'Create a landing page to gauge interest and collect email signups',
        cost: '$100',
        timeToComplete: '2 weeks',
        successMetrics: ['5% conversion rate', '200+ signups', 'Positive feedback'],
        status: 'in_progress'
      },
      {
        id: '3',
        title: 'Paid Ad Campaign',
        description: 'Run targeted Facebook/Instagram ads to test market demand',
        cost: '$200',
        timeToComplete: '1 week',
        successMetrics: ['$2 CAC', '10% CTR', 'Positive ROI'],
        status: 'pending'
      }
    ]
    setValidationExperiments(mockExperiments)

    // Mock co-founder matches
    const mockMatches: CofounderMatch[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        skills: ['Frontend Development', 'UI/UX Design', 'React'],
        experience: '2 years at Google, built 3 mobile apps',
        availability: 'Part-time (20hrs/week)',
        matchScore: 95,
        complementarySkills: ['Backend Development', 'AI/ML', 'Business Development']
      },
      {
        id: '2',
        name: 'Marcus Rodriguez',
        skills: ['Backend Development', 'Database Design', 'Python'],
        experience: '3 years at Microsoft, AI/ML specialist',
        availability: 'Full-time',
        matchScore: 88,
        complementarySkills: ['Frontend Development', 'UI/UX Design', 'Marketing']
      },
      {
        id: '3',
        name: 'Emily Johnson',
        skills: ['Marketing', 'Business Development', 'Sales'],
        experience: '4 years at startup, led 2 successful launches',
        availability: 'Part-time (15hrs/week)',
        matchScore: 82,
        complementarySkills: ['Technical Development', 'Product Management', 'Operations']
      }
    ]
    setCofounderMatches(mockMatches)
  }, [])

  // Generate startup plan from user prompt
  const generateStartupPlan = async () => {
    if (!userPrompt.trim()) return
    
    setIsGeneratingPlan(true)
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockPlan = {
        problemStatement: `Based on your idea: "${userPrompt}", we've identified the core problem and refined it into a clear statement.`,
        targetCustomer: 'Primary: College students aged 18-25 who struggle with study efficiency. Secondary: High school students preparing for college.',
        businessModel: 'Freemium SaaS model with premium features for advanced AI tutoring and analytics.',
        revenueStreams: ['Subscription plans ($9.99/month)', 'Premium features ($19.99/month)', 'Institutional licenses ($500/year)'],
        keyMetrics: ['Monthly Active Users', 'Conversion Rate', 'Customer Acquisition Cost', 'Lifetime Value'],
        nextSteps: [
          'Validate problem with 50+ student interviews',
          'Build MVP with core AI tutoring features',
          'Test with 100 beta users',
          'Iterate based on feedback',
          'Launch public beta'
        ],
        timeline: '3-6 months to MVP, 6-12 months to product-market fit',
        fundingNeeds: '$25,000 for MVP development and initial marketing'
      }
      
      setStartupPlan(mockPlan)
      setActiveTab('plan')
    } catch (error) {
      console.error('Error generating startup plan:', error)
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    AI Co-Founder
              </span>
            </h1>
                <p className="text-xl text-gray-300">Your intelligent startup companion from idea to MVP</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Start Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Generate Your Startup Plan
                </CardTitle>
                <CardDescription>
                  Describe your idea in a few sentences and get a comprehensive startup plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your startup idea... (e.g., 'I want to build an AI-powered study app that helps college students learn more effectively by adapting to their learning style')"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={generateStartupPlan}
                  disabled={!userPrompt.trim() || isGeneratingPlan}
                  size="lg"
                  className="w-full"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Generate Startup Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="plan">Startup Plan</TabsTrigger>
              <TabsTrigger value="cofounders">Find Co-Founders</TabsTrigger>
              <TabsTrigger value="financials">Financial Canvas</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="vercel-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Stage</p>
                        <p className="text-2xl font-bold capitalize">{currentIdea?.stage || 'Idea'}</p>
                      </div>
                      <Target className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="vercel-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Progress</p>
                        <p className="text-2xl font-bold">{currentIdea?.progress || 0}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                    <Progress value={currentIdea?.progress || 0} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="vercel-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Experiments</p>
                        <p className="text-2xl font-bold">{validationExperiments.length}</p>
                      </div>
                      <TestTube className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="vercel-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Co-Founder Matches</p>
                        <p className="text-2xl font-bold">{cofounderMatches.length}</p>
                      </div>
                      <UserPlus className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {currentIdea && (
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Current Startup Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{currentIdea.title}</h3>
                      <p className="text-muted-foreground">{currentIdea.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Problem</h4>
                        <p className="text-sm">{currentIdea.problem}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Solution</h4>
                        <p className="text-sm">{currentIdea.solution}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Target Market</h4>
                      <p className="text-sm">{currentIdea.targetMarket}</p>
                  </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Validation Experiments Tab */}
            <TabsContent value="validation" className="space-y-6">
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-purple-500" />
                    Idea Validation Experiments
                  </CardTitle>
                  <CardDescription>
                    Low-cost experiments to validate your startup idea before building
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {validationExperiments.map((experiment, index) => (
                      <Card key={experiment.id} className="vercel-card">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{experiment.title}</h3>
                              <p className="text-sm text-muted-foreground">{experiment.description}</p>
                            </div>
                            <Badge 
                              variant={
                                experiment.status === 'completed' ? 'default' :
                                experiment.status === 'in_progress' ? 'secondary' : 'outline'
                              }
                            >
                              {experiment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Cost:</span>
                              <p className="text-muted-foreground">{experiment.cost}</p>
                            </div>
                            <div>
                              <span className="font-medium">Timeline:</span>
                              <p className="text-muted-foreground">{experiment.timeToComplete}</p>
                            </div>
                            <div>
                              <span className="font-medium">Success Metrics:</span>
                              <ul className="text-muted-foreground">
                                {experiment.successMetrics.map((metric, i) => (
                                  <li key={i} className="text-xs">• {metric}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                </Card>
            </TabsContent>

            {/* Startup Plan Tab */}
            <TabsContent value="plan" className="space-y-6">
              {startupPlan ? (
                <div className="space-y-6">
                  <Card className="vercel-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Generated Startup Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Problem Statement</h3>
                        <p className="text-muted-foreground">{startupPlan.problemStatement}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Target Customer</h3>
                        <p className="text-muted-foreground">{startupPlan.targetCustomer}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Business Model</h3>
                        <p className="text-muted-foreground">{startupPlan.businessModel}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Revenue Streams</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {startupPlan.revenueStreams.map((stream: string, index: number) => (
                            <li key={index}>{stream}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Key Metrics</h3>
                        <div className="flex flex-wrap gap-2">
                          {startupPlan.keyMetrics.map((metric: string, index: number) => (
                            <Badge key={index} variant="outline">{metric}</Badge>
                          ))}
                        </div>
            </div>

                      <div>
                        <h3 className="font-semibold mb-2">Next Steps</h3>
                        <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                          {startupPlan.nextSteps.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Timeline</h3>
                          <p className="text-muted-foreground">{startupPlan.timeline}</p>
                  </div>
                        <div>
                          <h3 className="font-semibold mb-2">Funding Needs</h3>
                          <p className="text-muted-foreground">{startupPlan.fundingNeeds}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="vercel-card">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Startup Plan Generated Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Enter your startup idea above to generate a comprehensive plan
                    </p>
                    <Button onClick={() => setActiveTab('overview')}>
                      Go to Overview
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Co-Founder Matching Tab */}
            <TabsContent value="cofounders" className="space-y-6">
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-orange-500" />
                    Co-Founder Matches
                  </CardTitle>
                  <CardDescription>
                    Find complementary team members from your campus community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cofounderMatches.map((match) => (
                      <Card key={match.id} className="vercel-card">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{match.name}</h3>
                              <p className="text-sm text-muted-foreground">{match.experience}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="default" className="mb-2">
                                {match.matchScore}% Match
                              </Badge>
                              <p className="text-sm text-muted-foreground">{match.availability}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Skills</h4>
                              <div className="flex flex-wrap gap-1">
                                {match.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2">Complementary Skills Needed</h4>
                              <div className="flex flex-wrap gap-1">
                                {match.complementarySkills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <Button size="sm">Contact</Button>
                            <Button size="sm" variant="outline">View Profile</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                </Card>
            </TabsContent>

            {/* Financial Canvas Tab */}
            <TabsContent value="financials" className="space-y-6">
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Financial Canvas
                  </CardTitle>
                  <CardDescription>
                    Basic revenue, cost, and runway projections for your startup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Revenue Projections</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Month 1-3 (MVP)</span>
                          <span className="font-medium">₹0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Month 4-6 (Beta)</span>
                          <span className="font-medium">₹41,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Month 7-12 (Launch)</span>
                          <span className="font-medium">₹2,07,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Year 2</span>
                          <span className="font-medium">₹12,45,000</span>
                        </div>
                      </div>
                    </div>
                    
                  <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Cost Structure</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Development</span>
                          <span className="font-medium">₹6,64,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Marketing</span>
                          <span className="font-medium">₹2,49,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operations</span>
                          <span className="font-medium">₹1,66,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Legal/Admin</span>
                          <span className="font-medium">₹83,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Total Funding Needed</h4>
                        <p className="text-2xl font-bold">₹11,62,000</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Runway</h4>
                        <p className="text-2xl font-bold">12 months</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Break-even</h4>
                        <p className="text-2xl font-bold">Month 18</p>
                      </div>
            </div>
          </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
