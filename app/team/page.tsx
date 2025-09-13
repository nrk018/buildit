"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Users, UserPlus, Target, Award, Calendar, ArrowRight, Plus, X, Search, Star, MessageCircle, MapPin, AlertCircle, CheckCircle, Clock, TrendingUp, CheckCircle2, ExternalLink, Monitor } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "", role: "", skills: "", equity: "", commitment: "" },
  ])
  const [activeTab, setActiveTab] = useState('current-team')
  const [searchQuery, setSearchQuery] = useState('')
  const [startupRequirements, setStartupRequirements] = useState(null)
  const [cofounderMatches, setCofounderMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [skillsGap, setSkillsGap] = useState(null)
  const [teamCompletion, setTeamCompletion] = useState({
    isComplete: false,
    completionPercentage: 0,
    missingPositions: [],
    completedPositions: []
  })
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  const [workspaceError, setWorkspaceError] = useState(false)

  // Load startup requirements on component mount
  useEffect(() => {
    loadStartupRequirements()
  }, [])

  // Function to load startup requirements
  const loadStartupRequirements = async () => {
    setLoading(true)
    try {
      // Get problem statement from localStorage or use default
      const problemStatement = localStorage.getItem('problemStatement') || 
        'AI-powered campus safety system to detect and prevent safety hazards using computer vision and IoT sensors'
      
      const response = await fetch('/api/analyze-startup-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement,
          businessModel: JSON.parse(localStorage.getItem('businessModel') || '{}'),
          solutions: JSON.parse(localStorage.getItem('solutions') || '[]'),
          targetMarket: localStorage.getItem('targetMarket') || 'College campuses in India',
          industry: localStorage.getItem('industry') || 'EdTech/Safety Technology'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setStartupRequirements(data.startupRequirements)
        analyzeSkillsGap(data.startupRequirements)
        checkTeamCompletion(data.startupRequirements)
      }
    } catch (error) {
      console.error('Error loading startup requirements:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to analyze skills gap
  const analyzeSkillsGap = (requirements) => {
    if (!requirements) return

    const currentSkills = teamMembers.flatMap(member => 
      member.skills ? member.skills.split(',').map(s => s.trim()) : []
    )

    const requiredSkills = [
      ...requirements.skillsAnalysis.technical,
      ...requirements.skillsAnalysis.business,
      ...requirements.skillsAnalysis.soft,
      ...requirements.skillsAnalysis.industry
    ]

    const missingSkills = requiredSkills.filter(skill => 
      !currentSkills.some(currentSkill => 
        currentSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(currentSkill.toLowerCase())
      )
    )

    setSkillsGap({
      currentSkills,
      requiredSkills,
      missingSkills,
      coverage: Math.round(((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100)
    })
  }

  // Function to check team completion
  const checkTeamCompletion = (requirements) => {
    if (!requirements) return

    const criticalPositions = requirements.requiredPositions.filter(pos => pos.priority === 'Critical')
    const highPriorityPositions = requirements.requiredPositions.filter(pos => pos.priority === 'High')
    
    // Check if we have team members for critical positions
    const completedCritical = criticalPositions.filter(position => 
      teamMembers.some(member => 
        member.name && member.role && 
        (member.role.toLowerCase().includes(position.title.toLowerCase().split(' ')[0]) ||
         position.title.toLowerCase().includes(member.role.toLowerCase()))
      )
    )

    const completedHigh = highPriorityPositions.filter(position => 
      teamMembers.some(member => 
        member.name && member.role && 
        (member.role.toLowerCase().includes(position.title.toLowerCase().split(' ')[0]) ||
         position.title.toLowerCase().includes(member.role.toLowerCase()))
      )
    )

    const totalRequired = criticalPositions.length + Math.ceil(highPriorityPositions.length * 0.7) // 70% of high priority
    const totalCompleted = completedCritical.length + completedHigh.length
    
    const completionPercentage = Math.round((totalCompleted / totalRequired) * 100)
    const isComplete = completionPercentage >= 80 // 80% completion threshold

    const missingPositions = requirements.requiredPositions.filter(position => 
      !teamMembers.some(member => 
        member.name && member.role && 
        (member.role.toLowerCase().includes(position.title.toLowerCase().split(' ')[0]) ||
         position.title.toLowerCase().includes(member.role.toLowerCase()))
      )
    )

    const completedPositions = requirements.requiredPositions.filter(position => 
      teamMembers.some(member => 
        member.name && member.role && 
        (member.role.toLowerCase().includes(position.title.toLowerCase().split(' ')[0]) ||
         position.title.toLowerCase().includes(member.role.toLowerCase()))
      )
    )

    const newTeamCompletion = {
      isComplete,
      completionPercentage,
      missingPositions,
      completedPositions
    }

    setTeamCompletion(newTeamCompletion)

    // Show completion message if team is complete and wasn't before
    if (isComplete && !teamCompletion.isComplete) {
      setShowCompletionMessage(true)
      // Hide message after 5 seconds
      setTimeout(() => setShowCompletionMessage(false), 5000)
    }
  }

  // Function to search for cofounders
  const searchCofounders = async () => {
    setLoading(true)
    try {
      const problemStatement = localStorage.getItem('problemStatement') || ''
      const keywords = problemStatement.toLowerCase().split(' ').filter(word => 
        word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word)
      )

      const response = await fetch('/api/cofounder-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemKeywords: keywords,
          problemCategory: localStorage.getItem('problemCategory') || '',
          searchQuery,
          location: 'India'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCofounderMatches(data.cofounders || [])
      }
    } catch (error) {
      console.error('Error searching cofounders:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTeamMember = () => {
    const newMembers = [
      ...teamMembers,
      {
        id: Date.now(),
        name: "",
        role: "",
        skills: "",
        equity: "",
        commitment: "",
      },
    ]
    setTeamMembers(newMembers)
    // Re-analyze skills gap and team completion when team changes
    if (startupRequirements) {
      analyzeSkillsGap(startupRequirements)
      checkTeamCompletion(startupRequirements)
    }
  }

  const removeTeamMember = (id: number) => {
    const newMembers = teamMembers.filter((member) => member.id !== id)
    setTeamMembers(newMembers)
    // Re-analyze skills gap and team completion when team changes
    if (startupRequirements) {
      analyzeSkillsGap(startupRequirements)
      checkTeamCompletion(startupRequirements)
    }
  }

  const updateTeamMember = (id: number, field: string, value: string) => {
    const newMembers = teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    )
    setTeamMembers(newMembers)
    // Re-analyze skills gap and team completion when team changes
    if (startupRequirements) {
      analyzeSkillsGap(startupRequirements)
      checkTeamCompletion(startupRequirements)
    }
  }

  const filteredMatches = cofounderMatches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    match.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get priority color for positions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Build Your Team</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Assemble the right team with complementary skills and shared vision to execute your business plan
            </p>
          </motion.div>

          {/* Required Positions Section */}
          {startupRequirements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Required Positions for Your Startup
                  </CardTitle>
                  <CardDescription>
                    Based on your business model and problem statement, here are the key positions you need to fill
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {startupRequirements.requiredPositions.map((position, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">{position.title}</h4>
                          <Badge className={getPriorityColor(position.priority)}>
                            {position.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{position.description}</p>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Skills Required:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {position.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span><strong>Timeline:</strong> {position.timeline}</span>
                            <span><strong>Equity:</strong> {position.equity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Skills Gap Analysis */}
          {skillsGap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-8"
            >
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Skills Gap Analysis
                  </CardTitle>
                  <CardDescription>
                    Current team skills coverage: {skillsGap.coverage}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Skills Coverage</span>
                      <span>{skillsGap.coverage}%</span>
                    </div>
                    <Progress value={skillsGap.coverage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">Current Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {skillsGap.currentSkills.map((skill, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">Missing Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {skillsGap.missingSkills.map((skill, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team Completion Progress */}
          {startupRequirements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="vercel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Team Completion Progress
                  </CardTitle>
                  <CardDescription>
                    Track your team building progress and see what positions you still need to fill
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Team Completion</span>
                      <span>{teamCompletion.completionPercentage}%</span>
                    </div>
                    <Progress 
                      value={teamCompletion.completionPercentage} 
                      className="h-3"
                      style={{
                        background: teamCompletion.isComplete 
                          ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                          : undefined
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Completed Positions ({teamCompletion.completedPositions.length})
                      </h4>
                      <div className="space-y-1">
                        {teamCompletion.completedPositions.map((position, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{position.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-red-600 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Missing Positions ({teamCompletion.missingPositions.length})
                      </h4>
                      <div className="space-y-1">
                        {teamCompletion.missingPositions.slice(0, 5).map((position, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <span>{position.title}</span>
                            <Badge className={getPriorityColor(position.priority)} variant="outline">
                              {position.priority}
                            </Badge>
                          </div>
                        ))}
                        {teamCompletion.missingPositions.length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            +{teamCompletion.missingPositions.length - 5} more positions
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team Completion Success Message */}
          {showCompletionMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-8"
            >
              <Card className="vercel-card border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        🎉 Team Complete! 
                      </h3>
                      <p className="text-green-700">
                        Congratulations! You've successfully assembled a strong team with {teamCompletion.completionPercentage}% completion. 
                        Your startup is ready to move forward with the right people in place.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowCompletionMessage(false)}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current-team">Current Team</TabsTrigger>
              <TabsTrigger value="find-cofounders">Find Co-Founders</TabsTrigger>
              <TabsTrigger value="coworking-space">Coworking Space</TabsTrigger>
            </TabsList>

            {/* Current Team Tab */}
            <TabsContent value="current-team" className="space-y-6">
              {/* Founder Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-500" />
                      Founder Profile
                    </CardTitle>
                    <CardDescription>Define your role and expertise as the founder</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="founder-name">Full name</Label>
                        <Input id="founder-name" placeholder="Your full name" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="founder-title">Title/Role</Label>
                        <Input id="founder-title" placeholder="CEO, CTO, Founder..." className="mt-2" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="founder-background">Background & expertise</Label>
                      <Textarea
                        id="founder-background"
                        placeholder="Describe your relevant experience, skills, and achievements"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="founder-motivation">Why this business?</Label>
                      <Textarea
                        id="founder-motivation"
                        placeholder="What drives you to solve this problem?"
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Team Members */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5 text-green-500" />
                          Team Members
                        </CardTitle>
                        <CardDescription>Add key team members and their roles</CardDescription>
                      </div>
                      <Button onClick={addTeamMember} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {teamMembers.map((member, index) => (
                      <div key={member.id} className="border border-border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Team Member {index + 1}</h4>
                          {teamMembers.length > 1 && (
                            <Button
                              onClick={() => removeTeamMember(member.id)}
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
                            <Label htmlFor={`member-name-${member.id}`}>Name</Label>
                            <Input 
                              id={`member-name-${member.id}`} 
                              placeholder="Full name" 
                              className="mt-2"
                              value={member.name}
                              onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`member-role-${member.id}`}>Role</Label>
                            <Input 
                              id={`member-role-${member.id}`} 
                              placeholder="CTO, CMO, Developer..." 
                              className="mt-2"
                              value={member.role}
                              onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`member-skills-${member.id}`}>Key skills & experience</Label>
                          <Textarea
                            id={`member-skills-${member.id}`}
                            placeholder="Relevant skills, experience, and background"
                            className="mt-2"
                            value={member.skills}
                            onChange={(e) => updateTeamMember(member.id, 'skills', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`member-equity-${member.id}`}>Equity %</Label>
                            <Input 
                              id={`member-equity-${member.id}`} 
                              placeholder="5%" 
                              className="mt-2"
                              value={member.equity}
                              onChange={(e) => updateTeamMember(member.id, 'equity', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`member-commitment-${member.id}`}>Time commitment</Label>
                            <Input
                              id={`member-commitment-${member.id}`}
                              placeholder="Full-time, Part-time..."
                              className="mt-2"
                              value={member.commitment}
                              onChange={(e) => updateTeamMember(member.id, 'commitment', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Find Co-Founders Tab */}
            <TabsContent value="find-cofounders" className="space-y-6">
              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-purple-500" />
                      Find Your Perfect Co-Founder
                    </CardTitle>
                    <CardDescription>
                      Discover talented individuals from your campus community who complement your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Search by name, skills, or role..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={searchCofounders}
                        disabled={loading}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {loading ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                    {startupRequirements && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Smart Matching:</strong> We're looking for cofounders with skills in: {' '}
                          {startupRequirements.skillsAnalysis.technical.slice(0, 3).join(', ')} and more
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Co-Founder Matches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Searching for cofounders...</p>
                  </div>
                ) : filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <Card key={match.id} className="vercel-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{match.name}</h3>
                              <Badge variant="default" className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {match.match_score || 85}% Match
                              </Badge>
                            </div>
                            <p className="text-lg text-muted-foreground mb-1">{match.role}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              {match.year} • {match.branch} • {match.college}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {match.college}
                              </div>
                              <div>{match.availability}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">View Profile</Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {match.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Project Experience</h4>
                            <div className="flex flex-wrap gap-1">
                              {match.projects.map((project, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {project}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Interests</h4>
                          <div className="flex flex-wrap gap-1">
                            {match.interests.map((interest, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-sm">
                          {match.github && (
                            <a href={`https://${match.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              GitHub
                            </a>
                          )}
                          {match.linkedin && (
                            <a href={`https://${match.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              LinkedIn
                            </a>
                          )}
                          {match.email && (
                            <a href={`mailto:${match.email}`} className="text-blue-500 hover:underline">
                              Email
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No cofounders found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or click "Search" to find potential cofounders
                    </p>
                    <Button onClick={searchCofounders} disabled={loading}>
                      <Search className="h-4 w-4 mr-2" />
                      Search Cofounders
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Coworking Space Tab */}
            <TabsContent value="coworking-space" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-purple-500" />
                      Virtual Coworking Space
                    </CardTitle>
                    <CardDescription>
                      Collaborate with your team in a virtual workspace powered by WorkAdventure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Monitor className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Join Your Virtual Workspace</h3>
                      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Experience the future of remote collaboration in our immersive virtual coworking space. 
                        Meet with your team, work together on projects, and build your startup in a shared digital environment.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            Team Collaboration
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Meet with your cofounders, share screens, and collaborate in real-time
                          </p>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-green-500" />
                            Interactive Communication
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Voice chat, video calls, and text messaging with your team members
                          </p>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4 text-orange-500" />
                            Project Rooms
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Dedicated spaces for different projects and brainstorming sessions
                          </p>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-500" />
                            Networking Events
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Connect with other entrepreneurs and potential investors
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          <p>💡 <strong>Pro Tip:</strong> Share this workspace with your team members to collaborate together</p>
                          <p className="mt-1">🔗 <strong>Workspace URL:</strong> https://play.staging.workadventu.re/@/tcm/workadventure/wa-village</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Getting Started Guide</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <p className="font-medium">Click "Enter Virtual Workspace"</p>
                            <p className="text-sm text-muted-foreground">This will open the WorkAdventure platform in a new tab</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <p className="font-medium">Create your avatar</p>
                            <p className="text-sm text-muted-foreground">Customize your character to represent yourself in the virtual world</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <p className="font-medium">Explore the workspace</p>
                            <p className="text-sm text-muted-foreground">Walk around, find meeting rooms, and discover collaboration spaces</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <p className="font-medium">Invite your team</p>
                            <p className="text-sm text-muted-foreground">Share the workspace link with your cofounders and start collaborating</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Embedded Virtual Workspace */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Virtual Workspace</h4>
                      <div className="relative w-full h-[600px] border border-border rounded-lg overflow-hidden bg-gray-100">
                        {workspaceLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                              <p className="text-gray-600">Loading virtual workspace...</p>
                            </div>
                          </div>
                        )}
                        
                        {workspaceError ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-center p-6">
                              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-700 mb-2">Workspace Unavailable</h3>
                              <p className="text-gray-600 mb-4">The virtual workspace is currently unavailable. Please try again later.</p>
                              <Button 
                                onClick={() => {
                                  setWorkspaceError(false)
                                  setWorkspaceLoading(true)
                                }}
                                variant="outline"
                              >
                                Retry
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <iframe
                            src="https://play.staging.workadventu.re/@/tcm/workadventure/wa-village"
                            className="w-full h-full"
                            title="Virtual Coworking Space"
                            allow="camera; microphone; fullscreen; autoplay; encrypted-media; picture-in-picture"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals"
                            onLoad={() => setWorkspaceLoading(false)}
                            onError={() => {
                              setWorkspaceLoading(false)
                              setWorkspaceError(true)
                            }}
                          />
                        )}
                        
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-black/50 text-white hover:bg-black/70 border-0"
                            onClick={() => window.open('https://play.staging.workadventu.re/@/tcm/workadventure/wa-village', '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Fullscreen
                          </Button>
                          <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
                            WorkAdventure
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p>🎮 <strong>Controls:</strong> Use WASD or arrow keys to move, click to interact with objects and other users</p>
                        <p>💬 <strong>Communication:</strong> Click on other avatars to start voice/video chat</p>
                        <p>🏢 <strong>Rooms:</strong> Different areas for meetings, collaboration, and networking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>


          {/* Advisors & Mentors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Advisors & Mentors
                </CardTitle>
                <CardDescription>Identify potential advisors and mentors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ideal-advisors">Ideal advisor profiles</Label>
                  <Textarea
                    id="ideal-advisors"
                    placeholder="What type of advisors would be most valuable? (industry experts, successful entrepreneurs, technical specialists)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="advisor-compensation">Advisor compensation</Label>
                  <Input
                    id="advisor-compensation"
                    placeholder="Equity percentage or other compensation"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="mentor-needs">Mentorship needs</Label>
                  <Textarea
                    id="mentor-needs"
                    placeholder="What specific guidance and support do you need?"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hiring Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  Hiring Timeline
                </CardTitle>
                <CardDescription>Plan when and how you'll expand your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="next-3-months">Next 3 months</Label>
                    <Textarea
                      id="next-3-months"
                      placeholder="Immediate hiring priorities"
                      className="mt-2 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="next-6-months">3-6 months</Label>
                    <Textarea id="next-6-months" placeholder="Medium-term hiring goals" className="mt-2 min-h-[80px]" />
                  </div>
                  <div>
                    <Label htmlFor="next-year">6-12 months</Label>
                    <Textarea id="next-year" placeholder="Long-term team expansion" className="mt-2 min-h-[80px]" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hiring-budget">Hiring budget</Label>
                  <Input id="hiring-budget" placeholder="Budget allocated for new hires" className="mt-2" />
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
            <Button size="lg" className="px-8 py-3">
              Continue to MVP Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
