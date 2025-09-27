'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Settings, Package, DollarSign, Clock,
  Calendar, FileText, Tag, Zap, Globe, Shield, Users, Star,
  Plus, Minus, CheckCircle, AlertCircle, Upload, Image, Edit,
  Archive, Trash2, Eye, Copy
} from 'lucide-react'

// Mock service data
const mockService = {
  id: 'srv_001',
  name: 'Custom Web Application Development',
  description: 'Complete web application development service including frontend, backend, and database design. Perfect for businesses looking to digitize their operations.',
  category: 'Web Development',
  type: 'project',
  status: 'active',
  pricingModel: 'fixed',
  basePrice: 5000,
  currency: 'USD',
  billingCycle: 'one-time',
  setupFee: 500,
  duration: 8,
  durationUnit: 'weeks',
  deliverables: [
    'Responsive web application',
    'Admin dashboard',
    'User authentication system',
    'Database setup',
    'Deployment to cloud server'
  ],
  requirements: [
    'Project requirements document',
    'Brand guidelines and assets',
    'Content for the website',
    'Hosting account credentials'
  ],
  features: [
    'Mobile-responsive design',
    'User management',
    'Payment integration',
    'Analytics dashboard',
    'SEO optimization'
  ],
  teamSize: 3,
  skillsRequired: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'UI Design'],
  estimatedHours: 320,
  revisions: 3,
  supportPeriod: 90,
  supportPeriodUnit: 'days',
  termsAndConditions: 'This service includes 3 rounds of revisions. Additional revisions will be charged separately. Final payment is due upon project completion.',
  tags: ['Popular', 'Custom', 'Full-Stack'],
  isPublic: true,
  isFeatured: true,
  createdAt: '2024-01-15',
  lastModified: '2024-03-20',
  ordersCount: 12,
  rating: 4.8,
  revenue: 60000
}

interface ServiceFormData {
  name: string
  description: string
  category: string
  type: string
  status: string
  pricingModel: string
  basePrice: number
  currency: string
  billingCycle: string
  setupFee: number
  duration: number
  durationUnit: string
  deliverables: string[]
  requirements: string[]
  features: string[]
  teamSize: number
  skillsRequired: string[]
  estimatedHours: number
  revisions: number
  supportPeriod: number
  supportPeriodUnit: string
  termsAndConditions: string
  tags: string[]
  isPublic: boolean
  isFeatured: boolean
}

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>({
    name: mockService.name,
    description: mockService.description,
    category: mockService.category,
    type: mockService.type,
    status: mockService.status,
    pricingModel: mockService.pricingModel,
    basePrice: mockService.basePrice,
    currency: mockService.currency,
    billingCycle: mockService.billingCycle,
    setupFee: mockService.setupFee,
    duration: mockService.duration,
    durationUnit: mockService.durationUnit,
    deliverables: mockService.deliverables,
    requirements: mockService.requirements,
    features: mockService.features,
    teamSize: mockService.teamSize,
    skillsRequired: mockService.skillsRequired,
    estimatedHours: mockService.estimatedHours,
    revisions: mockService.revisions,
    supportPeriod: mockService.supportPeriod,
    supportPeriodUnit: mockService.supportPeriodUnit,
    termsAndConditions: mockService.termsAndConditions,
    tags: mockService.tags,
    isPublic: mockService.isPublic,
    isFeatured: mockService.isFeatured
  })

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
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps', 'PostgreSQL'
  ]

  const availableTags = [
    'Popular', 'New', 'Premium', 'Quick Delivery', 'Custom',
    'Enterprise', 'Startup Friendly', 'Best Seller', 'Featured'
  ]

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: FileText },
    { id: 'pricing', label: 'Pricing & Terms', icon: DollarSign },
    { id: 'details', label: 'Details & Features', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: Package },
    { id: 'settings', label: 'Service Settings', icon: Shield }
  ]

  const handleSave = () => {
    console.log('Updating service:', formData)
    router.push(`/dashboard/services/${params.id}`)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      router.push('/dashboard/services')
    }, 1000)
  }

  const handleDuplicate = () => {
    console.log('Duplicating service...')
    router.push('/dashboard/services/new?duplicate=' + params.id)
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/services/${params.id}`}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Service</h1>
            <p className="text-gray-400">Update service information and settings</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/dashboard/services/${params.id}`)}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleDuplicate}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Service Stats */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total Orders</span>
                <span className="text-sm font-medium text-white">{mockService.ordersCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-white">{mockService.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Revenue</span>
                <span className="text-sm font-medium text-green-400">${(mockService.revenue / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Service Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Current Image</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload New</span>
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Terms Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Pricing & Terms</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pricing Model</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Base Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Setup Fee</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.setupFee}
                      onChange={(e) => setFormData({ ...formData, setupFee: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Revisions</label>
                  <input
                    type="number"
                    value={formData.revisions}
                    onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Hours</label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Support Period</label>
                <div className="flex space-x-2 max-w-md">
                  <input
                    type="number"
                    value={formData.supportPeriod}
                    onChange={(e) => setFormData({ ...formData, supportPeriod: parseInt(e.target.value) || 0 })}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Terms & Conditions</label>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Details & Features Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Service Details & Features</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Deliverables</label>
                <div className="space-y-2">
                  {formData.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={deliverable}
                        onChange={(e) => updateListItem('deliverables', index, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => updateListItem('requirements', index, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Key Features</label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateListItem('features', index, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
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
                <h3 className="text-lg font-medium text-white mb-4">Team & Skills</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                  <input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
                    className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Skills Required</label>
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Service Analytics</h2>

              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gray-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg gradient-blue">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">{mockService.ordersCount}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                </div>

                <div className="p-6 rounded-xl bg-gray-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg gradient-green">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">${(mockService.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                </div>

                <div className="p-6 rounded-xl bg-gray-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg gradient-yellow">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">{mockService.rating}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Average Rating</p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gray-800/30">
                <h3 className="text-lg font-medium text-white mb-4">Performance Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Conversion Rate</span>
                    <span className="text-white font-medium">24%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg. Order Value</span>
                    <span className="text-white font-medium">${(mockService.revenue / mockService.ordersCount).toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Customer Satisfaction</span>
                    <span className="text-green-400 font-medium">96%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Completion Time</span>
                    <span className="text-white font-medium">7.2 weeks avg</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gray-800/30">
                  <h3 className="text-lg font-medium text-white mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {[
                      { client: 'TechCorp', date: '2024-03-18', amount: 5000 },
                      { client: 'StartupXYZ', date: '2024-03-15', amount: 4500 },
                      { client: 'Enterprise Co', date: '2024-03-12', amount: 5500 }
                    ].map((order, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{order.client}</p>
                          <p className="text-xs text-gray-400">{order.date}</p>
                        </div>
                        <span className="text-green-400 font-medium">${order.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gray-800/30">
                  <h3 className="text-lg font-medium text-white mb-4">Customer Feedback</h3>
                  <div className="space-y-3">
                    {[
                      { rating: 5, comment: 'Excellent work, delivered on time' },
                      { rating: 5, comment: 'Great communication throughout' },
                      { rating: 4, comment: 'Good quality, minor revisions needed' }
                    ].map((feedback, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Service Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Service Tags</label>
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                    <div>
                      <p className="text-white font-medium">Public Service</p>
                      <p className="text-sm text-gray-400">Make this service publicly available for purchase</p>
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

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                    <div>
                      <p className="text-white font-medium">Featured Service</p>
                      <p className="text-sm text-gray-400">Highlight this service in listings and search results</p>
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

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                      <div>
                        <p className="text-white font-medium">Archive Service</p>
                        <p className="text-sm text-gray-400">Hide this service from active listings</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center space-x-2">
                        <Archive className="h-4 w-4" />
                        <span>Archive</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                      <div>
                        <p className="text-white font-medium">Delete Service</p>
                        <p className="text-sm text-gray-400">Permanently delete this service and all associated data</p>
                      </div>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}