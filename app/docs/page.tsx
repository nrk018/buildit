"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Search, Book, HelpCircle, ExternalLink, Copy } from "lucide-react"

interface DocSection {
  id: string
  title: string
  content: string
  subsections?: DocSection[]
}

const documentation: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: "Welcome to AI Problem Detector! This guide will help you get up and running quickly.",
    subsections: [
      {
        id: "quick-start",
        title: "Quick Start Guide",
        content: `
# Quick Start Guide

Follow these simple steps to start detecting problems with AI:

## 1. Upload Your Content
- Navigate to the Upload page
- Drag and drop your images or videos
- Or use the camera capture feature

## 2. Start Analysis
- Click "Analyze Files" once upload is complete
- Wait for AI processing (typically 2-3 seconds)
- View results in real-time

## 3. Review Results
- Check detected issues and confidence scores
- Export reports or share findings
- Save to history for future reference
        `,
      },
      {
        id: "system-requirements",
        title: "System Requirements",
        content: `
# System Requirements

## Supported File Formats
- **Images**: JPG, PNG, GIF, WebP
- **Videos**: MP4, WebM, OGG
- **Max file size**: 50MB per file

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Network Requirements
- Stable internet connection
- Minimum 1 Mbps upload speed recommended
        `,
      },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    content: "Complete API documentation for developers integrating with our platform.",
    subsections: [
      {
        id: "authentication",
        title: "Authentication",
        content: `
# Authentication

All API requests require authentication using API keys.

## Getting Your API Key
1. Go to Settings > API Keys
2. Click "Generate New Key"
3. Copy and store securely

## Using API Keys
Include your API key in the Authorization header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.aidetector.com/v1/analyze
\`\`\`
        `,
      },
      {
        id: "endpoints",
        title: "API Endpoints",
        content: `
# API Endpoints

## Upload File
\`POST /v1/upload\`

Upload a file for analysis.

**Request:**
\`\`\`json
{
  "file": "base64_encoded_file",
  "filename": "image.jpg",
  "type": "image/jpeg"
}
\`\`\`

**Response:**
\`\`\`json
{
  "file_id": "abc123",
  "status": "uploaded",
  "message": "File uploaded successfully"
}
\`\`\`

## Analyze File
\`POST /v1/analyze\`

Start analysis on uploaded file.

**Request:**
\`\`\`json
{
  "file_id": "abc123",
  "analysis_type": "comprehensive"
}
\`\`\`

**Response:**
\`\`\`json
{
  "analysis_id": "xyz789",
  "status": "processing",
  "estimated_time": 3
}
\`\`\`
        `,
      },
    ],
  },
  {
    id: "features",
    title: "Features & Capabilities",
    content: "Learn about all the powerful features available in AI Problem Detector.",
    subsections: [
      {
        id: "ai-models",
        title: "AI Models",
        content: `
# AI Models

Our platform uses state-of-the-art AI models for problem detection:

## Vision Models
- **GPT-Vision v4.0**: General purpose visual analysis
- **StructureNet**: Specialized for structural damage
- **SafetyAI**: Focused on safety hazard detection

## Analysis Types
- **Structural Analysis**: Cracks, damage, wear
- **Electrical Safety**: Hazards, code violations
- **Mechanical Issues**: Equipment problems, failures
- **Surface Quality**: Defects, inconsistencies

## Confidence Scoring
All analyses include confidence scores (0-100%):
- **90-100%**: High confidence, reliable results
- **70-89%**: Good confidence, review recommended
- **Below 70%**: Low confidence, manual verification needed
        `,
      },
      {
        id: "integrations",
        title: "Integrations",
        content: `
# Integrations

Connect AI Problem Detector with your existing tools:

## Supported Platforms
- **Slack**: Get notifications for critical issues
- **Microsoft Teams**: Share analysis results
- **Zapier**: Automate workflows
- **Webhook**: Custom integrations

## Setup Instructions
1. Go to Settings > Integrations
2. Select your platform
3. Follow authentication steps
4. Configure notification preferences

## Webhook Configuration
\`\`\`json
{
  "url": "https://your-app.com/webhook",
  "events": ["analysis.completed", "issue.critical"],
  "secret": "your_webhook_secret"
}
\`\`\`
        `,
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    content: "Common issues and solutions to help you resolve problems quickly.",
    subsections: [
      {
        id: "common-issues",
        title: "Common Issues",
        content: `
# Common Issues

## Upload Problems
**Issue**: Files won't upload
**Solutions**:
- Check file size (max 50MB)
- Verify file format is supported
- Try a different browser
- Check internet connection

## Analysis Errors
**Issue**: Analysis fails or times out
**Solutions**:
- Ensure image quality is sufficient
- Try with a smaller file
- Check if image contains detectable objects
- Contact support if issue persists

## Low Confidence Scores
**Issue**: AI returns low confidence results
**Solutions**:
- Use higher resolution images
- Ensure good lighting conditions
- Remove obstructions from view
- Try different angles or perspectives
        `,
      },
      {
        id: "error-codes",
        title: "Error Codes",
        content: `
# Error Codes

## HTTP Status Codes
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Invalid API key
- **403**: Forbidden - Insufficient permissions
- **429**: Rate Limited - Too many requests
- **500**: Server Error - Internal system error

## Application Error Codes
- **E001**: File format not supported
- **E002**: File size exceeds limit
- **E003**: Analysis timeout
- **E004**: Insufficient image quality
- **E005**: No detectable objects found

## Getting Help
If you encounter persistent issues:
1. Check our status page
2. Review error logs
3. Contact support with error details
        `,
      },
    ],
  },
]

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"])
  const [selectedSection, setSelectedSection] = useState("quick-start")

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split("\n")
    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold text-white mb-4 mt-6">
            {line.substring(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold text-cyan-400 mb-3 mt-5">
            {line.substring(3)}
          </h2>
        )
      }
      if (line.startsWith("```")) {
        const isClosing = index > 0 && lines[index - 1]?.startsWith("```")
        if (!isClosing) {
          const codeBlock = []
          let i = index + 1
          while (i < lines.length && !lines[i].startsWith("```")) {
            codeBlock.push(lines[i])
            i++
          }
          return (
            <div key={index} className="relative my-4">
              <pre className="bg-slate-900 border border-cyan-500/30 rounded-lg p-4 overflow-x-auto">
                <code className="text-cyan-300 text-sm">{codeBlock.join("\n")}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 border-cyan-500/50 text-cyan-400 bg-slate-800/80"
                onClick={() => copyToClipboard(codeBlock.join("\n"))}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )
        }
        return null
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={index} className="text-gray-300 ml-4 mb-1">
            {line.substring(2)}
          </li>
        )
      }
      if (line.trim() === "") {
        return <br key={index} />
      }
      return (
        <p key={index} className="text-gray-300 mb-2 leading-relaxed">
          {line}
        </p>
      )
    })
  }

  const selectedContent = documentation
    .flatMap((section) => [section, ...(section.subsections || [])])
    .find((section) => section.id === selectedSection)

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
                Documentation
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Complete guides and API reference for AI Problem Detector
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-morphism p-6 sticky top-24">
                  {/* Search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search docs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2">
                    {documentation.map((section) => (
                      <div key={section.id}>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center justify-between w-full p-2 text-left text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-cyan-400" />
                            <span className="font-medium">{section.title}</span>
                          </div>
                          {expandedSections.includes(section.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedSections.includes(section.id) && section.subsections && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-6 mt-2 space-y-1"
                            >
                              {section.subsections.map((subsection) => (
                                <button
                                  key={subsection.id}
                                  onClick={() => setSelectedSection(subsection.id)}
                                  className={`block w-full p-2 text-left text-sm rounded-lg transition-colors ${
                                    selectedSection === subsection.id
                                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400"
                                      : "text-gray-400 hover:text-white hover:bg-slate-800/30"
                                  }`}
                                >
                                  {subsection.title}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </nav>
                </Card>
              </motion.div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass-morphism p-8">
                  {selectedContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-white m-0">{selectedContent.title}</h1>
                        <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                      <div className="text-gray-300">{renderContent(selectedContent.content)}</div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Select a Topic</h3>
                      <p className="text-gray-400">Choose a documentation section from the sidebar to get started</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
