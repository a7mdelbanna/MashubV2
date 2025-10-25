'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { projectsService } from '@/lib/services/projects-service'
import { Project } from '@/types'
import { Task, Milestone, TimeEntry, ProjectTimeline } from '@/types/projects'
import { PermissionGuard } from '@/components/auth/permission-guard'
import { Can } from '@/components/auth/can'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, MoreVertical, Edit, Trash2, Calendar, Clock, DollarSign,
  Users, Briefcase, CheckCircle2, AlertCircle, PlayCircle, Star,
  MessageSquare, Plus, Activity, TrendingUp, Target, FileText
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type TabType = 'overview' | 'tasks' | 'timeline' | 'milestones' | 'team'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [timeline, setTimeline] = useState<ProjectTimeline[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Real-time subscription to project
  useEffect(() => {
    if (!projectId) return

    const unsubscribe = projectsService.subscribeToProject(projectId, (updatedProject) => {
      setProject(updatedProject)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [projectId])

  // Real-time subscription to related data
  useEffect(() => {
    if (!projectId) return

    const unsubTasks = projectsService.subscribeToTasks(projectId, setTasks)
    const unsubMilestones = projectsService.subscribeToMilestones(projectId, setMilestones)
    const unsubTimeline = projectsService.subscribeToTimeline(projectId, setTimeline)

    return () => {
      unsubTasks()
      unsubMilestones()
      unsubTimeline()
    }
  }, [projectId])

  const handleDelete = async () => {
    if (!project) return

    try {
      await projectsService.deleteProject(project.id)
      toast.success('Project archived successfully')
      router.push('/dashboard/projects')
    } catch (error: any) {
      console.error('Error archiving project:', error)
      toast.error(error.message || 'Failed to archive project')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      planning: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      in_progress: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      on_hold: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
      archived: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-500/20 text-gray-300',
      medium: 'bg-blue-500/20 text-blue-300',
      high: 'bg-orange-500/20 text-orange-300',
      critical: 'bg-red-500/20 text-red-300'
    }
    return colors[priority as keyof typeof colors] || colors.low
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-800" />
            <div>
              <div className="h-8 w-64 bg-gray-800 rounded mb-2" />
              <div className="h-4 w-96 bg-gray-800 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-800 rounded-lg" />
            <div className="h-10 w-24 bg-gray-800 rounded-lg" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-800 rounded-xl h-32" />
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="border-b border-gray-800">
          <div className="flex space-x-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-800 rounded-t" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-gray-800 rounded-xl h-96" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Briefcase className="h-16 w-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-gray-400 mb-6">The project you're looking for doesn't exist</p>
        <Link
          href="/dashboard/projects"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Back to Projects
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Briefcase },
    { id: 'tasks' as TabType, label: 'Tasks', icon: CheckCircle2 },
    { id: 'milestones' as TabType, label: 'Milestones', icon: Target },
    { id: 'timeline' as TabType, label: 'Timeline', icon: Activity },
    { id: 'team' as TabType, label: 'Team', icon: Users }
  ]

  return (
    <PermissionGuard permission="read:projects">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/projects"
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-sm sm:text-base text-gray-400 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={cn("px-3 py-1 rounded-lg text-xs font-medium border", getStatusColor(project.status))}>
                  {project.status}
                </span>
                <span className={cn("px-3 py-1 rounded-lg text-xs font-medium", getPriorityColor(project.priority))}>
                  {project.priority}
                </span>
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Can permission="write:projects">
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Archive</span>
              </button>
            </Can>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-2">{project.completionPercentage}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Budget</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {formatCurrency(project.budgetSpent || 0)}
                </p>
                <p className="text-xs text-gray-500">of {formatCurrency(project.budgetAllocated || 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Tasks</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {project.tasksCompleted}/{project.tasksTotal}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Team Size</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-2">{project.teamSize || 0}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 overflow-hidden">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base",
                    activeTab === tab.id
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && <OverviewTab project={project} />}
          {activeTab === 'tasks' && <TasksTab tasks={tasks} projectId={project.id} />}
          {activeTab === 'milestones' && <MilestonesTab milestones={milestones} projectId={project.id} />}
          {activeTab === 'timeline' && <TimelineTab timeline={timeline} />}
          {activeTab === 'team' && <TeamTab project={project} />}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-2">Archive Project?</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to archive this project? This will change its status to archived.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  )
}

// Overview Tab Component
function OverviewTab({ project }: { project: Project }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Project Details */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
          <div className="space-y-3">
            {project.clientName && (
              <div>
                <p className="text-sm text-gray-400">Client</p>
                <p className="text-white mt-1">{project.clientName}</p>
              </div>
            )}
            {project.managerName && (
              <div>
                <p className="text-sm text-gray-400">Project Manager</p>
                <p className="text-white mt-1">{project.managerName}</p>
              </div>
            )}
            {project.ownerName && (
              <div>
                <p className="text-sm text-gray-400">Owner</p>
                <p className="text-white mt-1">{project.ownerName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{project.description}</p>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Timeline */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="text-white mt-1">{formatDate(project.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">End Date</p>
              <p className="text-white mt-1">{formatDate(project.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Created</p>
              <p className="text-white mt-1">{formatDate(project.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Budget</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-400">Allocated</p>
              <p className="text-white font-semibold">{formatCurrency(project.budgetAllocated || 0)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Spent</p>
              <p className="text-white font-semibold">{formatCurrency(project.budgetSpent || 0)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Remaining</p>
              <p className="text-green-400 font-semibold">
                {formatCurrency((project.budgetAllocated || 0) - (project.budgetSpent || 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-400">Tasks</p>
              <p className="text-white font-semibold">{project.tasksCompleted}/{project.tasksTotal}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Milestones</p>
              <p className="text-white font-semibold">{project.milestonesCompleted}/{project.milestonesTotal}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Completion</p>
              <p className="text-purple-400 font-semibold">{project.completionPercentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tasks Tab Component
function TasksTab({ tasks, projectId }: { tasks: Task[], projectId: string }) {
  const getTaskStatusColor = (status: string) => {
    const colors = {
      backlog: 'bg-gray-500/20 text-gray-300',
      todo: 'bg-blue-500/20 text-blue-300',
      in_progress: 'bg-purple-500/20 text-purple-300',
      in_review: 'bg-yellow-500/20 text-yellow-300',
      done: 'bg-green-500/20 text-green-300',
      blocked: 'bg-red-500/20 text-red-300'
    }
    return colors[status as keyof typeof colors] || colors.backlog
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Tasks</h3>
        <Can permission="write:projects">
          <Link
            href={`/dashboard/projects/${projectId}/board`}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Go to Kanban Board</span>
          </Link>
        </Can>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
          <CheckCircle2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 10).map(task => (
            <div key={task.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
                </div>
                <span className={cn("px-2 py-1 rounded text-xs font-medium ml-4", getTaskStatusColor(task.status))}>
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {task.assigneeName && <span>Assigned to: {task.assigneeName}</span>}
                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Milestones Tab Component
function MilestonesTab({ milestones, projectId }: { milestones: Milestone[], projectId: string }) {
  const getMilestoneStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-500/20 text-blue-300',
      in_progress: 'bg-purple-500/20 text-purple-300',
      completed: 'bg-green-500/20 text-green-300',
      delayed: 'bg-red-500/20 text-red-300'
    }
    return colors[status as keyof typeof colors] || colors.upcoming
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Milestones</h3>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
          <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No milestones yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map(milestone => (
            <div key={milestone.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{milestone.name}</h4>
                  <p className="text-sm text-gray-400">{milestone.description}</p>
                </div>
                <span className={cn("px-2 py-1 rounded text-xs font-medium ml-4", getMilestoneStatusColor(milestone.status))}>
                  {milestone.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                <span>Tasks: {milestone.tasksCompleted}/{milestone.tasksTotal}</span>
                <span>Progress: {milestone.completionPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Timeline Tab Component
function TimelineTab({ timeline }: { timeline: ProjectTimeline[] }) {
  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'milestone': return Target
      case 'task': return CheckCircle2
      case 'sprint': return Activity
      case 'document': return FileText
      case 'team': return Users
      default: return Activity
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>

      {timeline.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {timeline.map(event => {
            const Icon = getTimelineIcon(event.type)
            return (
              <div key={event.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">{event.userName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Team Tab Component
function TeamTab({ project }: { project: Project }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Team Members</h3>
        <p className="text-gray-400">Total: {project.teamSize || 0}</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <div className="space-y-4">
          {project.ownerName && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Owner</p>
              <p className="text-white">{project.ownerName}</p>
            </div>
          )}
          {project.managerName && (
            <div>
              <p className="text-sm text-gray-400 mb-1">Manager</p>
              <p className="text-white">{project.managerName}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-400 mb-1">Team Size</p>
            <p className="text-white">{project.teamSize || 0} members</p>
          </div>
        </div>
      </div>
    </div>
  )
}
