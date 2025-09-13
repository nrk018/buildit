"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Heart, Share2, Plus, Search, Filter, Eye } from "lucide-react"

interface Post {
  id: string
  author: string
  avatar: string
  title: string
  content: string
  timestamp: string
  likes: number
  replies: number
  views: number
  tags: string[]
  isLiked: boolean
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "TechAnalyst_Pro",
    avatar: "/placeholder.svg?height=40&width=40&text=TA",
    title: "Best practices for industrial equipment analysis",
    content:
      "After analyzing hundreds of industrial setups, I've found that focusing on these key areas yields the best results...",
    timestamp: "2 hours ago",
    likes: 24,
    replies: 8,
    views: 156,
    tags: ["industrial", "best-practices", "equipment"],
    isLiked: false,
  },
  {
    id: "2",
    author: "AI_Detective",
    avatar: "/placeholder.svg?height=40&width=40&text=AD",
    title: "New AI model shows 95% accuracy in structural damage detection",
    content:
      "Just tested the latest model update and the results are incredible. The confidence scores are much more reliable now...",
    timestamp: "4 hours ago",
    likes: 42,
    replies: 15,
    views: 289,
    tags: ["ai-models", "accuracy", "structural"],
    isLiked: true,
  },
  {
    id: "3",
    author: "BuildingInspector",
    avatar: "/placeholder.svg?height=40&width=40&text=BI",
    title: "Question: How to handle false positives in foundation scans?",
    content:
      "I've been getting some false positives when scanning concrete foundations. Any tips on improving accuracy?",
    timestamp: "6 hours ago",
    likes: 12,
    replies: 23,
    views: 178,
    tags: ["question", "foundation", "troubleshooting"],
    isLiked: false,
  },
  {
    id: "4",
    author: "SafetyFirst_Engineer",
    avatar: "/placeholder.svg?height=40&width=40&text=SF",
    title: "Case Study: Preventing electrical hazards with AI detection",
    content:
      "Sharing a recent case where our AI system detected critical electrical issues that could have caused serious accidents...",
    timestamp: "1 day ago",
    likes: 67,
    replies: 31,
    views: 445,
    tags: ["case-study", "electrical", "safety"],
    isLiked: true,
  },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" })

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post,
      ),
    )
  }

  const handleSubmitPost = () => {
    if (newPost.title && newPost.content) {
      const post: Post = {
        id: Date.now().toString(),
        author: "You",
        avatar: "/placeholder.svg?height=40&width=40&text=U",
        title: newPost.title,
        content: newPost.content,
        timestamp: "Just now",
        likes: 0,
        replies: 0,
        views: 1,
        tags: newPost.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isLiked: false,
      }
      setPosts([post, ...posts])
      setNewPost({ title: "", content: "", tags: "" })
      setShowNewPost(false)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with fellow AI analysts and share insights
            </p>
          </motion.div>

          {/* Search and Actions */}
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
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowNewPost(!showNewPost)}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg glow-effect"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* New Post Form */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <Card className="glass-morphism p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Create New Post</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                    <Textarea
                      placeholder="Share your thoughts, questions, or insights..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500 min-h-[120px]"
                    />
                    <Input
                      placeholder="Tags (comma separated)..."
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSubmitPost} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                        Post
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewPost(false)}
                        className="border-gray-600 text-gray-400"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts */}
          <div className="space-y-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="glass-morphism p-6 hover:neon-border transition-all duration-300">
                    {/* Post Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={post.avatar || "/placeholder.svg"}
                          alt={post.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold">{post.author}</h4>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">{post.timestamp}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="bg-slate-800/50 text-cyan-400 border-cyan-500/30"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-6">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            post.isLiked ? "text-red-400" : "text-gray-400 hover:text-red-400"
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${post.isLiked ? "fill-current" : ""}`} />
                          <span>{post.likes}</span>
                        </motion.button>

                        <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span>{post.replies}</span>
                        </button>

                        <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                          <Eye className="h-5 w-5" />
                          <span>{post.views}</span>
                        </button>
                      </div>

                      <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredPosts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-gray-400 text-lg">No posts found</div>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}
