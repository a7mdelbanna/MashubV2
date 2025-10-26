'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Target, TrendingUp, Clock, CheckCircle2, PlayCircle, Edit, Trash2, ChevronRight, Users } from 'lucide-react'
import { Sprint, Task } from '@/types'
import { SprintsService } from '@/services/sprints.service'
import { TasksService } from '@/services/tasks.service'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

// Helper functions
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }
  return colors[priority] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    planned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

const calculateDaysRemaining = (endDate: Date) => {
  const now = new Date()
  const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

const calculateProgress = (sprint: Sprint) => {
  if (!sprint.capacity || sprint.capacity === 0) return 0
  return Math.round((sprint.completed / sprint.capacity) * 100)
}

export default function SprintsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenant } = useAuth()

  const projectId = searchParams.get('projectId')

  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const [sprintTasks, setSprintTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Load sprints from Firebase
  useEffect(() => {
    if (!tenant?.id || !projectId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = SprintsService.subscribe(
      tenant.id,
      projectId,
      (fetchedSprints) => {
        setSprints(fetchedSprints)
        // Auto-select active sprint or first sprint
        if (fetchedSprints.length > 0 && !selectedSprint) {
          const activeSprint = fetchedSprints.find(s => s.status === 'active')
          setSelectedSprint(activeSprint || fetchedSprints[0])
        }
        setLoading(false)
      },
      {
        orderByField: 'startDate',
        orderDirection: 'desc'
      }
    )

    return () => unsubscribe()
  }, [tenant?.id, projectId])

  // Load tasks for selected sprint
  useEffect(() => {
    if (!tenant?.id || !projectId || !selectedSprint) return

    const unsubscribe = TasksService.subscribe(
      tenant.id,
      projectId,
      (fetchedTasks) => {
        setSprintTasks(fetchedTasks)
      },
      {
        sprintId: selectedSprint.id
      }
    )

    return () => unsubscribe()
  }, [tenant?.id, projectId, selectedSprint?.id])

  const handleCreateSprint = async () => {
    if (!tenant?.id || !projectId) {
      toast.error('Project not found')
      return
    }

    try {
      await SprintsService.create(tenant.id, projectId, {
        name: `Sprint ${sprints.length + 1}`,
        goal: 'Enter sprint goal',
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        status: 'planned',
        capacity: 40,
        committed: 0,
        completed: 0,
        definitionOfDone: [
          'Code reviewed',
          'Tests written',
          'Documentation updated'
        ],
        projectId: projectId
      })
      toast.success('Sprint created successfully')
    } catch (error) {
      console.error('Error creating sprint:', error)
      toast.error('Failed to create sprint')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading sprints...</p>
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
          <p className="text-gray-400 mb-4">Please select a project to view its sprints</p>
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

  // Calculate stats for selected sprint
  const completedTasks = sprintTasks.filter(t => t.status === 'done').length
  const inProgressTasks = sprintTasks.filter(t => t.status === 'in_progress').length
  const totalPoints = sprintTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)
  const completedPoints = sprintTasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || 0), 0)

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Sprint Management
          </h1>
          <p className="text-gray-400">Plan and track your agile sprints</p>
        </div>

        <button
          onClick={handleCreateSprint}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Sprint
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sprint List Sidebar */}
        <div className="col-span-3">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">All Sprints</h3>
            <div className="space-y-2">
              {sprints.length === 0 ? (
                <div className="text-center py-8">
                  <PlayCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No sprints yet</p>
                  <button
                    onClick={handleCreateSprint}
                    className="mt-3 text-purple-400 text-sm hover:text-purple-300 transition-colors"
                  >
                    Create your first sprint
                  </button>
                </div>
              ) : (
                sprints.map(sprint => (
                  <button
                    key={sprint.id}
                    onClick={() => setSelectedSprint(sprint)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedSprint?.id === sprint.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{sprint.name}</span>
                      {sprint.status === 'active' && (
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(sprint.startDate).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sprint Detail */}
        <div className="col-span-9">
          {selectedSprint ? (
            <div className="space-y-6">
              {/* Sprint Header */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{selectedSprint.name}</h2>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(selectedSprint.status)}`}>
                        {selectedSprint.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400">{selectedSprint.goal}</p>
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

                {/* Sprint Dates */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Start Date</div>
                    <div className="text-white font-medium">
                      {new Date(selectedSprint.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">End Date</div>
                    <div className="text-white font-medium">
                      {new Date(selectedSprint.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Days Remaining</div>
                    <div className="text-white font-medium">
                      {calculateDaysRemaining(new Date(selectedSprint.endDate))} days
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Sprint Progress</span>
                    <span className="text-sm font-medium text-white">
                      {calculateProgress(selectedSprint)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                      style={{ width: `${calculateProgress(selectedSprint)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sprint Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl gradient-purple">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">{sprintTasks.length}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Total Tasks</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl gradient-green">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">{completedTasks}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Completed</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl gradient-yellow">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">{inProgressTasks}</span>
                  </div>
                  <p className="text-gray-400 text-sm">In Progress</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl gradient-blue">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {completedPoints}/{totalPoints}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Story Points</p>
                </div>
              </div>

              {/* Sprint Tasks */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sprint Tasks</h3>

                {sprintTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No tasks in this sprint yet</p>
                    <p className="text-gray-500 text-sm">Add tasks from the backlog to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sprintTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-4 rounded-lg bg-gray-700/30 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-white">{task.title}</h4>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority.toUpperCase()}
                              </span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-600 text-gray-300">
                                {task.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            {task.description && (
                              <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              {task.storyPoints && (
                                <span className="flex items-center gap-1">
                                  <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-medium">
                                    {task.storyPoints}
                                  </div>
                                  <span>points</span>
                                </span>
                              )}
                              {task.assignee?.name && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {task.assignee.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Definition of Done */}
              {selectedSprint.definitionOfDone && selectedSprint.definitionOfDone.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Definition of Done</h3>
                  <ul className="space-y-2">
                    {selectedSprint.definitionOfDone.map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center">
              <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Sprint Selected</h3>
              <p className="text-gray-400">Select a sprint from the sidebar or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
