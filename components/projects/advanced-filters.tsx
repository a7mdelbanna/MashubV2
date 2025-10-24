'use client'

/**
 * AdvancedFilters Component
 * Comprehensive filtering system for tasks, stories, and epics
 * Supports multi-select filters, date ranges, custom fields, and saved presets
 */

import { useState } from 'react'
import {
  X, Check, ChevronDown, Calendar, Users, Tag, Filter,
  CheckSquare, AlertCircle, Clock, Star, Save, Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Priority, TaskStatus, WorkItemType, WorkItemFilter
} from '@/types/agile'
import { getPriorityColor, getStatusColor } from '@/lib/agile-utils'

export interface FilterPreset {
  id: string
  name: string
  filters: WorkItemFilter
  createdAt: Date
}

export interface AdvancedFiltersProps {
  // Current filter state
  filters: WorkItemFilter
  onChange: (filters: WorkItemFilter) => void

  // Available options (passed from parent based on project data)
  availableAssignees?: { id: string; name: string; avatar?: string }[]
  availableEpics?: { id: string; name: string }[]
  availableSprints?: { id: string; name: string }[]

  // Saved filter presets
  savedPresets?: FilterPreset[]
  onSavePreset?: (name: string, filters: WorkItemFilter) => void
  onLoadPreset?: (preset: FilterPreset) => void
  onDeletePreset?: (presetId: string) => void

  // Options
  showCustomFields?: boolean
  className?: string
}

const PRIORITY_OPTIONS: Priority[] = ['critical', 'urgent', 'high', 'medium', 'low']
const STATUS_OPTIONS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'blocked']
const TYPE_OPTIONS: WorkItemType[] = ['task', 'bug', 'feature', 'improvement', 'documentation', 'spike']

export function AdvancedFilters({
  filters,
  onChange,
  availableAssignees = [],
  availableEpics = [],
  availableSprints = [],
  savedPresets = [],
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  showCustomFields = false,
  className
}: AdvancedFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('priority')
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')

  // Toggle helpers
  const togglePriority = (priority: Priority) => {
    const current = filters.priority || []
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority]
    onChange({ ...filters, priority: updated.length > 0 ? updated : undefined })
  }

  const toggleStatus = (status: TaskStatus) => {
    const current = filters.status || []
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status]
    onChange({ ...filters, status: updated.length > 0 ? updated : undefined })
  }

  const toggleType = (type: WorkItemType) => {
    const current = filters.type || []
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type]
    onChange({ ...filters, type: updated.length > 0 ? updated : undefined })
  }

  const toggleAssignee = (assigneeId: string) => {
    const current = filters.assignee || []
    const updated = current.includes(assigneeId)
      ? current.filter(a => a !== assigneeId)
      : [...current, assigneeId]
    onChange({ ...filters, assignee: updated.length > 0 ? updated : undefined })
  }

  const toggleEpic = (epicId: string) => {
    const current = filters.epic || []
    const updated = current.includes(epicId)
      ? current.filter(e => e !== epicId)
      : [...current, epicId]
    onChange({ ...filters, epic: updated.length > 0 ? updated : undefined })
  }

  const toggleSprint = (sprintId: string) => {
    const current = filters.sprint || []
    const updated = current.includes(sprintId)
      ? current.filter(s => s !== sprintId)
      : [...current, sprintId]
    onChange({ ...filters, sprint: updated.length > 0 ? updated : undefined })
  }

  // Clear all filters
  const clearAllFilters = () => {
    onChange({})
  }

  // Count active filters
  const activeFilterCount = [
    filters.priority?.length || 0,
    filters.status?.length || 0,
    filters.type?.length || 0,
    filters.assignee?.length || 0,
    filters.epic?.length || 0,
    filters.sprint?.length || 0,
    filters.hasChecklist !== undefined ? 1 : 0,
    filters.isBlocked !== undefined ? 1 : 0,
    filters.isOverdue !== undefined ? 1 : 0,
    filters.search ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  // Save preset
  const handleSavePreset = () => {
    if (newPresetName.trim() && onSavePreset) {
      onSavePreset(newPresetName.trim(), filters)
      setNewPresetName('')
      setShowSavePresetDialog(false)
    }
  }

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className={cn('bg-gray-800 rounded-lg border border-gray-700', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">Advanced Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
              {activeFilterCount} active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
          {onSavePreset && (
            <button
              onClick={() => setShowSavePresetDialog(true)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Preset
            </button>
          )}
        </div>
      </div>

      {/* Saved Presets */}
      {savedPresets.length > 0 && (
        <div className="p-4 border-b border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Saved Presets:</div>
          <div className="flex flex-wrap gap-2">
            {savedPresets.map(preset => (
              <div
                key={preset.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg group"
              >
                <button
                  onClick={() => onLoadPreset?.(preset)}
                  className="text-sm text-white hover:text-purple-400 transition-colors"
                >
                  {preset.name}
                </button>
                {onDeletePreset && (
                  <button
                    onClick={() => onDeletePreset(preset.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-red-400 hover:text-red-300" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="divide-y divide-gray-700">
        {/* Priority Filter */}
        <FilterSection
          title="Priority"
          icon={<Star className="w-4 h-4" />}
          isExpanded={expandedSection === 'priority'}
          onToggle={() => toggleSection('priority')}
          activeCount={filters.priority?.length || 0}
        >
          <div className="grid grid-cols-2 gap-2">
            {PRIORITY_OPTIONS.map(priority => (
              <button
                key={priority}
                onClick={() => togglePriority(priority)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                  filters.priority?.includes(priority)
                    ? getPriorityColor(priority)
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                <span className="capitalize">{priority}</span>
                {filters.priority?.includes(priority) && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Status Filter */}
        <FilterSection
          title="Status"
          icon={<CheckSquare className="w-4 h-4" />}
          isExpanded={expandedSection === 'status'}
          onToggle={() => toggleSection('status')}
          activeCount={filters.status?.length || 0}
        >
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map(status => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                  filters.status?.includes(status)
                    ? getStatusColor(status)
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                <span className="capitalize">{status.replace('_', ' ')}</span>
                {filters.status?.includes(status) && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Type Filter */}
        <FilterSection
          title="Type"
          icon={<Tag className="w-4 h-4" />}
          isExpanded={expandedSection === 'type'}
          onToggle={() => toggleSection('type')}
          activeCount={filters.type?.length || 0}
        >
          <div className="grid grid-cols-2 gap-2">
            {TYPE_OPTIONS.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                  filters.type?.includes(type)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                <span className="capitalize">{type}</span>
                {filters.type?.includes(type) && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Assignee Filter */}
        {availableAssignees.length > 0 && (
          <FilterSection
            title="Assignee"
            icon={<Users className="w-4 h-4" />}
            isExpanded={expandedSection === 'assignee'}
            onToggle={() => toggleSection('assignee')}
            activeCount={filters.assignee?.length || 0}
          >
            <div className="space-y-2">
              {availableAssignees.map(assignee => (
                <button
                  key={assignee.id}
                  onClick={() => toggleAssignee(assignee.id)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                    filters.assignee?.includes(assignee.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  <span>{assignee.name}</span>
                  {filters.assignee?.includes(assignee.id) && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Epic Filter */}
        {availableEpics.length > 0 && (
          <FilterSection
            title="Epic"
            icon={<Star className="w-4 h-4" />}
            isExpanded={expandedSection === 'epic'}
            onToggle={() => toggleSection('epic')}
            activeCount={filters.epic?.length || 0}
          >
            <div className="space-y-2">
              {availableEpics.map(epic => (
                <button
                  key={epic.id}
                  onClick={() => toggleEpic(epic.id)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                    filters.epic?.includes(epic.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  <span className="truncate">{epic.name}</span>
                  {filters.epic?.includes(epic.id) && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Sprint Filter */}
        {availableSprints.length > 0 && (
          <FilterSection
            title="Sprint"
            icon={<Calendar className="w-4 h-4" />}
            isExpanded={expandedSection === 'sprint'}
            onToggle={() => toggleSection('sprint')}
            activeCount={filters.sprint?.length || 0}
          >
            <div className="space-y-2">
              {availableSprints.map(sprint => (
                <button
                  key={sprint.id}
                  onClick={() => toggleSprint(sprint.id)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                    filters.sprint?.includes(sprint.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  <span className="truncate">{sprint.name}</span>
                  {filters.sprint?.includes(sprint.id) && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Quick Filters */}
        <FilterSection
          title="Quick Filters"
          icon={<AlertCircle className="w-4 h-4" />}
          isExpanded={expandedSection === 'quick'}
          onToggle={() => toggleSection('quick')}
          activeCount={
            (filters.hasChecklist !== undefined ? 1 : 0) +
            (filters.isBlocked !== undefined ? 1 : 0) +
            (filters.isOverdue !== undefined ? 1 : 0)
          }
        >
          <div className="space-y-2">
            <button
              onClick={() => onChange({ ...filters, hasChecklist: filters.hasChecklist === true ? undefined : true })}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                filters.hasChecklist === true
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              <span>Has Checklist</span>
              {filters.hasChecklist === true && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onChange({ ...filters, isBlocked: filters.isBlocked === true ? undefined : true })}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                filters.isBlocked === true
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              <span>Blocked</span>
              {filters.isBlocked === true && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onChange({ ...filters, isOverdue: filters.isOverdue === true ? undefined : true })}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                filters.isOverdue === true
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              <span>Overdue</span>
              {filters.isOverdue === true && <Check className="w-4 h-4" />}
            </button>
          </div>
        </FilterSection>
      </div>

      {/* Save Preset Dialog */}
      {showSavePresetDialog && (
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-2">Preset Name</label>
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="e.g., High Priority Bugs"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePreset}
              disabled={!newPresetName.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSavePresetDialog(false)
                setNewPresetName('')
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Collapsible Filter Section Component
 */
interface FilterSectionProps {
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  activeCount: number
  children: React.ReactNode
}

function FilterSection({
  title,
  icon,
  isExpanded,
  onToggle,
  activeCount,
  children
}: FilterSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400">{icon}</div>
          <span className="font-medium text-white">{title}</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}
