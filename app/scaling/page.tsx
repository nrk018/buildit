"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BarChart3, Users, Cog, Globe, TrendingUp, Zap, ArrowRight, Target } from "lucide-react"

export default function ScalingPage() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Scaling Strategy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plan for sustainable growth and scale your business operations, team, and market presence
            </p>
          </motion.div>

          {/* Growth Metrics & KPIs */}
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
                  Growth Metrics & KPIs
                </CardTitle>
                <CardDescription>Define key metrics to track your scaling progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="revenue-growth">Revenue growth rate</Label>
                    <Input id="revenue-growth" placeholder="20% MoM" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="customer-growth">Customer growth rate</Label>
                    <Input id="customer-growth" placeholder="15% MoM" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="market-share">Market share target</Label>
                    <Input id="market-share" placeholder="5% in 2 years" className="mt-2" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit-economics">Unit economics</Label>
                    <Textarea
                      id="unit-economics"
                      placeholder="LTV, CAC, gross margin, contribution margin per customer"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="operational-metrics">Operational metrics</Label>
                    <Textarea
                      id="operational-metrics"
                      placeholder="Churn rate, NPS, employee productivity, system uptime"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="north-star-metric">North Star Metric</Label>
                  <Textarea
                    id="north-star-metric"
                    placeholder="The single most important metric that reflects your business value"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Operational Scaling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="h-5 w-5 text-purple-500" />
                  Operational Scaling
                </CardTitle>
                <CardDescription>Scale your operations and infrastructure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="process-automation">Process automation</Label>
                  <Textarea
                    id="process-automation"
                    placeholder="Which processes can be automated to handle increased volume?"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="technology-infrastructure">Technology infrastructure</Label>
                    <Textarea
                      id="technology-infrastructure"
                      placeholder="Scalable architecture, cloud services, monitoring..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quality-control">Quality control systems</Label>
                    <Textarea
                      id="quality-control"
                      placeholder="How will you maintain quality as you scale?"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supply-chain">Supply chain optimization</Label>
                  <Textarea
                    id="supply-chain"
                    placeholder="Vendor relationships, inventory management, logistics..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-support">Customer support scaling</Label>
                  <Textarea
                    id="customer-support"
                    placeholder="Support team structure, self-service options, knowledge base..."
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Scaling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Team Scaling
                </CardTitle>
                <CardDescription>Build and scale your team structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="organizational-structure">Organizational structure</Label>
                  <Textarea
                    id="organizational-structure"
                    placeholder="Department structure, reporting lines, decision-making processes..."
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hiring-plan">Hiring plan (next 12 months)</Label>
                    <Textarea id="hiring-plan" placeholder="Key roles to hire, timeline, budget..." className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="leadership-team">Leadership team development</Label>
                    <Textarea
                      id="leadership-team"
                      placeholder="C-level hires, management structure..."
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company-culture">Company culture scaling</Label>
                  <Textarea
                    id="company-culture"
                    placeholder="How will you maintain culture as you grow?"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remote-work">Remote work strategy</Label>
                    <Textarea id="remote-work" placeholder="Remote, hybrid, or in-office approach" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="performance-management">Performance management</Label>
                    <Textarea
                      id="performance-management"
                      placeholder="Goal setting, reviews, career development..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Expansion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-500" />
                  Market Expansion
                </CardTitle>
                <CardDescription>Expand into new markets and customer segments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="geographic-expansion">Geographic expansion</Label>
                  <Textarea
                    id="geographic-expansion"
                    placeholder="New cities, states, or countries to enter"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-segments">New customer segments</Label>
                  <Textarea
                    id="customer-segments"
                    placeholder="Adjacent customer groups or market verticals"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-expansion">Product line expansion</Label>
                    <Textarea id="product-expansion" placeholder="New products or services to offer" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="channel-expansion">Channel expansion</Label>
                    <Textarea
                      id="channel-expansion"
                      placeholder="New distribution or sales channels"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="market-entry-strategy">Market entry strategy</Label>
                  <Textarea
                    id="market-entry-strategy"
                    placeholder="How will you enter new markets? (organic growth, partnerships, acquisitions)"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Scaling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  Financial Scaling
                </CardTitle>
                <CardDescription>Manage finances and funding for growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cash-flow-management">Cash flow management</Label>
                    <Textarea
                      id="cash-flow-management"
                      placeholder="Working capital, payment terms, cash reserves..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="funding-strategy">Future funding strategy</Label>
                    <Textarea
                      id="funding-strategy"
                      placeholder="Series A, B, C... debt financing, revenue-based financing"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="financial-controls">Financial controls and reporting</Label>
                  <Textarea
                    id="financial-controls"
                    placeholder="Budgeting, forecasting, financial reporting systems..."
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="burn-rate">Monthly burn rate</Label>
                    <Input id="burn-rate" placeholder="₹83,00,000" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="runway-months">Runway (months)</Label>
                    <Input id="runway-months" placeholder="18 months" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="break-even">Break-even timeline</Label>
                    <Input id="break-even" placeholder="Month 24" className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Risk Management & Contingency Planning
                </CardTitle>
                <CardDescription>Identify and mitigate scaling risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scaling-risks">Key scaling risks</Label>
                  <Textarea
                    id="scaling-risks"
                    placeholder="Operational bottlenecks, quality issues, cash flow, competition..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="risk-mitigation">Risk mitigation strategies</Label>
                  <Textarea
                    id="risk-mitigation"
                    placeholder="How will you address each identified risk?"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scenario-planning">Scenario planning</Label>
                    <Textarea
                      id="scenario-planning"
                      placeholder="Best case, worst case, and most likely scenarios"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contingency-plans">Contingency plans</Label>
                    <Textarea
                      id="contingency-plans"
                      placeholder="Backup plans for critical business functions"
                      className="mt-2"
                    />
                  </div>
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
            <Button size="lg" className="px-8 py-3">
              Continue to Sustainability Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
