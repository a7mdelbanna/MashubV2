'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Smartphone, Plus, Search, Filter, Grid, List,
  Download, Upload, ChevronLeft, ChevronRight,
  TrendingUp, CheckCircle2, AlertCircle, Users,
  Package, Activity
} from 'lucide-react'
import { MOCK_APPS, MOCK_PROJECTS } from '@/lib/mock-project-data'
import { AppCard } from '@/components/apps/app-card'
import { AppTypeBadge, APP_TYPE_CONFIG } from '@/components/apps/app-type-badge'
import { AppType } from '@/types'

export default function AppsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Calculate statistics
  const stats = {
    total: MOCK_APPS.length,
    production: MOCK_APPS.filter(a => a.status === 'production').length,
    development: MOCK_APPS.filter(a => a.status === 'development').length,
    avgUptime: (MOCK_APPS.reduce((sum, a) => sum + (a.health.uptime || 0), 0) / MOCK_APPS.length).toFixed(1),
    totalIssues: MOCK_APPS.reduce((sum, a) => sum + (a.health.issues || 0), 0)
  }

  // Get unique app types
  const appTypes = Object.keys(APP_TYPE_CONFIG) as AppType[]

  // Filter apps
  const filteredApps = MOCK_APPS.filter(app => {
    const matchesSearch = app.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || app.type === selectedType
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedApps = filteredApps.slice(startIndex, startIndex + itemsPerPage)

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Type', 'Client', 'Status', 'Version', 'Uptime', 'Issues'].join(','),
      ...filteredApps.map(a => [
        a.nameEn,
        a.type,
        a.client.name,
        a.status,
        a.releases.current.version,
        `${a.health.uptime}%`,
        a.health.issues
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'apps.csv'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Apps & Deliverables</h1>
          <p className="text-gray-400">Manage all deployed applications across projects</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => document.getElementById('import-input')?.click()}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-colors duration-150 flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-colors duration-150 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <Link href="/dashboard/apps/new">
            <button className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              New App
            </button>
          </Link>
        </div>
        <input
          id="import-input"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => console.log('Importing file:', e.target.files?.[0])}
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Apps</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.production}</span>
          </div>
          <p className="text-gray-400 text-sm">In Production</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-orange">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.development}</span>
          </div>
          <p className="text-gray-400 text-sm">In Development</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{stats.avgUptime}%</span>
          </div>
          <p className="text-gray-400 text-sm">Avg. Uptime</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-pink">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.totalIssues}</span>
          </div>
          <p className="text-gray-400 text-sm">Open Issues</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps by name or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="all">All Types</option>
            {appTypes.map(type => (
              <option key={type} value={type}>
                {APP_TYPE_CONFIG[type].label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
            <option value="maintenance">Maintenance</option>
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

      {/* Apps Grid/List */}
      <div className={cn(
        viewMode === 'grid'
          ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        {paginatedApps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            viewMode={viewMode}
            showClient={true}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredApps.length)} of {filteredApps.length} apps
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pageNumber === currentPage
                        ? "gradient-purple text-white"
                        : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    )}
                  >
                    {pageNumber}
                  </button>
                )
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="px-2 text-gray-500">
                    ...
                  </span>
                )
              }
              return null
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginatedApps.length === 0 && (
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12 text-center">
          <Smartphone className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No apps found</h3>
          <p className="text-gray-400">Try adjusting your filters or create a new app</p>
        </div>
      )}
    </div>
  )
}
