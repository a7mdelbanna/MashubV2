'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ExternalLink, Settings, MoreVertical,
  Globe, Database, Key, Package, Calendar, Users,
  Activity, TrendingUp, AlertCircle, CheckCircle2,
  GitBranch, Edit, Copy, Download, Shield, Palette,
  Code, Smartphone, Clock, Target, Bell, FolderOpen
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AppsService } from '@/services/apps.service'
import { ProjectsService } from '@/services/projects.service'
import { AppTypeIcon, AppTypeBadge } from '@/components/apps/app-type-badge'
import { CredentialsVault } from '@/components/apps/credentials-vault'
import { Checklist } from '@/components/apps/checklist'
import { AppFilesView } from '@/components/apps/app-files-view'
import { ProjectFile, App, Project } from '@/types'

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

export default function AppDetailPage() {
  const params = useParams()
  const { tenant } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [app, setApp] = useState<App | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const appId = params.id as string

  // Fetch app data from Firebase
  useEffect(() => {
    if (!tenant?.id || !appId) return

    const unsubscribe = AppsService.subscribe(tenant.id, appId, async (updatedApp) => {
      setApp(updatedApp)

      // Fetch the project this app belongs to
      if (updatedApp.projectId) {
        try {
          const projectData = await ProjectsService.getById(tenant.id, updatedApp.projectId)
          setProject(projectData)
        } catch (error) {
          console.error('Error fetching project:', error)
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [tenant?.id, appId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-white mb-2">App Not Found</h2>
        <p className="text-gray-400 mb-6">The app you're looking for doesn't exist</p>
        <Link
          href="/dashboard/apps"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Back to Apps
        </Link>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[app.status]
  const StatusIcon = statusConfig.icon

  // Get checklist template for this app type
  const checklist = project?.checklistTemplates?.find(t => t.appTypes.includes(app.type))

  // Mock project files (in real app, fetch from API)
  const mockProjectFiles: ProjectFile[] = [
    {
      id: 'file_1',
      projectId: project?.id || '',
      name: 'API Documentation.pdf',
      type: 'document',
      extension: '.pdf',
      size: 5242880,
      uploadedBy: 'Ahmed Hassan',
      uploadedAt: '2025-10-20T10:00:00Z',
      version: 2,
      versions: [
        { version: 1, uploadedBy: 'Ahmed Hassan', uploadedAt: '2025-10-15T10:00:00Z', size: 4800000 },
        { version: 2, uploadedBy: 'Ahmed Hassan', uploadedAt: '2025-10-20T10:00:00Z', size: 5242880, changes: 'Added authentication section' }
      ],
      folder: '/Documentation/API',
      tags: ['api', 'docs', 'technical'],
      isStarred: true,
      downloads: 45,
      assignedApps: [app.id] // Assigned to this app
    },
    {
      id: 'file_2',
      projectId: project?.id || '',
      name: 'Brand Guidelines.pdf',
      type: 'document',
      extension: '.pdf',
      size: 15728640,
      uploadedBy: 'Sarah Ahmed',
      uploadedAt: '2025-10-18T14:30:00Z',
      version: 1,
      versions: [
        { version: 1, uploadedBy: 'Sarah Ahmed', uploadedAt: '2025-10-18T14:30:00Z', size: 15728640 }
      ],
      folder: '/Design/Brand',
      tags: ['branding', 'design', 'guidelines'],
      isStarred: false,
      downloads: 22,
      assignedApps: [app.id, 'other_app_id'] // Shared with multiple apps
    },
    {
      id: 'file_3',
      projectId: project?.id || '',
      name: 'Logo Assets.zip',
      type: 'archive',
      extension: '.zip',
      size: 8388608,
      uploadedBy: 'Sarah Ahmed',
      uploadedAt: '2025-10-19T09:15:00Z',
      version: 1,
      versions: [
        { version: 1, uploadedBy: 'Sarah Ahmed', uploadedAt: '2025-10-19T09:15:00Z', size: 8388608 }
      ],
      folder: '/Design/Assets',
      tags: ['logo', 'assets', 'design'],
      isStarred: true,
      downloads: 18,
      assignedApps: [app.id]
    },
    {
      id: 'file_4',
      projectId: project?.id || '',
      name: 'Database Schema.png',
      type: 'image',
      extension: '.png',
      size: 2097152,
      uploadedBy: 'Mohamed Ali',
      uploadedAt: '2025-10-21T11:00:00Z',
      version: 3,
      versions: [
        { version: 1, uploadedBy: 'Mohamed Ali', uploadedAt: '2025-10-10T11:00:00Z', size: 1800000 },
        { version: 2, uploadedBy: 'Mohamed Ali', uploadedAt: '2025-10-15T11:00:00Z', size: 1900000, changes: 'Added user tables' },
        { version: 3, uploadedBy: 'Mohamed Ali', uploadedAt: '2025-10-21T11:00:00Z', size: 2097152, changes: 'Added transactions table' }
      ],
      folder: '/Development/Database',
      tags: ['database', 'schema', 'technical'],
      isStarred: false,
      downloads: 31,
      assignedApps: [app.id]
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'config', label: 'Configuration', icon: Code },
    { id: 'credentials', label: 'Credentials', icon: Shield },
    { id: 'releases', label: 'Releases', icon: GitBranch },
    { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
    { id: 'files', label: 'Files', icon: FolderOpen }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/apps">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <AppTypeIcon type={app.type} size="lg" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{app.nameEn}</h1>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border",
                  statusConfig.bg,
                  statusConfig.color,
                  statusConfig.border
                )}>
                  <StatusIcon className="h-4 w-4" />
                  {statusConfig.label}
                </div>
                <AppTypeBadge type={app.type} size="sm" />
              </div>
              <p className="text-gray-400">{app.descriptionEn}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {app.environments.production && (
            <Link href={app.environments.production.url} target="_blank">
              <button className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-colors flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open App
              </button>
            </Link>
          )}
          <button className="px-4 py-2 rounded-xl gradient-purple text-white hover:opacity-90 transition-opacity flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="p-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-gray-500">Client</span>
          </div>
          <p className="text-lg font-bold text-white">{app.client?.name || 'N/A'}</p>
        </div>

        <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-500">Version</span>
          </div>
          <p className="text-lg font-bold text-white">{app.releases?.current?.version || 'N/A'}</p>
        </div>

        <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-500">Uptime</span>
          </div>
          <p className="text-lg font-bold text-green-400">{app.health?.uptime?.toFixed(1) || 0}%</p>
        </div>

        <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <span className="text-xs text-gray-500">Open Issues</span>
          </div>
          <p className="text-lg font-bold text-white">{app.health?.issues || 0}</p>
        </div>

        <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Last Deploy</span>
          </div>
          <p className="text-sm font-semibold text-white">
            {app.lastDeployedAt
              ? new Date(app.lastDeployedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Never'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-purple-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Project & Client Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Card */}
              {project && (
                <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Project</h3>
                      <p className="text-sm text-gray-400">Parent project information</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <div className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500 transition-all cursor-pointer">
                      <h4 className="font-semibold text-white mb-1">{project.name}</h4>
                      <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-sm font-semibold text-purple-400">{project.progress}%</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Client Card */}
              {app.client && (
                <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Client</h3>
                      <p className="text-sm text-gray-400">Client information</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      {app.client.logo && (
                        <img
                          src={app.client.logo}
                          alt={app.client.name}
                          className="w-12 h-12 rounded-lg"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-white">{app.client.name}</h4>
                        <p className="text-xs text-gray-500">Client ID: {app.client.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Environments */}
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Environments</h3>
                  <p className="text-sm text-gray-400">Deployment environments and URLs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(app.environments).map(([env, config]) => {
                  if (!config) return null
                  return (
                    <div key={env} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-white capitalize">{env}</span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          config.status === 'active' ? 'bg-green-400' : 'bg-gray-600'
                        )} />
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-500">URL:</span>
                          <Link href={config.url} target="_blank" className="block text-purple-400 hover:text-purple-300 truncate">
                            {config.url}
                          </Link>
                        </div>
                        {config.version && (
                          <div>
                            <span className="text-gray-500">Version:</span>
                            <span className="ml-2 text-white">{config.version}</span>
                          </div>
                        )}
                        {config.lastDeployed && (
                          <div>
                            <span className="text-gray-500">Last Deploy:</span>
                            <span className="ml-2 text-gray-300">
                              {new Date(config.lastDeployed).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Features & Pricing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Features */}
              {app.features && (
                <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Enabled Features</h3>
                  {app.features.enabled && app.features.enabled.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {app.features.enabled.map((feature) => (
                        <div
                          key={feature}
                          className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm"
                        >
                          {feature.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  )}
                  {app.features.modules && app.features.modules.length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold text-white mt-6 mb-3">Modules</h4>
                      <div className="flex flex-wrap gap-2">
                        {app.features.modules.map((module) => (
                          <div
                            key={module}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm"
                          >
                            {module}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Pricing */}
              {app.pricing && (
                <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Pricing Plan</h3>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <h4 className="text-xl font-bold text-white mb-2">Pricing Configured</h4>
                    <p className="text-sm text-gray-400">Pricing catalog item ID: {app.pricing.catalogItemId}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Brand Identity</h3>

              {/* Colors */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Color Palette</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div
                      className="w-full h-20 rounded-lg mb-2 border border-gray-700"
                      style={{ backgroundColor: app.branding.primaryColor }}
                    />
                    <p className="text-xs text-gray-500">Primary</p>
                    <p className="text-sm text-white font-mono">{app.branding.primaryColor}</p>
                  </div>
                  <div>
                    <div
                      className="w-full h-20 rounded-lg mb-2 border border-gray-700"
                      style={{ backgroundColor: app.branding.secondaryColor }}
                    />
                    <p className="text-xs text-gray-500">Secondary</p>
                    <p className="text-sm text-white font-mono">{app.branding.secondaryColor}</p>
                  </div>
                  {app.branding.accentColor && (
                    <div>
                      <div
                        className="w-full h-20 rounded-lg mb-2 border border-gray-700"
                        style={{ backgroundColor: app.branding.accentColor }}
                      />
                      <p className="text-xs text-gray-500">Accent</p>
                      <p className="text-sm text-white font-mono">{app.branding.accentColor}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assets */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Brand Assets</h4>
                <div className="grid grid-cols-2 gap-4">
                  {app.branding.logo && (
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                      <p className="text-xs text-gray-500 mb-2">Logo</p>
                      <img src={app.branding.logo} alt="Logo" className="w-16 h-16 rounded-lg" />
                    </div>
                  )}
                  {app.branding.splashScreen && (
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                      <p className="text-xs text-gray-500 mb-2">Splash Screen</p>
                      <div className="text-sm text-purple-400">View Asset →</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-6">App Configuration</h3>

              {/* Store ID */}
              {app.storeId && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-400 mb-2 block">Store ID</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={app.storeId}
                      readOnly
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white font-mono"
                    />
                    <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                      <Copy className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* URLs */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Important URLs</h4>
                <div className="space-y-3">
                  {Object.entries(app.urls).map(([key, url]) => {
                    if (!url) return null
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 capitalize w-32">{key.replace('_', ' ')}:</span>
                        <Link
                          href={url}
                          target="_blank"
                          className="flex-1 px-3 py-2 rounded-lg bg-gray-800/30 border border-gray-700 text-purple-400 hover:text-purple-300 text-sm font-mono truncate"
                        >
                          {url}
                        </Link>
                        <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credentials Tab */}
        {activeTab === 'credentials' && (
          <CredentialsVault credentials={app.credentials} />
        )}

        {/* Releases Tab */}
        {activeTab === 'releases' && app.releases && (
          <div className="space-y-6">
            {/* Current Release */}
            {app.releases.current && (
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Current Release</h3>
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">
                        v{app.releases.current.version}
                      </h4>
                      {app.releases.current.releaseDate && (
                        <p className="text-sm text-gray-400">
                          Released {new Date(app.releases.current.releaseDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {app.releases.current.releaseChannel && (
                      <div className={cn(
                        "px-4 py-2 rounded-xl font-medium capitalize",
                        app.releases.current.releaseChannel === 'production' && "bg-green-500/20 text-green-400",
                        app.releases.current.releaseChannel === 'staging' && "bg-blue-500/20 text-blue-400",
                        app.releases.current.releaseChannel === 'dev' && "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {app.releases.current.releaseChannel}
                      </div>
                    )}
                  </div>
                  {app.releases.current.notes && (
                    <p className="text-gray-300">{app.releases.current.notes}</p>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming Release */}
            {app.releases.upcoming && (
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Upcoming Release</h3>
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">
                        v{app.releases.upcoming.version}
                      </h4>
                      {app.releases.upcoming.targetDate && (
                        <p className="text-sm text-gray-400">
                          Target: {new Date(app.releases.upcoming.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {app.releases.upcoming.status && (
                      <div className={cn(
                        "px-4 py-2 rounded-xl font-medium capitalize",
                        app.releases.upcoming.status === 'approved' && "bg-green-500/20 text-green-400",
                        app.releases.upcoming.status === 'qa' && "bg-blue-500/20 text-blue-400",
                        app.releases.upcoming.status === 'in_progress' && "bg-yellow-500/20 text-yellow-400",
                        app.releases.upcoming.status === 'planned' && "bg-gray-500/20 text-gray-400"
                      )}>
                        {app.releases.upcoming.status.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                  {app.releases.upcoming.features && app.releases.upcoming.features.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-400 mb-2">Planned Features:</p>
                      <ul className="space-y-1">
                        {app.releases.upcoming.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="h-4 w-4 text-purple-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Release History */}
            {app.releases.history && app.releases.history.length > 0 && (
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Release History</h3>
                <div className="space-y-3">
                  {app.releases.history.map((release, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">v{release.version}</h4>
                          <p className="text-sm text-gray-400">
                            {release.releaseDate && new Date(release.releaseDate).toLocaleDateString()} • {release.releaseChannel}
                          </p>
                        </div>
                        {release.status && (
                          <div className={cn(
                            "px-3 py-1 rounded-lg text-xs font-medium",
                            release.status === 'shipped' && "bg-green-500/20 text-green-400",
                            release.status === 'rolled_back' && "bg-red-500/20 text-red-400"
                          )}>
                            {release.status.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                      {release.notes && (
                        <p className="text-sm text-gray-400 mt-2">{release.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && checklist && (
          <Checklist template={checklist} readonly={true} />
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                <FolderOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">App Files</h3>
                <p className="text-sm text-gray-400">Files assigned to this app from the project</p>
              </div>
            </div>

            <AppFilesView
              appId={app.id}
              projectFiles={mockProjectFiles}
              onViewFile={(file) => console.log('View file:', file)}
              onDownloadFile={(file) => console.log('Download file:', file)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
