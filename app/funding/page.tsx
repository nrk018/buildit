"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Users, PieChart, Calendar, Target, ArrowRight, Banknote, Phone, MessageCircle, Bot, Download, Loader2, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Script from "next/script"

export default function FundingPage() {
  const [activeTab, setActiveTab] = useState('funding-planning')
  const [fundingRecommendations, setFundingRecommendations] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fundingData, setFundingData] = useState({
    totalFunding: '',
    runway: '',
    fundingPurpose: '',
    milestones: '',
    y1Revenue: '',
    y1Expenses: '',
    y1Customers: '',
    y2Revenue: '',
    y2Expenses: '',
    y2Customers: '',
    y3Revenue: '',
    y3Expenses: '',
    y3Customers: '',
    assumptions: '',
    personalSavings: '',
    revenueReinvestment: '',
    ffAmount: '',
    ffTerms: '',
    angelInvestors: '',
    vcFunding: '',
    grants: '',
    debtFinancing: '',
    elevatorPitch: '',
    pitchDeck: '',
    tractionMetrics: '',
    competitiveAdvantages: '',
    investorQuestions: '',
    preMoneyValuation: '',
    postMoneyValuation: '',
    equityDistribution: '',
    dilutionPlan: '',
    valuationJustification: '',
    prepPhase: '',
    outreachPhase: '',
    closingPhase: '',
    targetCloseDate: '',
    backupPlan: ''
  })

  // ElevenLabs Agent Configuration
  const ELEVENLABS_AGENT_ID = "agent_5601k51pbvtsf24rbmfp7y0yfy3y"
  const ELEVENLABS_AGENT_URL = `https://elevenlabs.io/app/talk-to?agent_id=${ELEVENLABS_AGENT_ID}`

  // Load funding recommendations when component mounts
  useEffect(() => {
    loadFundingRecommendations()
  }, [])

  // Function to load funding recommendations
  const loadFundingRecommendations = async () => {
    setLoading(true)
    try {
      const problemStatement = localStorage.getItem('problemStatement') || ''
      const businessModel = JSON.parse(localStorage.getItem('businessModel') || '{}')
      const teamData = JSON.parse(localStorage.getItem('teamData') || '{}')
      const targetMarket = localStorage.getItem('targetMarket') || ''
      const industry = localStorage.getItem('industry') || ''

      const response = await fetch('/api/analyze-startup-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement,
          businessModel,
          teamData,
          targetMarket,
          industry
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFundingRecommendations(data)
        
        // Pre-fill form with recommendations
        if (data.fundingRecommendations) {
          setFundingData(prev => ({
            ...prev,
            totalFunding: data.fundingRecommendations.recommendedAmount || '',
            runway: data.fundingRecommendations.recommendedRunway || '',
            fundingPurpose: data.fundingRecommendations.useOfFunds || '',
            milestones: data.fundingRecommendations.keyMilestones || '',
            preMoneyValuation: data.fundingRecommendations.preMoneyValuation || '',
            postMoneyValuation: data.fundingRecommendations.postMoneyValuation || ''
          }))
        }
      }
    } catch (error) {
      console.error('Error loading funding recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFundingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Function to download funding strategy PDF
  const downloadFundingStrategy = () => {
    const problemStatement = localStorage.getItem('problemStatement') || ''
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    const documentContent = `
FUNDING STRATEGY & FINANCIAL PLAN
${problemStatement.toUpperCase()}

Generated on: ${currentDate} at ${currentTime}
Document Version: 1.0

================================================================================
EXECUTIVE SUMMARY
================================================================================

Problem Statement: ${problemStatement}
Total Funding Required: ${fundingData.totalFunding || 'Not specified'}
Runway: ${fundingData.runway || 'Not specified'}
Pre-Money Valuation: ${fundingData.preMoneyValuation || 'Not specified'}
Post-Money Valuation: ${fundingData.postMoneyValuation || 'Not specified'}

================================================================================
FUNDING REQUIREMENTS
================================================================================

Total Funding Needed: ${fundingData.totalFunding || 'Not specified'}
Runway (Months): ${fundingData.runway || 'Not specified'}

Use of Funds:
${fundingData.fundingPurpose || 'Not specified'}

Key Milestones to Achieve:
${fundingData.milestones || 'Not specified'}

================================================================================
FINANCIAL PROJECTIONS
================================================================================

Year 1:
- Revenue: ${fundingData.y1Revenue || 'Not specified'}
- Expenses: ${fundingData.y1Expenses || 'Not specified'}
- Customers: ${fundingData.y1Customers || 'Not specified'}

Year 2:
- Revenue: ${fundingData.y2Revenue || 'Not specified'}
- Expenses: ${fundingData.y2Expenses || 'Not specified'}
- Customers: ${fundingData.y2Customers || 'Not specified'}

Year 3:
- Revenue: ${fundingData.y3Revenue || 'Not specified'}
- Expenses: ${fundingData.y3Expenses || 'Not specified'}
- Customers: ${fundingData.y3Customers || 'Not specified'}

Key Assumptions:
${fundingData.assumptions || 'Not specified'}

================================================================================
FUNDING SOURCES
================================================================================

Bootstrapping:
- Personal Savings: ${fundingData.personalSavings || 'Not specified'}
- Revenue Reinvestment: ${fundingData.revenueReinvestment || 'Not specified'}

Friends & Family:
- Target Amount: ${fundingData.ffAmount || 'Not specified'}
- Investment Terms: ${fundingData.ffTerms || 'Not specified'}

Angel Investors:
${fundingData.angelInvestors || 'Not specified'}

Venture Capital:
${fundingData.vcFunding || 'Not specified'}

Grants & Competitions:
${fundingData.grants || 'Not specified'}

Debt Financing:
${fundingData.debtFinancing || 'Not specified'}

================================================================================
INVESTOR PITCH PREPARATION
================================================================================

Elevator Pitch (30 seconds):
${fundingData.elevatorPitch || 'Not specified'}

Pitch Deck Outline:
${fundingData.pitchDeck || 'Not specified'}

Key Traction Metrics:
${fundingData.tractionMetrics || 'Not specified'}

Competitive Advantages:
${fundingData.competitiveAdvantages || 'Not specified'}

Anticipated Investor Questions:
${fundingData.investorQuestions || 'Not specified'}

================================================================================
VALUATION & EQUITY STRUCTURE
================================================================================

Pre-Money Valuation: ${fundingData.preMoneyValuation || 'Not specified'}
Post-Money Valuation: ${fundingData.postMoneyValuation || 'Not specified'}

Current Equity Distribution:
${fundingData.equityDistribution || 'Not specified'}

Dilution Plan:
${fundingData.dilutionPlan || 'Not specified'}

Valuation Justification:
${fundingData.valuationJustification || 'Not specified'}

================================================================================
FUNDING TIMELINE
================================================================================

Preparation Phase (Month 1):
${fundingData.prepPhase || 'Not specified'}

Outreach Phase (Months 2-3):
${fundingData.outreachPhase || 'Not specified'}

Closing Phase (Month 4):
${fundingData.closingPhase || 'Not specified'}

Target Close Date: ${fundingData.targetCloseDate || 'Not specified'}
Backup Funding Plan: ${fundingData.backupPlan || 'Not specified'}

================================================================================
AI RECOMMENDATIONS
================================================================================

${fundingRecommendations ? `
Recommended Funding Amount: ${fundingRecommendations.fundingRecommendations?.recommendedAmount || 'Not available'}
Recommended Runway: ${fundingRecommendations.fundingRecommendations?.recommendedRunway || 'Not available'}
Use of Funds: ${fundingRecommendations.fundingRecommendations?.useOfFunds || 'Not available'}
Key Milestones: ${fundingRecommendations.fundingRecommendations?.keyMilestones || 'Not available'}
Pre-Money Valuation: ${fundingRecommendations.fundingRecommendations?.preMoneyValuation || 'Not available'}
Post-Money Valuation: ${fundingRecommendations.fundingRecommendations?.postMoneyValuation || 'Not available'}

Funding Strategy: ${fundingRecommendations.fundingRecommendations?.fundingStrategy || 'Not available'}
Investor Targeting: ${fundingRecommendations.fundingRecommendations?.investorTargeting || 'Not available'}
Risk Assessment: ${fundingRecommendations.fundingRecommendations?.riskAssessment || 'Not available'}
` : 'AI recommendations not available.'}

================================================================================
NEXT STEPS
================================================================================

1. Finalize pitch deck and financial model
2. Identify and research target investors
3. Prepare due diligence materials
4. Schedule investor meetings
5. Practice pitch presentation
6. Negotiate term sheets
7. Complete legal documentation
8. Close funding round

================================================================================
DOCUMENT SUMMARY
================================================================================

Total Funding Required: ${fundingData.totalFunding || 'Not specified'}
Runway: ${fundingData.runway || 'Not specified'}
Pre-Money Valuation: ${fundingData.preMoneyValuation || 'Not specified'}
Post-Money Valuation: ${fundingData.postMoneyValuation || 'Not specified'}
Target Close Date: ${fundingData.targetCloseDate || 'Not specified'}

Document Generated: ${currentDate} at ${currentTime}
Generated by: BuildIt AI Platform
Problem Statement: ${problemStatement.substring(0, 100)}${problemStatement.length > 100 ? '...' : ''}

---
This funding strategy was developed for your startup: "${problemStatement.substring(0, 50)}${problemStatement.length > 50 ? '...' : ''}"
and provides a comprehensive plan for securing funding and growing your business.

For questions or support, please refer to the BuildIt AI Platform documentation.
    `

    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Funding_Strategy_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Open ElevenLabs Agent
  const openElevenLabsAgent = () => {
    // Open ElevenLabs agent in a new window/tab
    window.open(ELEVENLABS_AGENT_URL, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no')
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
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Funding Strategy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plan your funding approach and financial requirements to fuel your business growth
            </p>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="funding-planning">Funding Planning</TabsTrigger>
              <TabsTrigger value="ai-phone-call">AI VC Call</TabsTrigger>
              <TabsTrigger value="ai-chat">AI Chat Assistant</TabsTrigger>
            </TabsList>

            {/* Funding Planning Tab */}
            <TabsContent value="funding-planning" className="space-y-6">
              {/* AI Funding Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-12"
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      AI Funding Recommendations
                    </CardTitle>
                    <CardDescription>Personalized funding recommendations based on your startup idea</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className="mt-2 text-muted-foreground">Analyzing your startup and generating funding recommendations...</p>
                      </div>
                    ) : fundingRecommendations ? (
                      <div className="space-y-6">
                        <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-green-600" />
                            Recommended Funding Strategy
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Funding Amount</h4>
                              <p className="text-2xl font-bold text-green-600">{fundingRecommendations.fundingRecommendations?.recommendedAmount || 'Not available'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Recommended Runway</h4>
                              <p className="text-lg font-semibold">{fundingRecommendations.fundingRecommendations?.recommendedRunway || 'Not available'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Pre-Money Valuation</h4>
                              <p className="text-lg font-semibold">{fundingRecommendations.fundingRecommendations?.preMoneyValuation || 'Not available'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Post-Money Valuation</h4>
                              <p className="text-lg font-semibold">{fundingRecommendations.fundingRecommendations?.postMoneyValuation || 'Not available'}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Use of Funds</h4>
                            <p className="text-sm text-muted-foreground">{fundingRecommendations.fundingRecommendations?.useOfFunds || 'Not available'}</p>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Key Milestones</h4>
                            <p className="text-sm text-muted-foreground">{fundingRecommendations.fundingRecommendations?.keyMilestones || 'Not available'}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border border-border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Funding Strategy</h4>
                            <p className="text-sm text-muted-foreground">{fundingRecommendations.fundingRecommendations?.fundingStrategy || 'Not available'}</p>
                          </div>
                          <div className="border border-border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Investor Targeting</h4>
                            <p className="text-sm text-muted-foreground">{fundingRecommendations.fundingRecommendations?.investorTargeting || 'Not available'}</p>
                          </div>
                          <div className="border border-border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Risk Assessment</h4>
                            <p className="text-sm text-muted-foreground">{fundingRecommendations.fundingRecommendations?.riskAssessment || 'Not available'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
                        <p className="text-muted-foreground">No funding recommendations available. Please ensure your problem statement and business model are defined.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Funding Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12"
              >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Funding Requirements
                </CardTitle>
                <CardDescription>Define how much funding you need and why</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total-funding">Total funding needed</Label>
                    <Input 
                      id="total-funding" 
                      placeholder="₹4,15,00,000" 
                      className="mt-2" 
                      value={fundingData.totalFunding}
                      onChange={(e) => handleInputChange('totalFunding', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="runway">Runway (months)</Label>
                    <Input 
                      id="runway" 
                      placeholder="18-24 months" 
                      className="mt-2" 
                      value={fundingData.runway}
                      onChange={(e) => handleInputChange('runway', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="funding-purpose">Use of funds</Label>
                  <Textarea
                    id="funding-purpose"
                    placeholder="Describe how you'll use the funding (product development, marketing, hiring, operations, etc.)"
                    className="mt-2"
                    value={fundingData.fundingPurpose}
                    onChange={(e) => handleInputChange('fundingPurpose', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="milestones">Key milestones to achieve</Label>
                  <Textarea
                    id="milestones"
                    placeholder="What specific goals will this funding help you reach?"
                    className="mt-2"
                    value={fundingData.milestones}
                    onChange={(e) => handleInputChange('milestones', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Projections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Financial Projections
                </CardTitle>
                <CardDescription>Project your financial performance over the next 3 years</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Year 1</h4>
                    <div>
                      <Label htmlFor="y1-revenue">Revenue</Label>
                      <Input 
                        id="y1-revenue" 
                        placeholder="₹83,00,000" 
                        className="mt-1" 
                        value={fundingData.y1Revenue}
                        onChange={(e) => handleInputChange('y1Revenue', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y1-expenses">Expenses</Label>
                      <Input 
                        id="y1-expenses" 
                        placeholder="₹2,49,00,000" 
                        className="mt-1" 
                        value={fundingData.y1Expenses}
                        onChange={(e) => handleInputChange('y1Expenses', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y1-customers">Customers</Label>
                      <Input 
                        id="y1-customers" 
                        placeholder="500" 
                        className="mt-1" 
                        value={fundingData.y1Customers}
                        onChange={(e) => handleInputChange('y1Customers', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Year 2</h4>
                    <div>
                      <Label htmlFor="y2-revenue">Revenue</Label>
                      <Input 
                        id="y2-revenue" 
                        placeholder="₹4,15,00,000" 
                        className="mt-1" 
                        value={fundingData.y2Revenue}
                        onChange={(e) => handleInputChange('y2Revenue', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y2-expenses">Expenses</Label>
                      <Input 
                        id="y2-expenses" 
                        placeholder="₹4,98,00,000" 
                        className="mt-1" 
                        value={fundingData.y2Expenses}
                        onChange={(e) => handleInputChange('y2Expenses', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y2-customers">Customers</Label>
                      <Input 
                        id="y2-customers" 
                        placeholder="2,500" 
                        className="mt-1" 
                        value={fundingData.y2Customers}
                        onChange={(e) => handleInputChange('y2Customers', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Year 3</h4>
                    <div>
                      <Label htmlFor="y3-revenue">Revenue</Label>
                      <Input 
                        id="y3-revenue" 
                        placeholder="₹16,60,00,000" 
                        className="mt-1" 
                        value={fundingData.y3Revenue}
                        onChange={(e) => handleInputChange('y3Revenue', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y3-expenses">Expenses</Label>
                      <Input 
                        id="y3-expenses" 
                        placeholder="₹12,45,00,000" 
                        className="mt-1" 
                        value={fundingData.y3Expenses}
                        onChange={(e) => handleInputChange('y3Expenses', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y3-customers">Customers</Label>
                      <Input 
                        id="y3-customers" 
                        placeholder="10,000" 
                        className="mt-1" 
                        value={fundingData.y3Customers}
                        onChange={(e) => handleInputChange('y3Customers', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="assumptions">Key assumptions</Label>
                  <Textarea
                    id="assumptions"
                    placeholder="List the key assumptions behind your financial projections"
                    className="mt-2"
                    value={fundingData.assumptions}
                    onChange={(e) => handleInputChange('assumptions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Funding Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-purple-500" />
                  Funding Sources
                </CardTitle>
                <CardDescription>Explore different funding options for your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Bootstrapping</h4>
                    <div>
                      <Label htmlFor="personal-savings">Personal savings</Label>
                      <Input 
                        id="personal-savings" 
                        placeholder="₹41,50,000" 
                        className="mt-2" 
                        value={fundingData.personalSavings}
                        onChange={(e) => handleInputChange('personalSavings', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="revenue-reinvestment">Revenue reinvestment</Label>
                      <Input 
                        id="revenue-reinvestment" 
                        placeholder="₹20,75,000" 
                        className="mt-2" 
                        value={fundingData.revenueReinvestment}
                        onChange={(e) => handleInputChange('revenueReinvestment', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Friends & Family</h4>
                    <div>
                      <Label htmlFor="ff-amount">Target amount</Label>
                      <Input 
                        id="ff-amount" 
                        placeholder="₹83,00,000" 
                        className="mt-2" 
                        value={fundingData.ffAmount}
                        onChange={(e) => handleInputChange('ffAmount', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ff-terms">Investment terms</Label>
                      <Input 
                        id="ff-terms" 
                        placeholder="Convertible note, equity..." 
                        className="mt-2" 
                        value={fundingData.ffTerms}
                        onChange={(e) => handleInputChange('ffTerms', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="angel-investors">Angel investors</Label>
                  <Textarea
                    id="angel-investors"
                    placeholder="Target angel investor profiles and investment amounts"
                    className="mt-2"
                    value={fundingData.angelInvestors}
                    onChange={(e) => handleInputChange('angelInvestors', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vc-funding">Venture capital</Label>
                  <Textarea
                    id="vc-funding"
                    placeholder="VC firms that align with your industry and stage"
                    className="mt-2"
                    value={fundingData.vcFunding}
                    onChange={(e) => handleInputChange('vcFunding', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grants">Grants & competitions</Label>
                    <Textarea 
                      id="grants" 
                      placeholder="Government grants, startup competitions" 
                      className="mt-2" 
                      value={fundingData.grants}
                      onChange={(e) => handleInputChange('grants', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="debt-financing">Debt financing</Label>
                    <Textarea
                      id="debt-financing"
                      placeholder="Bank loans, SBA loans, revenue-based financing"
                      className="mt-2"
                      value={fundingData.debtFinancing}
                      onChange={(e) => handleInputChange('debtFinancing', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Investor Pitch Preparation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Investor Pitch Preparation
                </CardTitle>
                <CardDescription>Prepare your pitch and investor materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="elevator-pitch">Elevator pitch (30 seconds)</Label>
                  <Textarea
                    id="elevator-pitch"
                    placeholder="Concise description of your business and value proposition"
                    className="mt-2"
                    value={fundingData.elevatorPitch}
                    onChange={(e) => handleInputChange('elevatorPitch', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pitch-deck">Pitch deck outline</Label>
                  <Textarea
                    id="pitch-deck"
                    placeholder="Key slides: Problem, Solution, Market, Business Model, Traction, Team, Financials, Ask"
                    className="mt-2"
                    value={fundingData.pitchDeck}
                    onChange={(e) => handleInputChange('pitchDeck', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="traction-metrics">Key traction metrics</Label>
                    <Textarea 
                      id="traction-metrics" 
                      placeholder="Users, revenue, growth rate..." 
                      className="mt-2" 
                      value={fundingData.tractionMetrics}
                      onChange={(e) => handleInputChange('tractionMetrics', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="competitive-advantages">Competitive advantages</Label>
                    <Textarea 
                      id="competitive-advantages" 
                      placeholder="What makes you unique?" 
                      className="mt-2" 
                      value={fundingData.competitiveAdvantages}
                      onChange={(e) => handleInputChange('competitiveAdvantages', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="investor-questions">Anticipated investor questions</Label>
                  <Textarea
                    id="investor-questions"
                    placeholder="Prepare answers for common investor questions and concerns"
                    className="mt-2"
                    value={fundingData.investorQuestions}
                    onChange={(e) => handleInputChange('investorQuestions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Valuation & Equity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-red-500" />
                  Valuation & Equity Structure
                </CardTitle>
                <CardDescription>Plan your company valuation and equity distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pre-money-valuation">Pre-money valuation</Label>
                    <Input 
                      id="pre-money-valuation" 
                      placeholder="₹16,60,00,000" 
                      className="mt-2" 
                      value={fundingData.preMoneyValuation}
                      onChange={(e) => handleInputChange('preMoneyValuation', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-money-valuation">Post-money valuation</Label>
                    <Input 
                      id="post-money-valuation" 
                      placeholder="₹20,75,00,000" 
                      className="mt-2" 
                      value={fundingData.postMoneyValuation}
                      onChange={(e) => handleInputChange('postMoneyValuation', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="equity-distribution">Current equity distribution</Label>
                  <Textarea
                    id="equity-distribution"
                    placeholder="Founders: 70%, Employee pool: 20%, Advisors: 5%, Available for investors: 5%"
                    className="mt-2"
                    value={fundingData.equityDistribution}
                    onChange={(e) => handleInputChange('equityDistribution', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dilution-plan">Dilution plan</Label>
                  <Textarea
                    id="dilution-plan"
                    placeholder="How will equity be diluted through future funding rounds?"
                    className="mt-2"
                    value={fundingData.dilutionPlan}
                    onChange={(e) => handleInputChange('dilutionPlan', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="valuation-justification">Valuation justification</Label>
                  <Textarea
                    id="valuation-justification"
                    placeholder="How did you arrive at your valuation? (comparable companies, revenue multiples, etc.)"
                    className="mt-2"
                    value={fundingData.valuationJustification}
                    onChange={(e) => handleInputChange('valuationJustification', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Funding Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  Funding Timeline
                </CardTitle>
                <CardDescription>Plan your fundraising timeline and milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prep-phase">Preparation (Month 1)</Label>
                    <Textarea
                      id="prep-phase"
                      placeholder="Pitch deck, financial model, legal docs"
                      className="mt-2 min-h-[80px]"
                      value={fundingData.prepPhase}
                      onChange={(e) => handleInputChange('prepPhase', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="outreach-phase">Outreach (Months 2-3)</Label>
                    <Textarea
                      id="outreach-phase"
                      placeholder="Investor meetings, pitches, due diligence"
                      className="mt-2 min-h-[80px]"
                      value={fundingData.outreachPhase}
                      onChange={(e) => handleInputChange('outreachPhase', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="closing-phase">Closing (Month 4)</Label>
                    <Textarea
                      id="closing-phase"
                      placeholder="Term sheets, negotiations, legal closing"
                      className="mt-2 min-h-[80px]"
                      value={fundingData.closingPhase}
                      onChange={(e) => handleInputChange('closingPhase', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-close-date">Target close date</Label>
                    <Input 
                      id="target-close-date" 
                      type="date" 
                      className="mt-2" 
                      value={fundingData.targetCloseDate}
                      onChange={(e) => handleInputChange('targetCloseDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backup-plan">Backup funding plan</Label>
                    <Input 
                      id="backup-plan" 
                      placeholder="Alternative funding sources" 
                      className="mt-2" 
                      value={fundingData.backupPlan}
                      onChange={(e) => handleInputChange('backupPlan', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

              {/* Download Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <Card className="vercel-card bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-200">
                  <CardContent className="py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Download className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Download Funding Strategy
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Download a comprehensive funding strategy document with all your details, AI recommendations, and financial projections.
                    </p>
                    <Button 
                      size="lg" 
                      className="px-8 py-3"
                      onClick={downloadFundingStrategy}
                    >
                      Download Funding Strategy PDF
                      <Download className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* AI Phone Call Tab */}
            <TabsContent value="ai-phone-call" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-500" />
                      AI Voice Agent
                    </CardTitle>
                    <CardDescription>
                      Practice your pitch with our AI voice agent powered by ElevenLabs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* ElevenLabs Agent Interface */}
                    <div className="w-full">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-border">
                        <div className="text-center mb-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bot className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-2">AI Voice Agent</h3>
                          <p className="text-muted-foreground mb-6">
                            Practice your pitch with our advanced AI voice agent powered by ElevenLabs. Opens in a new window for the best experience.
                          </p>
                          <Button 
                            onClick={openElevenLabsAgent}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
                          >
                            <Phone className="h-6 w-6 mr-3" />
                            Open Voice Agent
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Real-time voice conversation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Advanced AI responses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Natural speech patterns</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Opens in new window</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agent Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 border border-border rounded-lg">
                        <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-semibold">Voice Conversation</h4>
                        <p className="text-sm text-muted-foreground">
                          Natural voice-to-voice interaction with AI
                        </p>
                      </div>
                      <div className="text-center p-4 border border-border rounded-lg">
                        <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <h4 className="font-semibold">Advanced AI</h4>
                        <p className="text-sm text-muted-foreground">
                          Powered by ElevenLabs' cutting-edge technology
                        </p>
                      </div>
                      <div className="text-center p-4 border border-border rounded-lg">
                        <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <h4 className="font-semibold">Pitch Practice</h4>
                        <p className="text-sm text-muted-foreground">
                          Practice your startup pitch with realistic feedback
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* AI Chat Assistant Tab */}
            <TabsContent value="ai-chat" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      AI Chat Assistant
                    </CardTitle>
                    <CardDescription>
                      Chat with our AI assistant for instant answers to your funding questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Chatbase Integration */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="h-[500px] bg-gray-100/50 dark:bg-gray-800/50 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 bg-white dark:bg-gray-900 border-b flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">AI Funding Assistant</h4>
                            <p className="text-sm text-muted-foreground">Powered by Chatbase</p>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-muted-foreground">Online</span>
                          </div>
                        </div>

                        {/* Chatbase Widget Container */}
                        <div className="flex-1 relative">
                          <div id="chatbase-widget" className="w-full h-full">
                            {/* Chatbase widget will be injected here */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">What you can ask:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• "What funding options are best for my startup?"</li>
                          <li>• "How much should I raise for my seed round?"</li>
                          <li>• "What investors should I target in my industry?"</li>
                          <li>• "How do I prepare for investor meetings?"</li>
                          <li>• "What's my company worth?"</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">AI Capabilities:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Real-time funding market analysis</li>
                          <li>• Personalized investor recommendations</li>
                          <li>• Pitch deck feedback and optimization</li>
                          <li>• Valuation estimates and comparisons</li>
                          <li>• Funding timeline and milestone planning</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Chatbase Script */}
      <Script id="chatbase-script" strategy="afterInteractive">
        {`
          (function(){
            if(!window.chatbase||window.chatbase("getState")!=="initialized"){
              window.chatbase=(...arguments)=>{
                if(!window.chatbase.q){
                  window.chatbase.q=[]
                }
                window.chatbase.q.push(arguments)
              };
              window.chatbase=new Proxy(window.chatbase,{
                get(target,prop){
                  if(prop==="q"){
                    return target.q
                  }
                  return(...args)=>target(prop,...args)
                }
              })
            }
            const onLoad=function(){
              const script=document.createElement("script");
              script.src="https://www.chatbase.co/embed.min.js";
              script.id="7GtBOknRlarxv2fqtHbWU";
              script.domain="www.chatbase.co";
              document.body.appendChild(script)
            };
            if(document.readyState==="complete"){
              onLoad()
            }else{
              window.addEventListener("load",onLoad)
            }
          })();
        `}
      </Script>

    </Layout>
  )
}
