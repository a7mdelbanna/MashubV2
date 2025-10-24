'use client'

/**
 * TaskDetailModal Component
 * Full-featured modal for viewing and editing task details
 * Displays all task information with inline editing capabilities
 */

import { useState } from 'react'
import {
  X, Edit2, Save, Calendar, Clock, User, Tag, AlertCircle,
  CheckSquare, Paperclip, MessageSquare, Activity, Trash2,
  Copy, ExternalLink, ChevronDown, Flag, Target, Layers
} from 'lucide-react'
import { Task, TaskStatus, Priority, WorkItemType } from '@/types/agile'
import { getPriorityColor, getStatusColor, formatTimeEstimate } from '@/lib/agile-utils'
import { TaskChecklistBadge } from './task-checklist-badge'

interface TaskDetailModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTask: Partial<Task>) => void
  onDelete?: () => void
  checklistInstance?: any // From mockChecklistInstances
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  checklistInstance
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Partial<Task>>(task)
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details')

  if (!isOpen) return null

  const handleSave = () => {
    onSave(editedTask)
    setIsEditing(false)
    onClose()
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const updateField = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({ ...prev, [field]: value }))
  }

  const statusOptions: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'blocked']
  const priorityOptions: Priority[] = ['low', 'medium', 'high', 'urgent', 'critical']
  const typeOptions: WorkItemType[] = ['task', 'bug', 'feature', 'improvement', 'documentation', 'spike']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">#{task.id}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'details'
                ? 'text-purple-400 border-purple-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'comments'
                ? 'text-purple-400 border-purple-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Comments
            {task.commentsCount > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                {task.commentsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'text-purple-400 border-purple-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTask.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg font-medium focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                {isEditing ? (
                  <textarea
                    value={editedTask.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-purple-500"
                    placeholder="Add a description..."
                  />
                ) : (
                  <p className="text-gray-300">{task.description || 'No description'}</p>
                )}
              </div>

              {/* Grid Layout for Properties */}
              <div className="grid grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  {isEditing ? (
                    <select
                      value={editedTask.status || task.status}
                      onChange={(e) => updateField('status', e.target.value as TaskStatus)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                  {isEditing ? (
                    <select
                      value={editedTask.priority || task.priority}
                      onChange={(e) => updateField('priority', e.target.value as Priority)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      {priorityOptions.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      <Flag className="w-4 h-4" />
                      {task.priority.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                  {isEditing ? (
                    <select
                      value={editedTask.type || task.type}
                      onChange={(e) => updateField('type', e.target.value as WorkItemType)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      {typeOptions.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="inline-flex px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </div>
                  )}
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assignee</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTask.assigneeName || ''}
                      onChange={(e) => updateField('assigneeName', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      placeholder="Unassigned"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <User className="w-4 h-4 text-gray-400" />
                      {task.assigneeName || 'Unassigned'}
                    </div>
                  )}
                </div>

                {/* Story Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Story Points</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedTask.storyPoints || ''}
                      onChange={(e) => updateField('storyPoints', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <div className="inline-flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        {task.storyPoints || 0}
                      </div>
                      <span className="text-gray-400 text-sm">points</span>
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateField('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </div>
                  )}
                </div>
              </div>

              {/* Time Estimate */}
              {task.timeEstimate && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Time Tracking</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Original Estimate</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {formatTimeEstimate(task.timeEstimate.original)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Remaining</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        {formatTimeEstimate(task.timeEstimate.remaining)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Actual</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-400" />
                        {formatTimeEstimate(task.timeEstimate.actual)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Checklist Badge */}
              {task.checklistItemId && task.checklistInstanceId && checklistInstance && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Linked Checklist</h3>
                  <TaskChecklistBadge
                    taskId={task.id}
                    checklistItemId={task.checklistItemId}
                    checklistInstanceId={task.checklistInstanceId}
                    totalItems={checklistInstance.totalItems}
                    completedItems={checklistInstance.completedItems}
                    isProductionReady={checklistInstance.isProductionReady}
                    items={checklistInstance.items}
                  />
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {task.tags.length === 0 && (
                    <span className="text-gray-500 text-sm">No tags</span>
                  )}
                </div>
              </div>

              {/* Blocked By */}
              {task.blockedBy && task.blockedBy.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Blocked By
                  </div>
                  <div className="space-y-1">
                    {task.blockedBy.map(blockerId => (
                      <div key={blockerId} className="text-sm text-gray-300">
                        Task #{blockerId}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IDs Section */}
              <div className="bg-gray-800/30 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Layers className="w-4 h-4" />
                  <span>Story ID:</span>
                  <span className="text-gray-300">{task.storyId || 'None'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Target className="w-4 h-4" />
                  <span>Epic ID:</span>
                  <span className="text-gray-300">{task.epicId || 'None'}</span>
                </div>
                {task.sprintId && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Sprint ID:</span>
                    <span className="text-gray-300">{task.sprintId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">Comments feature coming soon</p>
                <p className="text-sm text-gray-600 mt-1">
                  {task.commentsCount > 0 ? `${task.commentsCount} comments` : 'No comments yet'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">Activity timeline coming soon</p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                  <p>Last updated: {new Date(task.updatedAt).toLocaleString()}</p>
                  {task.createdBy && <p>Created by: {task.createdBy}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Task
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Updated {new Date(task.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
