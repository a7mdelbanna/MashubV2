'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Settings, Package, DollarSign, Clock,
  Calendar, FileText, Tag, Zap, Globe, Shield, Users, Star,
  Plus, Minus, CheckCircle, AlertCircle, Upload, Image
} from 'lucide-react'

interface ServiceFormData {
  // Basic Information
  name: string
  description: string
  category: string
  type: string
  status: string

  // Pricing
  pricingModel: string
  basePrice: number
  currency: string
  billingCycle: string
  setupFee: number

  // Service Details
  duration: number
  durationUnit: string
  deliverables: string[]
  requirements: string[]
  features: string[]

  // Resources
  teamSize: number
  skillsRequired: string[]
  estimatedHours: number

  // Terms & Conditions
  revisions: number
  supportPeriod: number
  supportPeriodUnit: string
  termsAndConditions: string

  // Metadata
  tags: string[]
  isPublic: boolean
  isFeatured: boolean
}

export default function NewServicePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    type: 'project',
    status: 'draft',
    pricingModel: 'fixed',
    basePrice: 0,
    currency: 'USD',
    billingCycle: 'one-time',
    setupFee: 0,
    duration: 1,
    durationUnit: 'weeks',
    deliverables: [''],
    requirements: [''],
    features: [''],
    teamSize: 1,
    skillsRequired: [],
    estimatedHours: 40,
    revisions: 3,
    supportPeriod: 30,
    supportPeriodUnit: 'days',
    termsAndConditions: '',
    tags: [],
    isPublic: false,
    isFeatured: false
  })

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Pricing & Terms', icon: DollarSign },
    { id: 3, title: 'Details & Features', icon: Settings },
    { id: 4, title: 'Review & Publish', icon: CheckCircle }
  ]

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Digital Marketing',
    'Content Creation',
    'Consulting',
    'Data Analysis',
    'Cloud Services',
    'DevOps',
    'Custom Software'
  ]

  const skillOptions = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java',
    'UI Design', 'UX Research', 'Figma', 'Adobe Creative Suite',
    'SEO', 'Google Ads', 'Social Media', 'Content Writing',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps'
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log('Creating service:', formData)
    router.push('/dashboard/services')
  }

  const addListItem = (field: keyof ServiceFormData) => {
    const currentArray = formData[field] as string[]
    setFormData({
      ...formData,
      [field]: [...currentArray, '']
    })
  }

  const removeListItem = (field: keyof ServiceFormData, index: number) => {
    const currentArray = formData[field] as string[]
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index)
    })
  }

  const updateListItem = (field: keyof ServiceFormData, index: number, value: string) => {
    const currentArray = formData[field] as string[]
    const updatedArray = [...currentArray]
    updatedArray[index] = value
    setFormData({
      ...formData,
      [field]: updatedArray
    })
  }

  const toggleSkill = (skill: string) => {
    const skills = formData.skillsRequired
    if (skills.includes(skill)) {
      setFormData({
        ...formData,
        skillsRequired: skills.filter(s => s !== skill)
      })
    } else {
      setFormData({
        ...formData,
        skillsRequired: [...skills, skill]
      })
    }
  }

  const toggleTag = (tag: string) => {
    const tags = formData.tags
    if (tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: tags.filter(t => t !== tag)
      })
    } else {
      setFormData({
        ...formData,
        tags: [...tags, tag]
      })
    }
  }

  const availableTags = [
    'Popular', 'New', 'Premium', 'Quick Delivery', 'Custom',
    'Enterprise', 'Startup Friendly', 'Best Seller', 'Featured'
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/services">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Service</h1>
          <p className="text-gray-400">Define your service offering and pricing</p>
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'gradient-purple' :
                    isCompleted ? 'gradient-green' :
                    'bg-gray-800'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      Step {step.id}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-purple-500' : 'bg-gray-800'
                  }`} />
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

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Enter service name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="project">One-time Project</option>
                  <option value="recurring">Recurring Service</option>
                  <option value="consultation">Consultation</option>
                  <option value="retainer">Retainer</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                  placeholder="Describe your service offering"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Duration
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="Duration"
                  />
                  <select
                    value={formData.durationUnit}
                    onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Upload Image</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Choose File</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Terms */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Pricing & Terms</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pricing Model *
                </label>
                <select
                  value={formData.pricingModel}
                  onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="milestone">Milestone-based</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Billing Cycle
                </label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="one-time">One-time Payment</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Setup Fee (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.setupFee}
                    onChange={(e) => setFormData({ ...formData, setupFee: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Included Revisions
                </label>
                <input
                  type="number"
                  value={formData.revisions}
                  onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="3"
                />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Support & Warranty</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Support Period
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.supportPeriod}
                      onChange={(e) => setFormData({ ...formData, supportPeriod: parseInt(e.target.value) || 0 })}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="30"
                    />
                    <select
                      value={formData.supportPeriodUnit}
                      onChange={(e) => setFormData({ ...formData, supportPeriodUnit: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="40"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Terms & Conditions
              </label>
              <textarea
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Enter terms and conditions for this service"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 3: Details & Features */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Service Details & Features</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deliverables
              </label>
              <div className="space-y-2">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => updateListItem('deliverables', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Enter deliverable"
                    />
                    {formData.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('deliverables', index)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('deliverables')}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Deliverable</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requirements
              </label>
              <div className="space-y-2">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => updateListItem('requirements', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Enter requirement"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('requirements', index)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('requirements')}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Requirement</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Features
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateListItem('features', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Enter feature"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('features', index)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('features')}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Feature</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Required Skills & Team</h3>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Size
                  </label>
                  <input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Skills Required
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => {
                    const isSelected = formData.skillsRequired.includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Publish */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Review & Publish</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Service Overview</h3>
                  <div className="p-4 rounded-lg bg-gray-800/30">
                    <p className="text-white font-medium">{formData.name || 'Untitled Service'}</p>
                    <p className="text-sm text-gray-400">{formData.category}</p>
                    <p className="text-sm text-gray-400 mt-2">{formData.description || 'No description provided'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Pricing</h3>
                  <div className="p-4 rounded-lg bg-gray-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Base Price</span>
                      <span className="text-white font-medium">${formData.basePrice} {formData.currency}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Pricing Model</span>
                      <span className="text-white">{formData.pricingModel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Billing Cycle</span>
                      <span className="text-white">{formData.billingCycle}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Service Details</h3>
                  <div className="p-4 rounded-lg bg-gray-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{formData.duration} {formData.durationUnit}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Revisions</span>
                      <span className="text-white">{formData.revisions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Support Period</span>
                      <span className="text-white">{formData.supportPeriod} {formData.supportPeriodUnit}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Public Service</p>
                        <p className="text-sm text-gray-400">Make this service publicly available</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPublic}
                          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Featured Service</p>
                        <p className="text-sm text-gray-400">Highlight this service in listings</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = formData.tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-green-400 font-medium">Ready to create service</p>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Your service will be created with the status "{formData.status}". You can modify it later.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              currentStep === 1
                ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            {currentStep === 4 ? (
              <>
                <Save className="h-4 w-4" />
                Create Service
              </>
            ) : (
              <>
                Next
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}