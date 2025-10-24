'use client'

import { useState } from 'react'
import { ChecklistTemplate, ChecklistItem } from '@/types'
import { cn } from '@/lib/utils'
import {
  CheckSquare, Square, CheckCircle2, XCircle,
  Palette, Code, Scale, TestTube, Rocket, FileText,
  Circle, Plus, Edit, Trash2, MessageSquare, User,
  Calendar, ChevronDown, ChevronRight, AlertCircle
} from 'lucide-react'

interface ChecklistProps {
  template: ChecklistTemplate
  onItemToggle?: (itemId: string, completed: boolean) => void
  onAddNote?: (itemId: string, note: string) => void
  readonly?: boolean
  className?: string
}

const CATEGORY_CONFIG = {
  branding: {
    icon: Palette,
    label: 'Branding',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10'
  },
  technical: {
    icon: Code,
    label: 'Technical',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  legal: {
    icon: Scale,
    label: 'Legal',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  qa: {
    icon: TestTube,
    label: 'QA & Testing',
    color: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  deployment: {
    icon: Rocket,
    label: 'Deployment',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10'
  },
  documentation: {
    icon: FileText,
    label: 'Documentation',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  other: {
    icon: Circle,
    label: 'Other',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10'
  }
}

function ChecklistItemCard({
  item,
  onToggle,
  onAddNote,
  readonly
}: {
  item: ChecklistItem
  onToggle?: (completed: boolean) => void
  onAddNote?: (note: string) => void
  readonly?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)

  const categoryConfig = CATEGORY_CONFIG[item.category]
  const CategoryIcon = categoryConfig.icon

  const handleToggle = () => {
    if (!readonly && onToggle) {
      onToggle(!item.completed)
    }
  }

  const handleAddNote = () => {
    if (noteText.trim() && onAddNote) {
      onAddNote(noteText)
      setNoteText('')
      setShowNoteInput(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-150',
        item.completed
          ? 'bg-green-500/5 border-green-500/20'
          : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
      )}
    >
      <div className="p-4">
        {/* Main Content */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={readonly}
            className={cn(
              'flex-shrink-0 mt-0.5 transition-colors',
              readonly && 'cursor-not-allowed opacity-50'
            )}
          >
            {item.completed ? (
              <CheckSquare className="h-5 w-5 text-green-400" />
            ) : (
              <Square className="h-5 w-5 text-gray-400 hover:text-gray-300" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={cn(
                      'text-sm font-semibold',
                      item.completed ? 'text-gray-400 line-through' : 'text-white'
                    )}
                  >
                    {item.title}
                  </h4>
                  {item.required && (
                    <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                      Required
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Category Badge */}
              <div className={cn('px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1', categoryConfig.bg, categoryConfig.color)}>
                <CategoryIcon className="h-3 w-3" />
                {categoryConfig.label}
              </div>
            </div>

            {/* Metadata */}
            {item.completed && (
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                {item.completedBy && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{item.completedBy}</span>
                  </div>
                )}
                {item.completedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="mt-2 p-2 rounded-lg bg-gray-900/50 border border-gray-700/50">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300">{item.notes}</p>
                </div>
              </div>
            )}

            {/* Add Note Button */}
            {!readonly && !showNoteInput && !item.notes && (
              <button
                onClick={() => setShowNoteInput(true)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add note
              </button>
            )}

            {/* Note Input */}
            {showNoteInput && (
              <div className="mt-2 space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteInput(false)
                      setNoteText('')
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Checklist({
  template,
  onItemToggle,
  onAddNote,
  readonly = false,
  className
}: ChecklistProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(CATEGORY_CONFIG))
  )

  // Group items by category
  const itemsByCategory = template.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  // Calculate progress
  const totalItems = template.items.length
  const completedItems = template.items.filter(item => item.completed).length
  const requiredItems = template.items.filter(item => item.required).length
  const completedRequiredItems = template.items.filter(item => item.required && item.completed).length
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  const requiredProgressPercentage = requiredItems > 0 ? Math.round((completedRequiredItems / requiredItems) * 100) : 100

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const isReadyForProduction = completedRequiredItems === requiredItems && completedItems === totalItems

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-xl',
            isReadyForProduction
              ? 'bg-gradient-to-r from-green-600 to-emerald-600'
              : 'bg-gradient-to-r from-orange-600 to-yellow-600'
          )}>
            {isReadyForProduction ? (
              <CheckCircle2 className="h-5 w-5 text-white" />
            ) : (
              <AlertCircle className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-400">{template.description}</p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn(
          'px-4 py-2 rounded-xl border font-medium text-sm',
          isReadyForProduction
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
        )}>
          {isReadyForProduction ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Ready for Production
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Not Ready
            </div>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overall Progress */}
        <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-lg font-bold text-white">{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completedItems} of {totalItems} items completed
          </p>
        </div>

        {/* Required Progress */}
        <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Required Items</span>
            <span className="text-lg font-bold text-white">{requiredProgressPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                requiredProgressPercentage === 100
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'bg-gradient-to-r from-orange-600 to-red-600'
              )}
              style={{ width: `${requiredProgressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completedRequiredItems} of {requiredItems} required items completed
          </p>
        </div>
      </div>

      {/* Checklist Items by Category */}
      <div className="space-y-4">
        {Object.entries(itemsByCategory)
          .sort(([a], [b]) => {
            // Sort by category order
            const order = Object.keys(CATEGORY_CONFIG)
            return order.indexOf(a) - order.indexOf(b)
          })
          .map(([category, items]) => {
            const categoryConfig = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]
            const CategoryIcon = categoryConfig.icon
            const isExpanded = expandedCategories.has(category)
            const categoryCompleted = items.filter(item => item.completed).length
            const categoryTotal = items.length

            return (
              <div key={category} className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <div className={cn('p-2 rounded-lg', categoryConfig.bg)}>
                      <CategoryIcon className={cn('h-4 w-4', categoryConfig.color)} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-white">{categoryConfig.label}</h4>
                      <p className="text-xs text-gray-500">
                        {categoryCompleted} of {categoryTotal} completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', `bg-gradient-to-r ${categoryConfig.color.replace('text-', 'from-')}-600 to-${categoryConfig.color.split('-')[1]}-400`)}
                        style={{ width: `${(categoryCompleted / categoryTotal) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-400 min-w-[3rem] text-right">
                      {Math.round((categoryCompleted / categoryTotal) * 100)}%
                    </span>
                  </div>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-3">
                    {items
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <ChecklistItemCard
                          key={item.id}
                          item={item}
                          onToggle={onItemToggle ? (completed) => onItemToggle(item.id, completed) : undefined}
                          onAddNote={onAddNote ? (note) => onAddNote(item.id, note) : undefined}
                          readonly={readonly}
                        />
                      ))}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
