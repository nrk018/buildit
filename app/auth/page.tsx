"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual authentication logic
    console.log("Auth form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* 3D Morphing Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

        {/* Animated Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Auth Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card className="glass-morphism neon-border p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="inline-block p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-4"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {isLogin ? "Welcome Back" : "Join the Future"}
            </h1>
            <p className="text-gray-400">
              {isLogin ? "Access your AI-powered dashboard" : "Create your account to get started"}
            </p>
          </div>

          {/* Form Toggle */}
          <div className="flex mb-6 p-1 bg-slate-800/50 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                isLogin ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                !isLogin ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                        placeholder="Enter your full name"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                    placeholder="Enter your email"
                    required
                  />
                </motion.div>
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </motion.div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                        placeholder="Confirm your password"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg glow-effect group"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
