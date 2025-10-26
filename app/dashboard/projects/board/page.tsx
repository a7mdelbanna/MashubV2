'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, Clock, AlertCircle, User, Tag, Calendar, X } from 'lucide-react'
import { Task } from '@/types'
import { TasksService } from '@/services/tasks.service'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'

// Helper functions
const getTaskStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    backlog: 'bg-gray-500/20 text-gray-400',
    todo: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-yellow-500/20 text-yellow-400',
    review: 'bg-orange-500/20 text-orange-400',
    testing: 'bg-purple-500/20 text-purple-400',
    done: 'bg-green-500/20 text-green-400',
    blocked: 'bg-red-500/20 text-red-400'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

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

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'testing' | 'done' | 'blocked'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
type TaskType = 'feature' | 'bug' | 'improvement' | 'task' | 'epic' | 'story'

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'blue' },
  { status: 'in_progress', label: 'In Progress', color: 'yellow' },
  { status: 'review', label: 'In Review', color: 'orange' },
  { status: 'testing', label: 'Testing', color: 'purple' },
  { status: 'done', label: 'Done', color: 'green' },
  { status: 'blocked', label: 'Blocked', color: 'red' }
]

export default function ProjectBoardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, tenant } = useAuth()

  // Get projectId from URL params (optional - show all projects if not specified)
  const projectId = searchParams.get('projectId')

  // State
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([])
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewDensity, setViewDensity] = useState<'compact' | 'comfortable'>('comfortable')

  // Modal states
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCreateTask, setShowCreateTask] = useState(false)

  // Subscribe to tasks from Firebase
  useEffect(() => {
    if (!tenant?.id) {
      setLoading(false)
      return
    }

    // If projectId is specified, subscribe to that project's tasks
    // Otherwise, we'd need a different query (for now, require projectId)
    if (!projectId) {
      setLoading(false)
      toast.error('Please select a project to view its board')
      return
    }

    setLoading(true)

    const unsubscribe = TasksService.subscribe(
      tenant.id,
      projectId,
      (fetchedTasks) => {
        setTasks(fetchedTasks)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [tenant?.id, projectId])

  // Handlers
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    const task = tasks.find(t => t.id === taskId)

    if (!task || task.status === newStatus || !tenant?.id || !projectId) return

    try {
      await TasksService.update(tenant.id, projectId, taskId, { status: newStatus })
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`)
    } catch (error) {
      console.error('Error updating task status:', error)
      toast.error('Failed to update task status')
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority)
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(task.type)

    return matchesSearch && matchesPriority && matchesType
  })

  // Group tasks by status
  const tasksByStatus = columns.map(column => ({
    ...column,
    tasks: sortTasksByPriority(filteredTasks.filter(task => task.status === column.status))
  }))

  // Loading state
  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading board...</p>
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
          <p className="text-gray-400 mb-4">Please select a project to view its task board</p>
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
    <div className="h-[calc(100vh-4rem)] flex flex-col" style={{ zoom: 0.8 }}>
      {/* Header - Sticky */}
      <div className="sticky top-0 z-20 bg-gray-900 p-3 sm:p-4 md:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Project Board
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Kanban board view for project tasks</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-1 bg-gray-800/80 border border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewDensity('comfortable')}
                className={`px-3 sm:px-4 py-2 rounded font-medium text-xs sm:text-sm transition-all ${
                  viewDensity === 'comfortable'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="hidden sm:inline">Comfortable</span>
                <span className="sm:hidden">Comfy</span>
              </button>
              <button
                onClick={() => setViewDensity('compact')}
                className={`px-3 sm:px-4 py-2 rounded font-medium text-xs sm:text-sm transition-all ${
                  viewDensity === 'compact'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Compact
              </button>
            </div>
            <button
              onClick={() => setShowCreateTask(true)}
              className="px-4 sm:px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
            {/* Priority Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">Priority:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['critical', 'urgent', 'high', 'medium', 'low'] as TaskPriority[]).map(priority => (
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

            {/* Task Type Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">Task Type:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['task', 'bug', 'feature', 'epic', 'story'] as TaskType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedTypes(prev =>
                        prev.includes(type)
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      )
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedTypes.includes(type)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
                {selectedTypes.length > 0 && (
                  <button
                    onClick={() => setSelectedTypes([])}
                    className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-hidden scroll-smooth">
          <div className={`h-full flex p-3 sm:p-4 md:p-6 min-w-max ${viewDensity === 'compact' ? 'gap-2 sm:gap-3' : 'gap-3 sm:gap-4'}`}>
          {tasksByStatus.map(column => (
            <div
              key={column.status}
              className={`flex flex-col ${viewDensity === 'compact' ? 'w-56 sm:w-64' : 'w-64 sm:w-72'}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-${column.color}-500`}></div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">{column.label}</h3>
                  <span className="px-1.5 sm:px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                </button>
              </div>

              {/* Task Cards */}
              <div className={`flex-1 overflow-y-auto pb-2 sm:pb-4 ${viewDensity === 'compact' ? 'space-y-1.5 sm:space-y-2' : 'space-y-2 sm:space-y-3'}`}>
                {column.tasks.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
                    No tasks
                  </div>
                ) : (
                  column.tasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => handleTaskClick(task)}
                      className={`bg-gray-800 rounded-lg border border-gray-700 cursor-move hover:border-purple-500 transition-colors ${viewDensity === 'compact' ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4'}`}
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                        <h4 className="font-medium text-white flex-1 line-clamp-2 text-sm sm:text-base">
                          {task.title}
                        </h4>
                        <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Priority Badge */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.blockedBy && task.blockedBy.length > 0 && (
                          <span className="px-1.5 sm:px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                            Blocked
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                          {task.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="px-1.5 sm:px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1"
                            >
                              <Tag className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                              <span className="hidden sm:inline">{tag}</span>
                              <span className="sm:hidden">{tag.length > 8 ? tag.slice(0, 8) + '...' : tag}</span>
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="px-1.5 sm:px-2 py-0.5 text-gray-500 text-xs">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Task Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {task.storyPoints && (
                            <span className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">
                                {task.storyPoints}
                              </div>
                            </span>
                          )}
                          {task.estimatedHours && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeEstimate(task.estimatedHours * 60)}
                            </span>
                          )}
                          {task.commentsCount && task.commentsCount > 0 && (
                            <span className="flex items-center gap-1">
                              💬 {task.commentsCount}
                            </span>
                          )}
                        </div>

                        {/* Assignee */}
                        {task.assignee?.name && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">
                              {task.assignee.name.split(' ')[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="mt-2 pt-2 border-t border-gray-700 flex items-center justify-between text-xs">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          {new Date(task.dueDate) < new Date() && task.status !== 'done' && (
                            <span className="text-red-400 font-medium">Overdue</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-3 sm:p-4 border-t border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-400">
          <span className="whitespace-nowrap">Total: <span className="text-white font-medium">{filteredTasks.length}</span></span>
          <span className="whitespace-nowrap">In Progress: <span className="text-yellow-400 font-medium">
            {filteredTasks.filter(t => t.status === 'in_progress').length}
          </span></span>
          <span className="whitespace-nowrap">Completed: <span className="text-green-400 font-medium">
            {filteredTasks.filter(t => t.status === 'done').length}
          </span></span>
          <span className="whitespace-nowrap">Blocked: <span className="text-red-400 font-medium">
            {filteredTasks.filter(t => t.status === 'blocked').length}
          </span></span>
        </div>
        <div className="text-gray-500 text-xs hidden md:block">
          Press <kbd className="px-2 py-0.5 bg-gray-800 rounded border border-gray-700">N</kbd> to create new task
        </div>
      </div>

      {/* Task Detail Modal */}
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
                {/* Description */}
                {selectedTask.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <p className="text-white">{selectedTask.description}</p>
                  </div>
                )}

                {/* Status & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <span className={`inline-block px-3 py-1 rounded text-sm ${getTaskStatusColor(selectedTask.status)}`}>
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

                {/* Assignee & Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedTask.assignee?.name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Assignee</label>
                      <p className="text-white">{selectedTask.assignee.name}</p>
                    </div>
                  )}
                  {selectedTask.dueDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                      <p className="text-white">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* Story Points & Time */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedTask.storyPoints && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Story Points</label>
                      <p className="text-white">{selectedTask.storyPoints}</p>
                    </div>
                  )}
                  {selectedTask.estimatedHours && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Estimated Hours</label>
                      <p className="text-white">{selectedTask.estimatedHours}h</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
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
