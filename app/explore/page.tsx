"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Grid, List, Eye, Heart, Download } from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  author: string
  likes: number
  views: number
  analysisType: string
  confidence: number
  tags: string[]
}

const mockGallery: GalleryItem[] = [
  {
    id: "1",
    title: "Industrial Machinery Analysis",
    description: "Complex mechanical system with multiple failure points detected",
    image: "/placeholder.svg?height=300&width=400&text=Industrial",
    category: "Industrial",
    author: "TechAnalyst_Pro",
    likes: 45,
    views: 234,
    analysisType: "Structural",
    confidence: 94,
    tags: ["machinery", "industrial", "critical"],
  },
  {
    id: "2",
    title: "Building Foundation Scan",
    description: "Comprehensive foundation analysis revealing structural integrity",
    image: "/placeholder.svg?height=300&width=400&text=Foundation",
    category: "Construction",
    author: "BuildingInspector",
    likes: 32,
    views: 189,
    analysisType: "Foundation",
    confidence: 87,
    tags: ["construction", "foundation", "safety"],
  },
  {
    id: "3",
    title: "Electrical Panel Inspection",
    description: "High-voltage electrical system analysis with safety recommendations",
    image: "/placeholder.svg?height=300&width=400&text=Electrical",
    category: "Electrical",
    author: "SafetyFirst_Engineer",
    likes: 28,
    views: 156,
    analysisType: "Electrical",
    confidence: 91,
    tags: ["electrical", "safety", "hazard"],
  },
  {
    id: "4",
    title: "Vehicle Damage Assessment",
    description: "Automotive damage analysis with repair cost estimation",
    image: "/placeholder.svg?height=300&width=400&text=Vehicle",
    category: "Automotive",
    author: "AutoExpert",
    likes: 67,
    views: 345,
    analysisType: "Surface",
    confidence: 89,
    tags: ["automotive", "damage", "assessment"],
  },
  {
    id: "5",
    title: "Bridge Infrastructure Review",
    description: "Large-scale infrastructure analysis for maintenance planning",
    image: "/placeholder.svg?height=300&width=400&text=Bridge",
    category: "Infrastructure",
    author: "CivilEngineer_AI",
    likes: 89,
    views: 567,
    analysisType: "Structural",
    confidence: 96,
    tags: ["infrastructure", "bridge", "maintenance"],
  },
  {
    id: "6",
    title: "Manufacturing Quality Control",
    description: "Production line quality analysis with defect detection",
    image: "/placeholder.svg?height=300&width=400&text=Manufacturing",
    category: "Manufacturing",
    author: "QualityControl_Bot",
    likes: 54,
    views: 278,
    analysisType: "Quality",
    confidence: 92,
    tags: ["manufacturing", "quality", "defects"],
  },
]

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const categories = [
    "all",
    "Industrial",
    "Construction",
    "Electrical",
    "Automotive",
    "Infrastructure",
    "Manufacturing",
  ]

  const filteredItems = mockGallery.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const GalleryCard = ({ item, index }: { item: GalleryItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="group cursor-pointer"
      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
    >
      <Card className="glass-morphism overflow-hidden hover:neon-border transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className={`bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0`}>
              {item.confidence}% confidence
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/30">
                {item.category}
              </Badge>
              <Badge variant="outline" className="bg-slate-800/50 text-purple-400 border-purple-500/30">
                {item.analysisType}
              </Badge>
            </div>
            <span className="text-gray-400 text-sm">by {item.author}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="outline" className="bg-slate-800/30 text-gray-400 border-gray-600 text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {item.likes}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {item.views}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )

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
                Explore Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover AI analysis examples and learn from the community
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
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedCategory === category
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                          : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      }
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode("grid")}
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    className={
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                        : "border-cyan-500/50 text-cyan-400"
                    }
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className={
                      viewMode === "list"
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                        : "border-cyan-500/50 text-cyan-400"
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Gallery Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <GalleryCard key={item.id} item={item} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-gray-400 text-lg">No items found</div>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}
