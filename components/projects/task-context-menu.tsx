'use client'

/**
 * TaskContextMenu Component
 * Dropdown context menu for task actions
 * Provides quick access to common task operations
 */

import { useEffect, useRef } from 'react'
import {
  Edit2, Trash2, Copy, ExternalLink, Flag, Star,
  CheckCircle, Clock, ArrowRight, MoreVertical
} from 'lucide-react'
import { Task, TaskStatus, Priority } from '@/types/agile'

interface TaskContextMenuProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  position?: { x: number; y: number }
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onChangeStatus?: (status: TaskStatus) => void
  onChangePriority?: (priority: Priority) => void
  onViewDetails?: () => void
}

export function TaskContextMenu({
  task,
  isOpen,
  onClose,
  position,
  onEdit,
  onDelete,
  onDuplicate,
  onChangeStatus,
  onChangePriority,
  onViewDetails
}: TaskContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const statusOptions: { status: TaskStatus; label: string; icon: any }[] = [
    { status: 'backlog', label: 'Backlog', icon: MoreVertical },
    { status: 'todo', label: 'To Do', icon: Clock },
    { status: 'in_progress', label: 'In Progress', icon: ArrowRight },
    { status: 'in_review', label: 'In Review', icon: CheckCircle },
    { status: 'done', label: 'Done', icon: CheckCircle },
    { status: 'blocked', label: 'Blocked', icon: Flag }
  ]

  const priorityOptions: { priority: Priority; label: string }[] = [
    { priority: 'low', label: 'Low' },
    { priority: 'medium', label: 'Medium' },
    { priority: 'high', label: 'High' },
    { priority: 'urgent', label: 'Urgent' },
    { priority: 'critical', label: 'Critical' }
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
        style={{
          left: position?.x || 0,
          top: position?.y || 0
        }}
      >
        {/* Quick Actions */}
        <div className="p-1">
          {onViewDetails && (
            <button
              onClick={() => {
                onViewDetails()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded transition-colors text-left"
            >
              <ExternalLink className="w-4 h-4" />
              View Details
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => {
                onEdit()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded transition-colors text-left"
            >
              <Edit2 className="w-4 h-4" />
              Edit Task
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={() => {
                onDuplicate()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded transition-colors text-left"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
          )}
        </div>

        {/* Change Status */}
        {onChangeStatus && (
          <>
            <div className="border-t border-gray-700 my-1" />
            <div className="p-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-400">Change Status</div>
              {statusOptions.map(({ status, label, icon: Icon }) => (
                <button
                  key={status}
                  onClick={() => {
                    onChangeStatus(status)
                    onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors text-left ${
                    task.status === status
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {task.status === status && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Change Priority */}
        {onChangePriority && (
          <>
            <div className="border-t border-gray-700 my-1" />
            <div className="p-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-400">Change Priority</div>
              {priorityOptions.map(({ priority, label }) => (
                <button
                  key={priority}
                  onClick={() => {
                    onChangePriority(priority)
                    onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors text-left ${
                    task.priority === priority
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  {label}
                  {task.priority === priority && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Delete */}
        {onDelete && (
          <>
            <div className="border-t border-gray-700 my-1" />
            <div className="p-1">
              <button
                onClick={() => {
                  onDelete()
                  onClose()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" />
                Delete Task
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
