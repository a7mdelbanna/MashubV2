import { App } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { AppTypeBadge, AppTypeIcon } from './app-type-badge'
import {
  ExternalLink, Settings, AlertCircle, CheckCircle2,
  TrendingUp, Package, Calendar, Users, MoreVertical
} from 'lucide-react'

interface AppCardProps {
  app: App
  viewMode?: 'grid' | 'list'
  showClient?: boolean
  showProject?: boolean
  projectId?: string
  className?: string
}

const STATUS_CONFIG = {
  development: {
    icon: Package,
    label: 'Development',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  },
  staging: {
    icon: TrendingUp,
    label: 'Staging',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  production: {
    icon: CheckCircle2,
    label: 'Production',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  maintenance: {
    icon: Settings,
    label: 'Maintenance',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  deprecated: {
    icon: AlertCircle,
    label: 'Deprecated',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  }
}

export function AppCard({
  app,
  viewMode = 'grid',
  showClient = true,
  showProject = false,
  projectId,
  className
}: AppCardProps) {
  const statusConfig = STATUS_CONFIG[app.status]
  const StatusIcon = statusConfig.icon
  const appDetailUrl = projectId
    ? `/dashboard/projects/${projectId}/apps/${app.id}`
    : `/dashboard/apps/${app.id}`

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800',
          'p-4 hover:border-purple-500/50 transition-all duration-150 cursor-pointer group',
          className
        )}
      >
        <div className="flex items-center justify-between">
          {/* Left: App Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <AppTypeIcon type={app.type} size="sm" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={appDetailUrl}
                  className="text-white font-semibold hover:text-purple-400 transition-colors truncate"
                >
                  {app.nameEn}
                </Link>
                <AppTypeBadge type={app.type} size="sm" showIcon={false} />
              </div>

              {showClient && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="h-3 w-3" />
                  <span>{app.client.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Middle: Status & Version */}
          <div className="flex items-center gap-6 px-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <div className={cn('flex items-center gap-1.5', statusConfig.color)}>
                <StatusIcon className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">{statusConfig.label}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Version</p>
              <p className="text-sm font-medium text-white">
                {app.releases.current.version}
              </p>
            </div>

            {app.pricing && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Plan</p>
                <p className="text-sm font-medium text-purple-400">Professional</p>
              </div>
            )}
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            {app.environments.production && (
              <Link
                href={app.environments.production.url}
                target="_blank"
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </Link>
            )}
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <Link
      href={appDetailUrl}
      className={cn(
        'block rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800',
        'p-6 hover:border-purple-500/50 transition-all duration-150 cursor-pointer group',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <AppTypeIcon type={app.type} />

        <div className="flex items-center gap-2">
          <div
            className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1',
              statusConfig.color,
              statusConfig.bg,
              statusConfig.border
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* App Name */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
          {app.nameEn}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1">{app.nameAr}</p>
      </div>

      {/* Client Badge */}
      {showClient && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Users className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">{app.client.name}</span>
        </div>
      )}

      {/* Description */}
      {app.descriptionEn && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {app.descriptionEn}
        </p>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-800">
        <div>
          <p className="text-xs text-gray-500 mb-1">Version</p>
          <p className="text-sm font-semibold text-white">
            {app.releases.current.version}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Uptime</p>
          <p className="text-sm font-semibold text-green-400">
            {app.health.uptime?.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Issues</p>
          <p className={cn(
            'text-sm font-semibold',
            app.health.issues === 0 ? 'text-green-400' : 'text-orange-400'
          )}>
            {app.health.issues || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Last Deploy</p>
          <p className="text-sm font-semibold text-gray-300">
            {app.lastDeployedAt
              ? new Date(app.lastDeployedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              : 'Never'}
          </p>
        </div>
      </div>

      {/* Next Release */}
      {app.releases.upcoming && (
        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Next Release:</span>
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-medium">
                v{app.releases.upcoming.version}
              </span>
              <span className="text-gray-500">
                {new Date(app.releases.upcoming.targetDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Features Count */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{app.features.enabled.length} features enabled</span>
        <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  )
}

// Compact version for sidebars or smaller spaces
export function AppCardCompact({ app, projectId }: { app: App; projectId?: string }) {
  const statusConfig = STATUS_CONFIG[app.status]
  const appDetailUrl = projectId
    ? `/dashboard/projects/${projectId}/apps/${app.id}`
    : `/dashboard/apps/${app.id}`

  return (
    <Link
      href={appDetailUrl}
      className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-150"
    >
      <AppTypeIcon type={app.type} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{app.nameEn}</p>
        <p className="text-xs text-gray-500 truncate">{app.client.name}</p>
      </div>
      <div className={cn('w-2 h-2 rounded-full', statusConfig.bg.replace('/10', ''))} />
    </Link>
  )
}
