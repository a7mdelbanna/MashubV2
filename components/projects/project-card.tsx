'use client'

import { cn } from '@/lib/utils'
import {
  Calendar, DollarSign, Users, Clock, MoreVertical,
  ArrowUpRight, CheckCircle2, AlertTriangle, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  project: any
  viewMode: 'grid' | 'list'
  statusConfig: any
  typeConfig: any
}

export function ProjectCard({ project, viewMode, statusConfig, typeConfig }: ProjectCardProps) {
  const StatusIcon = statusConfig[project.status].icon
  const budgetPercentage = (project.spent / project.budget) * 100
  const isOverBudget = budgetPercentage > 90
  const daysLeft = Math.ceil((project.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysLeft < 0

  if (viewMode === 'list') {
    return (
      <Link href={`/dashboard/projects/${project.id}`}>
        <div className="group relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 hover:bg-gray-900/70 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {project.name}
                  </h3>
                  <div className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium",
                    typeConfig[project.type].gradient,
                    "text-white"
                  )}>
                    {typeConfig[project.type].label}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                    statusConfig[project.status].bg,
                    statusConfig[project.status].color
                  )}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[project.status].label}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{project.client.name}</span>
                  <span>•</span>
                  <span>{project.manager.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {project.team.length} members
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs font-medium text-white">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", project.gradient)}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Budget</p>
                <p className={cn(
                  "text-sm font-medium",
                  isOverBudget ? "text-red-400" : "text-white"
                )}>
                  ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
                </p>
              </div>

              {/* Due Date */}
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Due Date</p>
                <p className={cn(
                  "text-sm font-medium",
                  isOverdue ? "text-red-400" : daysLeft < 7 ? "text-yellow-400" : "text-white"
                )}>
                  {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                </p>
              </div>
            </div>

            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors ml-4" />
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
          project.gradient
        )} />

        {/* Card */}
        <div className="relative h-full rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 group-hover:bg-gray-900/70 transition-all duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center text-white font-medium">
                {project.client.logo}
              </div>
              <div>
                <p className="text-xs text-gray-400">{project.client.name}</p>
                <div className={cn(
                  "text-xs font-medium mt-1 px-2 py-0.5 rounded inline-block",
                  typeConfig[project.type].gradient,
                  "text-white"
                )}>
                  {typeConfig[project.type].label}
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Project Name */}
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Status */}
          <div className="flex items-center gap-2 mb-4">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
              statusConfig[project.status].bg,
              statusConfig[project.status].color
            )}>
              <StatusIcon className="h-4 w-4" />
              {statusConfig[project.status].label}
            </div>
            {project.priority === 'urgent' && (
              <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Urgent
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-medium text-white">{project.progress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", project.gradient)}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Tasks Overview */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400 mb-1">Tasks</p>
              <p className="text-sm font-medium text-white">
                {project.tasks.completed}/{project.tasks.total}
              </p>
            </div>
            <div className="rounded-lg bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400 mb-1">In Progress</p>
              <p className="text-sm font-medium text-purple-400">
                {project.tasks.inProgress} tasks
              </p>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="space-y-3 mb-4">
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
                  ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
                </p>
                {isOverBudget && (
                  <p className="text-xs text-red-400 mt-0.5">Over budget</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Due Date</span>
              </div>
              <p className={cn(
                "text-sm font-medium",
                isOverdue ? "text-red-400" : daysLeft < 7 ? "text-yellow-400" : "text-white"
              )}>
                {project.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member: any, index: number) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-medium"
                  >
                    {member.avatar}
                  </div>
                ))}
                {project.team.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-gray-400 text-xs font-medium">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
              <span className="ml-3 text-sm text-gray-400">
                {project.team.length} members
              </span>
            </div>

            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}