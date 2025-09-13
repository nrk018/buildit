"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, Download, Filter, Search, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HistoryItem {
  id: string
  title: string
  date: string
  time: string
  status: "completed" | "processing" | "failed"
  type: "image" | "video"
  issues: number
  confidence: number
  thumbnail: string
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    title: "Industrial Equipment Scan",
    date: "2024-01-15",
    time: "14:30",
    status: "completed",
    type: "image",
    issues: 3,
    confidence: 94,
    thumbnail: "/placeholder.svg?height=100&width=100&text=Equipment",
  },
  {
    id: "2",
    title: "Building Foundation Check",
    date: "2024-01-14",
    time: "09:15",
    status: "completed",
    type: "image",
    issues: 1,
    confidence: 87,
    thumbnail: "/placeholder.svg?height=100&width=100&text=Foundation",
  },
  {
    id: "3",
    title: "Vehicle Inspection",
    date: "2024-01-13",
    time: "16:45",
    status: "processing",
    type: "video",
    issues: 0,
    confidence: 0,
    thumbnail: "/placeholder.svg?height=100&width=100&text=Vehicle",
  },
  {
    id: "4",
    title: "Electrical Panel Analysis",
    date: "2024-01-12",
    time: "11:20",
    status: "failed",
    type: "image",
    issues: 0,
    confidence: 0,
    thumbnail: "/placeholder.svg?height=100&width=100&text=Electrical",
  },
  {
    id: "5",
    title: "Roof Damage Assessment",
    date: "2024-01-11",
    time: "13:10",
    status: "completed",
    type: "image",
    issues: 5,
    confidence: 91,
    thumbnail: "/placeholder.svg?height=100&width=100&text=Roof",
  },
]

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      default:
        return <Info className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "from-green-500 to-cyan-500"
      case "processing":
        return "from-yellow-500 to-orange-500"
      case "failed":
        return "from-red-500 to-pink-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Analysis History
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Track your AI analysis history with detailed timelines and results
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="glass-morphism p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search analysis history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "completed", "processing", "failed"].map((status) => (
                    <Button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      className={
                        filterStatus === status
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                          : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      }
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500" />

            <div className="space-y-8">
              <AnimatePresence>
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 border-4 border-slate-900 z-10" />

                    {/* Content Card */}
                    <div className="ml-16">
                      <Card
                        className={`glass-morphism p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedItem === item.id ? "neon-border" : "hover:border-cyan-500/50"
                        }`}
                        onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.thumbnail || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                <Badge
                                  className={`bg-gradient-to-r ${getStatusColor(item.status)} text-white border-0`}
                                >
                                  {item.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {item.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {item.time}
                              </div>
                            </div>

                            {item.status === "completed" && (
                              <div className="flex items-center gap-6 text-sm">
                                <div className="text-gray-300">
                                  <span className="text-cyan-400 font-semibold">{item.issues}</span> issues found
                                </div>
                                <div className="text-gray-300">
                                  <span className="text-cyan-400 font-semibold">{item.confidence}%</span> confidence
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-500/50 text-cyan-400 bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.status === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-500/50 text-cyan-400 bg-transparent"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {selectedItem === item.id && item.status === "completed" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-gray-700"
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-white font-medium mb-2">Analysis Details</h4>
                                  <ul className="text-gray-400 text-sm space-y-1">
                                    <li>• Processing time: 2.3 seconds</li>
                                    <li>• File size: 4.2 MB</li>
                                    <li>• Resolution: 1920x1080</li>
                                    <li>• AI model: GPT-Vision v4.0</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-white font-medium mb-2">Issues Detected</h4>
                                  <ul className="text-gray-400 text-sm space-y-1">
                                    <li>• Structural damage (Critical)</li>
                                    <li>• Surface wear (Minor)</li>
                                    <li>• Moisture detection (Warning)</li>
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {filteredHistory.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-gray-400 text-lg">No analysis history found</div>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}
