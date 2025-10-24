'use client'

import { useState } from 'react'
import { X, Save, Mail, FileText, Tag, AlertCircle } from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: 'onboarding' | 'follow_up' | 'proposal' | 'renewal' | 'support' | 'marketing'
  variables: string[]
  usageCount: number
  lastUsed?: string
  openRate?: number
  replyRate?: number
  createdAt: string
}

interface AddEmailTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: () => void
}

const CATEGORIES = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'renewal', label: 'Renewal' },
  { value: 'support', label: 'Support' },
  { value: 'marketing', label: 'Marketing' }
]

export default function AddEmailTemplateModal({ isOpen, onClose, onCreate }: AddEmailTemplateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    category: 'onboarding' as const,
    variables: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Email body is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g
    const matches = text.match(regex)
    if (!matches) return []

    const variables = matches.map(match => match.replace(/\{\{|\}\}/g, '').trim())
    return Array.from(new Set(variables))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Extract variables from subject and body
    const subjectVars = extractVariables(formData.subject)
    const bodyVars = extractVariables(formData.body)
    const manualVars = formData.variables
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0)

    const allVariables = Array.from(new Set([...subjectVars, ...bodyVars, ...manualVars]))

    const newTemplate: Omit<EmailTemplate, 'id'> = {
      name: formData.name,
      subject: formData.subject,
      body: formData.body,
      category: formData.category,
      variables: allVariables,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    // Here you would save the template
    console.log('Creating template:', newTemplate)

    onCreate()

    // Reset form
    setFormData({
      name: '',
      subject: '',
      body: '',
      category: 'onboarding',
      variables: ''
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Get detected variables from subject and body
  const detectedVariables = Array.from(
    new Set([
      ...extractVariables(formData.subject),
      ...extractVariables(formData.body)
    ])
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Email Template</h2>
              <p className="text-sm text-gray-400">Design a reusable email template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Template Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                    placeholder="e.g., Welcome New Client"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors.subject ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all font-mono text-sm`}
                  placeholder="e.g., Welcome to {{company_name}}!"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Use {'{{'} variable_name {'}}'}  for dynamic content
                </p>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Email Body</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message Content <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => handleChange('body', e.target.value)}
                rows={12}
                className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                  errors.body ? 'border-red-500' : 'border-gray-700'
                } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none font-mono text-sm`}
                placeholder="Hi {{client_name}},&#10;&#10;Welcome to {{company_name}}! We're excited to have you on board.&#10;&#10;..."
              />
              {errors.body && (
                <p className="mt-1 text-xs text-red-400">{errors.body}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Use {'{{'} variable_name {'}}'}  to insert dynamic content. Variables will be automatically detected.
              </p>
            </div>
          </div>

          {/* Variables */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Template Variables</h3>

            {detectedVariables.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Detected Variables:</p>
                <div className="flex flex-wrap gap-2">
                  {detectedVariables.map((variable) => (
                    <span
                      key={variable}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-mono border border-purple-500/30"
                    >
                      {'{{'}{variable}{'}}'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Additional Variables (optional)
              </label>
              <input
                type="text"
                value={formData.variables}
                onChange={(e) => handleChange('variables', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all font-mono text-sm"
                placeholder="variable1, variable2, variable3"
              />
              <p className="mt-1 text-xs text-gray-400">
                Comma-separated list of additional variable names
              </p>
            </div>
          </div>

          {/* Common Variables Guide */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-medium mb-2">Common Variables</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-blue-400/80">
                  <div><code>{'{{'} client_name {'}}'}</code> - Client's full name</div>
                  <div><code>{'{{'} company_name {'}}'}</code> - Your company name</div>
                  <div><code>{'{{'} sender_name {'}}'}</code> - Your name</div>
                  <div><code>{'{{'} sender_title {'}}'}</code> - Your job title</div>
                  <div><code>{'{{'} client_email {'}}'}</code> - Client's email</div>
                  <div><code>{'{{'} date {'}}'}</code> - Current date</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Create Template</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
