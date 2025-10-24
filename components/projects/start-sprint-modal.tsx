'use client'

/**
 * StartSprintModal Component
 * Modal for configuring and starting a new sprint
 * Allows selecting sprint details, capacity, and tasks
 */

import { useState } from 'react'
import { X, PlayCircle, Calendar, Target, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import { Sprint, Task } from '@/types/agile'

interface StartSprintModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: (sprintData: Partial<Sprint>) => void
  sprint: any // The planning sprint to be started
  backlogTasks: Task[]
}

export function StartSprintModal({
  isOpen,
  onClose,
  onStart,
  sprint,
  backlogTasks
}: StartSprintModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    name: sprint?.name || '',
    goal: sprint?.goal || '',
    startDate: sprint?.startDate || today,
    endDate: sprint?.endDate || twoWeeksLater,
    capacity: sprint?.capacity || 40,
    selectedTaskIds: sprint?.tasks || []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const updateField = (field: string, value: any) => {
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

  const toggleTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTaskIds: prev.selectedTaskIds.includes(taskId)
        ? prev.selectedTaskIds.filter(id => id !== taskId)
        : [...prev.selectedTaskIds, taskId]
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Sprint name is required'
    }

    if (!formData.goal.trim()) {
      newErrors.goal = 'Sprint goal is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0'
    }

    if (formData.selectedTaskIds.length === 0) {
      newErrors.tasks = 'Select at least one task for the sprint'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStart = () => {
    if (!validate()) {
      return
    }

    const selectedTasks = backlogTasks.filter(task => formData.selectedTaskIds.includes(task.id))
    const totalStoryPoints = selectedTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)

    const sprintData: Partial<Sprint> = {
      ...sprint,
      name: formData.name,
      goal: formData.goal,
      startDate: formData.startDate,
      endDate: formData.endDate,
      capacity: formData.capacity,
      status: 'active',
      tasks: formData.selectedTaskIds,
      totalStoryPoints,
      completedStoryPoints: 0
    }

    onStart(sprintData)
    onClose()
  }

  const selectedTasks = backlogTasks.filter(task => formData.selectedTaskIds.includes(task.id))
  const totalStoryPoints = selectedTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
  const capacityUtilization = formData.capacity > 0 ? Math.round((totalStoryPoints / formData.capacity) * 100) : 0

  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Start Sprint</h2>
              <p className="text-sm text-gray-400">Configure and start your sprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sprint Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Sprint Details
            </h3>

            {/* Sprint Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sprint Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                }`}
                placeholder="e.g., Sprint 14 - User Authentication"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Sprint Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sprint Goal <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.goal}
                onChange={(e) => updateField('goal', e.target.value)}
                rows={2}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none transition-colors ${
                  errors.goal ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                }`}
                placeholder="What do you want to achieve in this sprint?"
              />
              {errors.goal && (
                <p className="mt-1 text-sm text-red-400">{errors.goal}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.startDate ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.endDate ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Capacity (Story Points) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => updateField('capacity', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
                  errors.capacity ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                }`}
                min="1"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-400">{errors.capacity}</p>
              )}
            </div>

            {/* Sprint Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  {getDuration()}
                </div>
                <div className="text-xs text-gray-400 mt-1">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{totalStoryPoints}</div>
                <div className="text-xs text-gray-400 mt-1">Story Points</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  capacityUtilization > 100 ? 'text-red-400' :
                  capacityUtilization > 80 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {capacityUtilization}%
                </div>
                <div className="text-xs text-gray-400 mt-1">Capacity</div>
              </div>
            </div>

            {/* Capacity Warning */}
            {capacityUtilization > 100 && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-400">Over Capacity</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    You've selected {totalStoryPoints} story points, which exceeds your capacity of {formData.capacity}. Consider removing some tasks.
                  </p>
                </div>
              </div>
            )}

            {capacityUtilization > 80 && capacityUtilization <= 100 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">High Capacity Utilization</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    You're using {capacityUtilization}% of your capacity. This is good, but leave some buffer for unexpected work.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Task Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Select Tasks
              </h3>
              <span className="text-sm text-gray-400">
                {formData.selectedTaskIds.length} of {backlogTasks.length} tasks selected
              </span>
            </div>

            {errors.tasks && (
              <p className="text-sm text-red-400">{errors.tasks}</p>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {backlogTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tasks available in backlog
                </div>
              ) : (
                backlogTasks.map(task => {
                  const isSelected = formData.selectedTaskIds.includes(task.id)
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-500/10 border-purple-500'
                          : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-purple-500 border-purple-500'
                                : 'border-gray-600'
                            }`}>
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <h4 className="font-medium text-white">{task.title}</h4>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-400 ml-7 line-clamp-1">{task.description}</p>
                          )}
                        </div>
                        {task.storyPoints && (
                          <div className="ml-4 flex items-center gap-1">
                            <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">
                              {task.storyPoints}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {formData.selectedTaskIds.length > 0 ? (
              <span>
                Starting sprint with {formData.selectedTaskIds.length} task(s) and {totalStoryPoints} story points
              </span>
            ) : (
              <span>Select tasks to include in this sprint</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Start Sprint
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
