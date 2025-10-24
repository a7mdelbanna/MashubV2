'use client'

import { useEffect, useState } from 'react'
import { superadminService } from '@/lib/services/superadmin-service'
import { Building2, Users, Activity, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

interface Stats {
  totalTenants: number
  activeTenants: number
  suspendedTenants: number
  totalUsers: number
  mrr: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTenants: 0,
    activeTenants: 0,
    suspendedTenants: 0,
    totalUsers: 0,
    mrr: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await superadminService.getSystemStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading stats...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
        <p className="text-gray-400">Monitor and manage your MasHub infrastructure</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tenants"
          value={stats.totalTenants}
          icon={Building2}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Active Tenants"
          value={stats.activeTenants}
          icon={Activity}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="purple"
          trend="+24%"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.mrr.toLocaleString()}`}
          icon={DollarSign}
          color="yellow"
          trend="+15%"
        />
      </div>

      {/* Alerts */}
      {stats.suspendedTenants > 0 && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-red-300 font-medium">
                {stats.suspendedTenants} Suspended Tenant{stats.suspendedTenants > 1 ? 's' : ''}
              </p>
              <p className="text-red-400/80 text-sm">Review suspended tenants to take action</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickAction
          title="Create Tenant"
          description="Add a new company to the platform"
          href="/superadmin/tenants"
          buttonText="New Tenant"
          icon={Building2}
        />
        <QuickAction
          title="View Activity"
          description="Monitor recent system actions"
          href="/superadmin/activity"
          buttonText="View Logs"
          icon={Activity}
        />
        <QuickAction
          title="Manage Users"
          description="View and manage all platform users"
          href="/superadmin/users"
          buttonText="View Users"
          icon={Users}
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <p className="text-gray-400">Activity logs will appear here</p>
      </div>
    </div>
  )
}

// ===========================================
// COMPONENTS
// ===========================================

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend
}: {
  title: string
  value: string | number
  icon: any
  color: 'blue' | 'green' | 'purple' | 'yellow'
  trend?: string
}) {
  const colorClasses = {
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    purple: 'from-purple-600 to-pink-600',
    yellow: 'from-yellow-600 to-orange-600'
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-400 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function QuickAction({
  title,
  description,
  href,
  buttonText,
  icon: Icon
}: {
  title: string
  description: string
  href: string
  buttonText: string
  icon: any
}) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <Icon className="h-8 w-8 text-purple-400 mb-3" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <a
        href={href}
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium transition-all"
      >
        {buttonText}
      </a>
    </div>
  )
}
