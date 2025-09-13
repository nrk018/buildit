"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Scale, FileText, Shield, AlertTriangle, CheckCircle, ArrowRight, Building, TrendingUp, DollarSign, Clock, Star, ExternalLink, Download } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function LegalsPage() {
  const [businessEntityAnalysis, setBusinessEntityAnalysis] = useState<any>(null)
  const [providerPricing, setProviderPricing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('entity-analysis')
  const [legalData, setLegalData] = useState({
    businessType: '',
    businessName: '',
    stateIncorporation: 'Delaware',
    businessAddress: '',
    ein: '',
    registrationDate: '',
    businessLicense: '',
    industryLicenses: '',
    localPermits: '',
    onlineBusiness: '',
    trademarks: '',
    copyrights: '',
    patents: '',
    tradeSecrets: '',
    dataProtection: '',
    industryRegulations: '',
    employmentLaw: '',
    taxObligations: '',
    legalBudget: '',
    attorneyContact: '',
    priorityItems: '',
    ongoingCompliance: ''
  })

  // Load business entity analysis when component mounts
  useEffect(() => {
    loadBusinessEntityAnalysis()
  }, [])

  // Function to load business entity analysis
  const loadBusinessEntityAnalysis = async () => {
    setLoading(true)
    try {
      const problemStatement = localStorage.getItem('problemStatement') || 
        'AI-powered campus safety system to detect and prevent safety hazards using computer vision and IoT sensors'
      
      const response = await fetch('/api/analyze-business-entity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement,
          businessModel: JSON.parse(localStorage.getItem('businessModel') || '{}'),
          teamData: JSON.parse(localStorage.getItem('teamData') || '{}'),
          targetMarket: localStorage.getItem('targetMarket') || 'College campuses in India',
          industry: localStorage.getItem('industry') || 'EdTech/Safety Technology',
          fundingPlans: localStorage.getItem('fundingPlans') || 'Seeking seed funding'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setBusinessEntityAnalysis(data.businessEntityAnalysis)
        setLegalData(prev => ({
          ...prev,
          businessType: data.businessEntityAnalysis.recommendedEntity.type,
          stateIncorporation: data.businessEntityAnalysis.recommendedEntity.recommendedState
        }))
        
        // Load provider pricing for the recommended entity type
        loadProviderPricing(data.businessEntityAnalysis.recommendedEntity.type, data.businessEntityAnalysis.recommendedEntity.recommendedState)
      }
    } catch (error) {
      console.error('Error loading business entity analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to load provider pricing
  const loadProviderPricing = async (entityType: string, state: string) => {
    try {
      const response = await fetch('/api/get-provider-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType,
          state
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProviderPricing(data)
      }
    } catch (error) {
      console.error('Error loading provider pricing:', error)
    }
  }

  // Function to generate legal document
  const generateLegalDocument = () => {
    if (!businessEntityAnalysis) return

    const documentContent = `
# Legal Requirements Document

## Business Entity Analysis
**Recommended Entity Type:** ${businessEntityAnalysis?.recommendedEntity?.type || 'Loading...'}
**Reasoning:** ${businessEntityAnalysis?.recommendedEntity?.reasoning || 'Loading...'}
**Recommended State:** ${businessEntityAnalysis?.recommendedEntity?.recommendedState || 'Loading...'}

### Benefits
${businessEntityAnalysis?.recommendedEntity?.benefits?.map((benefit: string) => `- ${benefit}`).join('\n') || 'Loading benefits...'}

### Drawbacks
${businessEntityAnalysis?.recommendedEntity?.drawbacks?.map((drawback: string) => `- ${drawback}`).join('\n') || 'Loading drawbacks...'}

## Entity Comparison
### LLP (Limited Liability Partnership)
**Description:** ${businessEntityAnalysis?.entityComparison?.llp?.description || 'Loading...'}
**Pros:** ${businessEntityAnalysis?.entityComparison?.llp?.pros?.join(', ') || 'Loading...'}
**Cons:** ${businessEntityAnalysis?.entityComparison?.llp?.cons?.join(', ') || 'Loading...'}
**Tax Treatment:** ${businessEntityAnalysis?.entityComparison?.llp?.taxTreatment || 'Loading...'}

### Private Limited Company
**Description:** ${businessEntityAnalysis?.entityComparison?.['private-limited']?.description || 'Loading...'}
**Pros:** ${businessEntityAnalysis?.entityComparison?.['private-limited']?.pros?.join(', ') || 'Loading...'}
**Cons:** ${businessEntityAnalysis?.entityComparison?.['private-limited']?.cons?.join(', ') || 'Loading...'}
**Tax Treatment:** ${businessEntityAnalysis?.entityComparison?.['private-limited']?.taxTreatment || 'Loading...'}

## Incorporation Requirements
### Required Documents
${businessEntityAnalysis?.incorporationRequirements?.requiredDocuments?.map((doc: string) => `- ${doc}`).join('\n') || 'Loading documents...'}

### Filing Requirements
${businessEntityAnalysis?.incorporationRequirements?.filingRequirements?.map((req: string) => `- ${req}`).join('\n') || 'Loading requirements...'}

**Estimated Timeline:** ${businessEntityAnalysis?.incorporationRequirements?.estimatedTimeline || 'Loading...'}

## Cost Analysis
### Incorporation Costs by State
${businessEntityAnalysis?.costAnalysis?.incorporationCosts ? Object.entries(businessEntityAnalysis.costAnalysis.incorporationCosts).map(([state, cost]) => `- ${state}: ${cost}`).join('\n') : 'Loading costs...'}

### Ongoing Costs
- Annual Fees: ${businessEntityAnalysis?.costAnalysis?.ongoingCosts?.annualFees || 'Loading...'}
- Registered Agent: ${businessEntityAnalysis?.costAnalysis?.ongoingCosts?.registeredAgent || 'Loading...'}
- Compliance Costs: ${businessEntityAnalysis?.costAnalysis?.ongoingCosts?.complianceCosts || 'Loading...'}

### Professional Services
- Attorney Fees: ${businessEntityAnalysis?.costAnalysis?.professionalServices?.attorneyFees || 'Loading...'}
- Accountant Fees: ${businessEntityAnalysis?.costAnalysis?.professionalServices?.accountantFees || 'Loading...'}
- Registered Agent: ${businessEntityAnalysis?.costAnalysis?.professionalServices?.registeredAgent || 'Loading...'}

## Provider Recommendations
${providerPricing ? `
### Cheapest Option
**Provider:** ${providerPricing?.comparison?.cheapest?.name || 'Loading...'}
**Price:** ${providerPricing?.comparison?.cheapest?.basicPlan?.price || 'Loading...'}
**Timeline:** ${providerPricing?.comparison?.cheapest?.basicPlan?.timeline || 'Loading...'}

### Most Popular
**Provider:** ${providerPricing?.comparison?.mostPopular?.name || 'Loading...'}
**Price:** ${providerPricing?.comparison?.mostPopular?.basicPlan?.price || 'Loading...'}
**Rating:** ${providerPricing?.comparison?.mostPopular?.basicPlan?.rating || 'Loading...'}/5

### Fastest Processing
**Provider:** ${providerPricing?.comparison?.fastest?.name || 'Loading...'}
**Price:** ${providerPricing?.comparison?.fastest?.basicPlan?.price || 'Loading...'}
**Timeline:** ${providerPricing?.comparison?.fastest?.basicPlan?.timeline || 'Loading...'}
` : ''}

## Legal Checklist
- [ ] Choose business entity type
- [ ] Select state of incorporation
- [ ] File articles of incorporation/organization
- [ ] Obtain EIN
- [ ] Create operating agreement/bylaws
- [ ] Appoint registered agent
- [ ] Obtain business license
- [ ] Register for taxes
- [ ] Set up business bank account
- [ ] Obtain necessary permits

---
*Generated on ${new Date().toLocaleDateString()}*
    `

    const blob = new Blob([documentContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Legal_Requirements_${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Legal Requirements</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ensure your business is legally compliant and protected from the start
            </p>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="entity-analysis">Entity Analysis</TabsTrigger>
              <TabsTrigger value="provider-pricing">Provider Pricing</TabsTrigger>
              <TabsTrigger value="legal-requirements">Legal Requirements</TabsTrigger>
              <TabsTrigger value="legal-document">Legal Document</TabsTrigger>
            </TabsList>

            {/* Entity Analysis Tab */}
            <TabsContent value="entity-analysis" className="space-y-6">
              {/* Business Entity Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-500" />
                      Business Entity Analysis
                    </CardTitle>
                    <CardDescription>
                      AI-powered analysis of your startup to recommend the best business entity type
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Analyzing your startup...</p>
                      </div>
                    ) : businessEntityAnalysis ? (
                      <div className="space-y-6">
                        {/* Recommended Entity */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            Recommended Entity Type
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-lg">{businessEntityAnalysis?.recommendedEntity?.type || 'Loading...'}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{businessEntityAnalysis?.recommendedEntity?.reasoning || 'Loading reasoning...'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium mb-2">Benefits</h5>
                                <ul className="space-y-1 text-sm">
                                  {businessEntityAnalysis?.recommendedEntity?.benefits?.map((benefit: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-green-500 mt-1">•</span>
                                      <span>{benefit}</span>
                                    </li>
                                  )) || <li className="text-gray-500">Loading benefits...</li>}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium mb-2">Drawbacks</h5>
                                <ul className="space-y-1 text-sm">
                                  {businessEntityAnalysis?.recommendedEntity?.drawbacks?.map((drawback: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-red-500 mt-1">•</span>
                                      <span>{drawback}</span>
                                    </li>
                                  )) || <li className="text-gray-500">Loading drawbacks...</li>}
                                </ul>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">Recommended State: {businessEntityAnalysis?.recommendedEntity?.recommendedState || 'Loading...'}</Badge>
                              <Badge variant="outline">Best States: {businessEntityAnalysis?.recommendedEntity?.bestStates?.join(', ') || 'Loading...'}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Entity Comparison */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Entity Type Comparison</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* LLP */}
                            <div className="border border-border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">LLP</h4>
                              <p className="text-sm text-muted-foreground mb-3">{businessEntityAnalysis.entityComparison.llp.description}</p>
                              <div className="space-y-2">
                                <div>
                                  <h5 className="font-medium text-sm">Pros:</h5>
                                  <ul className="text-xs space-y-1">
                                    {businessEntityAnalysis.entityComparison.llp.pros.map((pro: string, index: number) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span>{pro}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">Cons:</h5>
                                  <ul className="text-xs space-y-1">
                                    {businessEntityAnalysis.entityComparison.llp.cons.map((con: string, index: number) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{con}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Private Limited Company */}
                            <div className="border border-border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Private Limited Company</h4>
                              <p className="text-sm text-muted-foreground mb-3">{businessEntityAnalysis.entityComparison['private-limited'].description}</p>
                              <div className="space-y-2">
                                <div>
                                  <h5 className="font-medium text-sm">Pros:</h5>
                                  <ul className="text-xs space-y-1">
                                    {businessEntityAnalysis.entityComparison['private-limited'].pros.map((pro: string, index: number) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span>{pro}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">Cons:</h5>
                                  <ul className="text-xs space-y-1">
                                    {businessEntityAnalysis.entityComparison['private-limited'].cons.map((con: string, index: number) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{con}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Incorporation Requirements */}
                        <div className="border border-border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            Incorporation Requirements
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Required Documents</h4>
                              <ul className="space-y-1 text-sm">
                                {businessEntityAnalysis?.incorporationRequirements?.requiredDocuments?.map((doc: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{doc}</span>
                                  </li>
                                )) || <li className="text-gray-500">Loading documents...</li>}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Filing Requirements</h4>
                              <ul className="space-y-1 text-sm">
                                {businessEntityAnalysis?.incorporationRequirements?.filingRequirements?.map((req: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{req}</span>
                                  </li>
                                )) || <li className="text-gray-500">Loading requirements...</li>}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Badge variant="outline">Timeline: {businessEntityAnalysis?.incorporationRequirements?.estimatedTimeline || 'Loading...'}</Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No entity analysis available</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete your startup planning to get personalized entity recommendations
                        </p>
                        <Button onClick={loadBusinessEntityAnalysis} disabled={loading}>
                          Analyze Business Entity
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Provider Pricing Tab */}
            <TabsContent value="provider-pricing" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Provider Pricing Comparison
                    </CardTitle>
                    <CardDescription>
                      Compare pricing from different company registration providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {providerPricing ? (
                      <div className="space-y-6">
                        {/* Quick Comparison */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Quick Comparison
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <h4 className="font-medium text-sm text-green-600">Cheapest</h4>
                              <p className="text-lg font-semibold">{providerPricing?.comparison?.cheapest?.name || 'Loading...'}</p>
                              <p className="text-sm text-muted-foreground">{providerPricing?.comparison?.cheapest?.basicPlan?.price || 'Loading...'}</p>
                            </div>
                            <div className="text-center">
                              <h4 className="font-medium text-sm text-blue-600">Most Popular</h4>
                              <p className="text-lg font-semibold">{providerPricing?.comparison?.mostPopular?.name || 'Loading...'}</p>
                              <p className="text-sm text-muted-foreground">{providerPricing?.comparison?.mostPopular?.basicPlan?.price || 'Loading...'}</p>
                            </div>
                            <div className="text-center">
                              <h4 className="font-medium text-sm text-orange-600">Fastest</h4>
                              <p className="text-lg font-semibold">{providerPricing?.comparison?.fastest?.name || 'Loading...'}</p>
                              <p className="text-sm text-muted-foreground">{providerPricing?.comparison?.fastest?.basicPlan?.timeline || 'Loading...'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Provider Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Provider Details</h3>
                          {providerPricing?.providers?.map((provider: any, index: number) => (
                            <div key={index} className="border border-border rounded-lg p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="text-lg font-semibold">{provider.name}</h4>
                                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm">{provider.basicPlan.rating}</span>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Visit
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Plan */}
                                <div className="border border-border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="font-medium">Basic Plan</h5>
                                    <span className="text-lg font-semibold text-green-600">{provider.basicPlan.price}</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span>{provider.basicPlan.timeline}</span>
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-sm mb-2">Features:</h6>
                                      <ul className="space-y-1 text-xs">
                                        {provider.basicPlan.features.map((feature: string, idx: number) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                {/* Premium Plan */}
                                {provider.premiumPlan && (
                                  <div className="border border-border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="font-medium">Premium Plan</h5>
                                      <span className="text-lg font-semibold text-blue-600">{provider.premiumPlan.price}</span>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <span>{provider.premiumPlan.timeline}</span>
                                      </div>
                                      <div>
                                        <h6 className="font-medium text-sm mb-2">Features:</h6>
                                        <ul className="space-y-1 text-xs">
                                          {provider.premiumPlan.features.map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2">
                                              <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                              <span>{feature}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Additional Costs */}
                        <div className="border border-border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Additional Costs
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">State Filing Fees</h4>
                              <ul className="space-y-1 text-sm">
                                {providerPricing?.additionalCosts?.stateFilingFees ? Object.entries(providerPricing.additionalCosts.stateFilingFees).map(([state, cost]) => (
                                  <li key={state} className="flex justify-between">
                                    <span>{state}:</span>
                                    <span className="font-medium">{cost as string}</span>
                                  </li>
                                )) : <li className="text-gray-500">Loading costs...</li>}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Other Costs</h4>
                              <ul className="space-y-1 text-sm">
                                <li className="flex justify-between">
                                  <span>Registered Agent:</span>
                                  <span className="font-medium">{providerPricing?.additionalCosts?.registeredAgent || 'Loading...'}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Business License:</span>
                                  <span className="font-medium">{providerPricing?.additionalCosts?.businessLicense || 'Loading...'}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>EIN:</span>
                                  <span className="font-medium">{providerPricing?.additionalCosts?.ein || 'Loading...'}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No pricing data available</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete entity analysis to view provider pricing
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Legal Requirements Tab */}
            <TabsContent value="legal-requirements" className="space-y-6">
              {/* Business Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  Business Structure
                </CardTitle>
                <CardDescription>Choose the right legal structure for your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="business-type">Business entity type</Label>
                  <select
                    id="business-type"
                    className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    value={legalData.businessType}
                    onChange={(e) => setLegalData({...legalData, businessType: e.target.value})}
                  >
                    <option value="">Select entity type</option>
                    <option value="llp">LLP (Limited Liability Partnership)</option>
                    <option value="private-limited">Private Limited Company</option>
                    <option value="one-person-company">One Person Company (OPC)</option>
                    <option value="partnership">Partnership Firm</option>
                    <option value="sole-proprietorship">Sole Proprietorship</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-name">Legal business name</Label>
                    <Input 
                      id="business-name" 
                      placeholder="Your Company Pvt Ltd" 
                      className="mt-2"
                      value={legalData.businessName}
                      onChange={(e) => setLegalData({...legalData, businessName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state-incorporation">State of incorporation</Label>
                    <select
                      id="state-incorporation"
                      className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      value={legalData.stateIncorporation}
                      onChange={(e) => setLegalData({...legalData, stateIncorporation: e.target.value})}
                    >
                      <option value="">Select state</option>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai (Maharashtra)</option>
                      <option value="bangalore">Bangalore (Karnataka)</option>
                      <option value="chennai">Chennai (Tamil Nadu)</option>
                      <option value="hyderabad">Hyderabad (Telangana)</option>
                      <option value="pune">Pune (Maharashtra)</option>
                      <option value="kolkata">Kolkata (West Bengal)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="business-address">Business address</Label>
                  <Textarea 
                    id="business-address" 
                    placeholder="Full business address" 
                    className="mt-2"
                    value={legalData.businessAddress}
                    onChange={(e) => setLegalData({...legalData, businessAddress: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ein">PAN (Permanent Account Number)</Label>
                    <Input 
                      id="ein" 
                      placeholder="ABCDE1234F" 
                      className="mt-2"
                      value={legalData.ein}
                      onChange={(e) => setLegalData({...legalData, ein: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registration-date">Registration date</Label>
                    <Input 
                      id="registration-date" 
                      type="date" 
                      className="mt-2"
                      value={legalData.registrationDate}
                      onChange={(e) => setLegalData({...legalData, registrationDate: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Licenses & Permits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Licenses & Permits
                </CardTitle>
                <CardDescription>Identify required licenses and permits for your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="business-license">General business license</Label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="License number" />
                    <Input placeholder="Issuing authority" />
                    <Input type="date" placeholder="Expiration date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="industry-licenses">Industry-specific licenses</Label>
                  <Textarea
                    id="industry-licenses"
                    placeholder="List any industry-specific licenses required (professional licenses, health permits, etc.)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="local-permits">Local permits</Label>
                  <Textarea
                    id="local-permits"
                    placeholder="Zoning permits, signage permits, fire department permits, etc."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="online-business">Online business requirements</Label>
                  <Textarea
                    id="online-business"
                    placeholder="Sales tax registration, privacy policy, terms of service, GDPR compliance, etc."
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Intellectual Property
                </CardTitle>
                <CardDescription>Protect your intellectual property assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="trademarks">Trademarks</Label>
                  <Textarea
                    id="trademarks"
                    placeholder="Business name, logo, slogans, product names to trademark"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="copyrights">Copyrights</Label>
                  <Textarea
                    id="copyrights"
                    placeholder="Original content, software code, marketing materials, etc."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="patents">Patents</Label>
                  <Textarea
                    id="patents"
                    placeholder="Inventions, processes, or unique methods that could be patented"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="trade-secrets">Trade secrets</Label>
                  <Textarea
                    id="trade-secrets"
                    placeholder="Proprietary information, formulas, customer lists, etc."
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contracts & Agreements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Essential Contracts & Agreements
                </CardTitle>
                <CardDescription>Key legal documents your business needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Founder/Co-founder agreements",
                    "Employee contracts and offer letters",
                    "Non-disclosure agreements (NDAs)",
                    "Non-compete agreements",
                    "Customer terms of service",
                    "Privacy policy",
                    "Vendor/supplier agreements",
                    "Partnership agreements",
                    "Licensing agreements",
                    "Independent contractor agreements",
                  ].map((contract, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`contract-${index}`}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`contract-${index}`} className="text-sm text-foreground flex-1">
                        {contract}
                      </label>
                      <Input placeholder="Status/Notes" className="w-32 text-xs" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Compliance & Regulations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Compliance & Regulations
                </CardTitle>
                <CardDescription>Stay compliant with relevant regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="data-protection">Data protection compliance</Label>
                  <Textarea
                    id="data-protection"
                    placeholder="GDPR, CCPA, HIPAA, or other data protection requirements"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="industry-regulations">Industry-specific regulations</Label>
                  <Textarea
                    id="industry-regulations"
                    placeholder="Financial services, healthcare, food safety, etc."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="employment-law">Employment law compliance</Label>
                  <Textarea
                    id="employment-law"
                    placeholder="Wage and hour laws, anti-discrimination policies, workplace safety"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tax-obligations">Tax obligations</Label>
                  <Textarea
                    id="tax-obligations"
                    placeholder="Income tax, sales tax, payroll tax, quarterly filings"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Budget & Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Legal Budget & Timeline
                </CardTitle>
                <CardDescription>Plan your legal expenses and timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="legal-budget">Legal budget</Label>
                    <Input id="legal-budget" placeholder="₹4,15,000 - ₹12,45,000" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="attorney-contact">Attorney/Legal counsel</Label>
                    <Input id="attorney-contact" placeholder="Name and contact info" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority-items">Priority legal items (next 30 days)</Label>
                  <Textarea
                    id="priority-items"
                    placeholder="Most urgent legal tasks to complete first"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="ongoing-compliance">Ongoing compliance tasks</Label>
                  <Textarea
                    id="ongoing-compliance"
                    placeholder="Regular legal maintenance tasks and deadlines"
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
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <Button 
                  size="lg" 
                  className="px-8 py-3"
                  onClick={() => setActiveTab('legal-document')}
                >
                  Generate Legal Document
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </TabsContent>

            {/* Legal Document Tab */}
            <TabsContent value="legal-document" className="space-y-6">
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
                          Legal Requirements Document
                        </CardTitle>
                        <CardDescription>
                          Your comprehensive legal requirements document with entity analysis and provider recommendations
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={generateLegalDocument}
                          disabled={!businessEntityAnalysis}
                          variant="outline"
                        >
                          Generate Document
                        </Button>
                        {businessEntityAnalysis && (
                          <Button onClick={generateLegalDocument}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {businessEntityAnalysis ? (
                      <div className="space-y-6">
                        {/* Document Preview */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
                          <div className="space-y-4 text-sm">
                            <div>
                              <h4 className="font-medium">Business Entity Analysis</h4>
                              <p className="text-muted-foreground">
                                Recommended: <strong>{businessEntityAnalysis?.recommendedEntity?.type || 'Loading...'}</strong> in {businessEntityAnalysis?.recommendedEntity?.recommendedState || 'Loading...'}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium">Key Benefits</h4>
                              <ul className="space-y-1">
                                {businessEntityAnalysis?.recommendedEntity?.benefits?.slice(0, 3).map((benefit: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{benefit}</span>
                                  </li>
                                )) || <li className="text-gray-500">Loading benefits...</li>}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium">Timeline & Costs</h4>
                              <p className="text-muted-foreground">
                                Incorporation timeline: {businessEntityAnalysis?.incorporationRequirements?.estimatedTimeline || 'Loading...'}
                              </p>
                              <p className="text-muted-foreground">
                                Estimated costs: {businessEntityAnalysis?.costAnalysis?.incorporationCosts?.[businessEntityAnalysis?.recommendedEntity?.recommendedState?.toLowerCase()] || 'Loading...'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Document Sections */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Document Sections</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-border rounded-lg p-4">
                              <h4 className="font-medium mb-2">✅ Business Entity Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                AI-powered recommendation for {businessEntityAnalysis?.recommendedEntity?.type || 'Loading...'} with detailed reasoning
                              </p>
                            </div>
                            <div className="border border-border rounded-lg p-4">
                              <h4 className="font-medium mb-2">✅ Entity Comparison</h4>
                              <p className="text-sm text-muted-foreground">
                                Detailed comparison of LLC, Corporation, Partnership, and Sole Proprietorship
                              </p>
                            </div>
                            <div className="border border-border rounded-lg p-4">
                              <h4 className="font-medium mb-2">✅ Incorporation Requirements</h4>
                              <p className="text-sm text-muted-foreground">
                                Required documents, filing requirements, and timeline
                              </p>
                            </div>
                            <div className="border border-border rounded-lg p-4">
                              <h4 className="font-medium mb-2">✅ Cost Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                Incorporation costs by state and ongoing compliance costs
                              </p>
                            </div>
                            {providerPricing && (
                              <>
                                <div className="border border-border rounded-lg p-4">
                                  <h4 className="font-medium mb-2">✅ Provider Recommendations</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Cheapest: {providerPricing?.comparison?.cheapest?.name || 'Loading...'} ({providerPricing?.comparison?.cheapest?.basicPlan?.price || 'Loading...'})
                                  </p>
                                </div>
                                <div className="border border-border rounded-lg p-4">
                                  <h4 className="font-medium mb-2">✅ Legal Checklist</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Step-by-step checklist for incorporation and compliance
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Download Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Download className="h-5 w-5 text-blue-600" />
                            Download Your Legal Document
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Your comprehensive legal requirements document includes all the analysis, recommendations, and provider pricing information. 
                            This document can be used for:
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Sharing with legal counsel for incorporation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Reference during the incorporation process</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Comparing provider options and pricing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Planning legal budget and timeline</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No legal document available</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete entity analysis to generate your legal requirements document
                        </p>
                        <Button onClick={loadBusinessEntityAnalysis} disabled={loading}>
                          Analyze Business Entity
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
