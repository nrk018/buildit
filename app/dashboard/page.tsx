"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, FolderOpen, Calendar, User, Crown, Star, ArrowRight, Settings, LogOut } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  subscription_plan: string
  subscription_status: string
}

interface Project {
  id: string
  name: string
  description: string
  problem_statement: string
  status: string
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    problemStatement: ''
  })
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/auth/me')
      const authData = await authResponse.json()
      
      if (!authData.success) {
        router.push('/auth')
        return
      }

      setUser(authData.user)

      // Load projects
      const projectsResponse = await fetch('/api/projects')
      const projectsData = await projectsResponse.json()
      
      if (projectsData.success) {
        setProjects(projectsData.projects)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newProject.name || !newProject.problemStatement) {
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProject.name,
          description: newProject.description,
          problemStatement: newProject.problemStatement
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProjects([data.project, ...projects])
        setNewProject({ name: '', description: '', problemStatement: '' })
        setShowCreateProject(false)
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const openProject = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your startup projects and continue building your vision
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.subscription_plan === 'free' ? (
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Free Plan
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-600">
                    <Crown className="h-4 w-4 mr-2" />
                    {user?.subscription_plan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
                  </Button>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{projects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold">
                      {projects.filter(p => p.status === 'in_progress').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <p className="text-2xl font-bold capitalize">{user?.subscription_plan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
              
              <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Start a new startup project and begin building your vision
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="project-description">Description (Optional)</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Brief description of your project"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="problem-statement">Problem Statement</Label>
                      <Textarea
                        id="problem-statement"
                        placeholder="Describe the problem your startup solves"
                        value={newProject.problemStatement}
                        onChange={(e) => setNewProject({ ...newProject, problemStatement: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateProject(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Project</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {projects.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first startup project to get started
                  </p>
                  <Button onClick={() => setShowCreateProject(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openProject(project.id)}>
                      <CardHeader>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || 'No description provided'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {project.problem_statement}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : project.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status.replace('_', ' ')}
                          </span>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}