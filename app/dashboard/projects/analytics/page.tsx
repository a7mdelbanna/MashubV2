'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Activity,
  BarChart3,
  Calendar,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

const mockAnalytics = {
  overview: {
    totalProjects: 48,
    activeProjects: 32,
    completedThisMonth: 6,
    totalRevenue: 1850000,
    budgetUtilization: 78,
    avgProjectDuration: 45, // days
    avgTeamSize: 5.2,
    onTimeDelivery: 87.5 // percentage
  },
  projectHealth: {
    onTrack: 24,
    atRisk: 6,
    delayed: 2,
    completed: 16
  },
  budgetStatus: {
    underBudget: 18,
    onBudget: 22,
    overBudget: 8
  },
  projectsByStatus: [
    { status: 'Planning', count: 8, percentage: 16.7 },
    { status: 'In Progress', count: 24, percentage: 50 },
    { status: 'Review', count: 4, percentage: 8.3 },
    { status: 'Completed', count: 10, percentage: 20.8 },
    { status: 'On Hold', count: 2, percentage: 4.2 }
  ],
  completionTrends: [
    { month: 'Jul', completed: 4, onTime: 3, delayed: 1 },
    { month: 'Aug', completed: 5, onTime: 4, delayed: 1 },
    { month: 'Sep', completed: 6, onTime: 5, delayed: 1 },
    { month: 'Oct', completed: 5, onTime: 5, delayed: 0 },
    { month: 'Nov', completed: 7, onTime: 6, delayed: 1 },
    { month: 'Dec', completed: 8, onTime: 7, delayed: 1 }
  ],
  topProjects: [
    { id: 'p1', name: 'E-Commerce Platform', client: 'TechCorp', completion: 85, budget: 125000, spent: 98000, health: 92 },
    { id: 'p2', name: 'Mobile Banking App', client: 'FinanceHub', completion: 72, budget: 185000, spent: 145000, health: 88 },
    { id: 'p3', name: 'HR Management System', client: 'GlobalHR', completion: 65, budget: 95000, spent: 72000, health: 90 },
    { id: 'p4', name: 'POS System Upgrade', client: 'RetailChain', completion: 93, budget: 78000, spent: 75000, health: 95 },
    { id: 'p5', name: 'Healthcare Portal', client: 'MediCare', completion: 88, budget: 145000, spent: 135000, health: 85 }
  ],
  resourceUtilization: [
    { team: 'Frontend', allocated: 85, available: 15, projects: 8 },
    { team: 'Backend', allocated: 92, available: 8, projects: 10 },
    { team: 'Design', allocated: 68, available: 32, projects: 6 },
    { team: 'QA', allocated: 78, available: 22, projects: 12 },
    { team: 'DevOps', allocated: 88, available: 12, projects: 7 }
  ],
  burndownData: {
    project: 'E-Commerce Platform',
    totalTasks: 150,
    completed: 128,
    inProgress: 15,
    remaining: 7,
    daysRemaining: 12,
    expectedCompletion: '2024-03-25',
    trend: 'ahead'
  }
}

export default function ProjectAnalyticsPage() {
  const [dateRange, setDateRange] = useState('last_30_days')

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4" />
    if (value < 0) return <ArrowDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-green-400'
    if (health >= 70) return 'text-blue-400'
    if (health >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Analytics</h1>
          <p className="text-gray-400">Performance metrics and insights across all projects</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="flex items-center gap-1 text-sm text-green-400">
              <ArrowUp className="w-4 h-4" />
              8.2%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.totalProjects}</p>
          <p className="text-sm text-gray-400">Total Projects</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Active</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.activeProjects}</p>
          <p className="text-sm text-gray-400">In Progress</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span className="flex items-center gap-1 text-sm text-green-400">
              <ArrowUp className="w-4 h-4" />
              12.5%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.completedThisMonth}</p>
          <p className="text-sm text-gray-400">This Month</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${(mockAnalytics.overview.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm text-gray-400">Revenue</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-green-400">{mockAnalytics.overview.onTimeDelivery}%</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.avgProjectDuration}</p>
          <p className="text-sm text-gray-400">Avg Days</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-pink-400" />
            <span className="text-sm text-gray-400">Usage</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.budgetUtilization}%</p>
          <p className="text-sm text-gray-400">Budget</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Project Health */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Project Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-300">On Track</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.projectHealth.onTrack}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(mockAnalytics.projectHealth.onTrack / mockAnalytics.overview.totalProjects) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-300">At Risk</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.projectHealth.atRisk}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(mockAnalytics.projectHealth.atRisk / mockAnalytics.overview.totalProjects) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-300">Delayed</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.projectHealth.delayed}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(mockAnalytics.projectHealth.delayed / mockAnalytics.overview.totalProjects) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-300">Completed</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.projectHealth.completed}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(mockAnalytics.projectHealth.completed / mockAnalytics.overview.totalProjects) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Budget Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Under Budget</span>
                <span className="text-sm font-medium text-green-400">{mockAnalytics.budgetStatus.underBudget}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(mockAnalytics.budgetStatus.underBudget / mockAnalytics.overview.totalProjects) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">On Budget</span>
                <span className="text-sm font-medium text-blue-400">{mockAnalytics.budgetStatus.onBudget}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(mockAnalytics.budgetStatus.onBudget / mockAnalytics.overview.totalProjects) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Over Budget</span>
                <span className="text-sm font-medium text-red-400">{mockAnalytics.budgetStatus.overBudget}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(mockAnalytics.budgetStatus.overBudget / mockAnalytics.overview.totalProjects) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Avg Utilization</span>
                <span className="text-lg font-bold text-purple-400">
                  {mockAnalytics.overview.budgetUtilization}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{mockAnalytics.burndownData.project}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Completion</span>
              <span className="text-2xl font-bold text-green-400">
                {Math.round((mockAnalytics.burndownData.completed / mockAnalytics.burndownData.totalTasks) * 100)}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Completed</span>
                <span className="text-white">{mockAnalytics.burndownData.completed}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">In Progress</span>
                <span className="text-white">{mockAnalytics.burndownData.inProgress}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Remaining</span>
                <span className="text-white">{mockAnalytics.burndownData.remaining}</span>
              </div>
            </div>

            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-green-500"
                  style={{ width: `${(mockAnalytics.burndownData.completed / mockAnalytics.burndownData.totalTasks) * 100}%` }}
                />
                <div
                  className="bg-blue-500"
                  style={{ width: `${(mockAnalytics.burndownData.inProgress / mockAnalytics.burndownData.totalTasks) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Days Remaining</span>
                <span className="text-lg font-bold text-white">{mockAnalytics.burndownData.daysRemaining}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                  {mockAnalytics.burndownData.trend.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Trends & Top Projects */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Completion Trends */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Completion Trends</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockAnalytics.completionTrends.map((data) => {
              const maxCompleted = Math.max(...mockAnalytics.completionTrends.map(d => d.completed))
              const height = (data.completed / maxCompleted) * 100
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        On Time: {data.onTime}
                      </div>
                    </div>
                    {data.delayed > 0 && (
                      <div
                        className="w-full bg-red-500 hover:bg-red-600 transition-colors"
                        style={{ height: `${(data.delayed / maxCompleted) * 100}%` }}
                      />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{data.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Projects */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Active Projects</h3>
          <div className="space-y-4">
            {mockAnalytics.topProjects.map((project, index) => (
              <div key={project.id} className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{project.name}</h4>
                    <p className="text-sm text-gray-400">{project.client}</p>
                  </div>
                  <span className={`text-sm font-medium ${getHealthColor(project.health)}`}>
                    {project.health}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{project.completion}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${project.completion}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k</span>
                  <span className={project.spent > project.budget ? 'text-red-400' : 'text-green-400'}>
                    {Math.round((project.spent / project.budget) * 100)}% utilized
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Utilization */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Resource Utilization by Team</h3>
        <div className="space-y-4">
          {mockAnalytics.resourceUtilization.map((team) => (
            <div key={team.team}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{team.team}</span>
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                    {team.projects} projects
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">Allocated: {team.allocated}%</span>
                  <span className="text-green-400">Available: {team.available}%</span>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div
                    className={`${
                      team.allocated > 90 ? 'bg-red-500' :
                      team.allocated > 80 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${team.allocated}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
