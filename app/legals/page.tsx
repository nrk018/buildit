"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, CheckCircle, DollarSign, Download, ExternalLink, Star, Clock } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function LegalsPage() {
  const [selectedProvider, setSelectedProvider] = useState<any>(null)

  // Provider data with real Indian incorporation services
  const providers = [
    {
      id: 'vakilsearch',
      name: 'Vakilsearch',
      description: 'Leading legal services platform in India',
      basicPlan: {
        price: '₹7,499',
        timeline: '7-10 business days',
        rating: 4.5,
        features: [
          'LLP Registration',
          'Digital Signature Certificate (DSC)',
          'Director Identification Number (DIN)',
          'PAN & TAN Registration',
          'GST Registration',
          'Bank Account Opening Support'
        ]
      },
      premiumPlan: {
        price: '₹12,999',
        timeline: '5-7 business days',
        rating: 4.6,
        features: [
          'Everything in Basic',
          'Priority Processing',
          'Legal Document Review',
          'Compliance Support (3 months)',
          'Business License Assistance',
          'Annual Filing Support'
        ]
      },
      website: 'https://vakilsearch.com',
      pros: ['Comprehensive package', 'Good customer support', 'All-inclusive pricing'],
      cons: ['Higher cost', 'Limited customization']
    },
    {
      id: 'indiafilings',
      name: 'IndiaFilings',
      description: 'Professional incorporation services',
      basicPlan: {
        price: '₹6,999',
        timeline: '8-12 business days',
        rating: 4.3,
        features: [
          'Company Registration',
          'DSC & DIN',
          'PAN & TAN',
          'GST Registration',
          'Bank Account Support'
        ]
      },
      premiumPlan: {
        price: '₹11,999',
        timeline: '6-8 business days',
        rating: 4.4,
        features: [
          'Everything in Basic',
          'Priority Support',
          'Legal Compliance',
          'Annual Filing',
          'Business License'
        ]
      },
      website: 'https://indiafilings.com',
      pros: ['Competitive pricing', 'Good support', 'Quick processing'],
      cons: ['Limited features in basic plan']
    },
    {
      id: 'cleartax',
      name: 'ClearTax',
      description: 'Tax and compliance platform',
      basicPlan: {
        price: '₹8,999',
        timeline: '10-15 business days',
        rating: 4.2,
        features: [
          'Company Registration',
          'DSC & DIN',
          'PAN & TAN',
          'GST Registration',
          'Tax Compliance'
        ]
      },
      premiumPlan: {
        price: '₹14,999',
        timeline: '7-10 business days',
        rating: 4.3,
        features: [
          'Everything in Basic',
          'Priority Processing',
          'Tax Filing Support',
          'Compliance Monitoring',
          'Annual Returns'
        ]
      },
      website: 'https://cleartax.in',
      pros: ['Tax expertise', 'Compliance focus', 'Good reputation'],
      cons: ['Higher pricing', 'Slower processing']
    },
    {
      id: 'legalraasta',
      name: 'LegalRaasta',
      description: 'Legal services and compliance',
      basicPlan: {
        price: '₹5,999',
        timeline: '12-15 business days',
        rating: 4.1,
        features: [
          'Company Registration',
          'DSC & DIN',
          'PAN & TAN',
          'Basic Compliance'
        ]
      },
      premiumPlan: {
        price: '₹9,999',
        timeline: '8-12 business days',
        rating: 4.2,
        features: [
          'Everything in Basic',
          'Priority Support',
          'Legal Documentation',
          'Compliance Support'
        ]
      },
      website: 'https://legalraasta.com',
      pros: ['Lowest pricing', 'Basic compliance', 'Simple process'],
      cons: ['Slower processing', 'Limited support']
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Payment gateway with business services',
      basicPlan: {
        price: '₹9,999',
        timeline: '5-7 business days',
        rating: 4.7,
        features: [
          'Company Registration',
          'DSC & DIN',
          'PAN & TAN',
          'GST Registration',
          'Payment Gateway Setup',
          'Bank Account Integration'
        ]
      },
      premiumPlan: {
        price: '₹19,999',
        timeline: '3-5 business days',
        rating: 4.8,
        features: [
          'Everything in Basic',
          'Priority Processing',
          'Payment Solutions',
          'Business Banking',
          'Compliance Support',
          'API Integration'
        ]
      },
      website: 'https://razorpay.com',
      pros: ['Fast processing', 'Payment integration', 'Excellent support'],
      cons: ['Higher cost', 'Tech-focused']
    },
    {
      id: 'myonlineca',
      name: 'MyOnlineCA',
      description: 'Chartered Accountant services',
      basicPlan: {
        price: '₹6,500',
        timeline: '10-12 business days',
        rating: 4.0,
        features: [
          'Company Registration',
          'DSC & DIN',
          'PAN & TAN',
          'GST Registration',
          'CA Support'
        ]
      },
      premiumPlan: {
        price: '₹12,500',
        timeline: '7-10 business days',
        rating: 4.1,
        features: [
          'Everything in Basic',
          'CA Consultation',
          'Tax Planning',
          'Annual Compliance',
          'Audit Support'
        ]
      },
      website: 'https://myonlineca.in',
      pros: ['CA expertise', 'Tax planning', 'Reasonable pricing'],
      cons: ['Slower processing', 'Limited tech features']
    }
  ]

  // Function to download PDF with selected provider
  const downloadProviderPDF = () => {
    if (!selectedProvider) return

    const problemStatement = localStorage.getItem('problemStatement') || ''
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    const documentContent = `
BUSINESS INCORPORATION SERVICE SELECTION
${problemStatement.toUpperCase()}

Generated on: ${currentDate} at ${currentTime}
Document Version: 1.0

================================================================================
SELECTED INCORPORATION SERVICE
================================================================================

Provider: ${selectedProvider.name}
Description: ${selectedProvider.description}
Website: ${selectedProvider.website}

Selected Plan: ${selectedProvider.selectedPlan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
Price: ${selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.price : selectedProvider.premiumPlan.price}
Timeline: ${selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.timeline : selectedProvider.premiumPlan.timeline}
Rating: ${selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.rating : selectedProvider.premiumPlan.rating}/5

================================================================================
SERVICE FEATURES
================================================================================

${selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.features.map((feature: string, index: number) => `${index + 1}. ${feature}`).join('\n') : selectedProvider.premiumPlan.features.map((feature: string, index: number) => `${index + 1}. ${feature}`).join('\n')}

================================================================================
PROVIDER COMPARISON
================================================================================

Advantages:
${selectedProvider.pros.map((pro: string, index: number) => `${index + 1}. ${pro}`).join('\n')}

Disadvantages:
${selectedProvider.cons.map((con: string, index: number) => `${index + 1}. ${con}`).join('\n')}

================================================================================
ALTERNATIVE OPTIONS
================================================================================

${providers.filter(p => p.id !== selectedProvider.id).map(provider => `
${provider.name}:
- Basic Plan: ${provider.basicPlan.price} (${provider.basicPlan.timeline})
- Premium Plan: ${provider.premiumPlan.price} (${provider.premiumPlan.timeline})
- Rating: ${provider.basicPlan.rating}/5
- Website: ${provider.website}
`).join('\n')}

================================================================================
NEXT STEPS
================================================================================

1. Visit the provider website: ${selectedProvider.website}
2. Contact the provider for detailed consultation
3. Review the service terms and conditions
4. Proceed with the selected plan
5. Complete the incorporation process
6. Follow up on compliance requirements

================================================================================
DOCUMENT SUMMARY
================================================================================

Selected Provider: ${selectedProvider.name}
Selected Plan: ${selectedProvider.selectedPlan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
Total Cost: ${selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.price : selectedProvider.premiumPlan.price}
Processing Time: ${selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.timeline : selectedProvider.premiumPlan.timeline}
Provider Rating: ${selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.rating : selectedProvider.premiumPlan.rating}/5

Document Generated: ${currentDate} at ${currentTime}
Generated by: BuildIt AI Platform
Problem Statement: ${problemStatement.substring(0, 100)}${problemStatement.length > 100 ? '...' : ''}

---
This service selection was made for your startup: "${problemStatement.substring(0, 50)}${problemStatement.length > 50 ? '...' : ''}"
and provides a comprehensive comparison of incorporation service providers.

For questions or support, please refer to the BuildIt AI Platform documentation.
    `

    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Incorporation_Service_${selectedProvider.name}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Business Incorporation Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the best incorporation service provider for your startup. Compare pricing, features, and timelines.
            </p>
          </motion.div>

          {/* Provider Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-500" />
                  Select Incorporation Service Provider
                    </CardTitle>
                    <CardDescription>
                  Choose from leading Indian incorporation service providers
                    </CardDescription>
                  </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providers.map((provider) => (
                    <div
                      key={provider.id}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                        selectedProvider?.id === provider.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        {selectedProvider?.id === provider.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                        </div>

                      <p className="text-sm text-muted-foreground mb-4">{provider.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Basic Plan:</span>
                          <span className="font-bold text-green-600">{provider.basicPlan.price}</span>
                                </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Premium Plan:</span>
                          <span className="font-bold text-blue-600">{provider.premiumPlan.price}</span>
                                </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{provider.basicPlan.rating}/5</span>
                              </div>
                            </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Timeline:</span>
                          <span className="text-sm">{provider.basicPlan.timeline}</span>
                          </div>
                        </div>

                      <div className="mt-4 pt-4 border-t">
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                            </div>
                            </div>
                  ))}
                          </div>
                  </CardContent>
                </Card>
              </motion.div>

          {/* Selected Provider Details */}
          {selectedProvider && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Selected Provider: {selectedProvider.name}
                    </CardTitle>
                    <CardDescription>
                    Choose your plan and get detailed information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  {/* Plan Selection */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Plan */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                        selectedProvider.selectedPlan === 'basic'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-border hover:border-green-300'
                      }`}
                      onClick={() => setSelectedProvider({ ...selectedProvider, selectedPlan: 'basic' })}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Basic Plan</h3>
                        {selectedProvider.selectedPlan === 'basic' && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                                  </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">{selectedProvider.basicPlan.price}</div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{selectedProvider.basicPlan.timeline}</span>
                                    </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{selectedProvider.basicPlan.rating}/5</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {selectedProvider.basicPlan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                                            <span>{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                </div>

                                {/* Premium Plan */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                        selectedProvider.selectedPlan === 'premium'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedProvider({ ...selectedProvider, selectedPlan: 'premium' })}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Premium Plan</h3>
                        {selectedProvider.selectedPlan === 'premium' && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                                    </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{selectedProvider.premiumPlan.price}</div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{selectedProvider.premiumPlan.timeline}</span>
                                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{selectedProvider.premiumPlan.rating}/5</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {selectedProvider.premiumPlan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                                              <span>{feature}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                        </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                      <h4 className="font-semibold mb-3 text-green-600">Advantages</h4>
                      <ul className="space-y-2">
                        {selectedProvider.pros.map((pro: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-sm">{pro}</span>
                                  </li>
                        ))}
                              </ul>
                            </div>
                            <div>
                      <h4 className="font-semibold mb-3 text-red-600">Disadvantages</h4>
                      <ul className="space-y-2">
                        {selectedProvider.cons.map((con: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span className="text-sm">{con}</span>
                                </li>
                        ))}
                              </ul>
                            </div>
                          </div>
                  </CardContent>
                </Card>
              </motion.div>
          )}

          {/* Download Section */}
          {selectedProvider && selectedProvider.selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="vercel-card bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-200">
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Download className="h-8 w-8 text-white" />
                </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Download Service Selection
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Download a comprehensive document with your selected provider, plan details, and cost information.
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <div className="text-sm text-muted-foreground mb-2">Selected Service:</div>
                      <div className="font-semibold text-lg">{selectedProvider.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">Plan:</div>
                      <div className="font-semibold">{selectedProvider.selectedPlan === 'basic' ? 'Basic Plan' : 'Premium Plan'}</div>
                      <div className="text-sm text-muted-foreground mb-2">Cost:</div>
                      <div className="font-bold text-2xl text-green-600">
                        {selectedProvider.selectedPlan === 'basic' ? selectedProvider.basicPlan.price : selectedProvider.premiumPlan.price}
                </div>
                </div>
                <Button 
                  size="lg" 
                  className="px-8 py-3"
                      onClick={downloadProviderPDF}
                >
                      Download Service Selection PDF
                      <Download className="ml-2 h-5 w-5" />
                </Button>
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