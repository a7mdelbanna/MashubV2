'use client'

/**
 * TaskChecklistBadge Component
 * Displays checklist progress on task cards
 * Shows completion status, progress, and production-ready indicator
 */

import { CheckSquare, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ChecklistItemStatus {
  id: string
  title: string
  completed: boolean
  isProductionReady?: boolean
}

export interface TaskChecklistBadgeProps {
  taskId: string
  checklistItemId?: string
  checklistInstanceId?: string

  // Summary data (passed from parent to avoid fetching)
  totalItems: number
  completedItems: number
  isProductionReady?: boolean

  // Optional: Full items list for expandable view
  items?: ChecklistItemStatus[]

  // Display options
  compact?: boolean
  showDetails?: boolean
  className?: string

  // Callbacks
  onItemClick?: (itemId: string) => void
  onBadgeClick?: () => void
}

export function TaskChecklistBadge({
  taskId,
  checklistItemId,
  checklistInstanceId,
  totalItems,
  completedItems,
  isProductionReady = false,
  items,
  compact = false,
  showDetails = false,
  className,
  onItemClick,
  onBadgeClick
}: TaskChecklistBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate percentage
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  // Determine status color
  const getStatusColor = () => {
    if (percentage === 100) return 'bg-green-500/20 border-green-500/30 text-green-400'
    if (percentage > 0) return 'bg-orange-500/20 border-orange-500/30 text-orange-400'
    return 'bg-gray-500/20 border-gray-500/30 text-gray-400'
  }

  const handleBadgeClick = () => {
    if (items && items.length > 0) {
      setIsExpanded(!isExpanded)
    }
    onBadgeClick?.()
  }

  // No checklist
  if (!checklistItemId || !checklistInstanceId) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Badge */}
      <button
        onClick={handleBadgeClick}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded border transition-all',
          getStatusColor(),
          'hover:opacity-80',
          compact ? 'text-xs' : 'text-sm'
        )}
      >
        <CheckSquare className={cn(compact ? 'w-3 h-3' : 'w-4 h-4')} />

        {/* Progress text */}
        <span className="font-medium">
          {completedItems}/{totalItems}
        </span>

        {/* Production ready indicator */}
        {isProductionReady && (
          <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-green-500/30 border border-green-500/40 text-green-300">
            ✓ Ready
          </span>
        )}

        {/* Percentage (non-compact mode) */}
        {!compact && (
          <span className="text-xs opacity-70">
            ({percentage}%)
          </span>
        )}

        {/* Expand indicator */}
        {items && items.length > 0 && (
          <span className="ml-1">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
      </button>

      {/* Expanded checklist items */}
      {isExpanded && items && items.length > 0 && (
        <div className="ml-4 space-y-1.5 border-l-2 border-gray-700 pl-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                'flex items-center gap-2 text-sm w-full text-left px-2 py-1.5 rounded',
                'hover:bg-white/5 transition-colors',
                item.completed ? 'opacity-60' : 'opacity-100'
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                  item.completed
                    ? 'bg-green-500/20 border-green-500/40'
                    : 'border-gray-600'
                )}
              >
                {item.completed && (
                  <CheckSquare className="w-3 h-3 text-green-400" />
                )}
              </div>

              {/* Title */}
              <span className={cn(
                item.completed && 'line-through text-gray-500'
              )}>
                {item.title}
              </span>

              {/* Production ready badge */}
              {item.isProductionReady && (
                <span className="ml-auto px-1.5 py-0.5 rounded text-xs bg-green-500/20 border border-green-500/30 text-green-400">
                  Ready
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Compact variant for use in tight spaces (board cards)
 */
export function TaskChecklistBadgeCompact(props: Omit<TaskChecklistBadgeProps, 'compact'>) {
  return <TaskChecklistBadge {...props} compact={true} />
}

/**
 * Get checklist badge data from task
 * Helper function to extract checklist info from a task
 */
export function getChecklistBadgeData(
  task: any, // Task from agile types
  checklistInstances: any[] // ChecklistInstance from types/index
): Omit<TaskChecklistBadgeProps, 'taskId'> | null {
  if (!task.checklistItemId || !task.checklistInstanceId) {
    return null
  }

  const instance = checklistInstances.find(i => i.id === task.checklistInstanceId)
  if (!instance) return null

  // Extract items if available
  const items: ChecklistItemStatus[] = instance.items?.map((item: any) => ({
    id: item.id,
    title: item.title,
    completed: item.completed,
    isProductionReady: item.isProductionReady
  })) || []

  return {
    checklistItemId: task.checklistItemId,
    checklistInstanceId: task.checklistInstanceId,
    totalItems: instance.totalItems || instance.items?.length || 0,
    completedItems: instance.completedItems || instance.items?.filter((i: any) => i.completed).length || 0,
    isProductionReady: instance.isProductionReady || false,
    items
  }
}
