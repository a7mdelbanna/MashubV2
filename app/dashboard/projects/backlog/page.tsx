'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreVertical, Clock, PlayCircle, ChevronRight, Calendar, TrendingUp } from 'lucide-react'
import { Task, Sprint } from '@/types/projects'
import {
  getPriorityColor,
  formatTimeEstimate,
  sortTasksByPriority,
  getSprintProgress,
  getSprintDaysRemaining
} from '@/lib/projects-utils'

// Mock data
const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    projectId: 'proj-1',
    name: 'Sprint 12 - Authentication Module',
    goal: 'Complete authentication system implementation',
    status: 'active',
    number: 12,
    startDate: '2025-10-08',
    endDate: '2025-10-22',
    totalStoryPoints: 34,
    completedStoryPoints: 18,
    velocity: 0,
    capacity: 40,
    tasks: ['1', '2', '3'],
    burndownData: [],
    createdAt: '2025-10-01T10:00:00Z'
  },
  {
    id: 'sprint-2',
    projectId: 'proj-1',
    name: 'Sprint 13 - Payment Integration',
    goal: 'Integrate payment gateway and implement checkout flow',
    status: 'planning',
    number: 13,
    startDate: '2025-10-23',
    endDate: '2025-11-06',
    totalStoryPoints: 0,
    completedStoryPoints: 0,
    velocity: 0,
    capacity: 40,
    tasks: [],
    burndownData: [],
    createdAt: '2025-10-12T10:00:00Z'
  }
]

const mockBacklogTasks: Task[] = [
  {
    id: '10',
    projectId: 'proj-1',
    title: 'Implement payment gateway integration',
    description: 'Integrate Stripe payment gateway with backend',
    type: 'backend',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    estimatedHours: 16,
    timeSpent: 0,
    tags: ['payment', 'integration'],
    dependencies: [],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 0,
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-10T10:00:00Z'
  },
  {
    id: '11',
    projectId: 'proj-1',
    title: 'Design checkout UI',
    description: 'Create user-friendly checkout interface',
    type: 'design',
    status: 'backlog',
    priority: 'high',
    assigneeId: 'user-1',
    assigneeName: 'Sarah Chen',
    storyPoints: 5,
    estimatedHours: 10,
    timeSpent: 0,
    tags: ['ui', 'checkout'],
    dependencies: [],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 2,
    createdAt: '2025-10-11T10:00:00Z',
    updatedAt: '2025-10-12T14:00:00Z'
  },
  {
    id: '12',
    projectId: 'proj-1',
    title: 'Add order confirmation emails',
    description: 'Send email notifications after successful orders',
    type: 'feature',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 3,
    estimatedHours: 6,
    timeSpent: 0,
    tags: ['email', 'notifications'],
    dependencies: ['10'],
    blockedBy: [],
    subtasks: [],
    attachments: [],
    commentsCount: 1,
    createdAt: '2025-10-11T10:00:00Z',
    updatedAt: '2025-10-11T10:00:00Z'
  }
]

export default function ProjectBacklogPage() {
  const [sprints] = useState<Sprint[]>(mockSprints)
  const [backlogTasks] = useState<Task[]>(mockBacklogTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSprint, setExpandedSprint] = useState<string | null>(sprints.find(s => s.status === 'active')?.id || null)

  const activeSprint = sprints.find(s => s.status === 'active')
  const upcomingSprints = sprints.filter(s => s.status === 'planning')

  const filteredBacklog = sortTasksByPriority(
    backlogTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const totalBacklogPoints = backlogTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)

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
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <PlayCircle className="w-4 h-4" />
              Start Sprint
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
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

            <button className="px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg flex items-center gap-2 text-sm transition-colors">
              <Filter className="w-4 h-4" />
              Filters
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
                      {task.assigneeName && (
                        <span>Assigned to {task.assigneeName}</span>
                      )}
                      {task.commentsCount > 0 && (
                        <span>💬 {task.commentsCount}</span>
                      )}
                    </div>

                    {task.tags.length > 0 && (
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
    </div>
  )
}
