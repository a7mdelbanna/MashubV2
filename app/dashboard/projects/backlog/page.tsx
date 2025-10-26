'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, Clock, PlayCircle, ChevronRight, Calendar, TrendingUp, X } from 'lucide-react'
import { Task, Sprint } from '@/types'
import { TasksService } from '@/services/tasks.service'
import { SprintsService } from '@/services/sprints.service'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

// Helper functions
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    urgent: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-blue-500/20 text-blue-400'
  }
  return colors[priority] || 'bg-gray-500/20 text-gray-400'
}

const formatTimeEstimate = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

const sortTasksByPriority = (tasks: Task[]) => {
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
  return tasks.sort((a, b) => {
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4
    return aPriority - bPriority
  })
}

const calculateSprintProgress = (sprint: Sprint) => {
  if (!sprint.capacity || sprint.capacity === 0) return 0
  return Math.round((sprint.completed / sprint.capacity) * 100)
}

const getSprintDaysRemaining = (sprint: Sprint) => {
  const endDate = new Date(sprint.endDate)
  const now = new Date()
  const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export default function ProjectBacklogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenant } = useAuth()

  // Get projectId from URL params
  const projectId = searchParams.get('projectId')

  const [sprints, setSprints] = useState<Sprint[]>([])
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [expandedSprint, setExpandedSprint] = useState<string | null>(null)

  // Modal states
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [showNewTask, setShowNewTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Load sprints from Firebase
  useEffect(() => {
    if (!tenant?.id || !projectId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribeSprints = SprintsService.subscribe(
      tenant.id,
      projectId,
      (fetchedSprints) => {
        setSprints(fetchedSprints)
        // Set expanded sprint to the active one
        const activeSprint = fetchedSprints.find(s => s.status === 'active')
        if (activeSprint) {
          setExpandedSprint(activeSprint.id)
        }
        setLoading(false)
      },
      {
        orderByField: 'startDate',
        orderDirection: 'desc'
      }
    )

    return () => unsubscribeSprints()
  }, [tenant?.id, projectId])

  // Load backlog tasks from Firebase
  useEffect(() => {
    if (!tenant?.id || !projectId) return

    const unsubscribeTasks = TasksService.subscribe(
      tenant.id,
      projectId,
      (fetchedTasks) => {
        // Filter to show only backlog tasks (not assigned to a sprint)
        const backlog = fetchedTasks.filter(task => !task.sprintId)
        setBacklogTasks(backlog)
      }
    )

    return () => unsubscribeTasks()
  }, [tenant?.id, projectId])

  const activeSprint = sprints.find(s => s.status === 'active')
  const upcomingSprints = sprints.filter(s => s.status === 'planned')

  // Apply filters
  const filteredBacklog = sortTasksByPriority(
    backlogTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority)
      return matchesSearch && matchesPriority
    })
  )

  const totalBacklogPoints = backlogTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)

  // Handlers
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const handleNewTask = async () => {
    if (!tenant?.id || !projectId) {
      toast.error('Project not found')
      return
    }

    try {
      await TasksService.create(tenant.id, projectId, {
        title: 'New Task',
        description: '',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        scope: 'project',
        projectId: projectId,
        labels: [],
        tags: []
      })
      toast.success('Task created successfully')
      setShowNewTask(false)
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    }
  }

  const handleTaskUpdate = async (updatedTask: Partial<Task>) => {
    if (!tenant?.id || !projectId || !selectedTask) return

    try {
      await TasksService.update(tenant.id, projectId, selectedTask.id, updatedTask)
      toast.success('Task updated successfully')
      setShowTaskDetail(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading backlog...</p>
        </div>
      </div>
    )
  }

  // No project selected state
  if (!projectId) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Project Selected</h2>
          <p className="text-gray-400 mb-4">Please select a project to view its backlog</p>
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

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Product Backlog
            </h1>
            <p className="text-gray-400 mt-1">Manage and prioritize your project backlog</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewTask(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Backlog Tasks</div>
            <div className="text-2xl font-bold text-white">{backlogTasks.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Total Story Points</div>
            <div className="text-2xl font-bold text-purple-400">{totalBacklogPoints}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Active Sprint</div>
            <div className="text-2xl font-bold text-green-400">{activeSprint?.name.split(' - ')[0] || 'None'}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Sprint Progress</div>
            <div className="text-2xl font-bold text-yellow-400">
              {activeSprint ? `${getSprintProgress(activeSprint)}%` : '0%'}
            </div>
          </div>
        </div>
      </div>

      {/* Active Sprint */}
      {activeSprint && (
        <div className="mb-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-green-500/5 transition-colors"
              onClick={() => setExpandedSprint(expandedSprint === activeSprint.id ? null : activeSprint.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{activeSprint.name}</h3>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{activeSprint.goal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Story Points</div>
                    <div className="text-white font-medium">
                      {activeSprint.completedStoryPoints} / {activeSprint.totalStoryPoints}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Days Remaining</div>
                    <div className="text-white font-medium">{getSprintDaysRemaining(activeSprint)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Progress</div>
                    <div className="text-green-400 font-medium">{getSprintProgress(activeSprint)}%</div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSprint === activeSprint.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${getSprintProgress(activeSprint)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Sprints */}
      {upcomingSprints.length > 0 && (
        <div className="mb-6">
          {upcomingSprints.map(sprint => (
            <div
              key={sprint.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{sprint.name}</h3>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                        PLANNING
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{sprint.goal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Capacity</div>
                    <div className="text-white font-medium">{sprint.capacity} pts</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Current</div>
                    <div className="text-white font-medium">{sprint.totalStoryPoints} pts</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Starts</div>
                    <div className="text-white font-medium">
                      {new Date(sprint.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Backlog Section */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700">
        {/* Backlog Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Backlog</h2>
              <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                {filteredBacklog.length} tasks
              </span>
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                showAdvancedFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search backlog tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Priority Filter Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">Priority:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['low', 'medium', 'high', 'urgent']).map(priority => (
                  <button
                    key={priority}
                    onClick={() => {
                      setSelectedPriorities(prev =>
                        prev.includes(priority)
                          ? prev.filter(p => p !== priority)
                          : [...prev, priority]
                      )
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedPriorities.includes(priority)
                        ? getPriorityColor(priority)
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
                {selectedPriorities.length > 0 && (
                  <button
                    onClick={() => setSelectedPriorities([])}
                    className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Backlog Tasks */}
        <div className="divide-y divide-gray-700">
          {filteredBacklog.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No tasks in backlog</h3>
              <p className="text-gray-400 mb-6">Start by creating new tasks for your project</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors">
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            </div>
          ) : (
            filteredBacklog.map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
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
                          <span>Story Points</span>
                        </span>
                      )}
                      {task.estimatedHours && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeEstimate(task.estimatedHours * 60)}
                        </span>
                      )}
                      {task.assignee?.name && (
                        <span>Assigned to {task.assignee.name}</span>
                      )}
                      {task.commentsCount && task.commentsCount > 0 && (
                        <span>💬 {task.commentsCount}</span>
                      )}
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Detail Modal - Simplified */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowTaskDetail(false)}>
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-800" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">{selectedTask.title}</h2>
              <button
                onClick={() => setShowTaskDetail(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                {selectedTask.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <p className="text-white">{selectedTask.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <span className="inline-block px-3 py-1 rounded text-sm bg-gray-700 text-gray-300">
                      {selectedTask.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                    <span className={`inline-block px-3 py-1 rounded text-sm ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {selectedTask.assignee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Assignee</label>
                    <p className="text-white">{selectedTask.assignee.name}</p>
                  </div>
                )}

                {selectedTask.tags && selectedTask.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowTaskDetail(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
