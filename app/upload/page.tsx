"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Camera, File, X, CheckCircle, AlertCircle, Zap } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface UploadedFile {
  id: string
  file: File
  preview: string
  status: "uploading" | "success" | "error"
  progress: number
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: "uploading" as const,
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((uploadFile) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === uploadFile.id) {
              const newProgress = f.progress + Math.random() * 30
              if (newProgress >= 100) {
                clearInterval(interval)
                return { ...f, progress: 100, status: "success" }
              }
              return { ...f, progress: newProgress }
            }
            return f
          }),
        )
      }, 200)
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "video/*": [".mp4", ".webm", ".ogg"],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const captureFromCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // TODO: Implement camera capture functionality
      console.log("Camera access granted:", stream)
    } catch (error) {
      console.error("Camera access denied:", error)
    }
  }

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
                Upload & Detect
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload images or capture from your camera to detect problems with AI precision
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              {...getRootProps()}
              className={`glass-morphism p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? "neon-border scale-105" : "border-dashed border-2 border-gray-600 hover:border-cyan-500"
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="h-16 w-16 text-cyan-400 mx-auto mb-6 pulse-neon" />
              </motion.div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {isDragActive ? "Drop files here!" : "Drag & Drop Files"}
              </h3>
              <p className="text-gray-400 mb-6">Support for images (JPG, PNG, GIF, WebP) and videos (MP4, WebM)</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg glow-effect">
                  <File className="mr-2 h-5 w-5" />
                  Choose Files
                </Button>
                <Button
                  onClick={captureFromCamera}
                  variant="outline"
                  className="px-6 py-3 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-lg bg-transparent"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Use Camera
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Uploaded Files */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">Uploaded Files</h2>
                <div className="grid gap-4">
                  {uploadedFiles.map((uploadFile) => (
                    <motion.div
                      key={uploadFile.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      layout
                      className="glass-morphism p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={uploadFile.preview || "/placeholder.svg"}
                            alt={uploadFile.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-white font-medium truncate">{uploadFile.file.name}</h3>
                          <p className="text-gray-400 text-sm">{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB</p>

                          {/* Progress Bar */}
                          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadFile.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {uploadFile.status === "uploading" && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Zap className="h-5 w-5 text-cyan-400" />
                            </motion.div>
                          )}
                          {uploadFile.status === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
                          {uploadFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}

                          <Button
                            onClick={() => removeFile(uploadFile.id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {uploadedFiles.some((f) => f.status === "success") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                  >
                    <Button className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold rounded-lg glow-effect">
                      <Zap className="mr-2 h-5 w-5" />
                      Analyze Files
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  )
}
