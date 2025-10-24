'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  CheckSquare, Plus, Search, Grid, List,
  Palette, Code, Scale, TestTube, Rocket,
  FileText, Circle, Edit, Copy, Trash2,
  ChevronDown, TrendingUp, Target
} from 'lucide-react'
import { MOCK_CHECKLIST_TEMPLATES } from '@/lib/mock-project-data'
import { AppType } from '@/types'
import { APP_TYPE_CONFIG } from '@/components/apps/app-type-badge'

const CATEGORY_ICONS = {
  branding: Palette,
  technical: Code,
  legal: Scale,
  qa: TestTube,
  deployment: Rocket,
  documentation: FileText,
  other: Circle
}

export default function ChecklistsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAppType, setSelectedAppType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter templates
  const filteredTemplates = MOCK_CHECKLIST_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedAppType === 'all' || template.appTypes.includes(selectedAppType as AppType)
    return matchesSearch && matchesType
  })

  // Calculate stats
  const stats = {
    total: MOCK_CHECKLIST_TEMPLATES.length,
    totalItems: MOCK_CHECKLIST_TEMPLATES.reduce((sum, t) => sum + t.items.length, 0),
    avgItems: Math.round(MOCK_CHECKLIST_TEMPLATES.reduce((sum, t) => sum + t.items.length, 0) / MOCK_CHECKLIST_TEMPLATES.length),
    appTypes: new Set(MOCK_CHECKLIST_TEMPLATES.flatMap(t => t.appTypes)).size
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pre-Production Checklists</h1>
          <p className="text-gray-400">Manage checklist templates for different app types</p>
        </div>
        <button className="px-6 py-3 rounded-xl gradient-orange text-white font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Template
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Templates</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.totalItems}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Items</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.avgItems}</span>
          </div>
          <p className="text-gray-400 text-sm">Avg. Items/Template</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-orange">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.appTypes}</span>
          </div>
          <p className="text-gray-400 text-sm">App Types</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* App Type Filter */}
          <select
            value={selectedAppType}
            onChange={(e) => setSelectedAppType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="all">All App Types</option>
            {Object.entries(APP_TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-3 rounded-xl transition-colors",
                viewMode === 'grid'
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              )}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-3 rounded-xl transition-colors",
                viewMode === 'list'
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              )}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className={cn(
        viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        {filteredTemplates.map((template) => {
          // Group items by category
          const itemsByCategory = template.items.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = []
            acc[item.category].push(item)
            return acc
          }, {} as Record<string, typeof template.items>)

          const requiredItems = template.items.filter(item => item.required).length

          return (
            <div
              key={template.id}
              className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all duration-150 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{template.description}</p>
                  )}
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
                  <Edit className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* App Types */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">App Types:</p>
                <div className="flex flex-wrap gap-2">
                  {template.appTypes.map((type) => {
                    const config = APP_TYPE_CONFIG[type]
                    const Icon = config.icon
                    return (
                      <div
                        key={type}
                        className={cn(
                          'px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1',
                          config.bg,
                          config.text,
                          `border border-${config.text.replace('text-', '')}/20`
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 rounded-lg bg-gray-800/30">
                <div>
                  <p className="text-xs text-gray-500">Total Items</p>
                  <p className="text-lg font-bold text-white">{template.items.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Required</p>
                  <p className="text-lg font-bold text-orange-400">{requiredItems}</p>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Categories:</p>
                <div className="space-y-2">
                  {Object.entries(itemsByCategory).map(([category, items]) => {
                    const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Circle
                    return (
                      <div key={category} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-gray-300 capitalize">{category}</span>
                        </div>
                        <span className="text-gray-500">{items.length} items</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                <button className="flex-1 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors">
                  Edit Template
                </button>
                <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Copy className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12 text-center">
          <CheckSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
          <p className="text-gray-400">Try adjusting your filters or create a new template</p>
        </div>
      )}
    </div>
  )
}
