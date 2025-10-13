'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Video,
  FileText,
  CheckCircle,
  ClipboardList,
  Upload,
  Link as LinkIcon,
  Eye,
  Trash2,
  Plus,
  X,
  AlertCircle
} from 'lucide-react'

// Mock data
const mockSections = [
  { id: 's1', title: 'Getting Started', order: 1 },
  { id: 's2', title: 'HTML & CSS Fundamentals', order: 2 },
  { id: 's3', title: 'JavaScript Basics', order: 3 }
]

const mockLesson = {
  id: 'l1',
  courseId: 'c1',
  sectionId: 's1',
  title: 'Welcome to the Course',
  slug: 'welcome-to-the-course',
  description: 'An introduction to what you will learn in this comprehensive web development course',
  contentType: 'video' as const,
  videoUrl: 'https://www.youtube.com/watch?v=example',
  videoDuration: '15',
  videoProvider: 'youtube' as const,
  articleContent: '',
  quizQuestions: 10,
  passingScore: '70',
  assignmentInstructions: '',
  assignmentMaxScore: '100',
  attachments: [],
  resources: [
    { title: 'Course Syllabus', url: 'https://example.com/syllabus.pdf' },
    { title: 'Setup Guide', url: 'https://example.com/setup' }
  ],
  isPreview: true,
  isMandatory: true,
  isPublished: true,
  allowComments: true,
  allowDownloads: true
}

interface LessonFormData {
  title: string
  slug: string
  sectionId: string
  description: string
  contentType: 'video' | 'article' | 'quiz' | 'assignment'

  videoUrl: string
  videoDuration: string
  videoProvider: 'youtube' | 'vimeo' | 'custom'

  articleContent: string

  quizQuestions: number
  passingScore: string

  assignmentInstructions: string
  assignmentMaxScore: string

  attachments: Array<{ name: string; url: string; size: string }>
  resources: Array<{ title: string; url: string }>

  isPreview: boolean
  isMandatory: boolean
  isPublished: boolean
  allowComments: boolean
  allowDownloads: boolean
}

export default function EditLessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const lessonId = params.lessonId as string

  const [formData, setFormData] = useState<LessonFormData>({
    title: mockLesson.title,
    slug: mockLesson.slug,
    sectionId: mockLesson.sectionId,
    description: mockLesson.description,
    contentType: mockLesson.contentType,

    videoUrl: mockLesson.videoUrl,
    videoDuration: mockLesson.videoDuration,
    videoProvider: mockLesson.videoProvider,

    articleContent: mockLesson.articleContent,

    quizQuestions: mockLesson.quizQuestions,
    passingScore: mockLesson.passingScore,

    assignmentInstructions: mockLesson.assignmentInstructions,
    assignmentMaxScore: mockLesson.assignmentMaxScore,

    attachments: mockLesson.attachments,
    resources: mockLesson.resources,

    isPreview: mockLesson.isPreview,
    isMandatory: mockLesson.isMandatory,
    isPublished: mockLesson.isPublished,
    allowComments: mockLesson.allowComments,
    allowDownloads: mockLesson.allowDownloads
  })

  const [newResource, setNewResource] = useState({ title: '', url: '' })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleChange = (field: keyof LessonFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Auto-generate slug from title
      if (field === 'title') {
        updated.slug = generateSlug(value)
      }

      return updated
    })
    setHasUnsavedChanges(true)
  }

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource]
      }))
      setNewResource({ title: '', url: '' })
      setHasUnsavedChanges(true)
    }
  }

  const handleRemoveResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
    setHasUnsavedChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.sectionId) {
      alert('Please fill in all required fields')
      return
    }

    // Submit logic here
    console.log('Updating lesson:', formData)
    setHasUnsavedChanges(false)

    // Navigate back to lessons list
    router.push(`/dashboard/courses/${courseId}/lessons`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return
    }

    // Delete logic here
    console.log('Deleting lesson:', lessonId)

    // Navigate back to lessons list
    router.push(`/dashboard/courses/${courseId}/lessons`)
  }

  const renderContentFields = () => {
    switch (formData.contentType) {
      case 'video':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video Provider
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['youtube', 'vimeo', 'custom'].map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => handleChange('videoProvider', provider)}
                    className={`p-3 rounded-lg border-2 transition-all capitalize ${
                      formData.videoProvider === provider
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={formData.videoDuration}
                onChange={(e) => handleChange('videoDuration', e.target.value)}
                placeholder="15"
                min="1"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )

      case 'article':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Article Content *
            </label>
            <textarea
              value={formData.articleContent}
              onChange={(e) => handleChange('articleContent', e.target.value)}
              placeholder="Write your article content here... (supports Markdown)"
              rows={12}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
            />
            <p className="mt-2 text-sm text-gray-400">
              You can use Markdown formatting for rich text
            </p>
          </div>
        )

      case 'quiz':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Questions *
              </label>
              <input
                type="number"
                value={formData.quizQuestions}
                onChange={(e) => handleChange('quizQuestions', parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passing Score (%) *
              </label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) => handleChange('passingScore', e.target.value)}
                min="0"
                max="100"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-400 font-medium mb-1">Manage Quiz Questions</p>
                  <p className="text-sm text-blue-300">
                    You can add, edit, and reorder quiz questions from the quiz builder
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    Open Quiz Builder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'assignment':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Assignment Instructions *
              </label>
              <textarea
                value={formData.assignmentInstructions}
                onChange={(e) => handleChange('assignmentInstructions', e.target.value)}
                placeholder="Describe what students need to do for this assignment..."
                rows={8}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Score *
              </label>
              <input
                type="number"
                value={formData.assignmentMaxScore}
                onChange={(e) => handleChange('assignmentMaxScore', e.target.value)}
                min="1"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/courses/${courseId}/lessons`}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lessons</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Edit Lesson
            </h1>
            <p className="text-gray-400">Update lesson content and settings</p>
          </div>

          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Unsaved changes</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Introduction to React Hooks"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-400">
                Used in URL. Changing this may break existing links.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Section *
              </label>
              <select
                value={formData.sectionId}
                onChange={(e) => handleChange('sectionId', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select a section</option>
                {mockSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of what students will learn in this lesson"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Content Type */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Content Type</h2>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { type: 'video', icon: Video, label: 'Video' },
              { type: 'article', icon: FileText, label: 'Article' },
              { type: 'quiz', icon: CheckCircle, label: 'Quiz' },
              { type: 'assignment', icon: ClipboardList, label: 'Assignment' }
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('contentType', type)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.contentType === type
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  formData.contentType === type ? 'text-purple-400' : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  formData.contentType === type ? 'text-purple-400' : 'text-gray-400'
                }`}>
                  {label}
                </p>
              </button>
            ))}
          </div>

          {renderContentFields()}
        </div>

        {/* Resources */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Resources</h2>

          <div className="space-y-4">
            {formData.resources.map((resource, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50">
                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{resource.title}</p>
                  <p className="text-gray-400 text-xs truncate">{resource.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveResource(index)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex space-x-3">
              <input
                type="text"
                value={newResource.title}
                onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Resource title"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddResource}
                className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
              <div>
                <p className="text-white font-medium">Preview Lesson</p>
                <p className="text-sm text-gray-400">Allow non-enrolled students to view this lesson</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isPreview}
                onChange={(e) => handleChange('isPreview', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
              <div>
                <p className="text-white font-medium">Mandatory</p>
                <p className="text-sm text-gray-400">Students must complete this lesson to progress</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isMandatory}
                onChange={(e) => handleChange('isMandatory', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
              <div>
                <p className="text-white font-medium">Published</p>
                <p className="text-sm text-gray-400">Make this lesson visible to enrolled students</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
              <div>
                <p className="text-white font-medium">Allow Comments</p>
                <p className="text-sm text-gray-400">Students can leave comments and discussions</p>
              </div>
              <input
                type="checkbox"
                checked={formData.allowComments}
                onChange={(e) => handleChange('allowComments', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
              <div>
                <p className="text-white font-medium">Allow Downloads</p>
                <p className="text-sm text-gray-400">Students can download attachments and resources</p>
              </div>
              <input
                type="checkbox"
                checked={formData.allowDownloads}
                onChange={(e) => handleChange('allowDownloads', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Lesson</span>
          </button>

          <div className="flex items-center space-x-3">
            <Link
              href={`/dashboard/courses/${courseId}/lessons`}
              className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
