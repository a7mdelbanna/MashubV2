'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Flag, TrendingUp, CheckCircle2, Clock, AlertCircle, Edit, Trash2, Target, Link2 } from 'lucide-react'
import { Milestone } from '@/types'
import { MilestonesService } from '@/services/milestones.service'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

// Helper functions
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    overdue: 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    upcoming: Clock,
    in_progress: TrendingUp,
    completed: CheckCircle2,
    overdue: AlertCircle
  }
  return icons[status] || Flag
}

const isOverdue = (dueDate: Date, status: string) => {
  if (status === 'completed') return false
  return new Date(dueDate) < new Date()
}

const getDaysUntil = (dueDate: Date) => {
  const now = new Date()
  const diff = Math.ceil((new Date(dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function MilestonesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenant } = useAuth()

  const projectId = searchParams.get('projectId')

  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Load milestones from Firebase
  useEffect(() => {
    if (!tenant?.id || !projectId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = MilestonesService.subscribe(
      tenant.id,
      projectId,
      (fetchedMilestones) => {
        setMilestones(fetchedMilestones)
        setLoading(false)
      },
      {
        orderByField: 'dueDate',
        orderDirection: 'asc'
      }
    )

    return () => unsubscribe()
  }, [tenant?.id, projectId])

  const handleCreateMilestone = async () => {
    if (!tenant?.id || !projectId) {
      toast.error('Project not found')
      return
    }

    try {
      await MilestonesService.create(tenant.id, projectId, {
        name: 'New Milestone',
        description: 'Milestone description',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'upcoming',
        deliverables: [],
        progress: 0,
        projectId: projectId
      })
      toast.success('Milestone created successfully')
    } catch (error) {
      console.error('Error creating milestone:', error)
      toast.error('Failed to create milestone')
    }
  }

  const handleUpdateProgress = async (milestoneId: string, newProgress: number) => {
    if (!tenant?.id || !projectId) return

    try {
      await MilestonesService.updateProgress(tenant.id, projectId, milestoneId, newProgress)
      toast.success('Progress updated')
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading milestones...</p>
        </div>
      </div>
    )
  }

  // No project selected
  if (!projectId) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Project Selected</h2>
          <p className="text-gray-400 mb-4">Please select a project to view its milestones</p>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Go to Projects
          </button>
        </div>
      </div>
    )
  }

  // Filter milestones
  const filteredMilestones = milestones.filter(milestone => {
    if (filterStatus === 'all') return true
    return milestone.status === filterStatus
  })

  // Calculate stats
  const totalMilestones = milestones.length
  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const upcomingMilestones = milestones.filter(m => m.status === 'upcoming').length
  const overdueMilestones = milestones.filter(m => isOverdue(m.dueDate, m.status)).length

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Project Milestones
          </h1>
          <p className="text-gray-400">Track key deliverables and project phases</p>
        </div>

        <button
          onClick={handleCreateMilestone}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Milestone
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <Flag className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{totalMilestones}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Milestones</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{completedMilestones}</span>
          </div>
          <p className="text-gray-400 text-sm">Completed</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{upcomingMilestones}</span>
          </div>
          <p className="text-gray-400 text-sm">Upcoming</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-orange">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{overdueMilestones}</span>
          </div>
          <p className="text-gray-400 text-sm">Overdue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filter:</span>
          {['all', 'upcoming', 'in_progress', 'completed', 'overdue'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {filteredMilestones.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center">
            <Flag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {filterStatus === 'all' ? 'No Milestones Yet' : `No ${filterStatus} Milestones`}
            </h3>
            <p className="text-gray-400 mb-4">
              {filterStatus === 'all'
                ? 'Create your first milestone to track project deliverables'
                : 'Try adjusting your filters'}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={handleCreateMilestone}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create Milestone
              </button>
            )}
          </div>
        ) : (
          filteredMilestones.map((milestone, index) => {
            const StatusIcon = getStatusIcon(milestone.status)
            const daysUntil = getDaysUntil(milestone.dueDate)
            const overdueStatus = isOverdue(milestone.dueDate, milestone.status)

            return (
              <div
                key={milestone.id}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
              >
                {/* Timeline Connector */}
                {index < filteredMilestones.length - 1 && (
                  <div className="ml-6 mt-6 mb-2 h-8 border-l-2 border-dashed border-gray-700"></div>
                )}

                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`p-4 rounded-xl ${getStatusColor(milestone.status)} border`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{milestone.name}</h3>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {overdueStatus && (
                            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                              OVERDUE
                            </span>
                          )}
                        </div>
                        {milestone.description && (
                          <p className="text-gray-400">{milestone.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Due Date</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-medium">
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {daysUntil > 0 && milestone.status !== 'completed' && (
                          <div className="text-xs text-gray-500 mt-1">
                            {daysUntil} days remaining
                          </div>
                        )}
                        {daysUntil < 0 && milestone.status !== 'completed' && (
                          <div className="text-xs text-red-400 mt-1">
                            {Math.abs(daysUntil)} days overdue
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Progress</div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-medium">{milestone.progress}%</span>
                        </div>
                      </div>

                      {milestone.tasksLinked && milestone.tasksLinked.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Linked Tasks</div>
                          <div className="flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-medium">
                              {milestone.tasksLinked.length} tasks
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Completion</span>
                        <button
                          onClick={() => {
                            const newProgress = Math.min(milestone.progress + 10, 100)
                            handleUpdateProgress(milestone.id, newProgress)
                          }}
                          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Update Progress
                        </button>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            milestone.progress === 100
                              ? 'bg-green-500'
                              : 'bg-gradient-to-r from-purple-600 to-blue-600'
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Deliverables */}
                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-white mb-3">Deliverables</div>
                        <ul className="space-y-2">
                          {milestone.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
