'use client'

import { useState } from 'react'
import { Plus, Filter, Calendar, CheckCircle2, Circle, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react'
import { Milestone, Project } from '@/types/projects'
import { calculateMilestoneProgress, getDaysRemaining } from '@/lib/projects-utils'

// Mock data
const mockProject: Project = {
  id: 'proj-1',
  tenantId: 'tenant-1',
  name: 'MasHub V2 Development',
  slug: 'mashub-v2',
  description: 'Complete SaaS platform rebuild',
  clientId: 'client-1',
  clientName: 'Internal',
  status: 'in_progress',
  priority: 'high',
  startDate: '2025-09-01',
  endDate: '2025-12-31',
  budgetAllocated: 150000,
  budgetSpent: 45000,
  currency: 'USD',
  completionPercentage: 38,
  tasksTotal: 156,
  tasksCompleted: 59,
  milestonesTotal: 5,
  milestonesCompleted: 2,
  tags: ['saas', 'enterprise'],
  createdAt: '2025-08-15T10:00:00Z',
  updatedAt: '2025-10-13T14:00:00Z'
}

const mockMilestones: Milestone[] = [
  {
    id: 'ms-1',
    tenantId: 'tenant-1',
    projectId: 'proj-1',
    name: 'Foundation & Setup',
    description: 'Project initialization, tech stack setup, and base architecture',
    dueDate: '2025-09-15',
    status: 'completed',
    completionPercentage: 100,
    tasksTotal: 12,
    tasksCompleted: 12,
    dependsOn: [],
    createdAt: '2025-08-15T10:00:00Z',
    updatedAt: '2025-09-14T18:00:00Z',
    completedAt: '2025-09-14T18:00:00Z'
  },
  {
    id: 'ms-2',
    tenantId: 'tenant-1',
    projectId: 'proj-1',
    name: 'Authentication & User Management',
    description: 'Complete user authentication system with roles and permissions',
    dueDate: '2025-10-15',
    status: 'completed',
    completionPercentage: 100,
    tasksTotal: 24,
    tasksCompleted: 24,
    dependsOn: ['ms-1'],
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-10-12T16:00:00Z',
    completedAt: '2025-10-12T16:00:00Z'
  },
  {
    id: 'ms-3',
    tenantId: 'tenant-1',
    projectId: 'proj-1',
    name: 'Core Modules Development',
    description: 'Finance, Projects, Clients, and Products modules',
    dueDate: '2025-11-15',
    status: 'in_progress',
    completionPercentage: 65,
    tasksTotal: 48,
    tasksCompleted: 31,
    dependsOn: ['ms-2'],
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-10-13T14:00:00Z'
  },
  {
    id: 'ms-4',
    tenantId: 'tenant-1',
    projectId: 'proj-1',
    name: 'Advanced Features',
    description: 'Services, Visits, Support, and Settings modules',
    dueDate: '2025-12-01',
    status: 'upcoming',
    completionPercentage: 15,
    tasksTotal: 42,
    tasksCompleted: 6,
    dependsOn: ['ms-3'],
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-13T14:00:00Z'
  },
  {
    id: 'ms-5',
    tenantId: 'tenant-1',
    projectId: 'proj-1',
    name: 'Testing & Optimization',
    description: 'Comprehensive testing, performance optimization, and bug fixes',
    dueDate: '2025-12-20',
    status: 'upcoming',
    completionPercentage: 0,
    tasksTotal: 30,
    tasksCompleted: 0,
    dependsOn: ['ms-4'],
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-13T14:00:00Z'
  }
]

const quarters = [
  { label: 'Q3 2025', months: ['Sep'] },
  { label: 'Q4 2025', months: ['Oct', 'Nov', 'Dec'] }
]

export default function ProjectRoadmapPage() {
  const [milestones] = useState<Milestone[]>(mockMilestones)
  const [selectedView, setSelectedView] = useState<'timeline' | 'list'>('timeline')
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)

  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const totalMilestones = milestones.length

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Project Roadmap
            </h1>
            <p className="text-gray-400 mt-1">Visualize project timeline and milestones</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('timeline')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  selectedView === 'timeline'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setSelectedView('list')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  selectedView === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                List
              </button>
            </div>

            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              New Milestone
            </button>
          </div>
        </div>

        {/* Project Overview Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Project Progress</div>
            <div className="text-2xl font-bold text-purple-400">{mockProject.completionPercentage}%</div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all"
                style={{ width: `${mockProject.completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Milestones</div>
            <div className="text-2xl font-bold text-white">
              {completedMilestones}/{totalMilestones}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((completedMilestones / totalMilestones) * 100)}% complete
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Days Remaining</div>
            <div className="text-2xl font-bold text-yellow-400">
              {getDaysRemaining(mockProject.endDate!)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Until Dec 31, 2025</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Budget Used</div>
            <div className="text-2xl font-bold text-green-400">
              ${(mockProject.budgetSpent! / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-gray-500 mt-1">
              of ${(mockProject.budgetAllocated! / 1000).toFixed(0)}k total
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Tasks Completed</div>
            <div className="text-2xl font-bold text-blue-400">{mockProject.tasksCompleted}/{mockProject.tasksTotal}</div>
            <div className="text-xs text-green-400 mt-1">✓ {Math.round((mockProject.tasksCompleted / mockProject.tasksTotal) * 100)}% Done</div>
          </div>
        </div>
      </div>

      {selectedView === 'timeline' ? (
        /* Timeline View */
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
          {/* Timeline Header - Quarters */}
          <div className="border-b border-gray-700 bg-gray-800/50">
            <div className="flex">
              <div className="w-64 px-4 py-3 border-r border-gray-700">
                <span className="text-sm font-medium text-gray-400">Milestone</span>
              </div>
              <div className="flex-1 flex">
                {quarters.map((quarter, idx) => (
                  <div
                    key={quarter.label}
                    className={`flex-1 px-4 py-3 text-center ${
                      idx > 0 ? 'border-l border-gray-700' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-white">{quarter.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Body */}
          <div className="divide-y divide-gray-700">
            {milestones.map((milestone, idx) => {
              const isExpanded = expandedMilestone === milestone.id
              const progress = calculateMilestoneProgress(milestone)

              return (
                <div key={milestone.id} className="hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center">
                    {/* Milestone Info */}
                    <div className="w-64 px-4 py-4 border-r border-gray-700">
                      <div
                        className="cursor-pointer"
                        onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {milestone.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : milestone.status === 'in_progress' ? (
                            <Circle className="w-4 h-4 text-blue-400 animate-pulse" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-white font-medium text-sm">{milestone.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-6">
                          {milestone.tasksCompleted}/{milestone.tasksTotal} tasks • {progress}%
                        </div>
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="flex-1 px-4 py-4 relative">
                      <div className="h-8 bg-gray-700/30 rounded relative">
                        {/* Calculate position based on dates */}
                        <div
                          className={`absolute h-full rounded flex items-center px-2 ${
                            milestone.status === 'completed'
                              ? 'bg-green-500/20 border border-green-500/50'
                              : milestone.status === 'in_progress'
                              ? 'bg-blue-500/20 border border-blue-500/50'
                              : 'bg-gray-600/20 border border-gray-600/50'
                          }`}
                          style={{
                            left: `${((idx * 20) % 80)}%`,
                            width: '18%'
                          }}
                        >
                          <span className="text-xs font-medium text-white truncate">
                            {milestone.status === 'completed' ? '✓ ' : ''}{progress}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 py-4 bg-gray-900/50 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-3">{milestone.description}</p>
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <span>Position: #{idx + 1}</span>
                        <span>Created: {new Date(milestone.createdAt).toLocaleDateString()}</span>
                        {milestone.completedAt && (
                          <span className="text-green-400">
                            Completed: {new Date(milestone.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {milestones.map((milestone) => {
            const progress = calculateMilestoneProgress(milestone)
            const daysRemaining = getDaysRemaining(milestone.dueDate)
            const isOverdue = daysRemaining < 0 && milestone.status !== 'completed'

            return (
              <div
                key={milestone.id}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      milestone.status === 'completed'
                        ? 'bg-green-500/20'
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-500/20'
                        : 'bg-gray-700'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : milestone.status === 'in_progress' ? (
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{milestone.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          milestone.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : milestone.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {milestone.status === 'completed' ? 'Completed' : milestone.status === 'in_progress' ? 'In Progress' : 'Pending'}
                        </span>
                        {isOverdue && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{progress}%</div>
                    <div className="text-xs text-gray-500">complete</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        milestone.status === 'completed'
                          ? 'bg-green-500'
                          : milestone.status === 'in_progress'
                          ? 'bg-blue-500'
                          : 'bg-gray-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">
                        {milestone.tasksCompleted}/{milestone.tasksTotal} tasks
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {milestone.status !== 'completed' && (
                      <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                        {isOverdue ? (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>{Math.abs(daysRemaining)} days overdue</span>
                          </>
                        ) : (
                          <span>{daysRemaining} days remaining</span>
                        )}
                      </div>
                    )}
                    {milestone.completedAt && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed {new Date(milestone.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
