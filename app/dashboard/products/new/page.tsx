'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowRight, Package, Settings, DollarSign,
  FileText, Upload, X, Check, Plus, Star, Shield,
  Globe, Code, Database, Cloud, Smartphone, Tag,
  Image, Camera, Monitor, Target, Users, Zap,
  TrendingUp, Clock, AlertCircle, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import Select from '@/components/ui/select'
import { productCategoryOptions, pricingModelOptions, currencyOptions } from '@/lib/select-options'

interface ProductFormData {
  // Basic Information
  name: string
  description: string
  shortDescription: string
  category: string
  type: string
  status: string
  tags: string[]

  // Media & Branding
  logo: string
  images: string[]
  videos: string[]
  screenshots: string[]
  demoUrl: string
  website: string

  // Pricing & Packages
  pricingModel: string
  currency: string
  packages: Array<{
    name: string
    price: number
    monthlyPrice: number
    description: string
    features: string[]
    popular: boolean
    duration: string
    support: string
  }>

  // Technical Details
  technologies: string[]
  platforms: string[]
  integrations: string[]
  requirements: {
    system: string[]
    software: string[]
    hardware: string[]
  }
  version: string
  lastUpdated: string

  // SEO & Marketing
  seoTitle: string
  seoDescription: string
  metaKeywords: string[]
  marketingCopy: string
  features: string[]
  benefits: string[]
  targetAudience: string[]

  // Settings
  visibility: string
  availability: string
  supportLevel: string
  documentation: boolean
  trial: boolean
  trialDuration: number
  refundPolicy: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProductFormData>({
    // Basic Information
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    type: 'software',
    status: 'draft',
    tags: [],

    // Media & Branding
    logo: '',
    images: [],
    videos: [],
    screenshots: [],
    demoUrl: '',
    website: '',

    // Pricing & Packages
    pricingModel: 'subscription',
    currency: 'USD',
    packages: [
      {
        name: 'Starter',
        price: 299,
        monthlyPrice: 29,
        description: 'Perfect for small businesses',
        features: [],
        popular: false,
        duration: 'Monthly',
        support: 'Email'
      },
      {
        name: 'Professional',
        price: 599,
        monthlyPrice: 59,
        description: 'For growing businesses',
        features: [],
        popular: true,
        duration: 'Monthly',
        support: 'Priority'
      },
      {
        name: 'Enterprise',
        price: 1299,
        monthlyPrice: 129,
        description: 'For large organizations',
        features: [],
        popular: false,
        duration: 'Monthly',
        support: '24/7'
      }
    ],

    // Technical Details
    technologies: [],
    platforms: [],
    integrations: [],
    requirements: {
      system: [],
      software: [],
      hardware: []
    },
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],

    // SEO & Marketing
    seoTitle: '',
    seoDescription: '',
    metaKeywords: [],
    marketingCopy: '',
    features: [],
    benefits: [],
    targetAudience: [],

    // Settings
    visibility: 'public',
    availability: 'available',
    supportLevel: 'standard',
    documentation: true,
    trial: false,
    trialDuration: 14,
    refundPolicy: '30-day'
  })

  const steps = [
    { id: 1, name: 'Basic Info', icon: Package },
    { id: 2, name: 'Media & Assets', icon: Image },
    { id: 3, name: 'Pricing & Packages', icon: DollarSign },
    { id: 4, name: 'Technical Details', icon: Code },
    { id: 5, name: 'Marketing & SEO', icon: Target },
    { id: 6, name: 'Settings & Review', icon: Settings }
  ]

  // Mock data
  const categories = [
    'SaaS Platform', 'Mobile App', 'Desktop Software', 'Web Application',
    'POS System', 'CRM Software', 'E-commerce Platform', 'Analytics Tool',
    'Marketing Tool', 'Development Tool', 'Design Software', 'Security Tool'
  ]

  // Select options for custom dropdowns
  const categorySelectOptions = categories.map(cat => ({ value: cat, label: cat }))

  const visibilityOptions = [
    { value: 'public', label: 'Public - Visible to everyone' },
    { value: 'private', label: 'Private - Visible to team only' },
    { value: 'unlisted', label: 'Unlisted - Accessible via direct link' }
  ]

  const availabilityOptions = [
    { value: 'available', label: 'Available for Purchase' },
    { value: 'coming-soon', label: 'Coming Soon' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'discontinued', label: 'Discontinued' }
  ]

  const supportLevelOptions = [
    { value: 'basic', label: 'Basic Support' },
    { value: 'standard', label: 'Standard Support' },
    { value: 'premium', label: 'Premium Support' },
    { value: 'enterprise', label: 'Enterprise Support' }
  ]

  const refundPolicyOptions = [
    { value: '30-day', label: '30-day Money Back' },
    { value: '14-day', label: '14-day Money Back' },
    { value: '7-day', label: '7-day Money Back' },
    { value: 'no-refund', label: 'No Refunds' }
  ]

  const productTypes = [
    { value: 'software', label: 'Software Product', description: 'Digital software solution' },
    { value: 'platform', label: 'Platform/SaaS', description: 'Cloud-based platform' },
    { value: 'mobile-app', label: 'Mobile Application', description: 'iOS/Android application' },
    { value: 'web-app', label: 'Web Application', description: 'Browser-based application' },
    { value: 'plugin', label: 'Plugin/Extension', description: 'Third-party integration' }
  ]

  const availableTechnologies = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Python',
    'Django', 'Laravel', 'Ruby on Rails', 'Java', 'C#', '.NET',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'Azure',
    'Google Cloud', 'Docker', 'Kubernetes', 'GraphQL', 'REST API'
  ]

  const availablePlatforms = [
    'Web Browser', 'Windows', 'macOS', 'Linux', 'iOS', 'Android',
    'Chrome Extension', 'Firefox Extension', 'Safari Extension',
    'WordPress', 'Shopify', 'Salesforce', 'HubSpot'
  ]

  const availableIntegrations = [
    'Stripe', 'PayPal', 'QuickBooks', 'Xero', 'Mailchimp', 'SendGrid',
    'Twilio', 'Slack', 'Microsoft Teams', 'Google Workspace',
    'Zoom', 'Calendly', 'Zapier', 'Make', 'Google Analytics'
  ]

  const availableTags = [
    'Productivity', 'Business', 'Marketing', 'Sales', 'Finance',
    'Communication', 'Design', 'Development', 'Analytics', 'Security',
    'E-commerce', 'Education', 'Healthcare', 'Real Estate', 'Retail'
  ]

  const targetAudiences = [
    'Small Businesses', 'Medium Businesses', 'Enterprise', 'Startups',
    'Freelancers', 'Agencies', 'Developers', 'Designers', 'Marketers',
    'Sales Teams', 'HR Teams', 'Finance Teams', 'Students', 'Educators'
  ]

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit form
      console.log('Creating product:', formData)
      router.push('/dashboard/products')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleArrayItem = (array: string[], item: string, setter: (value: any) => void) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
    setter(newArray)
  }

  const addFeature = (packageIndex: number) => {
    const newPackages = [...formData.packages]
    newPackages[packageIndex].features.push('')
    setFormData({ ...formData, packages: newPackages })
  }

  const updateFeature = (packageIndex: number, featureIndex: number, value: string) => {
    const newPackages = [...formData.packages]
    newPackages[packageIndex].features[featureIndex] = value
    setFormData({ ...formData, packages: newPackages })
  }

  const removeFeature = (packageIndex: number, featureIndex: number) => {
    const newPackages = [...formData.packages]
    newPackages[packageIndex].features.splice(featureIndex, 1)
    setFormData({ ...formData, packages: newPackages })
  }

  const addItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], '']
    }))
  }

  const updateItem = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].map((item: string, i: number) => i === index ? value : item)
    }))
  }

  const removeItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
    }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/products">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Product</h1>
          <p className="text-gray-400">Build and launch your next digital product</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    isActive ? "gradient-purple" :
                    isCompleted ? "gradient-green" :
                    "bg-gray-800"
                  )}>
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-white" : "text-gray-400"
                      )} />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={cn(
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-gray-400"
                    )}>
                      Step {step.id}
                    </p>
                    <p className={cn(
                      "text-xs",
                      isActive ? "text-purple-400" : "text-gray-500"
                    )}>
                      {step.name}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4",
                    isCompleted ? "bg-purple-500" : "bg-gray-800"
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Select
                  label="Category"
                  required
                  options={categorySelectOptions}
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder="Select category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="1.0.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Product Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      formData.type === type.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                    )}
                  >
                    <p className={cn(
                      "font-medium mb-1",
                      formData.type === type.value ? "text-purple-400" : "text-white"
                    )}>
                      {type.label}
                    </p>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Brief one-line description (max 120 characters)"
                maxLength={120}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/120 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Detailed description of your product, its features, and benefits"
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => {
                  const isSelected = formData.tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleArrayItem(formData.tags, tag, (tags) => setFormData({ ...formData, tags }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Media & Assets */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Media & Assets</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Product Logo
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-2">Drop your logo here or click to browse</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB (recommended: 512x512px)</p>
                  <button className="mt-4 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                    Upload Logo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Product Screenshots
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-2">Upload product screenshots</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB each (recommended: 1920x1080px)</p>
                  <button className="mt-4 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                    Add Screenshots
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Demo URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="https://demo.yourproduct.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="https://www.yourproduct.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Product Images Gallery
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(index => (
                  <div key={index} className="aspect-square border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Add Image</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Packages */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Pricing & Packages</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <Select
                  label="Pricing Model"
                  required
                  options={pricingModelOptions}
                  value={formData.pricingModel}
                  onChange={(value) => setFormData({ ...formData, pricingModel: value })}
                  placeholder="Select pricing model"
                />
              </div>

              <div>
                <Select
                  label="Currency"
                  required
                  options={currencyOptions}
                  value={formData.currency}
                  onChange={(value) => setFormData({ ...formData, currency: value })}
                  placeholder="Select currency"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Pricing Packages</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {formData.packages.map((pkg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-2xl backdrop-blur-xl border p-6 relative",
                      pkg.popular
                        ? "bg-purple-900/20 border-purple-500"
                        : "bg-gray-800/30 border-gray-700"
                    )}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full gradient-purple text-white text-sm font-medium">
                          Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => {
                          const newPackages = [...formData.packages]
                          newPackages[index].name = e.target.value
                          setFormData({ ...formData, packages: newPackages })
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-lg font-bold mb-3"
                        placeholder="Package name"
                      />

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs text-gray-400">One-time Price</label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              value={pkg.price}
                              onChange={(e) => {
                                const newPackages = [...formData.packages]
                                newPackages[index].price = parseFloat(e.target.value) || 0
                                setFormData({ ...formData, packages: newPackages })
                              }}
                              className="w-full pl-8 pr-2 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Monthly Price</label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              value={pkg.monthlyPrice}
                              onChange={(e) => {
                                const newPackages = [...formData.packages]
                                newPackages[index].monthlyPrice = parseFloat(e.target.value) || 0
                                setFormData({ ...formData, packages: newPackages })
                              }}
                              className="w-full pl-8 pr-2 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <textarea
                        value={pkg.description}
                        onChange={(e) => {
                          const newPackages = [...formData.packages]
                          newPackages[index].description = e.target.value
                          setFormData({ ...formData, packages: newPackages })
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm resize-none"
                        placeholder="Package description"
                        rows={2}
                      />
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Features</label>
                        <button
                          onClick={() => addFeature(index)}
                          className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {pkg.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                              className="flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white text-sm"
                              placeholder="Feature description"
                            />
                            <button
                              onClick={() => removeFeature(index, featureIndex)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={pkg.popular}
                          onChange={(e) => {
                            const newPackages = [...formData.packages]
                            newPackages[index].popular = e.target.checked
                            setFormData({ ...formData, packages: newPackages })
                          }}
                          className="mr-2"
                        />
                        <span className="text-gray-300">Popular</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Technical Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Technical Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTechnologies.map(tech => {
                  const isSelected = formData.technologies.includes(tech)
                  return (
                    <button
                      key={tech}
                      onClick={() => toggleArrayItem(formData.technologies, tech, (technologies) => setFormData({ ...formData, technologies }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {tech}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Supported Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.map(platform => {
                  const isSelected = formData.platforms.includes(platform)
                  return (
                    <button
                      key={platform}
                      onClick={() => toggleArrayItem(formData.platforms, platform, (platforms) => setFormData({ ...formData, platforms }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {platform}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Available Integrations
              </label>
              <div className="flex flex-wrap gap-2">
                {availableIntegrations.map(integration => {
                  const isSelected = formData.integrations.includes(integration)
                  return (
                    <button
                      key={integration}
                      onClick={() => toggleArrayItem(formData.integrations, integration, (integrations) => setFormData({ ...formData, integrations }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {integration}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">System Requirements</label>
                  <button
                    onClick={() => addItem('requirements.system')}
                    className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.system.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => {
                          const newReqs = [...formData.requirements.system]
                          newReqs[index] = e.target.value
                          setFormData({
                            ...formData,
                            requirements: { ...formData.requirements, system: newReqs }
                          })
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                        placeholder="e.g., Windows 10+"
                      />
                      <button
                        onClick={() => {
                          const newReqs = formData.requirements.system.filter((_, i) => i !== index)
                          setFormData({
                            ...formData,
                            requirements: { ...formData.requirements, system: newReqs }
                          })
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">Software Requirements</label>
                  <button
                    onClick={() => addItem('requirements.software')}
                    className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.software.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => {
                          const newReqs = [...formData.requirements.software]
                          newReqs[index] = e.target.value
                          setFormData({
                            ...formData,
                            requirements: { ...formData.requirements, software: newReqs }
                          })
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                        placeholder="e.g., Chrome Browser"
                      />
                      <button
                        onClick={() => {
                          const newReqs = formData.requirements.software.filter((_, i) => i !== index)
                          setFormData({
                            ...formData,
                            requirements: { ...formData.requirements, software: newReqs }
                          })
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">Hardware Requirements</label>
                  <button
                    onClick={() => addItem('requirements.hardware')}
                    className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.hardware.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => {
                          const newReqs = [...formData.requirements.hardware]
                          newReqs[index] = e.target.value
                          setFormData({
                            ...formData,
                            requirements: { ...formData.requirements, hardware: newReqs }
                          })
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                        placeholder="e.g., 4GB RAM minimum"
                      />
                      <button
                        onClick={() => {
                          const newReqs = formData.requirements.hardware.filter((_, i) => i !== index)
                          setFormData({
                            ...formData,
                            requirements: { ...formData.requirements, hardware: newReqs }
                          })
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Marketing & SEO */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Marketing & SEO</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="SEO optimized title (max 60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  placeholder="Enter keywords separated by commas"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="SEO meta description (max 160 characters)"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Marketing Copy
              </label>
              <textarea
                value={formData.marketingCopy}
                onChange={(e) => setFormData({ ...formData, marketingCopy: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Compelling marketing copy for your product landing page"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">Key Features</label>
                  <button
                    onClick={() => addItem('features')}
                    className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateItem('features', index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                        placeholder="Feature description"
                      />
                      <button
                        onClick={() => removeItem('features', index)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">Key Benefits</label>
                  <button
                    onClick={() => addItem('benefits')}
                    className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateItem('benefits', index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                        placeholder="Benefit description"
                      />
                      <button
                        onClick={() => removeItem('benefits', index)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Target Audience
              </label>
              <div className="flex flex-wrap gap-2">
                {targetAudiences.map(audience => {
                  const isSelected = formData.targetAudience.includes(audience)
                  return (
                    <button
                      key={audience}
                      onClick={() => toggleArrayItem(formData.targetAudience, audience, (targetAudience) => setFormData({ ...formData, targetAudience }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-orange-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {audience}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Settings & Review */}
        {currentStep === 6 && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white mb-6">Settings & Review</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Product Visibility"
                  options={visibilityOptions}
                  value={formData.visibility}
                  onChange={(value) => setFormData({ ...formData, visibility: value })}
                  placeholder="Select visibility"
                />
              </div>

              <div>
                <Select
                  label="Availability Status"
                  options={availabilityOptions}
                  value={formData.availability}
                  onChange={(value) => setFormData({ ...formData, availability: value })}
                  placeholder="Select availability"
                />
              </div>

              <div>
                <Select
                  label="Support Level"
                  options={supportLevelOptions}
                  value={formData.supportLevel}
                  onChange={(value) => setFormData({ ...formData, supportLevel: value })}
                  placeholder="Select support level"
                />
              </div>

              <div>
                <Select
                  label="Refund Policy"
                  options={refundPolicyOptions}
                  value={formData.refundPolicy}
                  onChange={(value) => setFormData({ ...formData, refundPolicy: value })}
                  placeholder="Select refund policy"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.trial}
                    onChange={(e) => setFormData({ ...formData, trial: e.target.checked })}
                    className="mr-3"
                  />
                  <span className="text-white">Offer Free Trial</span>
                </label>

                {formData.trial && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Trial Duration (days)
                    </label>
                    <input
                      type="number"
                      value={formData.trialDuration}
                      onChange={(e) => setFormData({ ...formData, trialDuration: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      min="1"
                      max="90"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.documentation}
                    onChange={(e) => setFormData({ ...formData, documentation: e.target.checked })}
                    className="mr-3"
                  />
                  <span className="text-white">Include Documentation</span>
                </label>
              </div>
            </div>

            {/* Product Summary */}
            <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Product Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Product Name:</span>
                  <span className="text-white ml-2">{formData.name || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-2">{formData.category || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2 capitalize">{formData.type.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-400">Pricing Model:</span>
                  <span className="text-white ml-2 capitalize">{formData.pricingModel.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-400">Packages:</span>
                  <span className="text-white ml-2">{formData.packages.length} configured</span>
                </div>
                <div>
                  <span className="text-gray-400">Technologies:</span>
                  <span className="text-white ml-2">{formData.technologies.length} selected</span>
                </div>
                <div>
                  <span className="text-gray-400">Platforms:</span>
                  <span className="text-white ml-2">{formData.platforms.length} supported</span>
                </div>
                <div>
                  <span className="text-gray-400">Visibility:</span>
                  <span className="text-white ml-2 capitalize">{formData.visibility}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
              currentStep === 1
                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            {currentStep === 6 ? 'Create Product' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}