"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Users, PieChart, Calendar, Target, ArrowRight, Banknote, Phone, MessageCircle, Bot } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Script from "next/script"

export default function FundingPage() {
  const [activeTab, setActiveTab] = useState('funding-planning')

  // ElevenLabs Agent Configuration
  const ELEVENLABS_AGENT_ID = "agent_5601k51pbvtsf24rbmfp7y0yfy3y"
  const ELEVENLABS_AGENT_URL = `https://elevenlabs.io/app/talk-to?agent_id=${ELEVENLABS_AGENT_ID}`

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
              {/* Funding Requirements */}
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
                  Funding Requirements
                </CardTitle>
                <CardDescription>Define how much funding you need and why</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total-funding">Total funding needed</Label>
                    <Input id="total-funding" placeholder="₹4,15,00,000" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="runway">Runway (months)</Label>
                    <Input id="runway" placeholder="18-24 months" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="funding-purpose">Use of funds</Label>
                  <Textarea
                    id="funding-purpose"
                    placeholder="Describe how you'll use the funding (product development, marketing, hiring, operations, etc.)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="milestones">Key milestones to achieve</Label>
                  <Textarea
                    id="milestones"
                    placeholder="What specific goals will this funding help you reach?"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Projections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                      <Input id="y1-revenue" placeholder="₹83,00,000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="y1-expenses">Expenses</Label>
                      <Input id="y1-expenses" placeholder="₹2,49,00,000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="y1-customers">Customers</Label>
                      <Input id="y1-customers" placeholder="500" className="mt-1" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Year 2</h4>
                    <div>
                      <Label htmlFor="y2-revenue">Revenue</Label>
                      <Input id="y2-revenue" placeholder="₹4,15,00,000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="y2-expenses">Expenses</Label>
                      <Input id="y2-expenses" placeholder="₹4,98,00,000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="y2-customers">Customers</Label>
                      <Input id="y2-customers" placeholder="2,500" className="mt-1" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Year 3</h4>
                    <div>
                      <Label htmlFor="y3-revenue">Revenue</Label>
                      <Input id="y3-revenue" placeholder="₹16,60,00,000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="y3-expenses">Expenses</Label>
                      <Input id="y3-expenses" placeholder="₹12,45,00,000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="y3-customers">Customers</Label>
                      <Input id="y3-customers" placeholder="10,000" className="mt-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="assumptions">Key assumptions</Label>
                  <Textarea
                    id="assumptions"
                    placeholder="List the key assumptions behind your financial projections"
                    className="mt-2"
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
                      <Input id="personal-savings" placeholder="₹41,50,000" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="revenue-reinvestment">Revenue reinvestment</Label>
                      <Input id="revenue-reinvestment" placeholder="₹20,75,000" className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Friends & Family</h4>
                    <div>
                      <Label htmlFor="ff-amount">Target amount</Label>
                      <Input id="ff-amount" placeholder="₹83,00,000" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="ff-terms">Investment terms</Label>
                      <Input id="ff-terms" placeholder="Convertible note, equity..." className="mt-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="angel-investors">Angel investors</Label>
                  <Textarea
                    id="angel-investors"
                    placeholder="Target angel investor profiles and investment amounts"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="vc-funding">Venture capital</Label>
                  <Textarea
                    id="vc-funding"
                    placeholder="VC firms that align with your industry and stage"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grants">Grants & competitions</Label>
                    <Textarea id="grants" placeholder="Government grants, startup competitions" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="debt-financing">Debt financing</Label>
                    <Textarea
                      id="debt-financing"
                      placeholder="Bank loans, SBA loans, revenue-based financing"
                      className="mt-2"
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
                  />
                </div>
                <div>
                  <Label htmlFor="pitch-deck">Pitch deck outline</Label>
                  <Textarea
                    id="pitch-deck"
                    placeholder="Key slides: Problem, Solution, Market, Business Model, Traction, Team, Financials, Ask"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="traction-metrics">Key traction metrics</Label>
                    <Textarea id="traction-metrics" placeholder="Users, revenue, growth rate..." className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="competitive-advantages">Competitive advantages</Label>
                    <Textarea id="competitive-advantages" placeholder="What makes you unique?" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="investor-questions">Anticipated investor questions</Label>
                  <Textarea
                    id="investor-questions"
                    placeholder="Prepare answers for common investor questions and concerns"
                    className="mt-2"
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
                    <Input id="pre-money-valuation" placeholder="₹16,60,00,000" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="post-money-valuation">Post-money valuation</Label>
                    <Input id="post-money-valuation" placeholder="₹20,75,00,000" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="equity-distribution">Current equity distribution</Label>
                  <Textarea
                    id="equity-distribution"
                    placeholder="Founders: 70%, Employee pool: 20%, Advisors: 5%, Available for investors: 5%"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="dilution-plan">Dilution plan</Label>
                  <Textarea
                    id="dilution-plan"
                    placeholder="How will equity be diluted through future funding rounds?"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="valuation-justification">Valuation justification</Label>
                  <Textarea
                    id="valuation-justification"
                    placeholder="How did you arrive at your valuation? (comparable companies, revenue multiples, etc.)"
                    className="mt-2"
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="outreach-phase">Outreach (Months 2-3)</Label>
                    <Textarea
                      id="outreach-phase"
                      placeholder="Investor meetings, pitches, due diligence"
                      className="mt-2 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="closing-phase">Closing (Month 4)</Label>
                    <Textarea
                      id="closing-phase"
                      placeholder="Term sheets, negotiations, legal closing"
                      className="mt-2 min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-close-date">Target close date</Label>
                    <Input id="target-close-date" type="date" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="backup-plan">Backup funding plan</Label>
                    <Input id="backup-plan" placeholder="Alternative funding sources" className="mt-2" />
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
                  Continue to Strategy Planning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
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
                      <div className="h-[500px] bg-gray-50 flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b flex items-center gap-3">
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
