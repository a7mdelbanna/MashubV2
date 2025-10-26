'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  GitBranch, Plus, Search, Filter, Calendar,
  Package, Download, CheckCircle2, Clock,
  AlertCircle, TrendingUp, Code, Smartphone,
  ChevronDown, ExternalLink
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AppsService } from '@/services/apps.service'
import { App } from '@/types'
import { AppTypeBadge } from '@/components/apps/app-type-badge'

export default function ReleasesPage() {
  const { tenant } = useAuth()
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  // Load apps from Firebase
  useEffect(() => {
    if (!tenant?.id) return

    const unsubscribe = AppsService.subscribeAll(
      tenant.id,
      (updatedApps) => {
        setApps(updatedApps)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [tenant?.id])

  // Get all releases from all apps
  const allReleases = apps.flatMap(app => {
    if (!app.releases) return []
    const releases = []

    // Add current release
    if (app.releases.current) {
      releases.push({
        ...app.releases.current,
        status: 'current',
        app: { id: app.id, nameEn: app.nameEn, type: app.type },
        deployedAt: app.releases.current.releaseDate ? new Date(app.releases.current.releaseDate) : new Date()
      })
    }

    // Add upcoming release
    if (app.releases.upcoming) {
      releases.push({
        ...app.releases.upcoming,
        status: 'upcoming',
        app: { id: app.id, nameEn: app.nameEn, type: app.type },
        deployedAt: app.releases.upcoming.targetDate ? new Date(app.releases.upcoming.targetDate) : new Date()
      })
    }

    // Add history releases
    if (app.releases.history && Array.isArray(app.releases.history)) {
      app.releases.history.forEach(release => {
        releases.push({
          ...release,
          status: 'deployed',
          app: { id: app.id, nameEn: app.nameEn, type: app.type },
          deployedAt: release.releaseDate ? new Date(release.releaseDate) : new Date()
        })
      })
    }

    return releases
  })

  // Sort by date (newest first)
  const sortedReleases = allReleases.sort((a, b) =>
    b.deployedAt.getTime() - a.deployedAt.getTime()
  )

  // Filter releases
  const filteredReleases = sortedReleases.filter(release => {
    const matchesSearch = release.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.app.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || release.status === selectedStatus
    const matchesApp = !selectedAppId || release.app.id === selectedAppId

    return matchesSearch && matchesStatus && matchesApp
  })

  // Calculate stats
  const stats = {
    total: allReleases.length,
    current: allReleases.filter(r => r.status === 'current').length,
    upcoming: allReleases.filter(r => r.status === 'upcoming').length,
    deployed: allReleases.filter(r => r.status === 'deployed').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'deployed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return CheckCircle2
      case 'upcoming':
        return Clock
      case 'deployed':
        return Package
      default:
        return Package
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">App Releases</h1>
          <p className="text-gray-400">Track all app versions and deployments</p>
        </div>
        <button className="px-6 py-3 rounded-xl gradient-blue text-white font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Release
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Releases</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.current}</span>
          </div>
          <p className="text-gray-400 text-sm">Current</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.upcoming}</span>
          </div>
          <p className="text-gray-400 text-sm">Upcoming</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-orange">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.deployed}</span>
          </div>
          <p className="text-gray-400 text-sm">Deployed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search releases or apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="current">Current</option>
            <option value="upcoming">Upcoming</option>
            <option value="deployed">Deployed</option>
          </select>

          {/* App Filter */}
          <select
            value={selectedAppId || 'all'}
            onChange={(e) => setSelectedAppId(e.target.value === 'all' ? null : e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="all">All Apps</option>
            {MOCK_APPS.map(app => (
              <option key={app.id} value={app.id}>{app.nameEn}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Releases List */}
      <div className="space-y-4">
        {filteredReleases.map((release, index) => {
          const StatusIcon = getStatusIcon(release.status)

          return (
            <div
              key={`${release.app.id}-${release.version}-${index}`}
              className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all duration-150 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <GitBranch className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">
                        {release.app.nameEn} v{release.version}
                      </h3>
                      <AppTypeBadge type={release.app.type} size="sm" />
                      <div className={cn(
                        "px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1",
                        getStatusColor(release.status)
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Release Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Release Date</p>
                      <p className="text-sm text-white font-medium">
                        {release.deployedAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Build Number</p>
                      <p className="text-sm text-white font-medium">
                        {release.buildNumber || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Environment</p>
                      <p className="text-sm text-white font-medium">
                        {release.environment || 'Production'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Released By</p>
                      <p className="text-sm text-white font-medium">
                        {release.releasedBy || 'System'}
                      </p>
                    </div>
                  </div>

                  {/* Features/Changes */}
                  {release.features && release.features.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-2">Changes in this release:</p>
                      <ul className="space-y-1">
                        {release.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {release.features.length > 3 && (
                          <li className="text-xs text-gray-500 pl-5">
                            +{release.features.length - 3} more changes
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Notes */}
                  {release.notes && (
                    <p className="text-sm text-gray-400 italic">
                      "{release.notes}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <Download className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredReleases.length === 0 && (
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12 text-center">
          <GitBranch className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No releases found</h3>
          <p className="text-gray-400">Try adjusting your filters or create a new release</p>
        </div>
      )}
    </div>
  )
}
