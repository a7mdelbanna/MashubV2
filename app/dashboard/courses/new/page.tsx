'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, Plus, X, Upload, DollarSign,
  BookOpen, Award, Video, FileText, Globe, Tag,
  Info, Check, AlertCircle
} from 'lucide-react'
import Select from '@/components/ui/select'

const categories = [
  { value: '', label: 'Select category...' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
  { value: 'finance', label: 'Finance' }
]

const levels = [
  { value: '', label: 'Select level...' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all-levels', label: 'All Levels' }
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' }
]

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'EGP', label: 'Egyptian Pound (E£)' }
]

export default function NewCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    category: '',
    level: '',
    language: 'en',

    // Pricing
    price: '',
    currency: 'USD',
    discountPrice: '',
    discountEndsAt: '',
    isFree: false,

    // Settings
    maxStudents: '',
    hasCertificate: true,
    hasAssignments: false,
    hasQuizzes: false,
    allowDownloads: true,

    // Learning Outcomes
    requirements: [''],
    whatYouWillLearn: [''],
    targetAudience: [''],

    // Tags
    tags: [] as string[],
    tagInput: '',

    // Publishing
    status: 'draft' as const
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleArrayChange = (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'requirements' | 'whatYouWillLearn' | 'targetAudience', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleAddTag = () => {
    const tag = formData.tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: ''
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag)
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title) newErrors.title = 'Title is required'
      if (!formData.description) newErrors.description = 'Description is required'
      if (!formData.category) newErrors.category = 'Category is required'
      if (!formData.level) newErrors.level = 'Level is required'
    }

    if (step === 2) {
      if (!formData.isFree && !formData.price) {
        newErrors.price = 'Price is required for paid courses'
      }
      if (formData.price && parseFloat(formData.price) < 0) {
        newErrors.price = 'Price cannot be negative'
      }
      if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
        newErrors.discountPrice = 'Discount price must be less than regular price'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Course created:', formData)
      router.push('/dashboard/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      setErrors({ submit: 'Failed to create course. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Info', icon: BookOpen },
    { number: 2, title: 'Pricing', icon: DollarSign },
    { number: 3, title: 'Content', icon: FileText },
    { number: 4, title: 'Settings', icon: Award }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          Create New Course
        </h1>
        <p className="text-gray-400">Set up your online course step by step</p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-gradient-purple text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-800'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {errors.submit && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Basic Information
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Course Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-900 border ${
                      errors.title ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="e.g., Complete Web Development Bootcamp"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                    URL Slug <span className="text-gray-500 text-xs">(auto-generated)</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="complete-web-development-bootcamp"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    /courses/{formData.slug || 'your-course-slug'}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-gray-900 border ${
                      errors.description ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Brief description that appears in course listings..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Long Description */}
                <div>
                  <label
                    htmlFor="longDescription"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Description
                  </label>
                  <textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => handleChange('longDescription', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Detailed course description, what students will learn, etc..."
                  />
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Category"
                    options={categories}
                    value={formData.category}
                    onChange={(value) => handleChange('category', value)}
                    required
                    error={errors.category}
                  />
                  <Select
                    label="Level"
                    options={levels}
                    value={formData.level}
                    onChange={(value) => handleChange('level', value)}
                    required
                    error={errors.level}
                  />
                </div>

                {/* Language */}
                <Select
                  label="Language"
                  options={languages}
                  value={formData.language}
                  onChange={(value) => handleChange('language', value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Pricing & Enrollment
              </h2>

              <div className="space-y-6">
                {/* Free Course Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Free Course</p>
                    <p className="text-gray-400 text-sm">
                      Make this course available for free
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => handleChange('isFree', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {!formData.isFree && (
                  <>
                    {/* Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Price <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          id="price"
                          value={formData.price}
                          onChange={(e) => handleChange('price', e.target.value)}
                          min="0"
                          step="0.01"
                          className={`w-full px-4 py-3 bg-gray-900 border ${
                            errors.price ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="99.99"
                        />
                        {errors.price && (
                          <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                        )}
                      </div>

                      <Select
                        label="Currency"
                        options={currencies}
                        value={formData.currency}
                        onChange={(value) => handleChange('currency', value)}
                      />
                    </div>

                    {/* Discount */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="w-5 h-5 text-blue-400" />
                        <p className="text-blue-400 font-medium">Promotional Pricing (Optional)</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="discountPrice"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Discount Price
                          </label>
                          <input
                            type="number"
                            id="discountPrice"
                            value={formData.discountPrice}
                            onChange={(e) => handleChange('discountPrice', e.target.value)}
                            min="0"
                            step="0.01"
                            className={`w-full px-4 py-3 bg-gray-900 border ${
                              errors.discountPrice ? 'border-red-500' : 'border-gray-700'
                            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="49.99"
                          />
                          {errors.discountPrice && (
                            <p className="text-red-400 text-sm mt-1">{errors.discountPrice}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="discountEndsAt"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Discount Ends
                          </label>
                          <input
                            type="date"
                            id="discountEndsAt"
                            value={formData.discountEndsAt}
                            onChange={(e) => handleChange('discountEndsAt', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Max Students */}
                <div>
                  <label
                    htmlFor="maxStudents"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Maximum Students <span className="text-gray-500 text-xs">(leave empty for unlimited)</span>
                  </label>
                  <input
                    type="number"
                    id="maxStudents"
                    value={formData.maxStudents}
                    onChange={(e) => handleChange('maxStudents', e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Content */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* What You'll Learn */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                What Students Will Learn
              </h2>
              <div className="space-y-3">
                {formData.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange('whatYouWillLearn', index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Build responsive websites with HTML & CSS"
                    />
                    {formData.whatYouWillLearn.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('whatYouWillLearn', index)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('whatYouWillLearn')}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add learning outcome
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
              <div className="space-y-3">
                {formData.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Basic computer skills"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add requirement
                </button>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Target Audience</h2>
              <div className="space-y-3">
                {formData.targetAudience.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange('targetAudience', index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Complete beginners"
                    />
                    {formData.targetAudience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('targetAudience', index)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('targetAudience')}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add audience type
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-400" />
                Tags
              </h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.tagInput}
                  onChange={(e) => handleChange('tagInput', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add tags (e.g., javascript, react, web-dev)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-purple-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Settings */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Course Features & Settings
              </h2>

              <div className="space-y-4">
                {/* Certificate */}
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Certificate of Completion</p>
                    <p className="text-gray-400 text-sm">
                      Award a certificate when students complete the course
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasCertificate}
                      onChange={(e) => handleChange('hasCertificate', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Assignments */}
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Assignments</p>
                    <p className="text-gray-400 text-sm">
                      Include assignments for hands-on practice
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasAssignments}
                      onChange={(e) => handleChange('hasAssignments', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Quizzes */}
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Quizzes</p>
                    <p className="text-gray-400 text-sm">Include quizzes for assessment</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasQuizzes}
                      onChange={(e) => handleChange('hasQuizzes', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Downloads */}
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Allow Downloads</p>
                    <p className="text-gray-400 text-sm">
                      Let students download course resources
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowDownloads}
                      onChange={(e) => handleChange('allowDownloads', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Publishing Status */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-medium mb-2">Course Publishing</p>
                  <p className="text-gray-300 text-sm mb-4">
                    This course will be saved as a draft. You can add lessons and content before
                    publishing it to students.
                  </p>
                  <p className="text-gray-400 text-sm">
                    After creating the course, you'll be able to add sections, lessons, videos,
                    and other content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/courses"
              className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Creating...' : 'Create Course'}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
