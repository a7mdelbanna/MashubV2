'use client'

import { useState } from 'react'
import { Users, TrendingUp, AlertTriangle, CheckCircle, Calendar, Clock, Target, BarChart3 } from 'lucide-react'

interface Resource {
  id: string
  name: string
  role: string
  capacity: number // hours per week
  allocated: number
  projects: { id: string; name: string; hours: number }[]
  availability: number
  utilization: number
}

const mockResources: Resource[] = [
  { id: 'u1', name: 'Sarah Johnson', role: 'Senior Developer', capacity: 40, allocated: 38, projects: [{ id: 'p1', name: 'E-Commerce', hours: 25 }, { id: 'p2', name: 'Banking App', hours: 13 }], availability: 2, utilization: 95 },
  { id: 'u2', name: 'Michael Chen', role: 'Frontend Developer', capacity: 40, allocated: 32, projects: [{ id: 'p1', name: 'E-Commerce', hours: 20 }, { id: 'p3', name: 'HR System', hours: 12 }], availability: 8, utilization: 80 },
  { id: 'u3', name: 'Emily Davis', role: 'UI/UX Designer', capacity: 40, allocated: 28, projects: [{ id: 'p2', name: 'Banking App', hours: 15 }, { id: 'p4', name: 'POS Upgrade', hours: 13 }], availability: 12, utilization: 70 },
  { id: 'u4', name: 'David Wilson', role: 'Backend Developer', capacity: 40, allocated: 36, projects: [{ id: 'p3', name: 'HR System', hours: 20 }, { id: 'p5', name: 'Healthcare', hours: 16 }], availability: 4, utilization: 90 },
  { id: 'u5', name: 'Lisa Anderson', role: 'QA Engineer', capacity: 40, allocated: 24, projects: [{ id: 'p1', name: 'E-Commerce', hours: 10 }, { id: 'p2', name: 'Banking App', hours: 14 }], availability: 16, utilization: 60 }
]

export default function ResourcesPage() {
  const stats = {
    totalTeam: mockResources.length,
    avgUtilization: Math.round(mockResources.reduce((sum, r) => sum + r.utilization, 0) / mockResources.length),
    overAllocated: mockResources.filter(r => r.utilization > 90).length,
    available: mockResources.filter(r => r.availability > 10).length
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resource Management</h1>
          <p className="text-gray-400">Team allocation and capacity planning</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalTeam}</p>
          <p className="text-sm text-gray-400">Team Members</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgUtilization}%</p>
          <p className="text-sm text-gray-400">Avg Utilization</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.overAllocated}</p>
          <p className="text-sm text-gray-400">Over-allocated</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.available}</p>
          <p className="text-sm text-gray-400">Available</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockResources.map((resource) => (
          <div key={resource.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{resource.name}</h3>
                <p className="text-gray-400">{resource.role}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{resource.allocated}h</p>
                <p className="text-sm text-gray-400">of {resource.capacity}h capacity</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Utilization</span>
                <span className={`font-medium ${
                  resource.utilization > 90 ? 'text-red-400' :
                  resource.utilization > 80 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {resource.utilization}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    resource.utilization > 90 ? 'bg-red-500' :
                    resource.utilization > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${resource.utilization}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Projects ({resource.projects.length}):</p>
              <div className="flex flex-wrap gap-2">
                {resource.projects.map((project) => (
                  <div key={project.id} className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                    {project.name} ({project.hours}h)
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
