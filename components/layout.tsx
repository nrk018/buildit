"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Navbar } from "./navbar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-16"
      >
        {children}
      </motion.main>
    </div>
  )
}
