'use client'

import { cn } from '@/lib/utils'
import { Project } from '@/types'
import {
  Calendar, DollarSign, Users, Clock, MoreVertical,
  ArrowUpRight, CheckCircle2, AlertTriangle, TrendingUp,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
  viewMode: 'grid' | 'list'
  statusConfig: any
  formatCurrency: (amount: number) => string
}

export function ProjectCard({ project, viewMode, statusConfig, formatCurrency }: ProjectCardProps) {
  const StatusIcon = statusConfig[project.status]?.icon || Briefcase
  const budgetAllocated = project.budgetAllocated || 0
  const budgetSpent = project.budgetSpent || 0
  const budgetPercentage = budgetAllocated > 0 ? (budgetSpent / budgetAllocated) * 100 : 0
  const isOverBudget = budgetPercentage > 90

  // Calculate days left
  const daysLeft = project.endDate
    ? Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null
  const isOverdue = daysLeft !== null && daysLeft < 0

  // Get gradient based on status
  const getGradient = () => {
    switch (project.status) {
      case 'completed': return 'gradient-green'
      case 'in_progress': return 'gradient-purple'
      case 'on_hold': return 'gradient-orange'
      case 'cancelled': return 'gradient-red'
      default: return 'gradient-blue'
    }
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/dashboard/projects/${project.id}`}>
        <div className="group relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4 sm:p-6 hover:bg-gray-900/70 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                  {project.name}
                </h3>
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                  statusConfig[project.status]?.bg || 'bg-gray-400/10',
                  statusConfig[project.status]?.color || 'text-gray-400'
                )}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig[project.status]?.label || project.status}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                {project.clientName && (
                  <>
                    <span className="truncate">{project.clientName}</span>
                    <span className="hidden sm:inline">•</span>
                  </>
                )}
                {project.managerName && (
                  <>
                    <span className="truncate">{project.managerName}</span>
                    <span className="hidden sm:inline">•</span>
                  </>
                )}
                {project.teamSize && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {project.teamSize} members
                  </span>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="w-full sm:w-32">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Progress</span>
                <span className="text-xs font-medium text-white">{project.completionPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", getGradient())}
                  style={{ width: `${project.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Budget */}
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-400 mb-1">Budget</p>
              <p className={cn(
                "text-sm font-medium",
                isOverBudget ? "text-red-400" : "text-white"
              )}>
                {formatCurrency(budgetSpent)} / {formatCurrency(budgetAllocated)}
              </p>
            </div>

            {/* Due Date */}
            {daysLeft !== null && (
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-400 mb-1">Due Date</p>
                <p className={cn(
                  "text-sm font-medium",
                  isOverdue ? "text-red-400" : daysLeft < 7 ? "text-yellow-400" : "text-white"
                )}>
                  {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                </p>
              </div>
            )}

            <ArrowUpRight className="hidden sm:block h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors ml-4" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <div className="group relative">
        {/* Hover Glow */}
        <div className={cn(
          "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500",
          getGradient()
        )} />

        {/* Card */}
        <div className="relative h-full rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4 sm:p-6 group-hover:bg-gray-900/70 transition-all duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center text-white font-medium flex-shrink-0">
                {project.clientName ? project.clientName.substring(0, 2).toUpperCase() : project.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 truncate">{project.clientName || 'No Client'}</p>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded inline-block",
                  "bg-purple-500/20 text-purple-300"
                )}>
                  {project.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Project Name */}
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
            {project.name}
          </h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {project.description || 'No description'}
          </p>

          {/* Status */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
              statusConfig[project.status]?.bg || 'bg-gray-400/10',
              statusConfig[project.status]?.color || 'text-gray-400'
            )}>
              <StatusIcon className="h-4 w-4" />
              {statusConfig[project.status]?.label || project.status}
            </div>
            {project.priority === 'critical' && (
              <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Critical
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-medium text-white">{project.completionPercentage}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", getGradient())}
                style={{ width: `${project.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Tasks Overview */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400 mb-1">Tasks</p>
              <p className="text-sm font-medium text-white">
                {project.tasksCompleted}/{project.tasksTotal}
              </p>
            </div>
            <div className="rounded-lg bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400 mb-1">Milestones</p>
              <p className="text-sm font-medium text-purple-400">
                {project.milestonesCompleted}/{project.milestonesTotal}
              </p>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="space-y-3 mb-4">
            {budgetAllocated > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget</span>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-medium",
                    isOverBudget ? "text-red-400" : "text-white"
                  )}>
                    {formatCurrency(budgetSpent)} / {formatCurrency(budgetAllocated)}
                  </p>
                  {isOverBudget && (
                    <p className="text-xs text-red-400 mt-0.5">Over budget</p>
                  )}
                </div>
              </div>
            )}

            {project.endDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Due Date</span>
                </div>
                <p className={cn(
                  "text-sm font-medium",
                  isOverdue ? "text-red-400" : daysLeft && daysLeft < 7 ? "text-yellow-400" : "text-white"
                )}>
                  {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>

          {/* Team */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {project.teamSize || 0} {project.teamSize === 1 ? 'member' : 'members'}
              </span>
            </div>

            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}
