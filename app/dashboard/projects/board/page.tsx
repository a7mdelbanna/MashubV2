'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreVertical, Clock, AlertCircle, User, Tag, Calendar, Smartphone } from 'lucide-react'
import { Task, TaskStatus, TaskPriority } from '@/types/projects'
import {
  getTaskStatusColor,
  getPriorityColor,
  formatTimeEstimate,
  sortTasksByPriority
} from '@/lib/projects-utils'
import { MOCK_APPS } from '@/lib/mock-project-data'
import { AppTypeBadge } from '@/components/apps/app-type-badge'

// Mock data - In production, this would come from API
const mockTasks: Task[] = [
  {
    id: '1',
    projectId: 'proj-1',
    title: 'Design authentication flow',
    description: 'Create mockups for login, signup, and password reset',
    type: 'design',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-1',
    assigneeName: 'Sarah Chen',
    assigneeAvatar: undefined,
    storyPoints: 5,
    estimatedHours: 8,
    timeSpent: 3,
    tags: ['ui', 'auth'],
    dueDate: '2025-10-20',
    dependencies: [],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 3,
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-13T14:30:00Z',
    startedAt: '2025-10-12T09:00:00Z',
    scope: 'app',
    appId: 'app_shopleez_techcorp',
    appName: 'TechCorp POS'
  },
  {
    id: '2',
    projectId: 'proj-1',
    title: 'Implement user registration API',
    description: 'Build backend endpoints for user registration with email verification',
    type: 'backend',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'user-2',
    assigneeName: 'Mike Johnson',
    assigneeAvatar: undefined,
    storyPoints: 8,
    estimatedHours: 12,
    timeSpent: 0,
    tags: ['api', 'auth', 'backend'],
    dueDate: '2025-10-18',
    dependencies: [],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 1,
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-10T10:00:00Z',
    scope: 'app',
    appId: 'app_financehub_mobile',
    appName: 'FinanceHub Mobile'
  },
  {
    id: '3',
    projectId: 'proj-1',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    type: 'devops',
    status: 'in_review',
    priority: 'medium',
    assigneeId: 'user-3',
    assigneeName: 'Alex Rivera',
    assigneeAvatar: undefined,
    storyPoints: 5,
    estimatedHours: 6,
    timeSpent: 6,
    tags: ['devops', 'ci-cd'],
    dueDate: '2025-10-15',
    dependencies: [],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 5,
    createdAt: '2025-10-08T10:00:00Z',
    updatedAt: '2025-10-13T16:00:00Z',
    startedAt: '2025-10-09T10:00:00Z',
    scope: 'project'
  },
  {
    id: '4',
    projectId: 'proj-1',
    title: 'Database schema design',
    description: 'Design database schema for user management and authentication',
    type: 'backend',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-2',
    assigneeName: 'Mike Johnson',
    assigneeAvatar: undefined,
    storyPoints: 3,
    estimatedHours: 4,
    timeSpent: 5,
    tags: ['database', 'backend'],
    dueDate: '2025-10-12',
    dependencies: [],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 2,
    createdAt: '2025-10-08T10:00:00Z',
    updatedAt: '2025-10-12T15:00:00Z',
    startedAt: '2025-10-08T14:00:00Z',
    completedAt: '2025-10-12T15:00:00Z',
    scope: 'project'
  },
  {
    id: '5',
    projectId: 'proj-1',
    title: 'Fix login redirect bug',
    description: 'Users are redirected to wrong page after successful login',
    type: 'bug',
    status: 'blocked',
    priority: 'critical',
    assigneeId: 'user-1',
    assigneeName: 'Sarah Chen',
    assigneeAvatar: undefined,
    storyPoints: 2,
    estimatedHours: 3,
    timeSpent: 1,
    tags: ['bug', 'auth', 'urgent'],
    dueDate: '2025-10-14',
    dependencies: [],
    blockedBy: ['6'],
    subtasks: [],
    attachments: [],
    commentsCount: 7,
    createdAt: '2025-10-11T10:00:00Z',
    updatedAt: '2025-10-13T11:00:00Z',
    startedAt: '2025-10-11T14:00:00Z',
    scope: 'app',
    appId: 'app_retailchain_website',
    appName: 'RetailChain Website'
  },
  {
    id: '6',
    projectId: 'proj-1',
    title: 'Write integration tests',
    description: 'Create comprehensive integration tests for authentication flow',
    type: 'testing',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    estimatedHours: 10,
    timeSpent: 0,
    tags: ['testing', 'qa'],
    dependencies: [],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 0,
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-10T10:00:00Z',
    scope: 'project'
  }
]

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'backlog', label: 'Backlog', color: 'gray' },
  { status: 'todo', label: 'To Do', color: 'blue' },
  { status: 'in_progress', label: 'In Progress', color: 'yellow' },
  { status: 'in_review', label: 'In Review', color: 'orange' },
  { status: 'done', label: 'Done', color: 'green' },
  { status: 'blocked', label: 'Blocked', color: 'red' }
]

export default function ProjectBoardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([])
  const [selectedScope, setSelectedScope] = useState<'all' | 'project' | 'app'>('all')
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get unique apps from tasks
  const appsInTasks = MOCK_APPS.filter(app =>
    tasks.some(task => task.appId === app.id)
  )

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority)
    const matchesScope = selectedScope === 'all' || task.scope === selectedScope
    const matchesApp = !selectedAppId || task.appId === selectedAppId

    return matchesSearch && matchesPriority && matchesScope && matchesApp
  })

  // Group tasks by status
  const tasksByStatus = columns.map(column => ({
    ...column,
    tasks: sortTasksByPriority(filteredTasks.filter(task => task.status === column.status))
  }))

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Project Board
            </h1>
            <p className="text-gray-400 mt-1">Kanban board view for project tasks</p>
          </div>

          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
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

            {/* Scope Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">Scope:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'project', 'app'] as const).map(scope => (
                  <button
                    key={scope}
                    onClick={() => {
                      setSelectedScope(scope)
                      if (scope !== 'app') setSelectedAppId(null)
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedScope === scope
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {scope === 'all' ? 'All Tasks' : scope === 'project' ? 'Project-Level' : 'App-Level'}
                  </button>
                ))}
              </div>
            </div>

            {/* App Filter (only show when scope is 'app' or 'all') */}
            {(selectedScope === 'app' || selectedScope === 'all') && appsInTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Filter by App:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedAppId(null)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      !selectedAppId
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All Apps
                  </button>
                  {appsInTasks.map(app => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                        selectedAppId === app.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {app.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex gap-4 p-6 min-w-max">
          {tasksByStatus.map(column => (
            <div key={column.status} className="w-80 flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${column.color}-500`}></div>
                  <h3 className="font-semibold text-white">{column.label}</h3>
                  <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Task Cards */}
              <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                {column.tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No tasks
                  </div>
                ) : (
                  column.tasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-gray-800 rounded-lg border border-gray-700 p-4 cursor-pointer hover:border-purple-500 transition-colors"
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white flex-1 line-clamp-2">
                          {task.title}
                        </h4>
                        <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Priority Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.blockedBy.length > 0 && (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Blocked
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 3 && (
                            <span className="px-2 py-0.5 text-gray-500 text-xs">
                              +{task.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Task Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-3">
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
                          {task.commentsCount > 0 && (
                            <span className="flex items-center gap-1">
                              💬 {task.commentsCount}
                            </span>
                          )}
                        </div>

                        {/* Assignee */}
                        {task.assigneeName && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">
                              {task.assigneeName.split(' ')[0]}
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

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6 text-gray-400">
          <span>Total Tasks: <span className="text-white font-medium">{filteredTasks.length}</span></span>
          <span>In Progress: <span className="text-yellow-400 font-medium">
            {filteredTasks.filter(t => t.status === 'in_progress').length}
          </span></span>
          <span>Completed: <span className="text-green-400 font-medium">
            {filteredTasks.filter(t => t.status === 'done').length}
          </span></span>
          <span>Blocked: <span className="text-red-400 font-medium">
            {filteredTasks.filter(t => t.status === 'blocked').length}
          </span></span>
        </div>
        <div className="text-gray-500">
          Press <kbd className="px-2 py-0.5 bg-gray-800 rounded border border-gray-700">N</kbd> to create new task
        </div>
      </div>
    </div>
  )
}
