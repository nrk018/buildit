"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  Target, 
  ArrowRight, 
  Brain, 
  Building2, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Star,
  MapPin,
  GraduationCap,
  TrendingDown
} from "lucide-react"

// Types for our application state
interface Problem {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  confidence: number
  impact?: string
  urgency?: string
  estimatedCost?: string
  timeline?: string
}

interface Competitor {
  id: string
  name: string
  description: string
  website: string
  founded: string
  funding: string
  valuation: string
  employees: string
  pricing: string
  problemApproach: string
  solutionMethodology: string
  strengths: string[]
  weaknesses: string[]
  marketPosition: string
  relevanceScore: number
}

interface MarketAnalysis {
  totalMarketSize: string
  growthRate: string
  keyTrends: string[]
  marketGaps: string[]
  differentiationOpportunities: string[]
  collegeImplementation?: {
    opportunities: string[]
    challenges: string[]
    partnerships: string[]
  } | null
}

interface CompetitiveLandscape {
  directCompetitors: number
  indirectCompetitors: number
  marketMaturity: string
  barriersToEntry: string[]
  competitiveIntensity: string
}

export default function MarketPage() {
  // State management
  const [problems, setProblems] = useState<Problem[]>([])
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null)
  const [competitiveLandscape, setCompetitiveLandscape] = useState<CompetitiveLandscape | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [aiModel, setAiModel] = useState<string>('')
  const [userLocation, setUserLocation] = useState<string>('India')
  const [collegeContext, setCollegeContext] = useState<boolean>(false)

  // Load problems from localStorage on component mount
  useEffect(() => {
    const savedProblems = localStorage.getItem('analyzedProblems')
    if (savedProblems) {
      try {
        const parsedProblems = JSON.parse(savedProblems)
        setProblems(parsedProblems)
      } catch (error) {
        console.error('Error parsing saved problems:', error)
      }
    }
  }, [])

  // Detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For now, we'll use India as default, but this could be enhanced with reverse geocoding
          setUserLocation('India')
        },
        (error) => {
          console.log('Location access denied or failed:', error)
          setUserLocation('India') // Default to India
        }
      )
    } else {
      setUserLocation('India') // Default to India
    }
  }, [])

  // Analyze competitors when a problem is selected
  const analyzeCompetitors = async (problem: Problem) => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    
    try {
      const response = await fetch('/api/analyze-competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          problemCategory: problem.category,
          problemSeverity: problem.severity,
          userLocation: userLocation,
          collegeContext: collegeContext
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze competitors')
      }

      const data = await response.json()
      setCompetitors(data.competitors || [])
      setMarketAnalysis(data.marketAnalysis || null)
      setCompetitiveLandscape(data.competitiveLandscape || null)
      setAiModel(data.aiModel || 'AI Analysis')
      setAnalysisComplete(true)
    } catch (error) {
      console.error('Error analyzing competitors:', error)
      // Set fallback data
      setCompetitors([])
      setMarketAnalysis(null)
      setCompetitiveLandscape(null)
      setAiModel('Analysis Failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem)
    analyzeCompetitors(problem)
  }
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Market Analysis - India</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Select a problem from your analysis to get real-time competitor insights and market positioning in the Indian market
            </p>
            
            {/* Location and Context Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Location: {userLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="collegeContext"
                  checked={collegeContext}
                  onChange={(e) => setCollegeContext(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="collegeContext" className="text-sm font-medium flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-green-500" />
                  College Implementation Focus
                </label>
              </div>
            </div>
          </motion.div>

          {/* Problem Selection */}
          {problems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Select Problem for Market Analysis
                  </CardTitle>
                  <CardDescription>Choose a problem from your analysis to analyze the competitive landscape</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {problems.map((problem) => (
                      <Card
                        key={problem.id}
                        className={`cursor-pointer transition-all ${
                          selectedProblem?.id === problem.id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleProblemSelect(problem)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm">{problem.title}</h3>
                            <Badge
                              variant={
                                problem.severity === 'critical' ? 'destructive' :
                                problem.severity === 'high' ? 'destructive' :
                                problem.severity === 'medium' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {problem.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{problem.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">{problem.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(problem.confidence * 100)}% confidence
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <Card className="vercel-card">
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Problems Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to analyze problems on the Idea page first to see market analysis here.
                  </p>
                  <Button onClick={() => window.location.href = '/idea'}>
                    Go to Idea Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Analysis Progress */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12"
              >
                <Card className="vercel-card">
                  <CardContent className="text-center py-12">
                    <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-4">Analyzing Competitive Landscape...</h3>
                    <Progress value={75} className="w-full max-w-md mx-auto" />
                    <p className="text-muted-foreground mt-4">
                      Using AI to research competitors and market opportunities for: {selectedProblem?.title}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Market Analysis Results */}
          <AnimatePresence>
            {analysisComplete && selectedProblem && (
              <>
                {/* Selected Problem Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <Card className="vercel-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-red-500" />
                        Analyzing: {selectedProblem.title}
                      </CardTitle>
                      <CardDescription>Problem details and market context</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Problem Description</h4>
                          <p className="text-sm text-muted-foreground mb-4">{selectedProblem.description}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline">{selectedProblem.category}</Badge>
                            <Badge
                              variant={
                                selectedProblem.severity === 'critical' ? 'destructive' :
                                selectedProblem.severity === 'high' ? 'destructive' :
                                selectedProblem.severity === 'medium' ? 'secondary' : 'outline'
                              }
                            >
                              {selectedProblem.severity}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Impact & Urgency</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Impact:</strong> {selectedProblem.impact || 'Significant operational and safety risks'}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Urgency:</strong> {selectedProblem.urgency || 'Requires attention'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Confidence:</strong> {Math.round(selectedProblem.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Market Analysis */}
                {marketAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                  >
                    <Card className="vercel-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-500" />
                          Market Analysis
                        </CardTitle>
                        <CardDescription>Market size and growth opportunities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Market Size & Growth</h4>
                            <div className="space-y-3">
                              <div>
                                <span className="font-medium">Total Market Size:</span>
                                <span className="ml-2 text-green-600">{marketAnalysis.totalMarketSize}</span>
                              </div>
                              <div>
                                <span className="font-medium">Growth Rate:</span>
                                <span className="ml-2 text-blue-600">{marketAnalysis.growthRate}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Key Trends</h4>
                            <ul className="space-y-1">
                              {(marketAnalysis.keyTrends || []).map((trend, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-2 text-green-500" />
                                  {trend}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Competitive Landscape */}
                {competitiveLandscape && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                  >
                    <Card className="vercel-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-red-500" />
                          Competitive Landscape
                        </CardTitle>
                        <CardDescription>Market competition overview</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{competitiveLandscape.directCompetitors}</div>
                            <div className="text-sm text-muted-foreground">Direct Competitors</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{competitiveLandscape.indirectCompetitors}</div>
                            <div className="text-sm text-muted-foreground">Indirect Competitors</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{competitiveLandscape.marketMaturity}</div>
                            <div className="text-sm text-muted-foreground">Market Maturity</div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Market Barriers</h4>
                          <div className="flex flex-wrap gap-2">
                            {(competitiveLandscape.barriersToEntry || []).map((barrier, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {barrier}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Competitors Analysis */}
                {competitors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8"
                  >
                    <Card className="vercel-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-purple-500" />
                          Top Competitors
                        </CardTitle>
                        <CardDescription>Companies solving similar problems and how they approach it</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {competitors.map((competitor) => (
                            <Card key={competitor.id} className="vercel-card">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-lg font-semibold">{competitor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{competitor.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{competitor.marketPosition}</Badge>
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                      <span className="text-sm font-medium">{competitor.relevanceScore}%</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-2">How They Solve This Problem</h4>
                                    <p className="text-sm text-muted-foreground mb-3">{competitor.problemApproach}</p>
                                    
                                    <h4 className="font-semibold mb-2">Solution Methodology</h4>
                                    <p className="text-sm text-muted-foreground">{competitor.solutionMethodology}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Company Details</h4>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                      <div><strong>Founded:</strong> {competitor.founded}</div>
                                      <div><strong>Funding:</strong> {competitor.funding}</div>
                                      <div><strong>Valuation:</strong> {competitor.valuation}</div>
                                      <div><strong>Pricing:</strong> {competitor.pricing}</div>
                                      <div><strong>Employees:</strong> {competitor.employees}</div>
                                    </div>
                                    {competitor.website && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => window.open(competitor.website, '_blank')}
                                      >
                                        <ExternalLink className="h-3 w-3 mr-2" />
                                        Visit Website
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                      Strengths
                                    </h4>
                                    <ul className="space-y-1">
                                      {(competitor.strengths || []).map((strength, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                                          {strength}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                      Weaknesses
                                    </h4>
                                    <ul className="space-y-1">
                                      {(competitor.weaknesses || []).map((weakness, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                                          {weakness}
                                        </li>
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
                  </motion.div>
                )}

                {/* Differentiation Opportunities */}
                {marketAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                  >
                    <Card className="vercel-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Your Differentiation Opportunities
                        </CardTitle>
                        <CardDescription>How you can differentiate and compete effectively</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Market Gaps</h4>
                            <ul className="space-y-2">
                              {(marketAnalysis.marketGaps || []).map((gap, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start">
                                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {gap}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Differentiation Opportunities</h4>
                            <ul className="space-y-2">
                              {(marketAnalysis.differentiationOpportunities || []).map((opportunity, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start">
                                  <TrendingUp className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {opportunity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* AI Model Info */}
                {aiModel && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-xs text-muted-foreground">
                      Analysis powered by: {aiModel}
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

          {/* College Implementation Section */}
          {collegeContext && marketAnalysis?.collegeImplementation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-green-500" />
                    College Implementation Analysis
                  </CardTitle>
                  <CardDescription>
                    Opportunities and challenges for implementing this solution in Indian colleges and universities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Opportunities</h4>
                      <ul className="space-y-2">
                        {(marketAnalysis.collegeImplementation.opportunities || []).map((opportunity, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-yellow-600">Challenges</h4>
                      <ul className="space-y-2">
                        {(marketAnalysis.collegeImplementation.challenges || []).map((challenge, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600">Partnerships</h4>
                      <ul className="space-y-2">
                        {(marketAnalysis.collegeImplementation.partnerships || []).map((partnership, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <Users className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {partnership}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}
