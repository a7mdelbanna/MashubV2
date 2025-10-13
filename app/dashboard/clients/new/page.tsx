'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowRight, Building2, User, Mail, Phone,
  Globe, MapPin, FileText, Plus, X, Check, DollarSign,
  Calendar, CreditCard, Tag, Settings, Upload
} from 'lucide-react'
import Link from 'next/link'
import Select from '@/components/ui/select'
import {
  industryOptions,
  currencyOptions,
  paymentTermsOptions,
  billingCycleOptions,
  communicationMethodOptions,
  timezoneOptions,
  languageOptions
} from '@/lib/select-options'

interface ClientFormData {
  // Basic Information
  name: string
  industry: string
  website: string
  description: string
  logo: string

  // Contact Information
  email: string
  phone: string
  fax: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }

  // Primary Contact
  primaryContact: {
    name: string
    role: string
    email: string
    phone: string
  }

  // Financial Information
  creditLimit: number
  paymentTerms: string
  billingCycle: string
  taxId: string
  currency: string

  // Settings
  tier: string
  status: string
  tags: string[]
  preferences: {
    communication: string
    timezone: string
    language: string
  }
}

export default function NewClientPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    industry: '',
    website: '',
    description: '',
    logo: '',
    email: '',
    phone: '',
    fax: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    primaryContact: {
      name: '',
      role: '',
      email: '',
      phone: ''
    },
    creditLimit: 50000,
    paymentTerms: 'net-30',
    billingCycle: 'monthly',
    taxId: '',
    currency: 'USD',
    tier: 'starter',
    status: 'active',
    tags: [],
    preferences: {
      communication: 'email',
      timezone: 'America/New_York',
      language: 'en'
    }
  })

  const steps = [
    { id: 1, name: 'Basic Info', icon: Building2 },
    { id: 2, name: 'Contact', icon: User },
    { id: 3, name: 'Financial', icon: DollarSign },
    { id: 4, name: 'Settings', icon: Settings }
  ]

  const tierOptions = [
    { value: 'starter', label: 'Starter', description: 'Basic features and support' },
    { value: 'professional', label: 'Professional', description: 'Advanced features and priority support' },
    { value: 'enterprise', label: 'Enterprise', description: 'Full features and dedicated support' }
  ]

  const availableTags = [
    'Priority', 'Long-term', 'New Client', 'VIP', 'Strategic Partner',
    'High Volume', 'Tech Sector', 'Enterprise', 'SMB'
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit form
      console.log('Submitting client data:', formData)
      router.push('/dashboard/clients')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/clients">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Client</h1>
          <p className="text-gray-400">Create a new client profile</p>
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
                  <div className="ml-3">
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <Select
                  label="Industry"
                  required={true}
                  options={industryOptions}
                  value={formData.industry}
                  onChange={(value) => setFormData({ ...formData, industry: value })}
                  placeholder="Select industry"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="www.example.com"
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
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Brief description of the client's business"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                  Upload Logo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Address</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Street Address"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="State/Province"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.address.zip}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, zip: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="ZIP/Postal Code"
                  />
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Primary Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.primaryContact.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    primaryContact: { ...formData.primaryContact, name: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Contact Name"
                />
                <input
                  type="text"
                  value={formData.primaryContact.role}
                  onChange={(e) => setFormData({
                    ...formData,
                    primaryContact: { ...formData.primaryContact, role: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Role/Title"
                />
                <input
                  type="email"
                  value={formData.primaryContact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    primaryContact: { ...formData.primaryContact, email: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Email Address"
                />
                <input
                  type="tel"
                  value={formData.primaryContact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    primaryContact: { ...formData.primaryContact, phone: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Phone Number"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Financial Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Financial Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credit Limit
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={formData.currency}
                  onChange={(value) => setFormData({ ...formData, currency: value })}
                />
              </div>

              <div>
                <Select
                  label="Payment Terms"
                  options={paymentTermsOptions}
                  value={formData.paymentTerms}
                  onChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                />
              </div>

              <div>
                <Select
                  label="Billing Cycle"
                  options={billingCycleOptions}
                  value={formData.billingCycle}
                  onChange={(value) => setFormData({ ...formData, billingCycle: value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tax ID / VAT Number
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Enter tax identification number"
              />
            </div>
          </div>
        )}

        {/* Step 4: Settings */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Settings & Preferences</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Client Tier
              </label>
              <div className="grid grid-cols-3 gap-4">
                {tierOptions.map(tier => (
                  <button
                    key={tier.value}
                    onClick={() => setFormData({ ...formData, tier: tier.value })}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      formData.tier === tier.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                    )}
                  >
                    <p className={cn(
                      "font-medium mb-1",
                      formData.tier === tier.value ? "text-purple-400" : "text-white"
                    )}>
                      {tier.label}
                    </p>
                    <p className="text-sm text-gray-400">{tier.description}</p>
                  </button>
                ))}
              </div>
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
                      onClick={() => toggleTag(tag)}
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

            <div className="grid grid-cols-3 gap-6">
              <div>
                <Select
                  label="Preferred Communication"
                  options={communicationMethodOptions}
                  value={formData.preferences.communication}
                  onChange={(value) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, communication: value }
                  })}
                />
              </div>

              <div>
                <Select
                  label="Timezone"
                  options={timezoneOptions}
                  value={formData.preferences.timezone}
                  onChange={(value) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, timezone: value }
                  })}
                />
              </div>

              <div>
                <Select
                  label="Language"
                  options={languageOptions}
                  value={formData.preferences.language}
                  onChange={(value) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, language: value }
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-white">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-white">Inactive</span>
                </label>
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
            {currentStep === 4 ? 'Create Client' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}