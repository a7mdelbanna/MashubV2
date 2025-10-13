'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, X, Plus, Tag } from 'lucide-react'
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

const statuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
]

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    category: '',
    level: '',
    language: 'en',
    price: '',
    currency: 'USD',
    discountPrice: '',
    discountEndsAt: '',
    isFree: false,
    maxStudents: '',
    hasCertificate: true,
    hasAssignments: false,
    hasQuizzes: false,
    allowDownloads: true,
    requirements: [''],
    whatYouWillLearn: [''],
    targetAudience: [''],
    tags: [] as string[],
    tagInput: '',
    status: 'draft' as const
  })

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockCourse = {
          title: 'Complete Web Development Bootcamp',
          slug: 'complete-web-development-bootcamp',
          description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB',
          longDescription: 'Full-stack web development from scratch',
          category: 'web-development',
          level: 'beginner',
          language: 'en',
          price: '299',
          currency: 'USD',
          discountPrice: '199',
          discountEndsAt: '2024-12-31',
          isFree: false,
          maxStudents: '',
          hasCertificate: true,
          hasAssignments: true,
          hasQuizzes: true,
          allowDownloads: true,
          requirements: ['Basic computer skills', 'Desire to learn'],
          whatYouWillLearn: ['HTML & CSS', 'JavaScript ES6+', 'React', 'Node.js', 'MongoDB'],
          targetAudience: ['Beginners', 'Career changers'],
          tags: ['web-development', 'javascript', 'react', 'node'],
          tagInput: '',
          status: 'published' as const
        }

        setFormData(mockCourse)
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleArrayChange = (
    field: 'requirements' | 'whatYouWillLearn' | 'targetAudience',
    index: number,
    value: string
  ) => {
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

  const removeArrayItem = (
    field: 'requirements' | 'whatYouWillLearn' | 'targetAudience',
    index: number
  ) => {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title) newErrors.title = 'Title is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.level) newErrors.level = 'Level is required'

    if (!formData.isFree && !formData.price) {
      newErrors.price = 'Price is required for paid courses'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Course updated:', formData)
      router.push(`/dashboard/courses/${params.id}`)
    } catch (error) {
      console.error('Error updating course:', error)
      setErrors({ submit: 'Failed to update course. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/courses/${params.id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          Edit Course
        </h1>
        <p className="text-gray-400">Update course details and settings</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        {errors.submit && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
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
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

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
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Select
                label="Language"
                options={languages}
                value={formData.language}
                onChange={(value) => handleChange('language', value)}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Pricing</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div>
                <p className="text-white font-medium">Free Course</p>
                <p className="text-gray-400 text-sm">Make this course available for free</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
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
                    />
                    {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <Select
                    label="Currency"
                    options={currencies}
                    value={formData.currency}
                    onChange={(value) => handleChange('currency', value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
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
              </>
            )}

            <div>
              <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Students{' '}
                <span className="text-gray-500 text-xs">(leave empty for unlimited)</span>
              </label>
              <input
                type="number"
                id="maxStudents"
                value={formData.maxStudents}
                onChange={(e) => handleChange('maxStudents', e.target.value)}
                min="1"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Course Content</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-3">What Students Will Learn</h3>
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

            <div>
              <h3 className="text-white font-medium mb-3">Requirements</h3>
              <div className="space-y-3">
                {formData.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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

            <div>
              <h3 className="text-white font-medium mb-3">Target Audience</h3>
              <div className="space-y-3">
                {formData.targetAudience.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('targetAudience', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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

            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-400" />
                Tags
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.tagInput}
                  onChange={(e) => handleChange('tagInput', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add tags..."
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
        </div>

        {/* Course Features */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Course Features</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div>
                <p className="text-white font-medium">Certificate of Completion</p>
                <p className="text-gray-400 text-sm">Award certificate when students complete</p>
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

            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div>
                <p className="text-white font-medium">Assignments</p>
                <p className="text-gray-400 text-sm">Include assignments for practice</p>
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

            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div>
                <p className="text-white font-medium">Allow Downloads</p>
                <p className="text-gray-400 text-sm">Let students download resources</p>
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
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Publishing Status</h2>
          <Select
            label="Course Status"
            options={statuses}
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
          </button>
          <Link
            href={`/dashboard/courses/${params.id}`}
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
