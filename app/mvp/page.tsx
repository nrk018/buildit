"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Rocket, Target, CheckCircle, Clock, Users, Zap, ArrowRight, Plus, X, FlaskConical, FileText, Download, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function MVPPage() {
  const [features, setFeatures] = useState([
    { id: 1, name: "", description: "", priority: "high", effort: "", userStory: "" },
  ])
  const [experiments, setExperiments] = useState(null)
  const [mvpDocument, setMvpDocument] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('mvp-planning')
  const [mvpData, setMvpData] = useState({
    goal: '',
    targetUsers: '',
    successMetrics: '',
    techStack: '',
    integrations: '',
    technicalConstraints: '',
    architecture: '',
    phase1: '',
    phase2: '',
    phase3: '',
    launchDate: '',
    developmentBudget: '',
    testingApproach: '',
    testUsers: '',
    testingDuration: '',
    feedbackCollection: '',
    iterationPlan: ''
  })

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        id: Date.now(),
        name: "",
        description: "",
        priority: "medium",
        effort: "",
        userStory: "",
      },
    ])
  }

  const removeFeature = (id: number) => {
    setFeatures(features.filter((feature) => feature.id !== id))
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
  }

  // Load experiments and user data when component mounts
  useEffect(() => {
    loadExperiments()
    loadUserData()
  }, [])

  // Function to load user data from localStorage
  const loadUserData = () => {
    try {
      // Load problem statement and related data
      const problemStatement = localStorage.getItem('problemStatement') || ''
      const analyzedProblems = JSON.parse(localStorage.getItem('analyzedProblems') || '[]')
      const generatedSolutions = JSON.parse(localStorage.getItem('generatedSolutions') || '[]')
      const businessModel = JSON.parse(localStorage.getItem('businessModel') || '{}')
      const teamData = JSON.parse(localStorage.getItem('teamData') || '{}')
      const marketAnalysis = JSON.parse(localStorage.getItem('marketAnalysis') || '{}')
      
      // Auto-populate MVP data based on user's idea
      if (problemStatement) {
        setMvpData(prev => ({
          ...prev,
          goal: prev.goal || `Validate the core value proposition for: ${problemStatement.substring(0, 100)}...`,
          targetUsers: prev.targetUsers || 'College students and campus administrators',
          successMetrics: prev.successMetrics || 'User engagement, problem resolution rate, user satisfaction',
          techStack: prev.techStack || 'React, Node.js, Python, AI/ML frameworks',
          integrations: prev.integrations || 'Campus systems, mobile apps, web platforms',
          technicalConstraints: prev.technicalConstraints || 'Budget limitations, campus infrastructure, user adoption',
          architecture: prev.architecture || 'Scalable cloud-based architecture with mobile-first design',
          phase1: prev.phase1 || 'Core feature development and initial user testing',
          phase2: prev.phase2 || 'Feature enhancement and user feedback integration',
          phase3: prev.phase3 || 'Full deployment and scaling',
          launchDate: prev.launchDate || '3-6 months from development start',
          developmentBudget: prev.developmentBudget || '₹2,00,000 - ₹5,00,000',
          testingApproach: prev.testingApproach || 'User testing with campus community, A/B testing',
          testUsers: prev.testUsers || '50-100 initial users from target campus',
          testingDuration: prev.testingDuration || '4-6 weeks',
          feedbackCollection: prev.feedbackCollection || 'Surveys, interviews, usage analytics',
          iterationPlan: prev.iterationPlan || 'Weekly sprints with user feedback integration'
        }))
      }

      // Auto-populate features based on solutions
      if (generatedSolutions.length > 0) {
        const autoFeatures = generatedSolutions.slice(0, 5).map((solution, index) => ({
          id: Date.now() + index,
          name: solution.title || `Feature ${index + 1}`,
          description: solution.description || 'Auto-generated feature description',
          priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
          effort: index < 2 ? 'High' : index < 4 ? 'Medium' : 'Low',
          userStory: `As a user, I want ${solution.title?.toLowerCase() || 'this feature'} so that I can ${solution.description?.toLowerCase().substring(0, 50) || 'achieve my goals'}`
        }))
        
        if (features.length === 1 && !features[0].name) {
          setFeatures(autoFeatures)
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  // Function to load experiments
  const loadExperiments = async () => {
    setLoading(true)
    try {
      const problemStatement = localStorage.getItem('problemStatement') || 
        'AI-powered campus safety system to detect and prevent safety hazards using computer vision and IoT sensors'
      
      const response = await fetch('/api/generate-experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement,
          businessModel: JSON.parse(localStorage.getItem('businessModel') || '{}'),
          targetMarket: localStorage.getItem('targetMarket') || 'College campuses in India',
          mvpGoal: mvpData.goal || 'Validate the core value proposition and achieve product-market fit',
          features: features.filter(f => f.name && f.description)
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setExperiments(data.experiments)
      }
    } catch (error) {
      console.error('Error loading experiments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to generate MVP document
  const generateMVPDocument = async () => {
    setLoading(true)
    try {
      // Gather all user-specific data
      const problemStatement = localStorage.getItem('problemStatement') || ''
      const analyzedProblems = JSON.parse(localStorage.getItem('analyzedProblems') || '[]')
      const generatedSolutions = JSON.parse(localStorage.getItem('generatedSolutions') || '[]')
      const businessModel = JSON.parse(localStorage.getItem('businessModel') || '{}')
      const teamData = JSON.parse(localStorage.getItem('teamData') || '{}')
      const marketAnalysis = JSON.parse(localStorage.getItem('marketAnalysis') || '{}')
      const pitchDocument = JSON.parse(localStorage.getItem('pitchDocument') || '{}')
      const imageAnalysis = JSON.parse(localStorage.getItem('imageAnalysis') || '{}')
      
      const response = await fetch('/api/generate-mvp-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement,
          analyzedProblems,
          generatedSolutions,
          businessModel,
          teamData,
          marketAnalysis,
          pitchDocument,
          imageAnalysis,
          mvpData: {
            ...mvpData,
            features: features.filter(f => f.name && f.description)
          },
          experiments,
          targetMarket: localStorage.getItem('targetMarket') || 'College campuses in India',
          industry: localStorage.getItem('industry') || 'EdTech/Safety Technology',
          userLocation: 'India',
          collegeContext: true
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMvpDocument(data.mvpDocument)
        setActiveTab('mvp-document')
      }
    } catch (error) {
      console.error('Error generating MVP document:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to download MVP document
  const downloadMVPDocument = () => {
    if (!mvpDocument) return

    // Get user-specific data for the document
    const problemStatement = localStorage.getItem('problemStatement') || ''
    const teamData = JSON.parse(localStorage.getItem('teamData') || '{}')
    const businessModel = JSON.parse(localStorage.getItem('businessModel') || '{}')
    const marketAnalysis = JSON.parse(localStorage.getItem('marketAnalysis') || '{}')
    const generatedSolutions = JSON.parse(localStorage.getItem('generatedSolutions') || '[]')

    const documentContent = generateComprehensiveMVPDocument(mvpDocument, problemStatement, teamData, businessModel, marketAnalysis, generatedSolutions, mvpData, features, experiments)

    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MVP_Document_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to generate comprehensive MVP document content
  const generateComprehensiveMVPDocument = (mvpDoc: any, problemStatement: string, teamData: any, businessModel: any, marketAnalysis: any, generatedSolutions: any[], mvpData: any, features: any[], experiments: any) => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    return `
MVP DOCUMENT
${problemStatement.toUpperCase()}

Generated on: ${currentDate} at ${currentTime}
Document Version: 1.0

================================================================================
EXECUTIVE SUMMARY
================================================================================

Problem Statement:
${mvpDoc.executiveSummary.problemStatement}

Solution Overview:
${mvpDoc.executiveSummary.solutionOverview}

Market Opportunity:
${mvpDoc.executiveSummary.marketOpportunity}

Value Propositions:
${mvpDoc.executiveSummary.valuePropositions.map((vp: string, index: number) => `${index + 1}. ${vp}`).join('\n')}

Team Overview:
${mvpDoc.executiveSummary.teamOverview}

MVP Goals:
${mvpDoc.executiveSummary.mvpGoals.map((goal: string, index: number) => `${index + 1}. ${goal}`).join('\n')}

Success Metrics:
${mvpDoc.executiveSummary.successMetrics.map((metric: string, index: number) => `${index + 1}. ${metric}`).join('\n')}

================================================================================
MARKET ANALYSIS
================================================================================

Target Market:
${mvpDoc.marketAnalysis.targetMarket}

Market Size:
${mvpDoc.marketAnalysis.marketSize}

Competitive Landscape:
${mvpDoc.marketAnalysis.competitiveLandscape}

Customer Segments:
${mvpDoc.marketAnalysis.customerSegments.map((segment: string, index: number) => `${index + 1}. ${segment}`).join('\n')}

================================================================================
PRODUCT OVERVIEW
================================================================================

Feature Set:
${mvpDoc.productOverview.featureSet.map((feature: string, index: number) => `${index + 1}. ${feature}`).join('\n')}

User Stories:
${mvpDoc.productOverview.userStories.map((story: string, index: number) => `${index + 1}. ${story}`).join('\n')}

Technical Architecture:
${mvpDoc.productOverview.technicalArchitecture}

User Experience Flow:
${mvpDoc.productOverview.userExperienceFlow}

================================================================================
TEAM & ORGANIZATION
================================================================================

Team Structure:
${mvpDoc.teamOrganization.teamStructure}

Key Members:
${mvpDoc.teamOrganization.keyMembers.map((member: string, index: number) => `${index + 1}. ${member}`).join('\n')}

Organizational Chart:
${mvpDoc.teamOrganization.organizationalChart}

Hiring Plan:
${mvpDoc.teamOrganization.hiringPlan}

================================================================================
BUSINESS MODEL
================================================================================

Revenue Streams:
${mvpDoc.businessModel.revenueStreams.map((stream: string, index: number) => `${index + 1}. ${stream}`).join('\n')}

Pricing Strategy:
${mvpDoc.businessModel.pricingStrategy}

Cost Structure:
${mvpDoc.businessModel.costStructure}

Key Partnerships:
${mvpDoc.businessModel.keyPartnerships.map((partnership: string, index: number) => `${index + 1}. ${partnership}`).join('\n')}

================================================================================
VALIDATION STRATEGY
================================================================================

Experiment Plan:
${mvpDoc.validationStrategy.experimentPlan}

Success Metrics:
${mvpDoc.validationStrategy.successMetrics.map((metric: string, index: number) => `${index + 1}. ${metric}`).join('\n')}

Risk Mitigation:
${mvpDoc.validationStrategy.riskMitigation}

Iteration Plan:
${mvpDoc.validationStrategy.iterationPlan}

================================================================================
DEVELOPMENT PLAN
================================================================================

Technical Requirements:
${mvpDoc.developmentPlan.technicalRequirements}

Development Timeline:
${mvpDoc.developmentPlan.developmentTimeline}

Resource Allocation:
${mvpDoc.developmentPlan.resourceAllocation}

Launch Strategy:
${mvpDoc.developmentPlan.launchStrategy}

================================================================================
FINANCIAL PROJECTIONS
================================================================================

Development Costs:
${mvpDoc.financialProjections.developmentCosts}

Operating Expenses:
${mvpDoc.financialProjections.operatingExpenses}

Revenue Projections:
${mvpDoc.financialProjections.revenueProjections}

Funding Requirements:
${mvpDoc.financialProjections.fundingRequirements}

================================================================================
MVP PLANNING DETAILS
================================================================================

MVP Goal:
${mvpData.goal || 'Not specified'}

Target Users:
${mvpData.targetUsers || 'Not specified'}

Success Metrics:
${mvpData.successMetrics || 'Not specified'}

Tech Stack:
${mvpData.techStack || 'Not specified'}

Integrations:
${mvpData.integrations || 'Not specified'}

Technical Constraints:
${mvpData.technicalConstraints || 'Not specified'}

Architecture:
${mvpData.architecture || 'Not specified'}

Development Phases:
Phase 1: ${mvpData.phase1 || 'Not specified'}
Phase 2: ${mvpData.phase2 || 'Not specified'}
Phase 3: ${mvpData.phase3 || 'Not specified'}

Launch Date:
${mvpData.launchDate || 'Not specified'}

Development Budget:
${mvpData.developmentBudget || 'Not specified'}

Testing Approach:
${mvpData.testingApproach || 'Not specified'}

Test Users:
${mvpData.testUsers || 'Not specified'}

Testing Duration:
${mvpData.testingDuration || 'Not specified'}

Feedback Collection:
${mvpData.feedbackCollection || 'Not specified'}

Iteration Plan:
${mvpData.iterationPlan || 'Not specified'}

================================================================================
MVP FEATURES
================================================================================

${features.filter(f => f.name && f.description).map((feature, index) => `
Feature ${index + 1}: ${feature.name}
Description: ${feature.description}
Priority: ${feature.priority}
Effort: ${feature.effort}
User Story: ${feature.userStory}
`).join('\n')}

================================================================================
VALIDATION EXPERIMENTS
================================================================================

${experiments ? Object.entries(experiments).map(([key, experiment]: [string, any]) => `
${key.toUpperCase()}:
${experiment.description || 'No description available'}
Cost: ${experiment.cost || 'Not specified'}
Timeline: ${experiment.timeline || 'Not specified'}
Success Metrics: ${experiment.successMetrics || 'Not specified'}
`).join('\n') : 'No experiments available'}

================================================================================
GENERATED SOLUTIONS INTEGRATION
================================================================================

${generatedSolutions.length > 0 ? generatedSolutions.map((solution, index) => `
Solution ${index + 1}: ${solution.title}
Description: ${solution.description}
Category: ${solution.category}
Cost: ${solution.cost}
Timeline: ${solution.timeline}
Effectiveness: ${solution.effectiveness}%
Implementation: ${solution.implementation.join(', ')}
`).join('\n') : 'No solutions available'}

================================================================================
TEAM DETAILS
================================================================================

${teamData.founder ? `
Founder:
Name: ${teamData.founder.name || 'Not specified'}
Title: ${teamData.founder.title || 'Not specified'}
Background: ${teamData.founder.background || 'Not specified'}
Motivation: ${teamData.founder.motivation || 'Not specified'}
` : 'No founder information available'}

Team Members:
${teamData.teamMembers && teamData.teamMembers.length > 0 ? teamData.teamMembers.map((member: any, index: number) => `
${index + 1}. ${member.name}
   Role: ${member.role}
   Skills: ${member.skills}
   Equity: ${member.equity}
   Commitment: ${member.commitment}
`).join('\n') : 'No team members added'}

Advisors:
${teamData.advisors && teamData.advisors.length > 0 ? teamData.advisors.map((advisor: any, index: number) => `
${index + 1}. ${advisor.name}
   Role: ${advisor.role}
   Expertise: ${advisor.expertise}
   Company: ${advisor.company}
   Contact: ${advisor.contact}
`).join('\n') : 'No advisors added'}

Mentors:
${teamData.mentors && teamData.mentors.length > 0 ? teamData.mentors.map((mentor: any, index: number) => `
${index + 1}. ${mentor.name}
   Role: ${mentor.role}
   Expertise: ${mentor.expertise}
   Company: ${mentor.company}
   Contact: ${mentor.contact}
`).join('\n') : 'No mentors added'}

================================================================================
DOCUMENT SUMMARY
================================================================================

Total MVP Features: ${features.filter(f => f.name && f.description).length}
Total Team Members: ${teamData.teamMembers ? teamData.teamMembers.length : 0}
Total Advisors: ${teamData.advisors ? teamData.advisors.length : 0}
Total Mentors: ${teamData.mentors ? teamData.mentors.length : 0}
Total Solutions: ${generatedSolutions.length}
Total Experiments: ${experiments ? Object.keys(experiments).length : 0}

Document Generated: ${currentDate} at ${currentTime}
Generated by: BuildIt AI Platform
Problem Statement: ${problemStatement.substring(0, 100)}${problemStatement.length > 100 ? '...' : ''}

---
This MVP document was generated specifically for your analysis of "${problemStatement.substring(0, 50)}${problemStatement.length > 50 ? '...' : ''}" 
and includes comprehensive planning for implementation, team structure, and validation strategy.

For questions or support, please refer to the BuildIt AI Platform documentation.
    `
  }

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
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">MVP Planning</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Define your Minimum Viable Product to validate your business idea with the least effort and maximum
              learning
            </p>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mvp-planning">MVP Planning</TabsTrigger>
              <TabsTrigger value="experiments">Experiments</TabsTrigger>
              <TabsTrigger value="mvp-document">Final Document</TabsTrigger>
            </TabsList>

            {/* MVP Planning Tab */}
            <TabsContent value="mvp-planning" className="space-y-6">
              {/* MVP Definition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  MVP Definition
                </CardTitle>
                <CardDescription>Define the core purpose and scope of your MVP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mvp-goal">Primary goal</Label>
                  <Textarea
                    id="mvp-goal"
                    placeholder="What is the main objective of your MVP? What do you want to learn or validate?"
                    className="mt-2"
                    value={mvpData.goal}
                    onChange={(e) => setMvpData({...mvpData, goal: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="target-users">Target users for MVP</Label>
                  <Textarea
                    id="target-users"
                    placeholder="Who are the specific users you're targeting with this MVP?"
                    className="mt-2"
                    value={mvpData.targetUsers}
                    onChange={(e) => setMvpData({...mvpData, targetUsers: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="success-metrics">Success metrics</Label>
                  <Textarea
                    id="success-metrics"
                    placeholder="How will you measure the success of your MVP? (user engagement, conversion rates, feedback scores)"
                    className="mt-2"
                    value={mvpData.successMetrics}
                    onChange={(e) => setMvpData({...mvpData, successMetrics: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Core Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Core Features
                    </CardTitle>
                    <CardDescription>List the essential features for your MVP</CardDescription>
                  </div>
                  <Button onClick={addFeature} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {features.map((feature, index) => (
                  <div key={feature.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Feature {index + 1}</h4>
                      {features.length > 1 && (
                        <Button
                          onClick={() => removeFeature(feature.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`feature-name-${feature.id}`}>Feature name</Label>
                        <Input id={`feature-name-${feature.id}`} placeholder="User authentication" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor={`feature-priority-${feature.id}`}>Priority</Label>
                        <select
                          id={`feature-priority-${feature.id}`}
                          className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`feature-description-${feature.id}`}>Description</Label>
                      <Textarea
                        id={`feature-description-${feature.id}`}
                        placeholder="Describe what this feature does and why it's important"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`feature-user-story-${feature.id}`}>User story</Label>
                      <Textarea
                        id={`feature-user-story-${feature.id}`}
                        placeholder="As a [user type], I want [functionality] so that [benefit]"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`feature-effort-${feature.id}`}>Development effort</Label>
                      <Input
                        id={`feature-effort-${feature.id}`}
                        placeholder="Hours, days, or story points"
                        className="mt-2"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Technical Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Technical Requirements
                </CardTitle>
                <CardDescription>Define the technical scope and constraints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tech-stack">Technology stack</Label>
                    <Textarea
                      id="tech-stack"
                      placeholder="Frontend, backend, database, hosting platform..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="integrations">Third-party integrations</Label>
                    <Textarea
                      id="integrations"
                      placeholder="Payment processors, APIs, analytics tools..."
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="technical-constraints">Technical constraints</Label>
                  <Textarea
                    id="technical-constraints"
                    placeholder="Budget limitations, time constraints, team skills, scalability requirements"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="architecture">System architecture</Label>
                  <Textarea id="architecture" placeholder="High-level system design and data flow" className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Development Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Development Timeline
                </CardTitle>
                <CardDescription>Plan your MVP development phases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phase-1">Phase 1 (Weeks 1-2)</Label>
                    <Textarea
                      id="phase-1"
                      placeholder="Core functionality and basic features"
                      className="mt-2 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase-2">Phase 2 (Weeks 3-4)</Label>
                    <Textarea
                      id="phase-2"
                      placeholder="Additional features and integrations"
                      className="mt-2 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase-3">Phase 3 (Weeks 5-6)</Label>
                    <Textarea
                      id="phase-3"
                      placeholder="Testing, refinement, and launch prep"
                      className="mt-2 min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="launch-date">Target launch date</Label>
                    <Input id="launch-date" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="development-budget">Development budget</Label>
                    <Input id="development-budget" placeholder="₹8,30,000" className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Testing & Validation Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Testing & Validation Plan
                </CardTitle>
                <CardDescription>How will you test and validate your MVP?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testing-approach">Testing approach</Label>
                  <Textarea
                    id="testing-approach"
                    placeholder="Beta testing, user interviews, A/B testing, analytics tracking..."
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="test-users">Number of test users</Label>
                    <Input id="test-users" placeholder="50-100 users" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="testing-duration">Testing duration</Label>
                    <Input id="testing-duration" placeholder="2-4 weeks" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="feedback-collection">Feedback collection method</Label>
                  <Textarea
                    id="feedback-collection"
                    placeholder="Surveys, interviews, in-app feedback, usage analytics..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="iteration-plan">Iteration plan</Label>
                  <Textarea
                    id="iteration-plan"
                    placeholder="How will you incorporate feedback and iterate on the MVP?"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center"
              >
                <Button 
                  size="lg" 
                  className="px-8 py-3"
                  onClick={() => setActiveTab('experiments')}
                >
                  View Validation Experiments
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </TabsContent>

            {/* Experiments Tab */}
            <TabsContent value="experiments" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-purple-500" />
                      Low-Cost Validation Experiments
                    </CardTitle>
                    <CardDescription>
                      Validate your MVP assumptions with these 3 low-cost experiments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Generating experiments...</p>
                      </div>
                    ) : experiments ? (
                      <div className="space-y-6">
                        {/* Survey Experiment */}
                        <div className="border border-border rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{experiments?.surveyExperiment?.title || 'Loading...'}</h3>
                              <p className="text-sm text-muted-foreground">Cost: {experiments?.surveyExperiment?.cost || 'Loading...'} • Timeline: {experiments?.surveyExperiment?.timeline || 'Loading...'}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{experiments?.surveyExperiment?.description || 'Loading experiment details...'}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">Key Questions</h4>
                              <ul className="space-y-1 text-sm">
                                {experiments?.surveyExperiment?.keyQuestions?.map((question: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{question}</span>
                                  </li>
                                )) || <li className="text-gray-500">Loading questions...</li>}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Expected Insights</h4>
                              <ul className="space-y-1 text-sm">
                                {experiments?.surveyExperiment?.expectedInsights?.map((insight: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{insight}</span>
                                  </li>
                                )) || <li className="text-gray-500">Loading insights...</li>}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Target: {experiments?.surveyExperiment?.targetAudience || 'Loading...'}</Badge>
                            <Badge variant="outline">Sample: {experiments?.surveyExperiment?.sampleSize || 'Loading...'}</Badge>
                            <Badge variant="outline">Tools: {experiments?.surveyExperiment?.tools?.join(', ') || 'Loading...'}</Badge>
                          </div>
                        </div>

                        {/* Landing Page Experiment */}
                        <div className="border border-border rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{experiments?.landingPageExperiment?.title || 'Loading...'}</h3>
                              <p className="text-sm text-muted-foreground">Cost: {experiments?.landingPageExperiment?.cost || 'Loading...'} • Timeline: {experiments?.landingPageExperiment?.timeline || 'Loading...'}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{experiments?.landingPageExperiment?.description || 'Loading experiment details...'}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">Concept & Messaging</h4>
                              <p className="text-sm text-muted-foreground mb-2">{experiments?.landingPageExperiment?.concept || 'Loading concept...'}</p>
                              <p className="text-sm">{experiments?.landingPageExperiment?.messaging || 'Loading messaging...'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Metrics to Track</h4>
                              <ul className="space-y-1 text-sm">
                                {experiments?.landingPageExperiment?.metricsToTrack?.map((metric: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{metric}</span>
                                  </li>
                                )) || <li className="text-gray-500">Loading metrics...</li>}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">CTA: {experiments?.landingPageExperiment?.callToAction || 'Loading...'}</Badge>
                            <Badge variant="outline">Tools: {experiments?.landingPageExperiment?.tools?.join(', ') || 'Loading...'}</Badge>
                          </div>
                        </div>

                        {/* Paid Ads Experiment */}
                        <div className="border border-border rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{experiments?.paidAdsExperiment?.title || 'Loading...'}</h3>
                              <p className="text-sm text-muted-foreground">Cost: {experiments?.paidAdsExperiment?.cost || 'Loading...'} • Timeline: {experiments?.paidAdsExperiment?.timeline || 'Loading...'}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{experiments?.paidAdsExperiment?.description || 'Loading experiment details...'}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">Campaign Concept</h4>
                              <p className="text-sm text-muted-foreground mb-2">{experiments?.paidAdsExperiment?.campaignConcept || 'Loading concept...'}</p>
                              <p className="text-sm"><strong>Target:</strong> {experiments?.paidAdsExperiment?.targetAudience || 'Loading target...'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Metrics to Measure</h4>
                              <ul className="space-y-1 text-sm">
                                {experiments?.paidAdsExperiment?.metricsToMeasure?.map((metric: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>{metric}</span>
                                  </li>
                                )) || <li className="text-gray-500">Loading metrics...</li>}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Platforms: {experiments?.paidAdsExperiment?.platforms?.join(', ') || 'Loading...'}</Badge>
                            <Badge variant="outline">Tools: {experiments?.paidAdsExperiment?.tools?.join(', ') || 'Loading...'}</Badge>
                          </div>
                        </div>

                        {/* Overall Validation Summary */}
                        <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            Overall Validation Plan
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm"><strong>Total Cost:</strong> {experiments?.overallValidation?.totalCost || 'Loading...'}</p>
                              <p className="text-sm"><strong>Total Timeline:</strong> {experiments?.overallValidation?.totalTimeline || 'Loading...'}</p>
                            </div>
                            <div>
                              <p className="text-sm"><strong>Success Criteria:</strong> {experiments?.overallValidation?.successCriteria || 'Loading...'}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Key Assumptions to Validate</h4>
                            <ul className="space-y-1 text-sm">
                              {experiments?.overallValidation?.keyAssumptions?.map((assumption: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{assumption}</span>
                                </li>
                              )) || <li className="text-gray-500">Loading assumptions...</li>}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No experiments generated</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete your MVP planning to generate validation experiments
                        </p>
                        <Button onClick={loadExperiments} disabled={loading}>
                          Generate Experiments
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>


            {/* MVP Document Tab */}
            <TabsContent value="mvp-document" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          Finalized MVP Document
                        </CardTitle>
                        <CardDescription>
                          Your comprehensive MVP document with all planning details
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={generateMVPDocument}
                          disabled={loading}
                          variant="outline"
                        >
                          {loading ? 'Generating...' : 'Generate Document'}
                        </Button>
                        {mvpDocument && (
                          <Button onClick={downloadMVPDocument}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Generating MVP document...</p>
                      </div>
                    ) : mvpDocument ? (
                      <div className="space-y-6">
                        {/* Executive Summary */}
                        <div className="border border-border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            Executive Summary
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Problem Statement</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.executiveSummary.problemStatement}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Solution Overview</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.executiveSummary.solutionOverview}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Value Propositions</h4>
                              <ul className="space-y-1 text-sm">
                                {mvpDocument.executiveSummary.valuePropositions.map((vp: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{vp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Market Analysis */}
                        <div className="border border-border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Market Analysis
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Target Market</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.marketAnalysis.targetMarket}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Market Size</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.marketAnalysis.marketSize}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Customer Segments</h4>
                              <ul className="space-y-1 text-sm">
                                {mvpDocument.marketAnalysis.customerSegments.map((segment: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{segment}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Product Overview */}
                        <div className="border border-border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Rocket className="h-5 w-5 text-purple-600" />
                            Product Overview
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Feature Set</h4>
                              <ul className="space-y-1 text-sm">
                                {mvpDocument.productOverview.featureSet.map((feature: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-1">•</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">User Stories</h4>
                              <ul className="space-y-1 text-sm">
                                {mvpDocument.productOverview.userStories.map((story: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-1">•</span>
                                    <span>{story}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Development Plan */}
                        <div className="border border-border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-orange-600" />
                            Development Plan
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Technical Requirements</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.developmentPlan.technicalRequirements}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Development Timeline</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.developmentPlan.developmentTimeline}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Launch Strategy</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.developmentPlan.launchStrategy}</p>
                            </div>
                          </div>
                        </div>

                        {/* Financial Projections */}
                        <div className="border border-border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Financial Projections
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Development Costs</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.financialProjections.developmentCosts}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Revenue Projections</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.financialProjections.revenueProjections}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Funding Requirements</h4>
                              <p className="text-sm text-muted-foreground">{mvpDocument.financialProjections.fundingRequirements}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No MVP document generated</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete your MVP planning and generate a comprehensive document
                        </p>
                        <Button onClick={generateMVPDocument} disabled={loading}>
                          Generate MVP Document
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
