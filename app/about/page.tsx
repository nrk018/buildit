"use client"

import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Users, Target, Award, Github, Linkedin, Twitter, Mail } from "lucide-react"

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "AI Research Lead",
    bio: "PhD in Computer Vision from MIT. 10+ years in AI research and development.",
    avatar: "/placeholder.svg?height=120&width=120&text=SC",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Marcus Rodriguez",
    role: "Lead Engineer",
    bio: "Full-stack developer with expertise in scalable AI systems and cloud architecture.",
    avatar: "/placeholder.svg?height=120&width=120&text=MR",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Dr. Emily Watson",
    role: "Product Manager",
    bio: "Former industrial engineer turned product strategist. Expert in problem detection workflows.",
    avatar: "/placeholder.svg?height=120&width=120&text=EW",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Alex Kim",
    role: "UX Designer",
    bio: "Design systems specialist focused on creating intuitive interfaces for complex AI tools.",
    avatar: "/placeholder.svg?height=120&width=120&text=AK",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
]

const milestones = [
  { year: "2024", title: "AI Problem Detector Launch", description: "Public release with 95% accuracy" },
  { year: "2023", title: "Series A Funding", description: "₹830M raised to accelerate development" },
  { year: "2022", title: "Beta Testing Program", description: "1000+ users testing early versions" },
  { year: "2021", title: "Company Founded", description: "Started with a vision to democratize AI analysis" },
]

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-20">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  About Us
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We're building the future of AI-powered problem detection, making advanced analysis accessible to
                everyone.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20"
          >
            <Card className="glass-morphism p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  To democratize advanced AI analysis and make problem detection accessible to professionals across all
                  industries. We believe that everyone should have access to cutting-edge AI tools that can help prevent
                  accidents, reduce costs, and save lives.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 mb-4">
                      <Target className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Precision</h3>
                    <p className="text-gray-400">95%+ accuracy in problem detection across multiple domains</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 mb-4">
                      <Zap className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Speed</h3>
                    <p className="text-gray-400">Lightning-fast analysis in under 3 seconds</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 mb-4">
                      <Users className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Accessibility</h3>
                    <p className="text-gray-400">User-friendly interface for professionals at any skill level</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-300">The brilliant minds behind AI Problem Detector</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <Card className="glass-morphism p-6 text-center hover:neon-border transition-all duration-300">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 mb-3">
                      {member.role}
                    </Badge>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{member.bio}</p>
                    <div className="flex justify-center gap-3">
                      <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
              <p className="text-xl text-gray-300">Key milestones in our mission to revolutionize AI analysis</p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-cyan-500 to-purple-500" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                    className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div className="w-5/12">
                      <Card className={`glass-morphism p-6 ${index % 2 === 0 ? "mr-8 text-right" : "ml-8 text-left"}`}>
                        <div className="text-2xl font-bold text-cyan-400 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                        <p className="text-gray-400">{milestone.description}</p>
                      </Card>
                    </div>

                    {/* Timeline Dot */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 border-4 border-slate-900 z-10 flex-shrink-0" />

                    <div className="w-5/12" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Card className="glass-morphism p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Have questions about our technology or want to partner with us? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg glow-effect">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-3 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-lg bg-transparent"
                >
                  <Award className="mr-2 h-5 w-5" />
                  Careers
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
