'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { projectsService } from '@/lib/services/projects-service'
import { Project } from '@/types/projects'
import { cn } from '@/lib/utils'
import {
  Briefcase, Plus, Search, Filter, Calendar, DollarSign,
  Users, Clock, TrendingUp, MoreVertical, ArrowUpRight,
  Folder, Star, AlertCircle, CheckCircle2, XCircle,
  PauseCircle, PlayCircle, Grid, List, ChevronDown,
  Download, Upload, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { ProjectCard } from '@/components/projects/project-card'
import { PermissionGuard } from '@/components/auth/permission-guard'
import { Can } from '@/components/auth/can'
import toast from 'react-hot-toast'

const statusConfig = {
  draft: { icon: Folder, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Draft' },
  planning: { icon: Folder, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Planning' },
  in_progress: { icon: PlayCircle, color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'In Progress' },
  on_hold: { icon: PauseCircle, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'On Hold' },
  completed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Cancelled' },
  archived: { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Archived' }
}

const priorityConfig = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
}

const typeConfig = {
  web_app: { label: 'Web App', gradient: 'gradient-blue' },
  mobile_app: { label: 'Mobile App', gradient: 'gradient-green' },
  pos: { label: 'POS System', gradient: 'gradient-orange' },
  hybrid: { label: 'Hybrid', gradient: 'gradient-purple' },
  custom: { label: 'Custom', gradient: 'gradient-pink' }
}

export default function ProjectsPage() {
  const { user, tenant } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Real-time subscription to projects
  useEffect(() => {
    if (!tenant?.id) return

    setLoading(true)
    const unsubscribe = projectsService.subscribeToProjects(
      tenant.id,
      (updatedProjects) => {
        setProjects(updatedProjects)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [tenant?.id])

  // Calculate statistics
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budgetAllocated || 0), 0),
    totalSpent: projects.reduce((sum, p) => sum + (p.budgetSpent || 0), 0)
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.clientName && project.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'endDate':
        if (!a.endDate && !b.endDate) return 0
        if (!a.endDate) return 1
        if (!b.endDate) return -1
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      case 'progress':
        return b.completionPercentage - a.completionPercentage
      case 'budget':
        return (b.budgetAllocated || 0) - (a.budgetAllocated || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage)

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Client', 'Status', 'Priority', 'Progress', 'Budget', 'Spent', 'Start Date', 'End Date'].join(','),
      ...sortedProjects.map(p => [
        p.name,
        p.clientName || 'N/A',
        p.status,
        p.priority,
        `${p.completionPercentage}%`,
        `$${p.budgetAllocated || 0}`,
        `$${p.budgetSpent || 0}`,
        p.startDate || 'N/A',
        p.endDate || 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projects-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-800 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-800 rounded" />
          </div>
          <div className="h-10 w-32 bg-gray-800 rounded-lg" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-gray-800 rounded-xl h-32" />
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-gray-800 rounded-lg" />
          <div className="h-10 w-32 bg-gray-800 rounded-lg" />
          <div className="h-10 w-32 bg-gray-800 rounded-lg" />
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-800 rounded-xl h-96" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard permission="read:projects">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-sm sm:text-base text-gray-400">Manage and track all your projects</p>
          </div>

          <Can permission="write:projects">
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Link>
          </Can>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Total Projects</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.active}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Total Budget</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{formatCurrency(stats.totalBudget)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Total Spent</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{formatCurrency(stats.totalSpent)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="createdAt">Created Date</option>
            <option value="endDate">Due Date</option>
            <option value="progress">Progress</option>
            <option value="budget">Budget</option>
            <option value="name">Name</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Projects Grid/List */}
        {paginatedProjects.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
            <Briefcase className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first project'}
            </p>
            <Can permission="write:projects">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Project</span>
              </Link>
            </Can>
          </div>
        ) : (
          <>
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                : 'space-y-4'
            )}>
              {paginatedProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  statusConfig={statusConfig}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <p className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProjects.length)} of {sortedProjects.length} projects
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PermissionGuard>
  )
}
