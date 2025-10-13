'use client'

import { useState } from 'react'
import { FileText, Download, BarChart3, TrendingUp, Clock, DollarSign, Users, Target, Calendar, Activity } from 'lucide-react'

const reports = [
  { id: 'r1', name: 'Project Performance', type: 'performance', description: 'Overall project metrics, completion rates, and health scores', icon: TrendingUp },
  { id: 'r2', name: 'Budget Analysis', type: 'budget', description: 'Budget utilization, spending trends, and cost analysis', icon: DollarSign },
  { id: 'r3', name: 'Time & Productivity', type: 'time', description: 'Time tracking, team productivity, and efficiency metrics', icon: Clock },
  { id: 'r4', name: 'Resource Utilization', type: 'resources', description: 'Team allocation, capacity, and workload distribution', icon: Users },
  { id: 'r5', name: 'Milestone Progress', type: 'milestones', description: 'Milestone achievements, delays, and forecasting', icon: Target },
  { id: 'r6', name: 'Risk Assessment', type: 'risks', description: 'Project risks, issues, and mitigation strategies', icon: Activity }
]

const mockPerformanceData = {
  summary: {
    totalProjects: 48,
    onTrack: 24,
    atRisk: 6,
    delayed: 2,
    completed: 16,
    avgComplet ion: 68
  },
  byStatus: [
    { status: 'On Track', count: 24, percentage: 50 },
    { status: 'At Risk', count: 6, percentage: 12.5 },
    { status: 'Delayed', count: 2, percentage: 4.2 },
    { status: 'Completed', count: 16, percentage: 33.3 }
  ]
}

export default function ProjectReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>('performance')
  const [dateRange, setDateRange] = useState('last_30_days')

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Reports</h1>
          <p className="text-gray-400">Generate and analyze project insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Reports</h3>
            <div className="space-y-2">
              {reports.map((report) => {
                const Icon = report.icon
                return (
                  <button key={report.id} onClick={() => setSelectedReport(report.type)} className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors ${selectedReport === report.type ? 'bg-purple-600 text-white' : 'bg-gray-900/50 hover:bg-gray-700/50 text-gray-300'}`}>
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{report.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-span-9">
          {selectedReport === 'performance' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Project Performance Report</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">{mockPerformanceData.summary.totalProjects}</p>
                    <p className="text-sm text-gray-400">Total Projects</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{mockPerformanceData.summary.onTrack}</p>
                    <p className="text-sm text-gray-400">On Track</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-400">{mockPerformanceData.summary.avgCompletion}%</p>
                    <p className="text-sm text-gray-400">Avg Completion</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Projects by Status</h3>
                  {mockPerformanceData.byStatus.map((item) => (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{item.status}</span>
                        <span className="text-sm text-gray-400">{item.count} projects ({item.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          item.status === 'On Track' ? 'bg-green-500' :
                          item.status === 'At Risk' ? 'bg-yellow-500' :
                          item.status === 'Delayed' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
