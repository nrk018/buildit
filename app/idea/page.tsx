"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Lightbulb, 
  Target, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Camera, 
  Upload, 
  Eye, 
  Brain, 
  FileText, 
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react"

// Types for our application state
type StepType = 'capture' | 'text-input' | 'analyze' | 'problems' | 'solutions' | 'statement' | 'pitch'

interface DetectedProblem {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  location?: { x: number; y: number }
  confidence: number
  solutions?: Array<{
    title: string
    description: string
    cost: string
    timeline: string
    priority: 'high' | 'medium' | 'low'
  }>
  impact?: string
  urgency?: 'immediate' | 'within_week' | 'within_month' | 'low_priority'
  estimatedCost?: string
  timeline?: string
}

interface Solution {
  id: string
  title: string
  description: string
  type: 'technical' | 'non-technical'
  complexity: 'simple' | 'moderate' | 'complex'
  estimatedCost: string
  timeToImplement: string
  effectiveness: number
}

interface ProblemStatement {
  technical: {
    problem: string
    rootCause: string
    impact: string
    metrics: string
  }
  nonTechnical: {
    problem: string
    stakeholders: string
    businessImpact: string
    urgency: string
  }
}

export default function IdeaPage() {
  // State management
  const [currentStep, setCurrentStep] = useState<StepType>('capture')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedProblems, setDetectedProblems] = useState<DetectedProblem[]>([])
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [generatedSolutions, setGeneratedSolutions] = useState<Solution[]>([])
  const [problemStatement, setProblemStatement] = useState<ProblemStatement>({
    technical: { problem: '', rootCause: '', impact: '', metrics: '' },
    nonTechnical: { problem: '', stakeholders: '', businessImpact: '', urgency: '' }
  })
  const [pitchDocument, setPitchDocument] = useState<string>('')
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false)
  const [imageDescription, setImageDescription] = useState<string>('')
  const [overallAssessment, setOverallAssessment] = useState<string>('')
  const [recommendations, setRecommendations] = useState<string>('')
  const [aiModel, setAiModel] = useState<string>('')
  const [textProblem, setTextProblem] = useState<string>('')
  const [isAnalyzingText, setIsAnalyzingText] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<'image' | 'text'>('image')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Camera capture functionality
  const startCamera = useCallback(async () => {
    try {
      console.log('Starting camera...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Camera ready, video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions and try again.')
    }
  }, [])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        console.log('Capturing image...')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        console.log('Image captured, size:', imageData.length)
        setCapturedImage(imageData)
        
        // Stop camera stream
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream
          stream.getTracks().forEach(track => track.stop())
        }
        
        setCurrentStep('analyze')
      } else {
        console.error('Video not ready for capture')
        alert('Camera not ready. Please wait a moment and try again.')
      }
    }
  }, [])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setCapturedImage(imageData)
        setCurrentStep('analyze')
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // AI Analysis using API with improved error handling and timeout
  const analyzeImage = useCallback(async () => {
    if (!capturedImage) {
      console.error('No captured image available')
      return
    }
    
    setIsAnalyzing(true)
    console.log('Starting image analysis...')
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timeout after 10 seconds')), 10000)
    })
    
    try {
      const fetchPromise = fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: capturedImage
        })
      })
      
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response
      
      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`API request failed: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      console.log('API response data:', data)
      
      if (data.problems && Array.isArray(data.problems)) {
        setDetectedProblems(data.problems)
        setImageDescription(data.imageDescription || '')
        setOverallAssessment(data.overallAssessment || '')
        setRecommendations(data.recommendations || '')
        setAiModel(data.aiModel || 'AI Analysis')
        setIsAnalyzing(false)
        setCurrentStep('problems')
        
        // Save problems to localStorage for market analysis
        localStorage.setItem('analyzedProblems', JSON.stringify(data.problems))
        
        console.log('Successfully analyzed image, moving to problems step')
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
      setIsAnalyzing(false)
      
      // Fallback to mock data if API fails
      console.log('Using fallback mock data')
      const mockProblems: DetectedProblem[] = [
        {
          id: '1',
          title: 'Safety Hazard - Exposed Wiring',
          description: 'Electrical wiring is exposed and poses a significant safety risk to workers and equipment.',
          severity: 'critical',
          category: 'Safety',
          confidence: 0.95,
          location: { x: 150, y: 200 }
        },
        {
          id: '2',
          title: 'Equipment Maintenance Overdue',
          description: 'Industrial equipment shows signs of wear and requires immediate maintenance to prevent breakdown.',
          severity: 'high',
          category: 'Maintenance',
          confidence: 0.87,
          location: { x: 300, y: 150 }
        },
        {
          id: '3',
          title: 'Inefficient Workflow Layout',
          description: 'Current workspace layout creates bottlenecks and reduces operational efficiency.',
          severity: 'medium',
          category: 'Operations',
          confidence: 0.78,
          location: { x: 200, y: 300 }
        },
        {
          id: '4',
          title: 'Environmental Compliance Issue',
          description: 'Potential environmental compliance violation detected in waste management area.',
          severity: 'high',
          category: 'Compliance',
          confidence: 0.82,
          location: { x: 400, y: 250 }
        }
      ]
      setDetectedProblems(mockProblems)
      setCurrentStep('problems')
      
      // Save problems to localStorage for market analysis
      localStorage.setItem('analyzedProblems', JSON.stringify(mockProblems))
      
      console.log('Fallback data set, moving to problems step')
    }
  }, [capturedImage])

  // Analyze text problem using API (with optional image context)
  const analyzeTextProblem = useCallback(async () => {
    if (!textProblem.trim()) {
      console.error('No text problem provided')
      return
    }
    
    setIsAnalyzingText(true)
    console.log('Starting text problem analysis...')
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timeout after 10 seconds')), 10000)
    })
    
    try {
      const fetchPromise = fetch('/api/analyze-text-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemText: textProblem,
          imageData: analysisMode === 'image' ? capturedImage : null,
          analysisMode: analysisMode
        })
      })
      
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response
      
      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`API request failed: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      console.log('API response data:', data)
      
      if (data.problems && Array.isArray(data.problems)) {
        setDetectedProblems(data.problems)
        setImageDescription(data.problemDescription || data.imageDescription || '')
        setOverallAssessment(data.overallAssessment || '')
        setRecommendations(data.recommendations || '')
        setAiModel(data.aiModel || 'AI Text Analysis')
        setIsAnalyzingText(false)
        setCurrentStep('problems')
        
        // Save problems to localStorage for market analysis
        localStorage.setItem('analyzedProblems', JSON.stringify(data.problems))
        
        console.log('Successfully analyzed text problem, moving to problems step')
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (error) {
      console.error('Error analyzing text problem:', error)
      setIsAnalyzingText(false)
      
      // Fallback to mock data if API fails
      console.log('Using fallback mock data for text analysis')
      const mockProblems: DetectedProblem[] = [
        {
          id: '1',
          title: analysisMode === 'image' ? 'Image & Text Analysis' : 'Problem Analysis from Text',
          description: analysisMode === 'image' 
            ? `Based on your image and description: "${textProblem}", we've identified the core issues and potential solutions.`
            : `Based on your description: "${textProblem}", we've identified the core issues and potential solutions.`,
          severity: 'medium',
          category: 'Analysis',
          confidence: 0.85,
          location: { x: 0, y: 0 },
          solutions: [
            {
              title: 'Immediate Action Plan',
              description: 'Develop a structured approach to address the identified problem with clear milestones.',
              cost: '₹41,500-1,66,000',
              timeline: '1-2 weeks',
              priority: 'high'
            },
            {
              title: 'Long-term Strategy',
              description: 'Implement a comprehensive solution that addresses root causes and prevents recurrence.',
              cost: '₹1,66,000-8,30,000',
              timeline: '1-3 months',
              priority: 'medium'
            }
          ],
          impact: 'Addressing this problem will improve efficiency and reduce risks',
          urgency: 'within_month',
          estimatedCost: '₹41,500-1,66,000',
          timeline: '1-2 weeks'
        }
      ]
      setDetectedProblems(mockProblems)
      setImageDescription(analysisMode === 'image' ? `Image Analysis: ${textProblem}` : `Problem Description: ${textProblem}`)
      setOverallAssessment(analysisMode === 'image' ? 'Image and text analysis completed with recommended solutions' : 'Text-based problem analysis completed with recommended solutions')
      setRecommendations('Focus on immediate actions first, then implement long-term strategies')
      setAiModel('Fallback Text Analysis')
      setCurrentStep('problems')
      
      // Save problems to localStorage for market analysis
      localStorage.setItem('analyzedProblems', JSON.stringify(mockProblems))
      
      console.log('Fallback data set, moving to problems step')
    }
  }, [textProblem, analysisMode, capturedImage])

  // Auto-start camera when component mounts
  useEffect(() => {
    if (currentStep === 'capture') {
      startCamera()
    }
  }, [currentStep, startCamera])

  // Auto-start text analysis when we have text and are on analyze step
  useEffect(() => {
    if (currentStep === 'analyze' && textProblem && !isAnalyzingText && analysisMode === 'text') {
      console.log('Auto-starting text analysis...')
      analyzeTextProblem()
    }
  }, [currentStep, textProblem, isAnalyzingText, analyzeTextProblem, analysisMode])

  // Auto-start analysis when we have an image and are on analyze step
  useEffect(() => {
    if (currentStep === 'analyze' && capturedImage && !isAnalyzing && analysisMode === 'image' && !textProblem) {
      console.log('Auto-starting image analysis...')
      analyzeImage()
    } else if (currentStep === 'analyze' && capturedImage && textProblem && analysisMode === 'image' && !isAnalyzingText) {
      console.log('Auto-starting combined image and text analysis...')
      analyzeTextProblem()
    }
  }, [currentStep, capturedImage, isAnalyzing, analysisMode, textProblem, isAnalyzingText, analyzeImage, analyzeTextProblem])

  // Generate solutions based on selected problems using API
  const generateSolutions = useCallback(async () => {
    if (selectedProblems.length === 0) return
    
    try {
      const selectedProblemsData = detectedProblems.filter(p => selectedProblems.includes(p.id))
      
      const response = await fetch('/api/generate-solutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedProblems,
          problemDetails: selectedProblemsData
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate solutions')
      }
      
      const data = await response.json()
      setGeneratedSolutions(data.solutions)
      // Save solutions to localStorage for use in other pages
      localStorage.setItem('generatedSolutions', JSON.stringify(data.solutions))
      setCurrentStep('solutions')
    } catch (error) {
      console.error('Error generating solutions:', error)
      // Fallback to mock data if API fails
      const mockSolutions: Solution[] = [
        {
          id: '1',
          title: 'Automated Safety Monitoring System',
          description: 'Implement AI-powered cameras and sensors to continuously monitor for safety hazards and alert personnel immediately.',
          type: 'technical',
          complexity: 'complex',
          estimatedCost: '₹41,50,000 - ₹83,00,000',
          timeToImplement: '3-6 months',
          effectiveness: 95
        },
        {
          id: '2',
          title: 'Predictive Maintenance Program',
          description: 'Deploy IoT sensors and machine learning algorithms to predict equipment failures before they occur.',
          type: 'technical',
          complexity: 'moderate',
          estimatedCost: '₹20,75,000 - ₹41,50,000',
          timeToImplement: '2-4 months',
          effectiveness: 88
        },
        {
          id: '3',
          title: 'Workflow Optimization Training',
          description: 'Train staff on lean manufacturing principles and reorganize workspace for maximum efficiency.',
          type: 'non-technical',
          complexity: 'simple',
          estimatedCost: '₹4,15,000 - ₹12,45,000',
          timeToImplement: '1-2 months',
          effectiveness: 75
        },
        {
          id: '4',
          title: 'Environmental Management System',
          description: 'Implement comprehensive environmental compliance tracking and automated reporting system.',
          type: 'technical',
          complexity: 'moderate',
          estimatedCost: '₹12,45,000 - ₹24,90,000',
          timeToImplement: '2-3 months',
          effectiveness: 92
        }
      ]
      setGeneratedSolutions(mockSolutions)
      // Save fallback solutions to localStorage
      localStorage.setItem('generatedSolutions', JSON.stringify(mockSolutions))
      setCurrentStep('solutions')
    }
  }, [selectedProblems, detectedProblems])

  // Generate problem statement
  const generateProblemStatement = useCallback(() => {
    const selectedProblemsData = detectedProblems.filter(p => selectedProblems.includes(p.id))
    
    const technicalProblem = selectedProblemsData
      .filter(p => ['Safety', 'Maintenance'].includes(p.category))
      .map(p => p.title)
      .join(', ')
    
    const nonTechnicalProblem = selectedProblemsData
      .filter(p => ['Operations', 'Compliance'].includes(p.category))
      .map(p => p.title)
      .join(', ')
    
    setProblemStatement({
      technical: {
        problem: technicalProblem,
        rootCause: 'Lack of automated monitoring and predictive systems',
        impact: 'Increased safety risks, equipment downtime, and operational inefficiencies',
        metrics: '30% reduction in safety incidents, 25% decrease in maintenance costs'
      },
      nonTechnical: {
        problem: nonTechnicalProblem,
        stakeholders: 'Operations team, Safety officers, Management, Regulatory bodies',
        businessImpact: 'Potential fines, reduced productivity, increased insurance costs',
        urgency: 'High - Immediate action required to prevent accidents and compliance violations'
      }
    })
    
    setCurrentStep('statement')
  }, [detectedProblems, selectedProblems])

  // Generate pitch document using API
  const generatePitchDocument = useCallback(async () => {
    setIsGeneratingPitch(true)
    
    try {
      const selectedProblemsData = detectedProblems.filter(p => selectedProblems.includes(p.id))
      const selectedSolutionsData = generatedSolutions
      
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement,
          selectedProblems: selectedProblemsData,
          selectedSolutions: selectedSolutionsData,
          companyInfo: {
            name: 'Industrial Solutions AI',
            industry: 'Industrial Automation',
            size: 'Startup'
          },
          marketData: {
            totalAddressableMarket: '₹16,60,00,000 Cr',
            serviceableAddressableMarket: '₹12,45,000 Cr',
            serviceableObtainableMarket: '₹41,500 Cr'
          },
          imageDescription,
          overallAssessment,
          recommendations
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate pitch document')
      }
      
      const data = await response.json()
      setPitchDocument(data.pitchDocument)
      setIsGeneratingPitch(false)
      setCurrentStep('pitch')
    } catch (error) {
      console.error('Error generating pitch document:', error)
      setIsGeneratingPitch(false)
      // Fallback to mock data if API fails
      const mockPitch = `
# Industrial Problem-Solving Solution Pitch

## Executive Summary
Our AI-powered industrial problem identification and solution system addresses critical safety, maintenance, and operational challenges in industrial environments. By leveraging computer vision and machine learning, we provide real-time problem detection and actionable solutions.

## Problem Statement
${problemStatement.technical.problem || 'Multiple critical issues detected in industrial environment'}

## Market Opportunity
- Industrial automation market: ₹16,60,00,000 Cr+ globally
- Safety compliance market: ₹12,45,000 Cr+ annually
- Predictive maintenance market: ₹6,64,000 Cr+ and growing 25% annually

## Solution Overview
Our platform combines:
- Real-time image analysis for problem detection
- AI-powered solution recommendations
- Comprehensive problem statement generation
- Automated pitch document creation

## Technical Implementation
- Computer vision models for environment analysis
- Machine learning algorithms for solution optimization
- Cloud-based processing for scalability
- Mobile and web interfaces for accessibility

## Business Model
- SaaS subscription: ₹41,500-1,66,000/month per facility
- Implementation services: ₹8,30,000-41,50,000 per deployment
- Training and support: ₹1,66,000-4,15,000 annually

## Competitive Advantage
- Real-time problem detection vs. manual inspections
- AI-powered solution recommendations
- Comprehensive documentation generation
- Industry-specific customization

## Financial Projections
- Year 1: ₹4,15,00,000 revenue, 10 customers
- Year 2: ₹16,60,00,000 revenue, 50 customers
- Year 3: ₹41,50,00,000 revenue, 150 customers

## Funding Requirements
- ₹16,60,00,000 Series A for product development and market expansion
- 18-month runway to achieve product-market fit
- Focus on industrial manufacturing and construction sectors

## Next Steps
1. Complete MVP development
2. Pilot program with 3 industrial partners
3. Secure Series A funding
4. Scale to 50+ customers within 18 months
      `
      setPitchDocument(mockPitch)
      setCurrentStep('pitch')
    }
  }, [problemStatement, detectedProblems, selectedProblems, generatedSolutions])

  const downloadPitchDocument = useCallback(() => {
    const blob = new Blob([pitchDocument], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'industrial-solution-pitch.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [pitchDocument])

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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">AI Problem Identification System</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Capture images of your environment and let AI identify problems, generate solutions, and create comprehensive pitch documents
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4">
              {['capture', 'analyze', 'problems', 'solutions', 'statement', 'pitch'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step 
                      ? 'bg-blue-500 text-white' 
                      : ['capture', 'analyze', 'problems', 'solutions', 'statement', 'pitch'].indexOf(currentStep) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 5 && (
                    <div className={`w-12 h-1 mx-2 ${
                      ['capture', 'analyze', 'problems', 'solutions', 'statement', 'pitch'].indexOf(currentStep) > index
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step 1: Image Capture */}
          <AnimatePresence mode="wait">
            {currentStep === 'capture' && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-blue-500" />
                      Capture Environment Image
                </CardTitle>
                    <CardDescription>
                      Take a photo or upload an image of the environment you want to analyze
                    </CardDescription>
              </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Method Selection */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold mb-4">Choose Your Analysis Method</h3>
                      <div className="flex gap-4 justify-center">
                        <Button 
                          onClick={() => {
                            setAnalysisMode('image')
                            setCurrentStep('capture')
                          }}
                          variant={analysisMode === 'image' ? 'default' : 'outline'}
                          className="flex items-center gap-2"
                        >
                          <Camera className="h-4 w-4" />
                          Image Analysis
                        </Button>
                        <Button 
                          onClick={() => {
                            setAnalysisMode('text')
                            setCurrentStep('text-input')
                          }}
                          variant={analysisMode === 'text' ? 'default' : 'outline'}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Text Description
                        </Button>
                      </div>
                    </div>

                    {currentStep === 'capture' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Camera Capture */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Live Camera</h3>
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-64 bg-gray-100 rounded-lg object-cover"
                          />
                          <Button
                            onClick={captureImage}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                            size="lg"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Capture
                          </Button>
                        </div>
                        <Button onClick={startCamera} variant="outline" className="w-full">
                          Start Camera
                        </Button>
                      </div>

                      {/* File Upload */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Upload Image</h3>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                    )}

                    {capturedImage && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Captured Image</h3>
                        <div className="relative">
                          <img
                            src={capturedImage}
                            alt="Captured environment"
                            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                              onClick={() => setCurrentStep('text-input')}
                              variant="outline"
                              size="sm"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Add Description
                            </Button>
                            <Button
                              onClick={analyzeImage}
                              size="sm"
                            >
                              <Brain className="h-4 w-4 mr-2" />
                              Analyze Image
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-sm text-muted-foreground mb-2">
                            You can analyze the image directly or add a description for more context
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={() => setCurrentStep('text-input')}
                              variant="outline"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Add Description & Analyze
                            </Button>
                            <Button
                              onClick={analyzeImage}
                            >
                              <Brain className="h-4 w-4 mr-2" />
                              Analyze Image Only
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Text Input Step */}
            {currentStep === 'text-input' && (
              <motion.div
                key="text-input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-blue-500" />
                      {analysisMode === 'image' ? 'Describe Your Image' : 'Describe Your Problem'}
                    </CardTitle>
                    <CardDescription>
                      {analysisMode === 'image' 
                        ? "Provide additional context about the image you uploaded to help AI better understand the problems"
                        : "Provide a detailed description of the problem or challenge you're facing"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {analysisMode === 'image' && capturedImage && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Your Image:</h4>
                        <img
                          src={capturedImage}
                          alt="Image to analyze"
                          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <Textarea
                        placeholder={analysisMode === 'image' 
                          ? "Describe what you see in the image and any specific problems or concerns you have about this environment... (e.g., 'This is our manufacturing floor. I'm concerned about the exposed wiring near the equipment and the cluttered workspace that might cause safety issues.')"
                          : "Describe your problem in detail... (e.g., 'Our manufacturing line has frequent breakdowns due to outdated equipment, causing production delays and increased maintenance costs. We need a solution to improve reliability and reduce downtime.')"
                        }
                        value={textProblem}
                        onChange={(e) => setTextProblem(e.target.value)}
                        className="min-h-[200px] text-sm"
                      />
                      
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => {
                            setCurrentStep('analyze')
                            // Auto-start analysis will be triggered by useEffect
                          }}
                          disabled={!textProblem.trim()}
                          size="lg"
                          className="px-8"
                        >
                          <Brain className="mr-2 h-5 w-5" />
                          {analysisMode === 'image' ? 'Analyze Image & Description' : 'Analyze Problem'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Tips for Better Analysis:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {analysisMode === 'image' ? (
                          <>
                            <li>• Describe what you see in the image</li>
                            <li>• Mention any safety concerns or issues you notice</li>
                            <li>• Include context about the environment or industry</li>
                            <li>• Specify any particular problems you want to focus on</li>
                            <li>• Add any relevant background information</li>
                          </>
                        ) : (
                          <>
                            <li>• Be specific about the problem and its impact</li>
                            <li>• Include context about your industry or environment</li>
                            <li>• Mention any constraints (budget, timeline, resources)</li>
                            <li>• Describe what you've already tried</li>
                            <li>• Include relevant metrics or measurements if available</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: AI Analysis */}
            {currentStep === 'analyze' && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      AI Analysis in Progress
                    </CardTitle>
                    <CardDescription>
                      {analysisMode === 'image' && capturedImage 
                        ? textProblem 
                          ? "Our AI is analyzing your image and description to identify potential problems and solutions"
                          : "Our AI is analyzing your image to identify potential problems and solutions"
                        : "Our AI is analyzing your problem description to provide solutions"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-4">
                      {analysisMode === 'image' && capturedImage 
                        ? textProblem 
                          ? "Analyzing Image & Description..." 
                          : "Analyzing Environment..."
                        : "Analyzing Problem..."
                      }
                    </h3>
                    <Progress value={(isAnalyzing || isAnalyzingText) ? 75 : 100} className="w-full max-w-md mx-auto" />
                    <p className="text-muted-foreground mt-4">
                      {(isAnalyzing || isAnalyzingText) 
                        ? (analysisMode === 'image' && capturedImage 
                            ? (textProblem ? 'Analyzing image and processing your description...' : 'Detecting problems and analyzing patterns...')
                            : 'Processing your description and generating solutions...')
                        : 'Analysis complete!'
                      }
                    </p>
                    
                    {(isAnalyzing || isAnalyzingText) && (
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            console.log('Skipping analysis, using fallback data')
                            setIsAnalyzing(false)
                            setIsAnalyzingText(false)
                            // Use fallback data immediately
                            const mockProblems: DetectedProblem[] = [
                              {
                                id: '1',
                                title: capturedImage ? 'Safety Hazard - Exposed Wiring' : 'Problem Analysis from Text',
                                description: capturedImage 
                                  ? 'Electrical wiring is exposed and poses a significant safety risk to workers and equipment.'
                                  : `Based on your description: "${textProblem}", we've identified the core issues and potential solutions.`,
                                severity: 'critical',
                                category: capturedImage ? 'Safety' : 'Analysis',
                                confidence: 0.95,
                                location: { x: 150, y: 200 },
                                solutions: [
                                  {
                                    title: 'Immediate Action Plan',
                                    description: 'Develop a structured approach to address the identified problem with clear milestones.',
                                    cost: '₹41,500-1,66,000',
                                    timeline: '1-2 weeks',
                                    priority: 'high'
                                  }
                                ],
                                impact: 'Addressing this problem will improve efficiency and reduce risks',
                                urgency: 'within_month',
                                estimatedCost: '₹41,500-1,66,000',
                                timeline: '1-2 weeks'
                              }
                            ]
                            setDetectedProblems(mockProblems)
                            setImageDescription(capturedImage ? 'Image analyzed successfully' : `Problem Description: ${textProblem}`)
                            setOverallAssessment('Analysis completed with recommended solutions')
                            setRecommendations('Focus on immediate actions first, then implement long-term strategies')
                            setAiModel('Fallback Analysis')
                            setCurrentStep('problems')
                          }}
                        >
                          Skip Analysis (Use Demo Data)
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Detected Problems */}
            {currentStep === 'problems' && (
              <motion.div
                key="problems"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="vercel-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Detected Problems
                    </CardTitle>
                    <CardDescription>
                      AI has identified the following issues in your environment. Select the ones you want to address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Image Description and Assessment */}
                    {(imageDescription || overallAssessment || recommendations) && (
                      <div className="mb-6 space-y-4">
                        {imageDescription && (
                          <Card className="vercel-card">
                            <CardContent className="p-4">
                              <h4 className="font-medium text-sm mb-2">Image Description</h4>
                              <p className="text-sm text-muted-foreground">{imageDescription}</p>
                            </CardContent>
                          </Card>
                        )}
                        
                        {overallAssessment && (
                          <Card className="vercel-card">
                            <CardContent className="p-4">
                              <h4 className="font-medium text-sm mb-2">Overall Assessment</h4>
                              <p className="text-sm text-muted-foreground">{overallAssessment}</p>
                            </CardContent>
                          </Card>
                        )}
                        
                        {recommendations && (
                          <Card className="vercel-card">
                            <CardContent className="p-4">
                              <h4 className="font-medium text-sm mb-2">General Recommendations</h4>
                              <p className="text-sm text-muted-foreground">{recommendations}</p>
                            </CardContent>
                          </Card>
                        )}
                        
                        {aiModel && (
                          <div className="text-xs text-muted-foreground text-center">
                            Analysis powered by: {aiModel}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-4 mb-6">
                      {detectedProblems.map((problem) => (
                        <Card
                          key={problem.id}
                          className={`cursor-pointer transition-all ${
                            selectedProblems.includes(problem.id)
                              ? 'ring-2 ring-blue-500 bg-blue-50'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => {
                            setSelectedProblems(prev =>
                              prev.includes(problem.id)
                                ? prev.filter(id => id !== problem.id)
                                : [...prev, problem.id]
                            )
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-lg">{problem.title}</h3>
                              <div className="flex gap-2">
                                <Badge
                                  variant={
                                    problem.severity === 'critical' ? 'destructive' :
                                    problem.severity === 'high' ? 'destructive' :
                                    problem.severity === 'medium' ? 'secondary' : 'outline'
                                  }
                                >
                                  {problem.severity}
                                </Badge>
                                <Badge variant="outline">{problem.category}</Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{problem.description}</p>
                            
                            {problem.impact && (
                              <div className="mb-3">
                                <h4 className="font-medium text-sm mb-1">Impact:</h4>
                                <p className="text-sm text-muted-foreground">{problem.impact}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <span className="font-medium text-sm">Confidence:</span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {Math.round(problem.confidence * 100)}%
                                </span>
                              </div>
                              {problem.estimatedCost && (
                                <div>
                                  <span className="font-medium text-sm">Estimated Cost:</span>
                                  <span className="ml-2 text-sm text-muted-foreground">{problem.estimatedCost}</span>
                                </div>
                              )}
                              {problem.timeline && (
                <div>
                                  <span className="font-medium text-sm">Timeline:</span>
                                  <span className="ml-2 text-sm text-muted-foreground">{problem.timeline}</span>
                                </div>
                              )}
                            </div>
                            
                            {problem.solutions && problem.solutions.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-sm mb-2">Recommended Solutions:</h4>
                                <div className="space-y-2">
                                  {problem.solutions.slice(0, 2).map((solution, index) => (
                                    <div key={index} className="bg-muted p-3 rounded-lg">
                                      <div className="flex items-start justify-between mb-1">
                                        <h5 className="font-medium text-sm">{solution.title}</h5>
                                        <Badge 
                                          variant={solution.priority === 'high' ? 'destructive' : 
                                                  solution.priority === 'medium' ? 'secondary' : 'outline'}
                                          className="text-xs"
                                        >
                                          {solution.priority}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground mb-2">{solution.description}</p>
                                      <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span>Cost: {solution.cost}</span>
                                        <span>Timeline: {solution.timeline}</span>
                                      </div>
                                    </div>
                                  ))}
                                  {problem.solutions.length > 2 && (
                                    <p className="text-xs text-muted-foreground">
                                      +{problem.solutions.length - 2} more solutions available
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep('capture')}>
                        Back to Capture
                      </Button>
                      <Button
                        onClick={generateSolutions}
                        disabled={selectedProblems.length === 0}
                        size="lg"
                      >
                        Generate Solutions ({selectedProblems.length} selected)
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                </div>
              </CardContent>
            </Card>
              </motion.div>
            )}

            {/* Step 4: Generated Solutions */}
            {currentStep === 'solutions' && (
              <motion.div
                key="solutions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-500" />
                      AI-Generated Solutions
                </CardTitle>
                    <CardDescription>
                      Here are the recommended solutions for your selected problems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {generatedSolutions.map((solution) => (
                        <Card key={solution.id} className="vercel-card">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{solution.title}</CardTitle>
                              <Badge variant={solution.type === 'technical' ? 'default' : 'secondary'}>
                                {solution.type}
                              </Badge>
                            </div>
              </CardHeader>
              <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{solution.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Complexity:</span>
                                <Badge variant="outline" className="ml-2">
                                  {solution.complexity}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Effectiveness:</span>
                                <span className="ml-2 text-green-600">{solution.effectiveness}%</span>
                              </div>
                <div>
                                <span className="font-medium">Cost:</span>
                                <span className="ml-2">{solution.estimatedCost}</span>
                </div>
                <div>
                                <span className="font-medium">Timeline:</span>
                                <span className="ml-2">{solution.timeToImplement}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep('problems')}>
                        Back to Problems
                      </Button>
                      <Button onClick={generateProblemStatement} size="lg">
                        Generate Problem Statement
                        <FileText className="ml-2 h-4 w-4" />
                      </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
            )}

            {/* Step 5: Problem Statement */}
            {currentStep === 'statement' && (
          <motion.div
                key="statement"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-500" />
                      Problem Statement
                </CardTitle>
                    <CardDescription>
                      Comprehensive problem analysis with technical and non-technical perspectives
                    </CardDescription>
              </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="technical" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
                        <TabsTrigger value="non-technical">Business Impact</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="technical" className="space-y-4">
                        <div>
                          <Label htmlFor="tech-problem">Technical Problem</Label>
                          <Textarea
                            id="tech-problem"
                            value={problemStatement.technical.problem}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              technical: { ...prev.technical, problem: e.target.value }
                            }))}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="root-cause">Root Cause Analysis</Label>
                          <Textarea
                            id="root-cause"
                            value={problemStatement.technical.rootCause}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              technical: { ...prev.technical, rootCause: e.target.value }
                            }))}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="impact">Technical Impact</Label>
                          <Textarea
                            id="impact"
                            value={problemStatement.technical.impact}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              technical: { ...prev.technical, impact: e.target.value }
                            }))}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="metrics">Success Metrics</Label>
                          <Textarea
                            id="metrics"
                            value={problemStatement.technical.metrics}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              technical: { ...prev.technical, metrics: e.target.value }
                            }))}
                            className="mt-2"
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="non-technical" className="space-y-4">
                  <div>
                          <Label htmlFor="business-problem">Business Problem</Label>
                          <Textarea
                            id="business-problem"
                            value={problemStatement.nonTechnical.problem}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              nonTechnical: { ...prev.nonTechnical, problem: e.target.value }
                            }))}
                            className="mt-2"
                          />
                  </div>
                  <div>
                          <Label htmlFor="stakeholders">Key Stakeholders</Label>
                          <Textarea
                            id="stakeholders"
                            value={problemStatement.nonTechnical.stakeholders}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              nonTechnical: { ...prev.nonTechnical, stakeholders: e.target.value }
                            }))}
                            className="mt-2"
                          />
                  </div>
                        <div>
                          <Label htmlFor="business-impact">Business Impact</Label>
                          <Textarea
                            id="business-impact"
                            value={problemStatement.nonTechnical.businessImpact}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              nonTechnical: { ...prev.nonTechnical, businessImpact: e.target.value }
                            }))}
                            className="mt-2"
                          />
                </div>
                <div>
                          <Label htmlFor="urgency">Urgency Level</Label>
                  <Textarea
                            id="urgency"
                            value={problemStatement.nonTechnical.urgency}
                            onChange={(e) => setProblemStatement(prev => ({
                              ...prev,
                              nonTechnical: { ...prev.nonTechnical, urgency: e.target.value }
                            }))}
                    className="mt-2"
                  />
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setCurrentStep('solutions')}>
                        Back to Solutions
                      </Button>
                      <Button onClick={generatePitchDocument} size="lg">
                        Generate Pitch Document
                        <FileText className="ml-2 h-4 w-4" />
                      </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
            )}

            {/* Step 6: Pitch Document */}
            {currentStep === 'pitch' && (
          <motion.div
                key="pitch"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
          >
            <Card className="vercel-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-500" />
                      AI-Generated Pitch Document
                </CardTitle>
                    <CardDescription>
                      Your comprehensive pitch document ready for investors and stakeholders
                    </CardDescription>
              </CardHeader>
              <CardContent>
                    {isGeneratingPitch ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-6" />
                        <h3 className="text-xl font-semibold mb-4">Generating Pitch Document...</h3>
                        <Progress value={75} className="w-full max-w-md mx-auto" />
                        <p className="text-muted-foreground mt-4">
                          AI is creating your comprehensive pitch document...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {pitchDocument}
                          </pre>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setCurrentStep('statement')}>
                            Back to Problem Statement
                          </Button>
                          <div className="space-x-2">
                            <Button variant="outline" onClick={downloadPitchDocument}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button onClick={() => setCurrentStep('capture')} size="lg">
                              Start New Analysis
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                    </div>
                </div>
                    )}
              </CardContent>
            </Card>
          </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </Layout>
  )
}
