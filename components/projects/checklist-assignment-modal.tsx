'use client'

import { useState, useEffect } from 'react'
import { X, CheckSquare, AlertCircle, Palette, Code, Scale, TestTube, Rocket, FileText, Circle } from 'lucide-react'
import { ChecklistTemplate, ChecklistItem, TeamMember } from '@/types'
import { AssignmentPicker } from './assignment-picker'

interface ChecklistAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  templates: ChecklistTemplate[]
  teamMembers: TeamMember[]
  onAssign: (assignments: Map<string, { assignedTo: string; assignedType: 'user' | 'team' }>) => void
}

export function ChecklistAssignmentModal({
  isOpen,
  onClose,
  templates,
  teamMembers,
  onAssign
}: ChecklistAssignmentModalProps) {
  const [assignments, setAssignments] = useState<Map<string, { assignedTo: string; assignedType: 'user' | 'team' }>>(new Map())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Initialize assignments with default assignments from templates
  useEffect(() => {
    if (isOpen) {
      const initialAssignments = new Map<string, { assignedTo: string; assignedType: 'user' | 'team' }>()

      templates.forEach(template => {
        template.items.forEach(item => {
          if (item.assignedTo && item.assignedType) {
            initialAssignments.set(item.id, {
              assignedTo: item.assignedTo,
              assignedType: item.assignedType
            })
          }
        })
      })

      setAssignments(initialAssignments)

      // Expand all categories by default
      const categories = new Set<string>()
      templates.forEach(template => {
        template.items.forEach(item => categories.add(item.category))
      })
      setExpandedCategories(categories)
    }
  }, [isOpen, templates])

  const handleAssignmentChange = (itemId: string, assignment: { assignedTo: string; assignedType: 'user' | 'team' } | null) => {
    const newAssignments = new Map(assignments)
    if (assignment) {
      newAssignments.set(itemId, assignment)
    } else {
      newAssignments.delete(itemId)
    }
    setAssignments(newAssignments)
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const handleSubmit = () => {
    onAssign(assignments)
    onClose()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'branding': return <Palette className="w-4 h-4" />
      case 'technical': return <Code className="w-4 h-4" />
      case 'legal': return <Scale className="w-4 h-4" />
      case 'qa': return <TestTube className="w-4 h-4" />
      case 'deployment': return <Rocket className="w-4 h-4" />
      case 'documentation': return <FileText className="w-4 h-4" />
      default: return <Circle className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'branding': return 'text-pink-400'
      case 'technical': return 'text-blue-400'
      case 'legal': return 'text-purple-400'
      case 'qa': return 'text-green-400'
      case 'deployment': return 'text-orange-400'
      case 'documentation': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  // Group all items by category across all templates
  const itemsByCategory = new Map<string, Array<{ template: ChecklistTemplate; item: ChecklistItem }>>()

  templates.forEach(template => {
    template.items.forEach(item => {
      if (!itemsByCategory.has(item.category)) {
        itemsByCategory.set(item.category, [])
      }
      itemsByCategory.get(item.category)!.push({ template, item })
    })
  })

  // Calculate stats
  const totalItems = templates.reduce((sum, t) => sum + t.items.length, 0)
  const assignedItems = assignments.size
  const requiredItems = templates.reduce((sum, t) => sum + t.items.filter(i => i.required).length, 0)
  const assignedRequiredItems = Array.from(assignments.keys()).filter(itemId => {
    return templates.some(t => t.items.some(i => i.id === itemId && i.required))
  }).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-purple-500" />
              Assign Checklist Items
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Assign team members or teams to checklist items for this project
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-gray-800/30 border-b border-gray-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalItems}</div>
            <div className="text-xs text-gray-400 mt-1">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{assignedItems}</div>
            <div className="text-xs text-gray-400 mt-1">Assigned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{requiredItems}</div>
            <div className="text-xs text-gray-400 mt-1">Required</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{assignedRequiredItems}/{requiredItems}</div>
            <div className="text-xs text-gray-400 mt-1">Required Assigned</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-300">
                You can assign items to individual team members or entire teams. Items can be reassigned later.
                Required items are marked with an asterisk (*).
              </p>
            </div>
          </div>

          {/* Items by Category */}
          <div className="space-y-4">
            {Array.from(itemsByCategory.entries()).map(([category, items]) => {
              const isExpanded = expandedCategories.has(category)

              return (
                <div key={category} className="border border-gray-800 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={getCategoryColor(category)}>
                        {getCategoryIcon(category)}
                      </div>
                      <span className="font-medium text-white capitalize">{category}</span>
                      <span className="text-xs text-gray-500">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {items.filter(({ item }) => assignments.has(item.id)).length} assigned
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-800">
                      {items.map(({ template, item }) => (
                        <div key={item.id} className="p-4 bg-gray-900/30">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white">
                                  {item.title}
                                  {item.required && <span className="text-orange-500 ml-1">*</span>}
                                </h4>
                                <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
                                  {template.name}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                              )}
                            </div>
                            <div className="w-64">
                              <AssignmentPicker
                                teamMembers={teamMembers}
                                value={assignments.get(item.id) || null}
                                onChange={(assignment) => handleAssignmentChange(item.id, assignment)}
                                placeholder={item.required ? "Required - assign..." : "Optional - assign..."}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-800/30">
          <div className="text-sm text-gray-400">
            {assignedRequiredItems < requiredItems && (
              <span className="text-orange-400">
                {requiredItems - assignedRequiredItems} required item(s) still need assignment
              </span>
            )}
            {assignedRequiredItems === requiredItems && (
              <span className="text-green-400">
                All required items have been assigned
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Save Assignments
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
