'use client'

import { cn } from '@/lib/utils'
import {
  Filter, X, Calendar, DollarSign, Users,
  Briefcase, CheckCircle2, AlertCircle, Clock
} from 'lucide-react'
import { useState } from 'react'

interface ProjectFiltersProps {
  onFilterChange: (filters: any) => void
  activeFilters: any
}

export function ProjectFilters({ onFilterChange, activeFilters }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const filterOptions = {
    status: [
      { value: 'planning', label: 'Planning', icon: Clock, color: 'text-blue-400' },
      { value: 'in_progress', label: 'In Progress', icon: AlertCircle, color: 'text-purple-400' },
      { value: 'review', label: 'Review', icon: AlertCircle, color: 'text-yellow-400' },
      { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-green-400' },
      { value: 'on_hold', label: 'On Hold', icon: Clock, color: 'text-orange-400' }
    ],
    priority: [
      { value: 'urgent', label: 'Urgent', color: 'text-red-400' },
      { value: 'high', label: 'High', color: 'text-orange-400' },
      { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
      { value: 'low', label: 'Low', color: 'text-gray-400' }
    ],
    type: [
      { value: 'web_app', label: 'Web App' },
      { value: 'mobile_app', label: 'Mobile App' },
      { value: 'pos', label: 'POS System' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'custom', label: 'Custom' }
    ],
    budget: [
      { value: '0-50k', label: 'Under $50k' },
      { value: '50k-100k', label: '$50k - $100k' },
      { value: '100k-200k', label: '$100k - $200k' },
      { value: '200k+', label: 'Over $200k' }
    ]
  }

  const handleFilterSelect = (category: string, value: string) => {
    const currentFilters = { ...activeFilters }
    if (!currentFilters[category]) {
      currentFilters[category] = []
    }

    const index = currentFilters[category].indexOf(value)
    if (index > -1) {
      currentFilters[category].splice(index, 1)
    } else {
      currentFilters[category].push(value)
    }

    onFilterChange(currentFilters)
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const activeFilterCount = Object.values(activeFilters).reduce(
    (count: number, filters: any) => count + (Array.isArray(filters) ? filters.length : 0),
    0
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-3 rounded-xl border transition-all flex items-center gap-2",
          activeFilterCount > 0
            ? "bg-purple-600/20 border-purple-500 text-purple-400"
            : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white"
        )}
      >
        <Filter className="h-5 w-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-medium">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filters Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Filter Categories */}
            <div className="space-y-6">
              {/* Status Filter */}
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Status</p>
                <div className="space-y-2">
                  {filterOptions.status.map(option => {
                    const Icon = option.icon
                    const isActive = activeFilters.status?.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect('status', option.value)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-all",
                          isActive
                            ? "bg-purple-600/20 border border-purple-500"
                            : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", option.color)} />
                        <span className={cn(
                          "text-sm",
                          isActive ? "text-white" : "text-gray-400"
                        )}>
                          {option.label}
                        </span>
                        {isActive && (
                          <CheckCircle2 className="h-4 w-4 text-purple-400 ml-auto" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Priority</p>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.priority.map(option => {
                    const isActive = activeFilters.priority?.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect('priority', option.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg transition-all text-sm",
                          isActive
                            ? "bg-purple-600/20 border border-purple-500 text-white"
                            : "bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white"
                        )}
                      >
                        <span className={option.color}>●</span> {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.type.map(option => {
                    const isActive = activeFilters.type?.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect('type', option.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg transition-all text-sm",
                          isActive
                            ? "bg-purple-600/20 border border-purple-500 text-white"
                            : "bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white"
                        )}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Budget Range Filter */}
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Budget Range</p>
                <div className="space-y-2">
                  {filterOptions.budget.map(option => {
                    const isActive = activeFilters.budget?.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect('budget', option.value)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-all",
                          isActive
                            ? "bg-purple-600/20 border border-purple-500"
                            : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800"
                        )}
                      >
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className={cn(
                          "text-sm",
                          isActive ? "text-white" : "text-gray-400"
                        )}>
                          {option.label}
                        </span>
                        {isActive && (
                          <CheckCircle2 className="h-4 w-4 text-purple-400 ml-auto" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}