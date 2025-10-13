'use client'

import { useState, useEffect } from 'react'
import { X, Save, Palette } from 'lucide-react'
import { SettingsItem } from './SettingsItemList'

interface SettingsItemFormProps {
  item?: SettingsItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: Partial<SettingsItem>) => void
  title: string
  fields?: FormField[]
  showColor?: boolean
  showIcon?: boolean
  showSlug?: boolean
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'color'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  helpText?: string
}

const defaultFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
]

const predefinedColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444',
  '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
]

export default function SettingsItemForm({
  item,
  isOpen,
  onClose,
  onSave,
  title,
  fields = defaultFields,
  showColor = false,
  showIcon = false,
  showSlug = true
}: SettingsItemFormProps) {
  const [formData, setFormData] = useState<Partial<SettingsItem>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
        color: predefinedColors[0]
      })
    }
    setErrors({})
  }, [item, isOpen])

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && showSlug && !item ? { slug: generateSlug(value) } : {})
    }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">{item ? 'Edit' : 'Add'} {title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none`}
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                />
              )}

              {field.type === 'select' && (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-700'
                  } text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span className="text-white">{field.helpText || field.label}</span>
                </label>
              )}

              {errors[field.name] && (
                <p className="text-red-400 text-sm mt-1">{errors[field.name]}</p>
              )}

              {field.helpText && !errors[field.name] && field.type !== 'checkbox' && (
                <p className="text-gray-500 text-sm mt-1">{field.helpText}</p>
              )}
            </div>
          ))}

          {/* Slug (auto-generated) */}
          {showSlug && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="auto-generated-slug"
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all font-mono text-sm"
              />
              <p className="text-gray-500 text-sm mt-1">URL-friendly identifier</p>
            </div>
          )}

          {/* Color Picker */}
          {showColor && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Palette className="h-4 w-4 inline mr-1" />
                Color
              </label>
              <div className="grid grid-cols-10 gap-2">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange('color', color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color
                        ? 'border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.color || predefinedColors[0]}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-700 bg-gray-800"
                />
                <input
                  type="text"
                  value={formData.color || ''}
                  onChange={(e) => handleChange('color', e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Icon Picker */}
          {showIcon && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={formData.icon || ''}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder="🚀"
                maxLength={2}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-2xl text-center placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
              />
              <p className="text-gray-500 text-sm mt-1">Click to choose an emoji</p>
            </div>
          )}

          {/* Active Status */}
          <div className="pt-4 border-t border-gray-800">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
              />
              <div>
                <span className="text-white font-medium">Active</span>
                <p className="text-sm text-gray-400">This item will be available for use</p>
              </div>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{item ? 'Update' : 'Create'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
