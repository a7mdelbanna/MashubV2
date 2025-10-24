'use client'

/**
 * TaskFormModal Component
 * Form modal for creating and editing tasks
 * Supports all task fields with validation
 */

import { useState } from 'react'
import { X, Save, Plus, Tag as TagIcon } from 'lucide-react'
import { Task, TaskStatus, Priority, WorkItemType } from '@/types/agile'
import { getPriorityColor, getStatusColor } from '@/lib/agile-utils'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Partial<Task>) => void
  initialTask?: Partial<Task>
  defaultStatus?: TaskStatus
  title?: string
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  defaultStatus,
  title = 'Create New Task'
}: TaskFormModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    type: 'feature',
    status: defaultStatus || 'backlog',
    priority: 'medium',
    storyPoints: 0,
    tags: [],
    ...initialTask
  })

  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const statusOptions: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'blocked']
  const priorityOptions: Priority[] = ['low', 'medium', 'high', 'urgent', 'critical']
  const typeOptions: WorkItemType[] = ['task', 'bug', 'feature', 'improvement', 'documentation', 'spike']

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required'
    }

    if (!formData.type) {
      newErrors.type = 'Type is required'
    }

    if (!formData.status) {
      newErrors.status = 'Status is required'
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Clean up the data
    const taskData: Partial<Task> = {
      ...formData,
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      createdAt: formData.createdAt || new Date(),
      updatedAt: new Date()
    }

    onSubmit(taskData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'feature',
      status: defaultStatus || 'backlog',
      priority: 'medium',
      storyPoints: 0,
      tags: []
    })
    setNewTag('')
    setErrors({})
    onClose()
  }

  const updateField = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      updateField('tags', [...(formData.tags || []), newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateField('tags', (formData.tags || []).filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
              }`}
              placeholder="Enter task title..."
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500"
              placeholder="Add a detailed description..."
            />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type || 'feature'}
                onChange={(e) => updateField('type', e.target.value as WorkItemType)}
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
                  errors.type ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                }`}
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-400">{errors.type}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.status || 'backlog'}
                onChange={(e) => updateField('status', e.target.value as TaskStatus)}
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
                  errors.status ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                }`}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-400">{errors.status}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {priorityOptions.map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => updateField('priority', priority)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      formData.priority === priority
                        ? getPriorityColor(priority)
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-400">{errors.priority}</p>
              )}
            </div>

            {/* Story Points */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Story Points
              </label>
              <input
                type="number"
                value={formData.storyPoints || 0}
                onChange={(e) => updateField('storyPoints', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                min="0"
                max="100"
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assigneeName || ''}
                onChange={(e) => updateField('assigneeName', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="Unassigned"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => updateField('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Time Estimate */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Estimate (hours)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Original</label>
                <input
                  type="number"
                  value={formData.timeEstimate?.original ? formData.timeEstimate.original / 60 : 0}
                  onChange={(e) => updateField('timeEstimate', {
                    ...(formData.timeEstimate || {}),
                    original: (parseInt(e.target.value) || 0) * 60,
                    remaining: (parseInt(e.target.value) || 0) * 60,
                    actual: formData.timeEstimate?.actual || 0,
                    confidence: formData.timeEstimate?.confidence || 'medium'
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Confidence</label>
                <select
                  value={formData.timeEstimate?.confidence || 'medium'}
                  onChange={(e) => updateField('timeEstimate', {
                    ...(formData.timeEstimate || { original: 0, remaining: 0, actual: 0 }),
                    confidence: e.target.value as 'low' | 'medium' | 'high'
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Epic/Story IDs */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Epic ID
              </label>
              <input
                type="text"
                value={formData.epicId || ''}
                onChange={(e) => updateField('epicId', e.target.value || undefined)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Story ID
              </label>
              <input
                type="text"
                value={formData.storyId || ''}
                onChange={(e) => updateField('storyId', e.target.value || undefined)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="Optional"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {initialTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
