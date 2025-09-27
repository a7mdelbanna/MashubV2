'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Briefcase, Plus, Search, Filter, Calendar, DollarSign,
  Users, Clock, TrendingUp, MoreVertical, ArrowUpRight,
  Folder, Star, AlertCircle, CheckCircle2, XCircle,
  PauseCircle, PlayCircle, Grid, List, ChevronDown,
  Download, Upload, ChevronLeft, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilters } from '@/components/projects/project-filters'

// Mock data for projects
const projects = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    client: {
      id: 'c1',
      name: 'TechCorp Inc.',
      logo: 'TC'
    },
    description: 'Modern e-commerce platform with AI-powered recommendations',
    type: 'web_app' as const,
    status: 'in_progress' as const,
    priority: 'high' as const,
    budget: 125000,
    spent: 78500,
    progress: 65,
    startDate: new Date('2024-01-15'),
    dueDate: new Date('2024-06-30'),
    manager: {
      id: 'm1',
      name: 'Sarah Chen',
      avatar: 'SC'
    },
    team: [
      { id: 't1', name: 'Mike Johnson', role: 'Backend Dev', avatar: 'MJ' },
      { id: 't2', name: 'Emma Davis', role: 'Frontend Dev', avatar: 'ED' },
      { id: 't3', name: 'Alex Kim', role: 'UI/UX Designer', avatar: 'AK' },
      { id: 't4', name: 'James Wilson', role: 'DevOps', avatar: 'JW' }
    ],
    tasks: {
      total: 48,
      completed: 31,
      inProgress: 12,
      todo: 5
    },
    gradient: 'gradient-blue'
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    client: {
      id: 'c2',
      name: 'FinanceHub',
      logo: 'FH'
    },
    description: 'Secure mobile banking application with biometric authentication',
    type: 'mobile_app' as const,
    status: 'in_progress' as const,
    priority: 'urgent' as const,
    budget: 185000,
    spent: 156000,
    progress: 85,
    startDate: new Date('2023-11-01'),
    dueDate: new Date('2024-03-31'),
    manager: {
      id: 'm2',
      name: 'David Lee',
      avatar: 'DL'
    },
    team: [
      { id: 't5', name: 'Sophie Brown', role: 'iOS Dev', avatar: 'SB' },
      { id: 't6', name: 'Ryan Martinez', role: 'Android Dev', avatar: 'RM' },
      { id: 't7', name: 'Lisa Wang', role: 'QA Engineer', avatar: 'LW' }
    ],
    tasks: {
      total: 62,
      completed: 53,
      inProgress: 7,
      todo: 2
    },
    gradient: 'gradient-green'
  },
  {
    id: '3',
    name: 'HR Management System',
    client: {
      id: 'c3',
      name: 'GlobalHR Solutions',
      logo: 'GH'
    },
    description: 'Comprehensive HR management system with payroll integration',
    type: 'web_app' as const,
    status: 'planning' as const,
    priority: 'medium' as const,
    budget: 95000,
    spent: 12000,
    progress: 15,
    startDate: new Date('2024-02-01'),
    dueDate: new Date('2024-08-31'),
    manager: {
      id: 'm3',
      name: 'Jennifer Taylor',
      avatar: 'JT'
    },
    team: [
      { id: 't8', name: 'Mark Anderson', role: 'Full Stack Dev', avatar: 'MA' },
      { id: 't9', name: 'Nina Patel', role: 'Business Analyst', avatar: 'NP' }
    ],
    tasks: {
      total: 35,
      completed: 5,
      inProgress: 8,
      todo: 22
    },
    gradient: 'gradient-purple'
  },
  {
    id: '4',
    name: 'POS System Upgrade',
    client: {
      id: 'c4',
      name: 'RetailChain Pro',
      logo: 'RC'
    },
    description: 'Upgrading legacy POS system to cloud-based solution',
    type: 'pos' as const,
    status: 'review' as const,
    priority: 'high' as const,
    budget: 78000,
    spent: 71000,
    progress: 92,
    startDate: new Date('2023-10-15'),
    dueDate: new Date('2024-02-28'),
    manager: {
      id: 'm1',
      name: 'Sarah Chen',
      avatar: 'SC'
    },
    team: [
      { id: 't10', name: 'Chris Evans', role: 'Backend Dev', avatar: 'CE' },
      { id: 't11', name: 'Diana Prince', role: 'QA Lead', avatar: 'DP' }
    ],
    tasks: {
      total: 28,
      completed: 26,
      inProgress: 2,
      todo: 0
    },
    gradient: 'gradient-orange'
  },
  {
    id: '5',
    name: 'AI Chat Assistant',
    client: {
      id: 'c5',
      name: 'InnovateTech',
      logo: 'IT'
    },
    description: 'AI-powered customer support chatbot with NLP capabilities',
    type: 'custom' as const,
    status: 'on_hold' as const,
    priority: 'low' as const,
    budget: 55000,
    spent: 22000,
    progress: 40,
    startDate: new Date('2024-01-01'),
    dueDate: new Date('2024-05-31'),
    manager: {
      id: 'm4',
      name: 'Robert Kim',
      avatar: 'RK'
    },
    team: [
      { id: 't12', name: 'Alice Cooper', role: 'ML Engineer', avatar: 'AC' },
      { id: 't13', name: 'Bob Dylan', role: 'Data Scientist', avatar: 'BD' }
    ],
    tasks: {
      total: 24,
      completed: 10,
      inProgress: 4,
      todo: 10
    },
    gradient: 'gradient-pink'
  },
  {
    id: '6',
    name: 'Healthcare Portal',
    client: {
      id: 'c6',
      name: 'MediCare Plus',
      logo: 'MP'
    },
    description: 'Patient portal with appointment booking and telemedicine features',
    type: 'hybrid' as const,
    status: 'completed' as const,
    priority: 'medium' as const,
    budget: 145000,
    spent: 138000,
    progress: 100,
    startDate: new Date('2023-08-01'),
    dueDate: new Date('2024-01-31'),
    manager: {
      id: 'm2',
      name: 'David Lee',
      avatar: 'DL'
    },
    team: [
      { id: 't14', name: 'Frank Ocean', role: 'Lead Dev', avatar: 'FO' },
      { id: 't15', name: 'Grace Kelly', role: 'UI Designer', avatar: 'GK' },
      { id: 't16', name: 'Henry Ford', role: 'Backend Dev', avatar: 'HF' }
    ],
    tasks: {
      total: 58,
      completed: 58,
      inProgress: 0,
      todo: 0
    },
    gradient: 'gradient-yellow'
  }
]

const statusConfig = {
  planning: { icon: Folder, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Planning' },
  in_progress: { icon: PlayCircle, color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'In Progress' },
  review: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Review' },
  completed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Completed' },
  on_hold: { icon: PauseCircle, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'On Hold' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Cancelled' }
}

const typeConfig = {
  web_app: { label: 'Web App', gradient: 'gradient-blue' },
  mobile_app: { label: 'Mobile App', gradient: 'gradient-green' },
  pos: { label: 'POS System', gradient: 'gradient-orange' },
  hybrid: { label: 'Hybrid', gradient: 'gradient-purple' },
  custom: { label: 'Custom', gradient: 'gradient-pink' }
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('dueDate')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Calculate statistics
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0)
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesType = filterType === 'all' || project.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return a.dueDate.getTime() - b.dueDate.getTime()
      case 'progress':
        return b.progress - a.progress
      case 'budget':
        return b.budget - a.budget
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
      ['Name', 'Client', 'Status', 'Progress', 'Budget', 'Spent', 'Due Date'].join(','),
      ...sortedProjects.map(p => [
        p.name,
        p.client.name,
        p.status,
        `${p.progress}%`,
        `$${p.budget}`,
        `$${p.spent}`,
        p.dueDate.toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'projects.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage and track all your projects</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => document.getElementById('import-input')?.click()}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <Link href="/dashboard/projects/new">
            <button className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all duration-300 shadow-lg flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </Link>
        </div>
        <input
          id="import-input"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => {
            // Handle file import logic here
            console.log('Importing file:', e.target.files?.[0])
          }}
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Projects</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.active}</span>
          </div>
          <p className="text-gray-400 text-sm">Active Projects</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.completed}</span>
          </div>
          <p className="text-gray-400 text-sm">Completed</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-orange">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">${(stats.totalBudget / 1000).toFixed(0)}k</span>
          </div>
          <p className="text-gray-400 text-sm">Total Budget</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-pink">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              {((stats.totalSpent / stats.totalBudget) * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Budget Utilized</p>
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
                placeholder="Search projects or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          >
            <option value="all">All Types</option>
            <option value="web_app">Web App</option>
            <option value="mobile_app">Mobile App</option>
            <option value="pos">POS System</option>
            <option value="hybrid">Hybrid</option>
            <option value="custom">Custom</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          >
            <option value="dueDate">Due Date</option>
            <option value="progress">Progress</option>
            <option value="budget">Budget</option>
            <option value="name">Name</option>
          </select>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-3 rounded-xl transition-all",
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
                "p-3 rounded-xl transition-all",
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

      {/* Projects Grid/List */}
      <div className={cn(
        viewMode === 'grid'
          ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        {paginatedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            viewMode={viewMode}
            statusConfig={statusConfig}
            typeConfig={typeConfig}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProjects.length)} of {sortedProjects.length} projects
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
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
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
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
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginatedProjects.length === 0 && (
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12">
          <div className="text-center">
            <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400">Try adjusting your filters or create a new project</p>
          </div>
        </div>
      )}
    </div>
  )
}