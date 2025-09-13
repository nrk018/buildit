"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Share2,
  RefreshCw,
  TrendingUp,
  Target,
  Shield,
} from "lucide-react"

interface AnalysisResult {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  confidence: number
  location: { x: number; y: number }
}

const mockResults: AnalysisResult[] = [
  {
    id: "1",
    type: "critical",
    title: "Structural Damage Detected",
    description: "Potential crack in foundation wall requiring immediate attention",
    confidence: 94,
    location: { x: 45, y: 60 },
  },
  {
    id: "2",
    type: "warning",
    title: "Moisture Detection",
    description: "Elevated moisture levels detected in corner area",
    confidence: 87,
    location: { x: 75, y: 30 },
  },
  {
    id: "3",
    type: "info",
    title: "Surface Wear",
    description: "Normal wear patterns consistent with age",
    confidence: 76,
    location: { x: 25, y: 80 },
  },
]

export default function AnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [selectedResult, setSelectedResult] = useState<string | null>(null)

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setResults(mockResults)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const getResultIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      case "warning":
        return <Eye className="h-5 w-5 text-yellow-400" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />
    }
  }

  const getResultColor = (type: string) => {
    switch (type) {
      case "critical":
        return "from-red-500 to-pink-500"
      case "warning":
        return "from-yellow-500 to-orange-500"
      default:
        return "from-green-500 to-cyan-500"
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced AI-powered problem detection and analysis results
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Analysis Image */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-morphism p-6">
                  <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg overflow-hidden">
                    {/* Placeholder Image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="/industrial-equipment-analysis.jpg"
                        alt="Analysis Subject"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Analysis Overlay */}
                    <AnimatePresence>
                      {!isAnalyzing &&
                        results.map((result) => (
                          <motion.div
                            key={result.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + Number.parseInt(result.id) * 0.2 }}
                            className={`absolute w-4 h-4 rounded-full cursor-pointer ${
                              selectedResult === result.id ? "ring-4 ring-white/50" : ""
                            }`}
                            style={{
                              left: `${result.location.x}%`,
                              top: `${result.location.y}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                            onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                          >
                            <div
                              className={`w-full h-full rounded-full bg-gradient-to-r ${getResultColor(result.type)} pulse-neon`}
                            />
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                          </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Analysis Progress Overlay */}
                    <AnimatePresence>
                      {isAnalyzing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="inline-block p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-4"
                            >
                              <Brain className="h-8 w-8 text-white" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-white mb-2">AI Analysis in Progress</h3>
                            <p className="text-gray-300 mb-4">Scanning for problems and anomalies...</p>
                            <div className="w-64 mx-auto">
                              <Progress value={progress} className="h-2" />
                              <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}% Complete</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Analysis Controls */}
                  {!isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="flex justify-between items-center mt-6"
                    >
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Re-analyze
                      </Button>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Analysis Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass-morphism p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-cyan-400" />
                    Analysis Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Overall Confidence</span>
                      <span className="text-cyan-400 font-semibold">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Issues Found</span>
                      <span className="text-white font-semibold">{results.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Processing Time</span>
                      <span className="text-gray-300">2.3s</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Results List */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="glass-morphism p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="mr-2 h-5 w-5 text-cyan-400" />
                    Detected Issues
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedResult === result.id
                              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 neon-border"
                              : "bg-slate-800/50 hover:bg-slate-700/50"
                          }`}
                          onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getResultIcon(result.type)}
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{result.title}</h4>
                              <p className="text-gray-400 text-sm mb-2">{result.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className={`bg-gradient-to-r ${getResultColor(result.type)} text-white border-0`}
                                >
                                  {result.type}
                                </Badge>
                                <span className="text-xs text-gray-500">{result.confidence}% confidence</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="glass-morphism p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-cyan-400" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-300">• Immediate inspection recommended for structural damage</p>
                    <p className="text-gray-300">• Monitor moisture levels in affected areas</p>
                    <p className="text-gray-300">• Schedule maintenance within 30 days</p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
