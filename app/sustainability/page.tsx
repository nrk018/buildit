"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Leaf, Recycle, Heart, Globe, TrendingUp, Shield, ArrowRight, CheckCircle } from "lucide-react"

export default function SustainabilityPage() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Sustainability Planning</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build a sustainable business that creates long-term value for all stakeholders and the environment
            </p>
          </motion.div>

          {/* Environmental Sustainability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>Minimize your environmental footprint and promote sustainability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="carbon-footprint">Carbon footprint assessment</Label>
                  <Textarea
                    id="carbon-footprint"
                    placeholder="Assess your business's carbon emissions from operations, supply chain, and digital infrastructure"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="green-practices">Green business practices</Label>
                    <Textarea
                      id="green-practices"
                      placeholder="Renewable energy, waste reduction, sustainable materials..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supply-chain-sustainability">Sustainable supply chain</Label>
                    <Textarea
                      id="supply-chain-sustainability"
                      placeholder="Eco-friendly suppliers, local sourcing, ethical procurement..."
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="environmental-goals">Environmental goals and targets</Label>
                  <Textarea
                    id="environmental-goals"
                    placeholder="Carbon neutrality timeline, waste reduction targets, sustainability certifications..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="green-products">Sustainable product design</Label>
                  <Textarea
                    id="green-products"
                    placeholder="How will you design products/services to minimize environmental impact?"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Responsibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Social Responsibility
                </CardTitle>
                <CardDescription>Create positive social impact and support your community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="social-mission">Social mission and values</Label>
                  <Textarea
                    id="social-mission"
                    placeholder="What social problems does your business help solve? What are your core values?"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="community-impact">Community engagement</Label>
                    <Textarea
                      id="community-impact"
                      placeholder="Local partnerships, volunteer programs, community support..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diversity-inclusion">Diversity & inclusion</Label>
                    <Textarea
                      id="diversity-inclusion"
                      placeholder="Hiring practices, workplace culture, supplier diversity..."
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="employee-wellbeing">Employee wellbeing</Label>
                  <Textarea
                    id="employee-wellbeing"
                    placeholder="Work-life balance, mental health support, professional development, fair compensation..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="giving-back">Giving back initiatives</Label>
                  <Textarea
                    id="giving-back"
                    placeholder="Charitable donations, pro bono work, social impact programs..."
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Economic Sustainability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Economic Sustainability
                </CardTitle>
                <CardDescription>Build a financially sustainable and resilient business model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="long-term-viability">Long-term business viability</Label>
                  <Textarea
                    id="long-term-viability"
                    placeholder="How will you ensure your business remains profitable and competitive over time?"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="revenue-diversification">Revenue diversification</Label>
                    <Textarea
                      id="revenue-diversification"
                      placeholder="Multiple revenue streams, market diversification..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost-optimization">Cost optimization</Label>
                    <Textarea
                      id="cost-optimization"
                      placeholder="Efficient operations, technology automation, lean practices..."
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="stakeholder-value">Stakeholder value creation</Label>
                  <Textarea
                    id="stakeholder-value"
                    placeholder="How do you create value for customers, employees, investors, and society?"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="innovation-strategy">Innovation and adaptation</Label>
                  <Textarea
                    id="innovation-strategy"
                    placeholder="How will you stay innovative and adapt to market changes?"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Governance & Ethics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Governance & Ethics
                </CardTitle>
                <CardDescription>Establish strong governance and ethical business practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ethical-framework">Ethical framework</Label>
                  <Textarea
                    id="ethical-framework"
                    placeholder="Core ethical principles that guide business decisions and operations"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transparency">Transparency and accountability</Label>
                    <Textarea
                      id="transparency"
                      placeholder="Open communication, regular reporting, stakeholder engagement..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data-privacy">Data privacy and security</Label>
                    <Textarea
                      id="data-privacy"
                      placeholder="Customer data protection, privacy policies, security measures..."
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="compliance-framework">Compliance framework</Label>
                  <Textarea
                    id="compliance-framework"
                    placeholder="Regulatory compliance, industry standards, internal policies..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="board-governance">Board and leadership governance</Label>
                  <Textarea
                    id="board-governance"
                    placeholder="Board composition, decision-making processes, leadership accountability..."
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Circular Economy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-orange-500" />
                  Circular Economy Principles
                </CardTitle>
                <CardDescription>Implement circular economy practices in your business model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="waste-reduction">Waste reduction and elimination</Label>
                  <Textarea
                    id="waste-reduction"
                    placeholder="How will you minimize waste in your operations and products?"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reuse-recycle">Reuse and recycling programs</Label>
                    <Textarea
                      id="reuse-recycle"
                      placeholder="Product take-back programs, material recycling, refurbishment..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resource-efficiency">Resource efficiency</Label>
                    <Textarea
                      id="resource-efficiency"
                      placeholder="Optimize resource use, sharing economy models, digital solutions..."
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="product-lifecycle">Product lifecycle management</Label>
                  <Textarea
                    id="product-lifecycle"
                    placeholder="Design for durability, repairability, and end-of-life management"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sustainability Metrics & Reporting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-500" />
                  Sustainability Metrics & Reporting
                </CardTitle>
                <CardDescription>Track and report on your sustainability performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sustainability-kpis">Key sustainability KPIs</Label>
                  <Textarea
                    id="sustainability-kpis"
                    placeholder="Carbon emissions, waste reduction, employee satisfaction, community impact metrics..."
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reporting-framework">Reporting framework</Label>
                    <Input id="reporting-framework" placeholder="GRI, SASB, B Corp, UN SDGs..." className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="reporting-frequency">Reporting frequency</Label>
                    <Input id="reporting-frequency" placeholder="Annual, quarterly..." className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="stakeholder-communication">Stakeholder communication</Label>
                  <Textarea
                    id="stakeholder-communication"
                    placeholder="How will you communicate sustainability progress to stakeholders?"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="continuous-improvement">Continuous improvement plan</Label>
                  <Textarea
                    id="continuous-improvement"
                    placeholder="How will you continuously improve your sustainability performance?"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 mb-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Business Plan Complete!</h3>
              <p className="text-muted-foreground mb-6">
                You've successfully planned all aspects of your business from idea to sustainability. Your comprehensive
                business plan is ready to guide your entrepreneurial journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-3">
                  Download Business Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  Share with Team
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
