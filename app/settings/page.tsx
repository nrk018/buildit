"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, Zap, Key, Download, Trash2, Save, RefreshCw, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    name: "John Doe",
    email: "john@example.com",
    company: "Tech Corp",

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    criticalAlerts: true,
    weeklyReports: true,

    // Analysis
    defaultConfidenceThreshold: [75],
    autoAnalysis: true,
    saveHistory: true,
    maxFileSize: [25],

    // Privacy
    dataRetention: "90",
    shareAnalytics: false,
    publicProfile: false,

    // API
    apiKey: "sk-1234567890abcdef",
    showApiKey: false,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const generateNewApiKey = () => {
    const newKey = "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    updateSetting("apiKey", newKey)
  }

  const SettingCard = ({ icon: Icon, title, children }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="glass-morphism p-6 hover:neon-border transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
            <Icon className="h-5 w-5 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="space-y-6">{children}</div>
      </Card>
    </motion.div>
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
                Settings
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Customize your AI Problem Detector experience</p>
          </motion.div>

          <div className="space-y-8">
            {/* Profile Settings */}
            <SettingCard icon={User} title="Profile Settings">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => updateSetting("name", e.target.value)}
                    className="mt-1 bg-slate-800/50 border-slate-600 text-white focus:border-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                    className="mt-1 bg-slate-800/50 border-slate-600 text-white focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company" className="text-gray-300">
                  Company
                </Label>
                <Input
                  id="company"
                  value={settings.company}
                  onChange={(e) => updateSetting("company", e.target.value)}
                  className="mt-1 bg-slate-800/50 border-slate-600 text-white focus:border-cyan-500"
                />
              </div>
            </SettingCard>

            {/* Notification Settings */}
            <SettingCard icon={Bell} title="Notifications">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Email Notifications</Label>
                    <p className="text-gray-400 text-sm">Receive analysis results via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Push Notifications</Label>
                    <p className="text-gray-400 text-sm">Browser notifications for real-time updates</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Critical Alerts</Label>
                    <p className="text-gray-400 text-sm">Immediate alerts for critical issues</p>
                  </div>
                  <Switch
                    checked={settings.criticalAlerts}
                    onCheckedChange={(checked) => updateSetting("criticalAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Weekly Reports</Label>
                    <p className="text-gray-400 text-sm">Summary of your analysis activity</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => updateSetting("weeklyReports", checked)}
                  />
                </div>
              </div>
            </SettingCard>

            {/* Analysis Settings */}
            <SettingCard icon={Zap} title="Analysis Preferences">
              <div className="space-y-6">
                <div>
                  <Label className="text-white font-medium mb-3 block">
                    Default Confidence Threshold: {settings.defaultConfidenceThreshold[0]}%
                  </Label>
                  <Slider
                    value={settings.defaultConfidenceThreshold}
                    onValueChange={(value) => updateSetting("defaultConfidenceThreshold", value)}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-gray-400 text-sm mt-2">Only show results above this confidence level</p>
                </div>

                <div>
                  <Label className="text-white font-medium mb-3 block">
                    Max File Size: {settings.maxFileSize[0]} MB
                  </Label>
                  <Slider
                    value={settings.maxFileSize}
                    onValueChange={(value) => updateSetting("maxFileSize", value)}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Auto-Analysis</Label>
                    <p className="text-gray-400 text-sm">Automatically start analysis after upload</p>
                  </div>
                  <Switch
                    checked={settings.autoAnalysis}
                    onCheckedChange={(checked) => updateSetting("autoAnalysis", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Save History</Label>
                    <p className="text-gray-400 text-sm">Keep analysis results in your history</p>
                  </div>
                  <Switch
                    checked={settings.saveHistory}
                    onCheckedChange={(checked) => updateSetting("saveHistory", checked)}
                  />
                </div>
              </div>
            </SettingCard>

            {/* Privacy Settings */}
            <SettingCard icon={Shield} title="Privacy & Security">
              <div className="space-y-4">
                <div>
                  <Label className="text-white font-medium mb-2 block">Data Retention Period</Label>
                  <Select
                    value={settings.dataRetention}
                    onValueChange={(value) => updateSetting("dataRetention", value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">6 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Share Analytics</Label>
                    <p className="text-gray-400 text-sm">Help improve our AI models with anonymous data</p>
                  </div>
                  <Switch
                    checked={settings.shareAnalytics}
                    onCheckedChange={(checked) => updateSetting("shareAnalytics", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Public Profile</Label>
                    <p className="text-gray-400 text-sm">Make your profile visible in the community</p>
                  </div>
                  <Switch
                    checked={settings.publicProfile}
                    onCheckedChange={(checked) => updateSetting("publicProfile", checked)}
                  />
                </div>
              </div>
            </SettingCard>

            {/* API Settings */}
            <SettingCard icon={Key} title="API Configuration">
              <div className="space-y-4">
                <div>
                  <Label className="text-white font-medium mb-2 block">API Key</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type={settings.showApiKey ? "text" : "password"}
                        value={settings.apiKey}
                        readOnly
                        className="bg-slate-800/50 border-slate-600 text-white pr-10"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => updateSetting("showApiKey", !settings.showApiKey)}
                      >
                        {settings.showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      onClick={generateNewApiKey}
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-400 bg-transparent"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Use this key to access our API programmatically</p>
                </div>
              </div>
            </SettingCard>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="flex gap-4">
                <Button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg glow-effect">
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-3 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-lg bg-transparent"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export Data
                </Button>
              </div>
              <Button
                variant="outline"
                className="px-6 py-3 border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg bg-transparent"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Delete Account
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
