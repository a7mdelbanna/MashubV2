'use client'

import { useState, useEffect } from 'react'
import { MetricCard } from '@/components/ui/metric-card'
import { cn } from '@/lib/utils'
import {
  Briefcase, DollarSign, Users, HeadphonesIcon,
  TrendingUp, Plus, FileText, BarChart3,
  Calendar, ArrowUpRight, MoreVertical
} from 'lucide-react'

const metrics = [
  {
    title: 'ACTIVE PROJECTS',
    value: '24',
    subtitle: 'From last month',
    change: { value: 12, type: 'increase' as const },
    icon: Briefcase,
    gradient: 'gradient-blue'
  },
  {
    title: 'TOTAL REVENUE',
    value: '$125,430',
    subtitle: 'Monthly growth',
    change: { value: 8.2, type: 'increase' as const },
    icon: DollarSign,
    gradient: 'gradient-green'
  },
  {
    title: 'ACTIVE USERS',
    value: '89',
    subtitle: 'Team members',
    change: { value: 3.1, type: 'increase' as const },
    icon: Users,
    gradient: 'gradient-purple'
  },
  {
    title: 'SUPPORT TICKETS',
    value: '12',
    subtitle: 'Better than last week',
    change: { value: 15, type: 'decrease' as const },
    icon: HeadphonesIcon,
    gradient: 'gradient-orange'
  }
]

const revenueData = [
  { month: 'Jan', projects: 8, revenue: 45 },
  { month: 'Feb', projects: 10, revenue: 52 },
  { month: 'Mar', projects: 9, revenue: 48 },
  { month: 'Apr', projects: 12, revenue: 65 },
  { month: 'May', projects: 14, revenue: 72 },
  { month: 'Jun', projects: 16, revenue: 85 }
]

const quickActions = [
  {
    title: 'New Project',
    icon: Briefcase,
    gradient: 'gradient-blue'
  },
  {
    title: 'Add User',
    icon: Users,
    gradient: 'gradient-purple'
  },
  {
    title: 'Generate Invoice',
    icon: DollarSign,
    gradient: 'gradient-green'
  },
  {
    title: 'Support Tickets',
    icon: HeadphonesIcon,
    gradient: 'gradient-orange'
  }
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className={cn(
        "rounded-3xl p-8 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20",
        "animate-fade-in"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back, Admin
            </h1>
            <p className="text-gray-400">
              Your business is performing
              <span className="ml-2 text-green-400 font-medium">↗ Excellent</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-sm mb-1">Today's Revenue</p>
            <p className="text-3xl font-bold text-green-400">$12,482</p>

            <p className="text-gray-400 text-sm mt-4 mb-1">Active Now</p>
            <p className="text-2xl font-bold text-purple-400">247</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            {...metric}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
                <p className="text-gray-400 text-sm mt-1">Monthly performance tracking</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm font-medium">+18.2%</span>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm w-10">{data.month}</span>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1 h-10 bg-gray-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full gradient-purple rounded-lg transition-all duration-1000"
                        style={{
                          width: `${data.revenue}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm w-20 text-right">
                      {data.projects} projects
                    </span>
                    <span className="text-white font-medium w-20 text-right">
                      ${data.revenue}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-2">Quick Actions</h2>
            <p className="text-gray-400 text-sm mb-6">Common tasks at your fingertips</p>

            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="group relative rounded-xl p-4 bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-gray-600"
                >
                  <div className={cn(
                    "w-full h-24 rounded-lg flex flex-col items-center justify-center",
                    action.gradient
                  )}>
                    <action.icon className="h-8 w-8 text-white mb-2" />
                  </div>
                  <p className="text-white text-sm font-medium mt-3 text-center">
                    {action.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Projects</h2>
              <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'E-Commerce Platform', client: 'TechCorp', progress: 65, color: 'gradient-blue' },
                { name: 'Mobile Banking App', client: 'FinanceHub', progress: 85, color: 'gradient-green' },
                { name: 'HR Management', client: 'GlobalHR', progress: 40, color: 'gradient-purple' }
              ].map((project, index) => (
                <div key={index} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <p className="text-gray-500 text-sm">{project.client}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", project.color)}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Team Activity</h2>
              <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {[
                { user: 'Sarah Chen', action: 'completed', target: 'UI Design', time: '2 min ago', avatar: 'SC' },
                { user: 'Mike Johnson', action: 'started', target: 'API Integration', time: '15 min ago', avatar: 'MJ' },
                { user: 'Emma Davis', action: 'reviewed', target: 'Code Review', time: '1 hour ago', avatar: 'ED' },
                { user: 'Alex Kim', action: 'deployed', target: 'Production Build', time: '2 hours ago', avatar: 'AK' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-medium">
                    {activity.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">
                      <span className="text-white font-medium">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="text-purple-400">{activity.target}</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
        <div className="rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">MAS Business OS</h3>
              <p className="text-gray-400 text-sm">v1.0 - System performing optimally</p>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-gray-500 text-xs mb-1">API Response</p>
                <p className="text-green-400 font-medium">124ms</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Uptime</p>
                <p className="text-green-400 font-medium">99.9%</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Active Users</p>
                <p className="text-purple-400 font-medium">247</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}