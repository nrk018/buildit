"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Target, Zap, Users, TrendingUp, Globe, MessageSquare, ArrowRight, Crosshair, Video, Play, Download, Loader2 } from "lucide-react"
import { useState } from "react"

export default function StrategyPage() {
  // State for strategy form data
  const [strategyData, setStrategyData] = useState({
    positioningStatement: '',
    brandPromise: '',
    brandPersonality: '',
    competitiveStrategy: '',
    customerJourney: '',
    acquisitionChannels: '',
    conversionStrategy: '',
    cac: '',
    ltv: '',
    ltvCacRatio: '',
    marketingObjectives: '',
    seoStrategy: '',
    paidAdvertising: '',
    socialMedia: '',
    contentMarketing: '',
    emailMarketing: '',
    prStrategy: '',
    marketingBudget: '',
    marketingKpis: '',
    salesModel: '',
    salesProcess: '',
    salesCycle: '',
    conversionRate: '',
    salesTools: '',
    salesTeam: '',
    strategicPartners: '',
    channelPartners: '',
    supplierRelationships: '',
    partnershipGoals: '',
    preLaunch: '',
    launch: '',
    postLaunch: '',
    launchBudget: '',
    successMetrics: '',
    riskMitigation: ''
  })

  // Function to handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setStrategyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Function to download strategy document
  const downloadStrategyDocument = () => {
    const problemStatement = localStorage.getItem('problemStatement') || ''
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    const documentContent = `
GO-TO-MARKET STRATEGY
${problemStatement.toUpperCase()}

Generated on: ${currentDate} at ${currentTime}
Document Version: 1.0

================================================================================
EXECUTIVE SUMMARY
================================================================================

Problem Statement: ${problemStatement}
Strategy Document: Comprehensive Go-to-Market Strategy
Generated: ${currentDate} at ${currentTime}

================================================================================
STRATEGIC POSITIONING
================================================================================

Positioning Statement:
${strategyData.positioningStatement || 'Not specified'}

Brand Promise:
${strategyData.brandPromise || 'Not specified'}

Brand Personality:
${strategyData.brandPersonality || 'Not specified'}

Competitive Strategy:
${strategyData.competitiveStrategy || 'Not specified'}

================================================================================
CUSTOMER ACQUISITION STRATEGY
================================================================================

Customer Journey Mapping:
${strategyData.customerJourney || 'Not specified'}

Primary Acquisition Channels:
${strategyData.acquisitionChannels || 'Not specified'}

Conversion Strategy:
${strategyData.conversionStrategy || 'Not specified'}

Key Metrics:
- Customer Acquisition Cost (CAC): ${strategyData.cac || 'Not specified'}
- Customer Lifetime Value (LTV): ${strategyData.ltv || 'Not specified'}
- LTV:CAC Ratio: ${strategyData.ltvCacRatio || 'Not specified'}

================================================================================
MARKETING STRATEGY
================================================================================

Marketing Objectives:
${strategyData.marketingObjectives || 'Not specified'}

Digital Marketing:
- SEO Strategy: ${strategyData.seoStrategy || 'Not specified'}
- Paid Advertising: ${strategyData.paidAdvertising || 'Not specified'}
- Social Media Strategy: ${strategyData.socialMedia || 'Not specified'}

Content & Outreach:
- Content Marketing: ${strategyData.contentMarketing || 'Not specified'}
- Email Marketing: ${strategyData.emailMarketing || 'Not specified'}
- PR & Outreach: ${strategyData.prStrategy || 'Not specified'}

Marketing Budget & KPIs:
- Monthly Marketing Budget: ${strategyData.marketingBudget || 'Not specified'}
- Key Marketing KPIs: ${strategyData.marketingKpis || 'Not specified'}

================================================================================
SALES STRATEGY
================================================================================

Sales Model: ${strategyData.salesModel || 'Not specified'}

Sales Process:
${strategyData.salesProcess || 'Not specified'}

Sales Metrics:
- Average Sales Cycle: ${strategyData.salesCycle || 'Not specified'}
- Lead to Customer Conversion Rate: ${strategyData.conversionRate || 'Not specified'}

Sales Tools and CRM:
${strategyData.salesTools || 'Not specified'}

Sales Team Structure:
${strategyData.salesTeam || 'Not specified'}

================================================================================
PARTNERSHIP STRATEGY
================================================================================

Strategic Partnerships:
${strategyData.strategicPartners || 'Not specified'}

Channel Partnerships:
${strategyData.channelPartners || 'Not specified'}

Supplier Relationships:
${strategyData.supplierRelationships || 'Not specified'}

Partnership Goals and Metrics:
${strategyData.partnershipGoals || 'Not specified'}

================================================================================
LAUNCH PLAN
================================================================================

Pre-Launch (Month -1):
${strategyData.preLaunch || 'Not specified'}

Launch (Month 0):
${strategyData.launch || 'Not specified'}

Post-Launch (Month +1):
${strategyData.postLaunch || 'Not specified'}

Launch Budget: ${strategyData.launchBudget || 'Not specified'}
Success Metrics: ${strategyData.successMetrics || 'Not specified'}

Risk Mitigation:
${strategyData.riskMitigation || 'Not specified'}

================================================================================
NEXT STEPS
================================================================================

1. Finalize positioning and messaging
2. Develop marketing materials and campaigns
3. Set up sales processes and tools
4. Establish key partnerships
5. Execute launch plan
6. Monitor and optimize performance
7. Scale successful strategies

================================================================================
DOCUMENT SUMMARY
================================================================================

Strategy Type: Go-to-Market Strategy
Problem Statement: ${problemStatement.substring(0, 100)}${problemStatement.length > 100 ? '...' : ''}
Marketing Budget: ${strategyData.marketingBudget || 'Not specified'}
Launch Budget: ${strategyData.launchBudget || 'Not specified'}
Sales Model: ${strategyData.salesModel || 'Not specified'}

Document Generated: ${currentDate} at ${currentTime}
Generated by: BuildIt AI Platform

---
This go-to-market strategy was developed for your startup: "${problemStatement.substring(0, 50)}${problemStatement.length > 50 ? '...' : ''}"
and provides a comprehensive plan for launching and growing your business.

For questions or support, please refer to the BuildIt AI Platform documentation.
    `

    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Go_to_Market_Strategy_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Video generation functions
  const generateVideo = async () => {
    const videoType = (document.getElementById('video-type') as HTMLSelectElement)?.value
    const videoPrompt = (document.getElementById('video-prompt') as HTMLTextAreaElement)?.value
    const videoDuration = (document.getElementById('video-duration') as HTMLSelectElement)?.value
    const videoStyle = (document.getElementById('video-style') as HTMLSelectElement)?.value

    if (!videoType || !videoPrompt) {
      alert('Please select a video type and provide a description')
      return
    }

    // Show generation status
    const statusDiv = document.getElementById('video-generation-status')
    const videoDiv = document.getElementById('generated-video')
    if (statusDiv) statusDiv.classList.remove('hidden')
    if (videoDiv) videoDiv.classList.add('hidden')

    try {
      // Get problem data from localStorage (from idea page)
      const analyzedProblems = localStorage.getItem('analyzedProblems')
      const problemData = analyzedProblems ? JSON.parse(analyzedProblems) : []

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoType,
          videoPrompt,
          videoDuration: parseInt(videoDuration),
          videoStyle,
          problemData,
          context: 'startup'
        })
      })

      if (!response.ok) {
        throw new Error('Video generation failed')
      }

      const data = await response.json()
      
      if (data.success && data.videoUrl) {
        // Show generated video
        const videoPlayer = document.getElementById('video-player') as HTMLVideoElement
        if (videoPlayer) {
          videoPlayer.src = data.videoUrl
          videoPlayer.load()
        }
        
        // Update video information
        const videoInfo = document.getElementById('video-info')
        if (videoInfo) {
          videoInfo.innerHTML = `
            <div class="space-y-2 text-sm">
              <div><strong>AI Model:</strong> ${data.aiModel || 'Unknown'}</div>
              <div><strong>Generation Time:</strong> ${data.generationTime || 'N/A'} seconds</div>
              <div><strong>Video ID:</strong> ${data.videoId || 'N/A'}</div>
              ${data.note ? `<div class="text-yellow-600"><strong>Note:</strong> ${data.note}</div>` : ''}
            </div>
          `
        }
        
        // Show video script if available
        const scriptDiv = document.getElementById('video-script')
        if (scriptDiv && data.script) {
          scriptDiv.innerHTML = `
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h5 class="font-semibold mb-2">Generated Video Script:</h5>
              <p class="text-sm text-muted-foreground whitespace-pre-wrap">${data.script}</p>
            </div>
          `
          scriptDiv.classList.remove('hidden')
        }
        
        if (statusDiv) statusDiv.classList.add('hidden')
        if (videoDiv) videoDiv.classList.remove('hidden')
      } else {
        throw new Error(data.error || 'Video generation failed')
      }
    } catch (error) {
      console.error('Error generating video:', error)
      alert('Failed to generate video. Please try again.')
      if (statusDiv) statusDiv.classList.add('hidden')
    }
  }

  const downloadVideo = () => {
    const videoPlayer = document.getElementById('video-player') as HTMLVideoElement
    if (videoPlayer && videoPlayer.src) {
      const link = document.createElement('a')
      link.href = videoPlayer.src
      link.download = `startup-video-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const regenerateVideo = () => {
    const videoDiv = document.getElementById('generated-video')
    if (videoDiv) videoDiv.classList.add('hidden')
    generateVideo()
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
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Go-to-Market Strategy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Develop a comprehensive strategy to launch, market, and grow your business effectively
            </p>
          </motion.div>

          {/* Strategic Positioning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crosshair className="h-5 w-5 text-blue-500" />
                  Strategic Positioning
                </CardTitle>
                <CardDescription>Define your market position and competitive strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="positioning-statement">Positioning statement</Label>
                  <Textarea
                    id="positioning-statement"
                    placeholder="For [target customer] who [need/opportunity], our [product/service] is [category] that [key benefit]. Unlike [competition], we [key differentiator]."
                    className="mt-2"
                    value={strategyData.positioningStatement}
                    onChange={(e) => handleInputChange('positioningStatement', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand-promise">Brand promise</Label>
                    <Textarea
                      id="brand-promise"
                      placeholder="What do you promise to deliver to customers?"
                      className="mt-2"
                      value={strategyData.brandPromise}
                      onChange={(e) => handleInputChange('brandPromise', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand-personality">Brand personality</Label>
                    <Textarea
                      id="brand-personality"
                      placeholder="How do you want customers to perceive your brand?"
                      className="mt-2"
                      value={strategyData.brandPersonality}
                      onChange={(e) => handleInputChange('brandPersonality', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="competitive-strategy">Competitive strategy</Label>
                  <Textarea
                    id="competitive-strategy"
                    placeholder="How will you compete and win in your market? (cost leadership, differentiation, niche focus)"
                    className="mt-2"
                    value={strategyData.competitiveStrategy}
                    onChange={(e) => handleInputChange('competitiveStrategy', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Acquisition Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Customer Acquisition Strategy
                </CardTitle>
                <CardDescription>Plan how you'll attract and convert customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="customer-journey">Customer journey mapping</Label>
                  <Textarea
                    id="customer-journey"
                    placeholder="Map the customer journey from awareness to purchase to retention"
                    className="mt-2"
                    value={strategyData.customerJourney}
                    onChange={(e) => handleInputChange('customerJourney', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="acquisition-channels">Primary acquisition channels</Label>
                    <Textarea
                      id="acquisition-channels"
                      placeholder="Digital marketing, content marketing, partnerships, referrals..."
                      className="mt-2"
                      value={strategyData.acquisitionChannels}
                      onChange={(e) => handleInputChange('acquisitionChannels', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="conversion-strategy">Conversion strategy</Label>
                    <Textarea
                      id="conversion-strategy"
                      placeholder="How will you convert prospects into customers?"
                      className="mt-2"
                      value={strategyData.conversionStrategy}
                      onChange={(e) => handleInputChange('conversionStrategy', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cac">Customer Acquisition Cost (CAC)</Label>
                    <Input 
                      id="cac" 
                      placeholder="₹4,150" 
                      className="mt-2" 
                      value={strategyData.cac}
                      onChange={(e) => handleInputChange('cac', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ltv">Customer Lifetime Value (LTV)</Label>
                    <Input 
                      id="ltv" 
                      placeholder="₹41,500" 
                      className="mt-2" 
                      value={strategyData.ltv}
                      onChange={(e) => handleInputChange('ltv', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ltv-cac-ratio">LTV:CAC Ratio</Label>
                    <Input 
                      id="ltv-cac-ratio" 
                      placeholder="10:1" 
                      className="mt-2" 
                      value={strategyData.ltvCacRatio}
                      onChange={(e) => handleInputChange('ltvCacRatio', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Marketing Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Marketing Strategy
                </CardTitle>
                <CardDescription>Develop your marketing mix and campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="marketing-objectives">Marketing objectives</Label>
                  <Textarea
                    id="marketing-objectives"
                    placeholder="Brand awareness, lead generation, customer acquisition, retention..."
                    className="mt-2"
                    value={strategyData.marketingObjectives}
                    onChange={(e) => handleInputChange('marketingObjectives', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Digital Marketing</h4>
                    <div>
                      <Label htmlFor="seo-strategy">SEO strategy</Label>
                      <Textarea 
                        id="seo-strategy" 
                        placeholder="Target keywords, content strategy" 
                        className="mt-2" 
                        value={strategyData.seoStrategy}
                        onChange={(e) => handleInputChange('seoStrategy', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="paid-advertising">Paid advertising</Label>
                      <Textarea
                        id="paid-advertising"
                        placeholder="Google Ads, Facebook Ads, LinkedIn Ads..."
                        className="mt-2"
                        value={strategyData.paidAdvertising}
                        onChange={(e) => handleInputChange('paidAdvertising', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="social-media">Social media strategy</Label>
                      <Textarea
                        id="social-media"
                        placeholder="Platform selection, content calendar, engagement strategy"
                        className="mt-2"
                        value={strategyData.socialMedia}
                        onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Content & Outreach</h4>
                    <div>
                      <Label htmlFor="content-marketing">Content marketing</Label>
                      <Textarea
                        id="content-marketing"
                        placeholder="Blog posts, videos, podcasts, webinars..."
                        className="mt-2"
                        value={strategyData.contentMarketing}
                        onChange={(e) => handleInputChange('contentMarketing', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-marketing">Email marketing</Label>
                      <Textarea
                        id="email-marketing"
                        placeholder="Newsletter, drip campaigns, automation..."
                        className="mt-2"
                        value={strategyData.emailMarketing}
                        onChange={(e) => handleInputChange('emailMarketing', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pr-strategy">PR & outreach</Label>
                      <Textarea
                        id="pr-strategy"
                        placeholder="Media relations, influencer partnerships, events..."
                        className="mt-2"
                        value={strategyData.prStrategy}
                        onChange={(e) => handleInputChange('prStrategy', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marketing-budget">Marketing budget (monthly)</Label>
                    <Input 
                      id="marketing-budget" 
                      placeholder="₹8,30,000" 
                      className="mt-2" 
                      value={strategyData.marketingBudget}
                      onChange={(e) => handleInputChange('marketingBudget', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketing-kpis">Key marketing KPIs</Label>
                    <Input 
                      id="marketing-kpis" 
                      placeholder="Traffic, leads, conversion rate..." 
                      className="mt-2" 
                      value={strategyData.marketingKpis}
                      onChange={(e) => handleInputChange('marketingKpis', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sales Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Sales Strategy
                </CardTitle>
                <CardDescription>Define your sales process and approach</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sales-model">Sales model</Label>
                  <select
                    id="sales-model"
                    className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    value={strategyData.salesModel}
                    onChange={(e) => handleInputChange('salesModel', e.target.value)}
                  >
                    <option value="">Select sales model</option>
                    <option value="self-service">Self-service</option>
                    <option value="inside-sales">Inside sales</option>
                    <option value="field-sales">Field sales</option>
                    <option value="channel-partners">Channel partners</option>
                    <option value="hybrid">Hybrid approach</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="sales-process">Sales process</Label>
                  <Textarea
                    id="sales-process"
                    placeholder="Lead qualification → Demo/Presentation → Proposal → Negotiation → Close"
                    className="mt-2"
                    value={strategyData.salesProcess}
                    onChange={(e) => handleInputChange('salesProcess', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sales-cycle">Average sales cycle</Label>
                    <Input 
                      id="sales-cycle" 
                      placeholder="30 days" 
                      className="mt-2" 
                      value={strategyData.salesCycle}
                      onChange={(e) => handleInputChange('salesCycle', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="conversion-rate">Lead to customer conversion rate</Label>
                    <Input 
                      id="conversion-rate" 
                      placeholder="15%" 
                      className="mt-2" 
                      value={strategyData.conversionRate}
                      onChange={(e) => handleInputChange('conversionRate', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sales-tools">Sales tools and CRM</Label>
                  <Textarea
                    id="sales-tools"
                    placeholder="CRM system, sales automation, proposal tools..."
                    className="mt-2"
                    value={strategyData.salesTools}
                    onChange={(e) => handleInputChange('salesTools', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sales-team">Sales team structure</Label>
                  <Textarea
                    id="sales-team"
                    placeholder="Sales roles, territories, compensation structure..."
                    className="mt-2"
                    value={strategyData.salesTeam}
                    onChange={(e) => handleInputChange('salesTeam', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Partnership Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Partnership Strategy
                </CardTitle>
                <CardDescription>Leverage partnerships for growth and market access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="strategic-partners">Strategic partnerships</Label>
                  <Textarea
                    id="strategic-partners"
                    placeholder="Technology partners, integration partners, co-marketing opportunities..."
                    className="mt-2"
                    value={strategyData.strategicPartners}
                    onChange={(e) => handleInputChange('strategicPartners', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="channel-partners">Channel partnerships</Label>
                  <Textarea
                    id="channel-partners"
                    placeholder="Resellers, distributors, affiliate programs..."
                    className="mt-2"
                    value={strategyData.channelPartners}
                    onChange={(e) => handleInputChange('channelPartners', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-relationships">Supplier relationships</Label>
                  <Textarea
                    id="supplier-relationships"
                    placeholder="Key suppliers, vendor management, supply chain strategy..."
                    className="mt-2"
                    value={strategyData.supplierRelationships}
                    onChange={(e) => handleInputChange('supplierRelationships', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="partnership-goals">Partnership goals and metrics</Label>
                  <Textarea
                    id="partnership-goals"
                    placeholder="Revenue targets, market expansion, cost reduction..."
                    className="mt-2"
                    value={strategyData.partnershipGoals}
                    onChange={(e) => handleInputChange('partnershipGoals', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Launch Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-500" />
                  Launch Plan
                </CardTitle>
                <CardDescription>Plan your market entry and launch strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pre-launch">Pre-launch (Month -1)</Label>
                    <Textarea
                      id="pre-launch"
                      placeholder="Beta testing, PR buildup, early access..."
                      className="mt-2 min-h-[80px]"
                      value={strategyData.preLaunch}
                      onChange={(e) => handleInputChange('preLaunch', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="launch">Launch (Month 0)</Label>
                    <Textarea
                      id="launch"
                      placeholder="Product launch, marketing campaigns, PR..."
                      className="mt-2 min-h-[80px]"
                      value={strategyData.launch}
                      onChange={(e) => handleInputChange('launch', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-launch">Post-launch (Month +1)</Label>
                    <Textarea
                      id="post-launch"
                      placeholder="Customer feedback, iterations, scaling..."
                      className="mt-2 min-h-[80px]"
                      value={strategyData.postLaunch}
                      onChange={(e) => handleInputChange('postLaunch', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="launch-budget">Launch budget</Label>
                    <Input 
                      id="launch-budget" 
                      placeholder="₹41,50,000" 
                      className="mt-2" 
                      value={strategyData.launchBudget}
                      onChange={(e) => handleInputChange('launchBudget', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="success-metrics">Launch success metrics</Label>
                    <Input 
                      id="success-metrics" 
                      placeholder="Users, revenue, press coverage..." 
                      className="mt-2" 
                      value={strategyData.successMetrics}
                      onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="risk-mitigation">Risk mitigation</Label>
                  <Textarea
                    id="risk-mitigation"
                    placeholder="Potential risks and contingency plans for launch"
                    className="mt-2"
                    value={strategyData.riskMitigation}
                    onChange={(e) => handleInputChange('riskMitigation', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Video Generation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-500" />
                  AI Video Generation
                </CardTitle>
                <CardDescription>Generate startup-focused videos using Google Gemini AI based on your problem analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Play className="h-5 w-5 text-red-600" />
                    Startup Video Generator
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Create compelling startup videos that showcase your problem, solution, and vision. 
                    The AI will use your problem analysis from the Idea page to generate contextually relevant videos.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="video-type">Video Type</Label>
                      <select
                        id="video-type"
                        className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="">Select video type</option>
                        <option value="problem-explanation">Problem Explanation Video</option>
                        <option value="solution-demo">Solution Demo Video</option>
                        <option value="pitch-deck">Pitch Deck Video</option>
                        <option value="product-showcase">Product Showcase Video</option>
                        <option value="customer-testimonial">Customer Testimonial Video</option>
                        <option value="market-analysis">Market Analysis Video</option>
                        <option value="team-introduction">Team Introduction Video</option>
                        <option value="brand-story">Brand Story Video</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="video-prompt">Video Description & Style</Label>
                      <Textarea
                        id="video-prompt"
                        placeholder="Describe how you want the video to look, feel, and what it should showcase. For example: 'Create a professional video showing our AI-powered industrial safety solution in action, with modern tech aesthetics, showing before/after scenarios of workplace safety improvements'"
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="video-duration">Video Duration</Label>
                        <select
                          id="video-duration"
                          className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="15">15 seconds</option>
                          <option value="30">30 seconds</option>
                          <option value="60">1 minute</option>
                          <option value="120">2 minutes</option>
                          <option value="180">3 minutes</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="video-style">Visual Style</Label>
                        <select
                          id="video-style"
                          className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="professional">Professional & Corporate</option>
                          <option value="modern-tech">Modern Tech Startup</option>
                          <option value="minimalist">Minimalist & Clean</option>
                          <option value="dynamic">Dynamic & Energetic</option>
                          <option value="documentary">Documentary Style</option>
                          <option value="animated">Animated/Illustrated</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2"
                        onClick={() => generateVideo()}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Generate Video
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Powered by Google Gemini AI
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Video Generation Status */}
                <div id="video-generation-status" className="hidden">
                  <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Generating Your Video...</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Gemini AI is creating your startup video. This may take 2-5 minutes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Generated Video Display */}
                <div id="generated-video" className="hidden">
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Play className="h-5 w-5 text-green-600" />
                      Your Generated Video
                    </h4>
                    <div className="space-y-4">
                      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <video 
                          id="video-player"
                          controls 
                          className="w-full h-full rounded-lg"
                          poster="/api/placeholder/800/450"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      
                      {/* Video Information */}
                      <div id="video-info" className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h5 className="font-semibold mb-2">Video Details:</h5>
                        <div className="space-y-2 text-sm">
                          <div><strong>AI Model:</strong> Loading...</div>
                          <div><strong>Generation Time:</strong> Loading...</div>
                          <div><strong>Video ID:</strong> Loading...</div>
                        </div>
                      </div>
                      
                      {/* Video Script */}
                      <div id="video-script" className="hidden">
                        {/* Script will be populated by JavaScript */}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => downloadVideo()}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download Video
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => regenerateVideo()}
                          className="flex items-center gap-2"
                        >
                          <Video className="h-4 w-4" />
                          Generate New Version
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Video Generation Tips */}
                <div className="bg-gray-100/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">💡 Video Generation Tips</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be specific about your startup's problem and solution in the description</li>
                    <li>• Mention your target audience and industry for better context</li>
                    <li>• Include visual style preferences (colors, mood, setting)</li>
                    <li>• Specify if you want to show real people, animations, or product demos</li>
                    <li>• Gemini AI will create detailed video scripts and generation prompts</li>
                    <li>• The system uses your problem analysis from the Idea page for context</li>
                    <li>• Configure GOOGLE_GEMINI_API_KEY for real AI video generation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Download Strategy Document */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-8"
          >
            <Card className="vercel-card bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-200">
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Download Go-to-Market Strategy
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Download a comprehensive document with all your strategy details, including positioning, marketing, sales, partnerships, and launch plans.
                  </p>
                  <Button 
                    size="lg" 
                    className="px-8 py-3"
                    onClick={downloadStrategyDocument}
                  >
                    Download Strategy Document
                    <Download className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center"
          >
            <Button size="lg" className="px-8 py-3">
              Continue to Scaling Strategy
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
