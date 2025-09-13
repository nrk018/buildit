"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  DollarSign, 
  Users, 
  Truck, 
  Heart, 
  Zap, 
  Repeat, 
  ArrowRight,
  GraduationCap,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  Brain,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Rocket,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

// Types
interface Problem {
  id: string
  title: string
  description: string
  category: string
  severity: string
  confidence: number
  impact: string
  urgency: string
  estimatedCost: string
  timeline: string
}

interface Solution {
  id: string
  title: string
  description: string
  category: string
  cost: string
  timeline: string
  effectiveness: number
  implementation: string[]
}

interface BusinessModel {
  campusImplementation: {
    methodology: string[]
    challenges: string[]
    opportunities: string[]
    partnerships: string[]
    timeline: string
  }
  businessStructure: {
    valueProposition: string
    customerSegments: string[]
    keyPartners: string[]
    keyActivities: string[]
    keyResources: string[]
    channels: string[]
    customerRelationships: string[]
    costStructure: string[]
    revenueStreams: string[]
  }
  timeline: {
    month1: string[]
    month2: string[]
    month3: string[]
    month4: string[]
    month5: string[]
    month6: string[]
  }
  tagline: string
  callToAction: string
}

export default function BusinessModelPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [businessModel, setBusinessModel] = useState<BusinessModel | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [selectedSolutions, setSelectedSolutions] = useState<Solution[]>([])

  // Load data from localStorage
  useEffect(() => {
    const savedProblems = localStorage.getItem('analyzedProblems')
    const savedSolutions = localStorage.getItem('generatedSolutions')
    
    if (savedProblems) {
      try {
        const parsedProblems = JSON.parse(savedProblems)
        setProblems(parsedProblems)
        if (parsedProblems.length > 0) {
          setSelectedProblem(parsedProblems[0])
        }
      } catch (error) {
        console.error('Error parsing saved problems:', error)
      }
    }

    if (savedSolutions) {
      try {
        const parsedSolutions = JSON.parse(savedSolutions)
        setSolutions(parsedSolutions)
        setSelectedSolutions(parsedSolutions)
      } catch (error) {
        console.error('Error parsing saved solutions:', error)
      }
    }
  }, [])

  // Generate business model
  const generateBusinessModel = async () => {
    if (!selectedProblem) {
      alert('Please analyze problems from the Idea page first.')
      return
    }

    // If no solutions are available, create mock solutions based on the problem
    let solutionsToUse = selectedSolutions
    if (solutionsToUse.length === 0) {
      solutionsToUse = [
        {
          id: 'mock_solution_1',
          title: `AI-Powered ${selectedProblem.category} Detection System`,
          description: `Automated detection and analysis system for ${selectedProblem.category.toLowerCase()} problems using computer vision and machine learning`,
          category: selectedProblem.category,
          cost: '₹5-10 lakhs',
          timeline: '3-6 months',
          effectiveness: 85,
          implementation: ['System setup', 'Data collection', 'Model training', 'Deployment', 'Testing']
        },
        {
          id: 'mock_solution_2',
          title: `Campus Integration Platform`,
          description: `Integrated platform for campus-wide implementation with student and faculty collaboration`,
          category: 'Integration',
          cost: '₹2-5 lakhs',
          timeline: '2-4 months',
          effectiveness: 90,
          implementation: ['Campus partnerships', 'Student training', 'System integration', 'Pilot testing']
        }
      ]
      setSelectedSolutions(solutionsToUse)
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-business-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: selectedProblem,
          solutions: solutionsToUse,
          marketContext: 'India',
          campusFocus: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate business model')
      }

      const data = await response.json()
      setBusinessModel(data.businessModel)
    } catch (error) {
      console.error('Error generating business model:', error)
      // Fallback to mock data
      setBusinessModel(generateFallbackBusinessModel(selectedProblem, solutionsToUse))
    } finally {
      setIsGenerating(false)
    }
  }

  // Fallback business model
  const generateFallbackBusinessModel = (problem: Problem | null, solutions: Solution[]): BusinessModel => ({
    campusImplementation: {
      methodology: [
        'Pilot program with 3-5 college departments',
        'Student internship program for development and testing',
        'Faculty collaboration for research and validation',
        'Gradual rollout across campus facilities',
        'Integration with existing college systems'
      ],
      challenges: [
        'Limited budget in college environment',
        'Student turnover and training requirements',
        'Infrastructure constraints',
        'Regulatory compliance in educational setting'
      ],
      opportunities: [
        'Access to motivated student talent',
        'Real-world testing environment',
        'Research collaboration opportunities',
        'Potential for government funding',
        'Scalable model for other colleges'
      ],
      partnerships: [
        'College administration and IT department',
        'Student organizations and clubs',
        'Local industry partners for internships',
        'Government education initiatives',
        'Technology vendors and suppliers'
      ],
      timeline: '6-month phased implementation starting with pilot program'
    },
    businessStructure: {
      valueProposition: `AI-powered ${problem?.category.toLowerCase() || 'problem'} solution specifically designed for college campuses, providing cost-effective problem detection and resolution`,
      customerSegments: [
        'College administrations and IT departments',
        'Student organizations and clubs',
        'Faculty and research departments',
        'Campus maintenance teams',
        'Local businesses serving college communities'
      ],
      keyPartners: [
        'College administration and IT departments',
        'Student development organizations',
        'Local technology vendors',
        'Government education initiatives',
        'Industry mentors and advisors'
      ],
      keyActivities: [
        'AI model development and training',
        'Campus integration and deployment',
        'Student training and support',
        'Data collection and analysis',
        'Continuous improvement and updates'
      ],
      keyResources: [
        'AI/ML development team',
        'Campus infrastructure access',
        'Student talent pool',
        'Technology partnerships',
        'Government and institutional funding'
      ],
      channels: [
        'Direct campus partnerships',
        'Student organization networks',
        'Faculty research collaborations',
        'Government education programs',
        'Industry conference presentations'
      ],
      customerRelationships: [
        'Personal assistance and support',
        'Community building and engagement',
        'Co-creation with students and faculty',
        'Regular feedback and iteration',
        'Long-term partnership development'
      ],
      costStructure: [
        'Development team salaries (₹8-12 lakhs/month)',
        'Infrastructure and cloud costs (₹50,000-1 lakh/month)',
        'Student stipends and internships (₹2-3 lakhs/month)',
        'Marketing and partnership development (₹1-2 lakhs/month)',
        'Legal and compliance (₹50,000/month)'
      ],
      revenueStreams: [
        'Campus licensing fees (₹5-10 lakhs per college annually)',
        'Student project and internship fees (₹2-5 lakhs per project)',
        'Government and institutional grants (₹10-50 lakhs annually)',
        'Industry partnership revenue sharing (₹3-8 lakhs annually)',
        'Consulting and training services (₹1-3 lakhs per engagement)'
      ]
    },
    timeline: {
      month1: [
        'Finalize college partnerships and pilot agreements',
        'Set up development team and infrastructure',
        'Begin AI model training with campus data',
        'Recruit student interns and project teams'
      ],
      month2: [
        'Deploy pilot system in 2-3 college departments',
        'Conduct initial testing and data collection',
        'Train campus staff and student users',
        'Establish feedback collection mechanisms'
      ],
      month3: [
        'Analyze pilot results and iterate on solution',
        'Expand to additional campus areas',
        'Develop student training programs',
        'Begin seeking additional funding and partnerships'
      ],
      month4: [
        'Full campus deployment and integration',
        'Launch student internship and project programs',
        'Establish industry partnerships',
        'Begin marketing to other colleges'
      ],
      month5: [
        'Optimize system performance and user experience',
        'Scale student programs and partnerships',
        'Prepare for expansion to additional colleges',
        'Develop case studies and success metrics'
      ],
      month6: [
        'Launch at 2-3 additional colleges',
        'Establish sustainable revenue streams',
        'Build strategic partnerships and alliances',
        'Plan for next phase of growth and expansion'
      ]
    },
    tagline: `"Transforming Campus Life Through AI-Powered ${problem?.category || 'Problem'} Solutions"`,
    callToAction: 'Ready to revolutionize campus problem-solving? Join our mission to create smarter, more efficient college environments through innovative AI technology.'
  })

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Campus Business Model</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Transform your idea into a sustainable campus-based business model with AI-powered solutions
            </p>
            
            {/* Problem and Solution Summary */}
            {selectedProblem && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Problem: {selectedProblem.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Solutions: {selectedSolutions.length} selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Focus: Campus Implementation</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Generate Business Model Button */}
          {!businessModel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-12"
            >
              <Button 
                size="lg" 
                onClick={generateBusinessModel}
                disabled={isGenerating || !selectedProblem}
                className="px-8 py-4 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Business Model...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Generate Campus Business Model
                  </>
                )}
              </Button>
              {!selectedProblem && (
                <p className="text-sm text-muted-foreground mt-4">
                  Please analyze problems from the Idea page first.
                </p>
              )}
              {selectedProblem && selectedSolutions.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  No solutions found. Will generate mock solutions based on your problem.
                </p>
              )}
            </motion.div>
          )}

          {/* Business Model Content */}
          <AnimatePresence>
            {businessModel && (
              <>
                {/* Campus Implementation Methodology */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-12"
                >
                  <Card className="vercel-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-green-500" />
                        Campus Implementation Methodology
                      </CardTitle>
                      <CardDescription>
                        How to implement your solution in a college environment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-green-600">Implementation Steps</h4>
                          <ul className="space-y-2">
                            {businessModel.campusImplementation.methodology.map((step, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3 text-yellow-600">Challenges</h4>
                          <ul className="space-y-2">
                            {businessModel.campusImplementation.challenges.map((challenge, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3 text-blue-600">Opportunities</h4>
                          <ul className="space-y-2">
                            {businessModel.campusImplementation.opportunities.map((opportunity, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <TrendingUp className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3 text-purple-600">Partnerships</h4>
                          <ul className="space-y-2">
                            {businessModel.campusImplementation.partnerships.map((partnership, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <Users className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                                {partnership}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Business Model Canvas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-12"
                >
                  <Card className="vercel-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        Business Model Canvas
                      </CardTitle>
                      <CardDescription>
                        Complete business structure for campus implementation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-blue-500" />
                                Key Partners
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.keyPartners.map((partner, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {partner}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                Key Activities
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.keyActivities.map((activity, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {activity}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                Key Resources
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.keyResources.map((resource, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {resource}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Center Column */}
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Heart className="h-4 w-4 text-red-500" />
                                Value Proposition
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-muted-foreground">{businessModel.businessStructure.valueProposition}</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Repeat className="h-4 w-4 text-green-500" />
                                Customer Relationships
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.customerRelationships.map((relationship, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {relationship}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Truck className="h-4 w-4 text-orange-500" />
                                Channels
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.channels.map((channel, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {channel}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-purple-500" />
                                Customer Segments
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.customerSegments.map((segment, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {segment}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-red-500" />
                                Cost Structure
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.costStructure.map((cost, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {cost}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                Revenue Streams
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {businessModel.businessStructure.revenueStreams.map((revenue, index) => (
                                  <li key={index} className="text-xs text-muted-foreground">• {revenue}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 6-Month Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-12"
                >
                  <Card className="vercel-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        6-Month Implementation Timeline
                      </CardTitle>
                      <CardDescription>
                        Detailed roadmap for campus implementation and business growth
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(businessModel.timeline).map(([month, tasks], index) => (
                          <Card key={month} className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-blue-500" />
                                Month {index + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {tasks.map((task, taskIndex) => (
                                  <li key={taskIndex} className="text-xs text-muted-foreground flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <Card className="vercel-card bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-purple-200">
                    <CardContent className="py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Rocket className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-4">
                        {businessModel.tagline}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {businessModel.callToAction}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="px-8 py-3">
                          Start Implementation
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 py-3">
                          Download Business Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  )
}