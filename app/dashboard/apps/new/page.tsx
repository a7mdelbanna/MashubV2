'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PricingService } from '@/services/pricing.service'
import { ProjectsService } from '@/services/projects.service'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Save, Smartphone, Globe, Package, Palette, Key,
  FileText, CheckSquare, Upload, Settings, Cloud, GitBranch,
  Link as LinkIcon, DollarSign, Plus, X, Eye, EyeOff, Copy,
  Calendar, User, Tag, Zap
} from 'lucide-react'
import Link from 'next/link'
import { AppType, Project } from '@/types'
import type { FirestorePricingCatalogItem, FirestoreFeatureAddon } from '@/lib/firebase-schema'
import { APP_TYPE_CONFIG } from '@/components/apps/app-type-badge'
import { MOCK_CHECKLIST_TEMPLATES } from '@/lib/mock-project-data'

interface AppCredential {
  key: string
  value: string
  type: 'api_key' | 'password' | 'oauth' | 'certificate'
  masked: boolean
}

interface FeatureAddon {
  id: string
  name: string
  enabled: boolean
  pricing?: {
    amount: number
    currency: string
    interval?: 'month' | 'year' | 'one_time'
  }
}

interface PaymentInstallment {
  id: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid'
  description: string
}

export default function NewAppPage() {
  const router = useRouter()
  const { tenant } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [pricingPackages, setPricingPackages] = useState<FirestorePricingCatalogItem[]>([])
  const [featureAddons, setFeatureAddons] = useState<FirestoreFeatureAddon[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    // Basic Info
    nameEn: '',
    nameAr: '',
    type: '' as AppType | '',
    projectId: '', // NEW: Project selection
    clientId: '',
    description: '',

    // Branding
    branding: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#6366F1',
      logo: null as File | null
    },

    // Configuration
    config: {
      storeId: '',
      importantLinks: [] as { label: string; url: string }[]
    },

    // Environments
    environments: {
      dev: { url: '', apiKey: '', enabled: false },
      staging: { url: '', apiKey: '', enabled: false },
      production: { url: '', apiKey: '', enabled: true }
    },

    // Features & Pricing
    features: [] as string[],
    pricingPackage: '',
    customFeatures: [] as string[],
    selectedFeatures: [] as FeatureAddon[],

    // Contract Information
    contract: {
      contractNumber: '',
      startDate: '',
      endDate: '',
      totalValue: 0,
      currency: 'USD',
      notes: ''
    },

    // Payment Installments
    installments: [] as PaymentInstallment[],
    hasInstallments: false,

    // Credentials
    credentials: [] as AppCredential[],

    // Release Info
    release: {
      version: '1.0.0',
      buildNumber: '',
      releaseNotes: '',
      releaseDate: new Date().toISOString().split('T')[0]
    },

    // Checklist
    selectedChecklist: ''
  })

  const [newFeature, setNewFeature] = useState('')
  const [newLink, setNewLink] = useState({ label: '', url: '' })
  const [newCredential, setNewCredential] = useState({ key: '', value: '', type: 'api_key' as const })
  const [newInstallment, setNewInstallment] = useState({ amount: 0, dueDate: '', description: '' })

  // Get available addons for the selected project
  const projectAddons = formData.projectId
    ? MOCK_FEATURE_ADDONS.filter(addon => addon.projectId === formData.projectId).map(addon => ({
        id: addon.id,
        name: addon.name,
        enabled: false,
        pricing: addon.pricing
      }))
    : []

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText, required: true },
    { number: 2, title: 'App Type & Project', icon: Smartphone, required: true },
    { number: 3, title: 'Branding', icon: Palette, required: false },
    { number: 4, title: 'Configuration', icon: Settings, required: false },
    { number: 5, title: 'Environments', icon: Cloud, required: false },
    { number: 6, title: 'Features & Pricing', icon: DollarSign, required: false },
    { number: 7, title: 'Credentials', icon: Key, required: false },
    { number: 8, title: 'Release Info', icon: GitBranch, required: false },
    { number: 9, title: 'Checklist', icon: CheckSquare, required: false }
  ]

  const appTypes = Object.entries(APP_TYPE_CONFIG) as [AppType, typeof APP_TYPE_CONFIG[AppType]][]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating app:', formData)
    router.push('/dashboard/apps')
  }

  const addCustomFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        customFeatures: [...prev.customFeatures, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const addLink = () => {
    if (newLink.label && newLink.url) {
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          importantLinks: [...prev.config.importantLinks, newLink]
        }
      }))
      setNewLink({ label: '', url: '' })
    }
  }

  const addCredential = () => {
    if (newCredential.key && newCredential.value) {
      setFormData(prev => ({
        ...prev,
        credentials: [...prev.credentials, { ...newCredential, masked: true }]
      }))
      setNewCredential({ key: '', value: '', type: 'api_key' })
    }
  }

  const toggleFeature = (featureId: string) => {
    setFormData(prev => {
      const existing = prev.selectedFeatures.find(f => f.id === featureId)
      if (existing) {
        return {
          ...prev,
          selectedFeatures: prev.selectedFeatures.filter(f => f.id !== featureId)
        }
      } else {
        const feature = projectAddons.find(f => f.id === featureId)
        if (feature) {
          return {
            ...prev,
            selectedFeatures: [...prev.selectedFeatures, { ...feature, enabled: true }]
          }
        }
      }
      return prev
    })
  }

  const updateFeaturePricing = (featureId: string, pricing: { amount: number; currency: string; interval?: 'month' | 'year' | 'one_time' }) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.map(f =>
        f.id === featureId ? { ...f, pricing } : f
      )
    }))
  }

  const removeFeaturePricing = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.map(f =>
        f.id === featureId ? { ...f, pricing: undefined } : f
      )
    }))
  }

  const addInstallment = () => {
    if (newInstallment.amount > 0 && newInstallment.dueDate && newInstallment.description) {
      setFormData(prev => ({
        ...prev,
        installments: [
          ...prev.installments,
          {
            id: `inst_${Date.now()}`,
            amount: newInstallment.amount,
            dueDate: newInstallment.dueDate,
            status: 'pending' as const,
            description: newInstallment.description
          }
        ]
      }))
      setNewInstallment({ amount: 0, dueDate: '', description: '' })
    }
  }

  const canProceed = () => {
    const step = steps[currentStep - 1]
    if (!step.required) return true

    switch (currentStep) {
      case 1:
        return formData.nameEn && formData.nameAr
      case 2:
        return !!formData.type && !!formData.projectId
      default:
        return true
    }
  }

  // Load pricing packages and addons when project is selected
  useEffect(() => {
    const loadPricingData = async () => {
      if (!tenant?.id || !formData.projectId) {
        setPricingPackages([])
        setFeatureAddons([])
        return
      }

      try {
        const [packages, addons] = await Promise.all([
          PricingService.listCatalogByProject(tenant.id, formData.projectId),
          PricingService.listAddonsByProject(tenant.id, formData.projectId)
        ])
        setPricingPackages(packages)
        setFeatureAddons(addons)
      } catch (error) {
        console.error('Error loading pricing data:', error)
      }
    }

    loadPricingData()
  }, [tenant?.id, formData.projectId])

  // Get pricing packages for selected project
  const projectPricingPackages = pricingPackages

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/apps">
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New App</h1>
            <p className="text-gray-400 mt-1">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center"
        >
          <Save className="h-5 w-5 mr-2" />
          Create App
        </button>
      </div>

      {/* Progress Steps */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number

            return (
              <div key={step.number} className="flex items-center">
                <div
                  className={cn(
                    "flex flex-col items-center cursor-pointer transition-all",
                    isActive && "scale-105"
                  )}
                  onClick={() => setCurrentStep(step.number)}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all relative",
                      isCompleted && "bg-green-600",
                      isActive && "gradient-purple ring-4 ring-purple-500/30",
                      !isActive && !isCompleted && "bg-gray-800"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      (isActive || isCompleted) ? "text-white" : "text-gray-400"
                    )} />
                    {step.required && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      isActive ? "text-white" : "text-gray-400"
                    )}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2 transition-all",
                    currentStep > step.number ? "bg-green-600" : "bg-gray-700"
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                  <p className="text-sm text-gray-400">Essential details about your app</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    App Name (English) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g., TechCorp POS"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    App Name (Arabic) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: نقاط البيع تك كورب"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the app and its purpose..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: App Type & Project */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">App Type & Project</h2>
                  <p className="text-sm text-gray-400">Choose the type of application and assign to a project</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Select App Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {appTypes.map(([type, config]) => {
                    const Icon = config.icon
                    const isSelected = formData.type === type

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={cn(
                          "p-6 rounded-xl border-2 transition-all text-left hover:scale-105",
                          isSelected
                            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                            : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                          config.bg
                        )}>
                          <Icon className={cn("h-6 w-6", config.text)} />
                        </div>
                        <h3 className="font-semibold text-white mb-1">{config.label}</h3>
                        <p className="text-xs text-gray-400">{config.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select a project...</option>
                    {MOCK_PROJECTS.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a client...</option>
                    <option value="client_techcorp">TechCorp Inc.</option>
                    <option value="client_financehub">FinanceHub</option>
                    <option value="client_retailchain">RetailChain Pro</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">App Branding</h2>
                  <p className="text-sm text-gray-400">Customize your app's visual identity</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formData.branding.primaryColor}
                      onChange={(e) => setFormData({
                        ...formData,
                        branding: { ...formData.branding, primaryColor: e.target.value }
                      })}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-gray-700"
                    />
                    <input
                      type="text"
                      value={formData.branding.primaryColor}
                      onChange={(e) => setFormData({
                        ...formData,
                        branding: { ...formData.branding, primaryColor: e.target.value }
                      })}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formData.branding.secondaryColor}
                      onChange={(e) => setFormData({
                        ...formData,
                        branding: { ...formData.branding, secondaryColor: e.target.value }
                      })}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-gray-700"
                    />
                    <input
                      type="text"
                      value={formData.branding.secondaryColor}
                      onChange={(e) => setFormData({
                        ...formData,
                        branding: { ...formData.branding, secondaryColor: e.target.value }
                      })}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  App Logo
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG (max. 2MB)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Color Preview</p>
                <div className="flex gap-4">
                  <div
                    className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: formData.branding.primaryColor }}
                  >
                    Primary
                  </div>
                  <div
                    className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: formData.branding.secondaryColor }}
                  >
                    Secondary
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Configuration */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Configuration</h2>
                  <p className="text-sm text-gray-400">App-specific settings and identifiers</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Store ID / App Identifier
                </label>
                <input
                  type="text"
                  value={formData.config.storeId}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, storeId: e.target.value }
                  })}
                  placeholder="e.g., com.techcorp.pos or STORE-001"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Important Links
                </label>
                <div className="space-y-3">
                  {formData.config.importantLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                      <LinkIcon className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{link.label}</p>
                        <p className="text-xs text-gray-400 truncate">{link.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            importantLinks: formData.config.importantLinks.filter((_, i) => i !== index)
                          }
                        })}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newLink.label}
                      onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                      placeholder="Label (e.g., Admin Panel)"
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="URL"
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={addLink}
                      className="px-4 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Environments */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Environments</h2>
                  <p className="text-sm text-gray-400">Configure deployment environments</p>
                </div>
              </div>

              {(['dev', 'staging', 'production'] as const).map((env) => (
                <div key={env} className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Cloud className={cn(
                        "h-5 w-5",
                        env === 'production' ? "text-green-400" :
                        env === 'staging' ? "text-yellow-400" :
                        "text-blue-400"
                      )} />
                      <h3 className="text-lg font-semibold text-white capitalize">{env}</h3>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.environments[env].enabled}
                        onChange={(e) => setFormData({
                          ...formData,
                          environments: {
                            ...formData.environments,
                            [env]: { ...formData.environments[env], enabled: e.target.checked }
                          }
                        })}
                        className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-400">Enabled</span>
                    </label>
                  </div>

                  {formData.environments[env].enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                        <input
                          type="url"
                          value={formData.environments[env].url}
                          onChange={(e) => setFormData({
                            ...formData,
                            environments: {
                              ...formData.environments,
                              [env]: { ...formData.environments[env], url: e.target.value }
                            }
                          })}
                          placeholder={`https://${env}.example.com`}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                        <input
                          type="password"
                          value={formData.environments[env].apiKey}
                          onChange={(e) => setFormData({
                            ...formData,
                            environments: {
                              ...formData.environments,
                              [env]: { ...formData.environments[env], apiKey: e.target.value }
                            }
                          })}
                          placeholder="Optional API key"
                          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 6: Features & Pricing */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Features & Pricing</h2>
                  <p className="text-sm text-gray-400">Select features, pricing, and contract details</p>
                </div>
              </div>

              {/* Pricing Package */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Pricing Package
                </label>
                {projectPricingPackages.length > 0 ? (
                  <select
                    value={formData.pricingPackage}
                    onChange={(e) => setFormData({ ...formData, pricingPackage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a package...</option>
                    {projectPricingPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.pricing.amount}/{pkg.pricing.interval || 'one-time'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm text-yellow-400">
                      No pricing packages available for this project.
                      <Link
                        href={`/dashboard/projects/${formData.projectId}/pricing`}
                        className="underline ml-1 hover:text-yellow-300"
                      >
                        Create one first
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              {/* Multi-Select Features with Add-on Pricing */}
              <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Features & Modules</h3>
                <p className="text-sm text-gray-400 mb-4">Select features from this project's add-ons and optionally add pricing for each</p>

                {projectAddons.length === 0 && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
                    <p className="text-sm text-yellow-400">
                      No addons available for this project.{' '}
                      {formData.projectId && (
                        <Link
                          href={`/dashboard/projects/${formData.projectId}/pricing`}
                          className="underline hover:text-yellow-300"
                        >
                          Create addons first
                        </Link>
                      )}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {projectAddons.map((feature) => {
                    const isSelected = formData.selectedFeatures.some(f => f.id === feature.id)
                    const selectedFeature = formData.selectedFeatures.find(f => f.id === feature.id)

                    return (
                      <div key={feature.id} className={cn(
                        "rounded-lg border transition-all",
                        isSelected ? "bg-purple-500/10 border-purple-500/30" : "bg-gray-800/50 border-gray-700"
                      )}>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleFeature(feature.id)}
                                className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm font-medium text-white">{feature.name}</span>
                            </label>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (selectedFeature?.pricing) {
                                    removeFeaturePricing(feature.id)
                                  }
                                }}
                                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                {selectedFeature?.pricing ? 'Remove Pricing' : 'Add Pricing'}
                              </button>
                            )}
                          </div>

                          {/* Add-on Pricing */}
                          {isSelected && selectedFeature?.pricing && (
                            <div className="mt-3 grid grid-cols-3 gap-3 pl-8">
                              <input
                                type="number"
                                value={selectedFeature.pricing.amount}
                                onChange={(e) => updateFeaturePricing(feature.id, {
                                  ...selectedFeature.pricing!,
                                  amount: parseFloat(e.target.value) || 0
                                })}
                                placeholder="Amount"
                                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                              />
                              <select
                                value={selectedFeature.pricing.currency}
                                onChange={(e) => updateFeaturePricing(feature.id, {
                                  ...selectedFeature.pricing!,
                                  currency: e.target.value
                                })}
                                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                              >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="SAR">SAR</option>
                              </select>
                              <select
                                value={selectedFeature.pricing.interval || 'one_time'}
                                onChange={(e) => updateFeaturePricing(feature.id, {
                                  ...selectedFeature.pricing!,
                                  interval: e.target.value as 'month' | 'year' | 'one_time'
                                })}
                                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                              >
                                <option value="one_time">One-time</option>
                                <option value="month">Monthly</option>
                                <option value="year">Yearly</option>
                              </select>
                            </div>
                          )}

                          {/* Add Pricing Button */}
                          {isSelected && !selectedFeature?.pricing && (
                            <div className="mt-3 pl-8">
                              <button
                                type="button"
                                onClick={() => updateFeaturePricing(feature.id, {
                                  amount: 0,
                                  currency: 'USD',
                                  interval: 'month'
                                })}
                                className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                Add pricing for this feature
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected Features Summary */}
                {formData.selectedFeatures.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-sm font-medium text-white mb-2">
                      Selected: {formData.selectedFeatures.length} feature{formData.selectedFeatures.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedFeatures.map(f => (
                        <div key={f.id} className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs">
                          {f.name}
                          {f.pricing && ` (+$${f.pricing.amount}/${f.pricing.interval})`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contract Information */}
              <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contract Information</h3>
                <p className="text-sm text-gray-400 mb-4">Optional contract details for this app</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contract Number
                    </label>
                    <input
                      type="text"
                      value={formData.contract.contractNumber}
                      onChange={(e) => setFormData({
                        ...formData,
                        contract: { ...formData.contract, contractNumber: e.target.value }
                      })}
                      placeholder="e.g., CNT-2024-001"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Total Value
                      </label>
                      <input
                        type="number"
                        value={formData.contract.totalValue}
                        onChange={(e) => setFormData({
                          ...formData,
                          contract: { ...formData.contract, totalValue: parseFloat(e.target.value) || 0 }
                        })}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.contract.currency}
                        onChange={(e) => setFormData({
                          ...formData,
                          contract: { ...formData.contract, currency: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="SAR">SAR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.contract.startDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        contract: { ...formData.contract, startDate: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.contract.endDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        contract: { ...formData.contract, endDate: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contract Notes
                  </label>
                  <textarea
                    value={formData.contract.notes}
                    onChange={(e) => setFormData({
                      ...formData,
                      contract: { ...formData.contract, notes: e.target.value }
                    })}
                    placeholder="Additional contract notes..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment Installments */}
              <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Payment Installments</h3>
                    <p className="text-sm text-gray-400 mt-1">Define payment schedule if applicable</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasInstallments}
                      onChange={(e) => setFormData({ ...formData, hasInstallments: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">Has Installments</span>
                  </label>
                </div>

                {formData.hasInstallments && (
                  <>
                    {/* Existing Installments */}
                    {formData.installments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {formData.installments.map((installment, index) => (
                          <div key={installment.id} className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                            <div className="flex-1 grid grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs text-gray-400">Amount</p>
                                <p className="text-sm font-medium text-white">
                                  ${installment.amount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Due Date</p>
                                <p className="text-sm font-medium text-white">
                                  {new Date(installment.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Description</p>
                                <p className="text-sm font-medium text-white truncate">
                                  {installment.description}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                installments: formData.installments.filter((_, i) => i !== index)
                              })}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Installment */}
                    <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                      <h4 className="text-sm font-medium text-white mb-3">Add Installment</h4>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input
                          type="number"
                          value={newInstallment.amount || ''}
                          onChange={(e) => setNewInstallment({
                            ...newInstallment,
                            amount: parseFloat(e.target.value) || 0
                          })}
                          placeholder="Amount"
                          className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="date"
                          value={newInstallment.dueDate}
                          onChange={(e) => setNewInstallment({
                            ...newInstallment,
                            dueDate: e.target.value
                          })}
                          className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={newInstallment.description}
                          onChange={(e) => setNewInstallment({
                            ...newInstallment,
                            description: e.target.value
                          })}
                          placeholder="Description"
                          className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addInstallment}
                        className="w-full px-4 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Add Installment
                      </button>
                    </div>

                    {/* Installments Summary */}
                    {formData.installments.length > 0 && (
                      <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <p className="text-sm font-medium text-white">
                          Total Installments: {formData.installments.length}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Total Amount: ${formData.installments.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 7: Credentials */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Credentials</h2>
                  <p className="text-sm text-gray-400">Securely store app credentials (all optional)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <Key className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400">Security Notice</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Credentials are encrypted and masked by default. Only authorized users can view them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {formData.credentials.map((cred, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{cred.key}</p>
                        <p className="text-xs text-gray-400 capitalize">{cred.type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {cred.masked ? <Eye className="h-4 w-4 text-gray-400" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            credentials: formData.credentials.filter((_, i) => i !== index)
                          })}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 font-mono">
                      {cred.masked ? '••••••••••••' : cred.value}
                    </p>
                  </div>
                ))}

                <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700">
                  <h3 className="text-sm font-medium text-white mb-4">Add New Credential</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      value={newCredential.key}
                      onChange={(e) => setNewCredential({ ...newCredential, key: e.target.value })}
                      placeholder="Key name"
                      className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="password"
                      value={newCredential.value}
                      onChange={(e) => setNewCredential({ ...newCredential, value: e.target.value })}
                      placeholder="Value"
                      className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <select
                      value={newCredential.type}
                      onChange={(e) => setNewCredential({ ...newCredential, type: e.target.value as any })}
                      className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="api_key">API Key</option>
                      <option value="password">Password</option>
                      <option value="oauth">OAuth Token</option>
                      <option value="certificate">Certificate</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addCredential}
                    className="w-full px-4 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Credential
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Release Info */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <GitBranch className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Initial Release</h2>
                  <p className="text-sm text-gray-400">Set the first version details</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.release.version}
                    onChange={(e) => setFormData({
                      ...formData,
                      release: { ...formData.release, version: e.target.value }
                    })}
                    placeholder="1.0.0"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Build Number
                  </label>
                  <input
                    type="text"
                    value={formData.release.buildNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      release: { ...formData.release, buildNumber: e.target.value }
                    })}
                    placeholder="100"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.release.releaseDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      release: { ...formData.release, releaseDate: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Notes
                </label>
                <textarea
                  value={formData.release.releaseNotes}
                  onChange={(e) => setFormData({
                    ...formData,
                    release: { ...formData.release, releaseNotes: e.target.value }
                  })}
                  placeholder="What's new in this release..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 9: Checklist */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl gradient-purple">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Pre-launch Checklist</h2>
                  <p className="text-sm text-gray-400">Choose a checklist template (optional)</p>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_CHECKLIST_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedChecklist: template.id })}
                    className={cn(
                      "w-full p-6 rounded-xl border-2 transition-all text-left",
                      formData.selectedChecklist === template.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                        {template.description && (
                          <p className="text-sm text-gray-400">{template.description}</p>
                        )}
                      </div>
                      {formData.selectedChecklist === template.id && (
                        <CheckSquare className="h-6 w-6 text-purple-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{template.items.length} items</span>
                      <span>•</span>
                      <span>{template.items.filter(i => i.required).length} required</span>
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, selectedChecklist: '' })}
                  className={cn(
                    "w-full p-6 rounded-xl border-2 transition-all text-center",
                    !formData.selectedChecklist
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  )}
                >
                  <p className="text-white font-medium">No checklist (I'll add one later)</p>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-700">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next Step
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                Create App
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
