'use client'

import { useState } from 'react'
import { Clock, Play, Pause, Plus, Calendar, User, Search, Filter, DollarSign, TrendingUp, BarChart3, CheckCircle, Edit2, Trash2 } from 'lucide-react'

interface TimeEntry {
  id: string
  projectId: string
  projectName: string
  userId: string
  userName: string
  taskName: string
  description: string
  hours: number
  date: string
  billable: boolean
  rate?: number
  status: 'draft' | 'approved' | 'invoiced'
}

const mockEntries: TimeEntry[] = [
  { id: 't1', projectId: 'p1', projectName: 'E-Commerce Platform', userId: 'u1', userName: 'Sarah Johnson', taskName: 'API Development', description: 'Built REST endpoints for product catalog', hours: 6.5, date: '2024-03-01', billable: true, rate: 125, status: 'approved' },
  { id: 't2', projectId: 'p1', projectName: 'E-Commerce Platform', userId: 'u2', userName: 'Michael Chen', taskName: 'Frontend Development', description: 'Implemented product listing page', hours: 8, date: '2024-03-01', billable: true, rate: 115, status: 'approved' },
  { id: 't3', projectId: 'p2', projectName: 'Mobile Banking App', userId: 'u3', userName: 'Emily Davis', taskName: 'UI Design', description: 'Created mockups for transaction history', hours: 5, date: '2024-03-01', billable: true, rate: 95, status: 'draft' },
  { id: 't4', projectId: 'p1', projectName: 'E-Commerce Platform', userId: 'u1', userName: 'Sarah Johnson', taskName: 'Code Review', description: 'Reviewed pull requests', hours: 2.5, date: '2024-03-02', billable: false, rate: 0, status: 'draft' },
  { id: 't5', projectId: 'p3', projectName: 'HR Management System', userId: 'u4', userName: 'David Wilson', taskName: 'Database Design', description: 'Designed schema for employee records', hours: 7, date: '2024-03-02', billable: true, rate: 135, status: 'approved' },
  { id: 't6', projectId: 'p2', projectName: 'Mobile Banking App', userId: 'u2', userName: 'Michael Chen', taskName: 'Testing', description: 'Wrote unit tests for authentication module', hours: 4.5, date: '2024-03-02', billable: true, rate: 115, status: 'approved' },
  { id: 't7', projectId: 'p4', projectName: 'POS System Upgrade', userId: 'u3', userName: 'Emily Davis', taskName: 'Documentation', description: 'Updated API documentation', hours: 3, date: '2024-03-03', billable: true, rate: 95, status: 'invoiced' }
]

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>(mockEntries)
  const [filterProject, setFilterProject] = useState('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const stats = {
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    billableHours: entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0),
    totalValue: entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours * (e.rate || 0), 0),
    utilization: (entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0) / entries.reduce((sum, e) => sum + e.hours, 0)) * 100
  }

  const filteredEntries = entries.filter(e => {
    const matchesProject = filterProject === 'all' || e.projectId === filterProject
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus
    return matchesProject && matchesStatus
  })

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Time Tracking</h1>
          <p className="text-gray-400">Track time spent on projects and tasks</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          Log Time
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalHours.toFixed(1)}</p>
          <p className="text-sm text-gray-400">Total Hours</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.billableHours.toFixed(1)}</p>
          <p className="text-sm text-gray-400">Billable Hours</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.totalValue / 1000).toFixed(1)}k</p>
          <p className="text-sm text-gray-400">Total Value</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.utilization.toFixed(0)}%</p>
          <p className="text-sm text-gray-400">Utilization</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
            <option value="all">All Projects</option>
            <option value="p1">E-Commerce Platform</option>
            <option value="p2">Mobile Banking App</option>
            <option value="p3">HR Management System</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="invoiced">Invoiced</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{entry.taskName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    entry.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    entry.status === 'invoiced' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {entry.status}
                  </span>
                  {entry.billable && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                      Billable
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-3">{entry.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{entry.projectName}</span>
                  <span>•</span>
                  <span>{entry.userName}</span>
                  <span>•</span>
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white mb-1">{entry.hours}h</p>
                {entry.billable && entry.rate && (
                  <p className="text-sm text-green-400">${(entry.hours * entry.rate).toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
