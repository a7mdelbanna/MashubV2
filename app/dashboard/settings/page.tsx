'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Settings, Briefcase, Rocket, Package, Users, UserCheck, GraduationCap,
  HelpCircle, FileText, MapPin, Tag, Database, CheckCircle, AlertCircle,
  TrendingUp, ArrowRight, Download, Upload, RefreshCw, Shield
} from 'lucide-react'
import { STORAGE_KEYS, getSettings, exportSettings, importSettings } from '@/lib/settings-data'

export default function SettingsOverviewPage() {
  const [stats, setStats] = useState({
    totalSettings: 0,
    activeSettings: 0,
    moduleCount: 9,
    customizationCount: 0
  })

  useEffect(() => {
    calculateStats()
  }, [])

  const calculateStats = () => {
    let total = 0
    let active = 0

    // Count all settings
    Object.values(STORAGE_KEYS).forEach(key => {
      const items = getSettings(key)
      total += items.length
      active += items.filter((item: any) => item.isActive).length
    })

    setStats({
      totalSettings: total,
      activeSettings: active,
      moduleCount: 9,
      customizationCount: 3
    })
  }

  const handleExport = () => {
    const data = exportSettings()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mashub-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string
            if (importSettings(data)) {
              alert('Settings imported successfully!')
              calculateStats()
            } else {
              alert('Failed to import settings')
            }
          } catch (error) {
            alert('Invalid settings file')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const teamAccessSettings = [
    {
      title: 'Team Members',
      description: 'Manage users and team assignments',
      href: '/dashboard/settings/team',
      icon: Users,
      color: 'from-blue-600 to-purple-600',
      items: ['15 members', 'Role management']
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure access levels and permissions',
      href: '/dashboard/settings/roles',
      icon: Shield,
      color: 'from-purple-600 to-pink-600',
      items: ['7 system roles', 'Custom roles']
    }
  ]

  const moduleSettings = [
    {
      title: 'Projects',
      description: 'Statuses, priorities, tags, and task types',
      href: '/dashboard/settings/projects',
      icon: Briefcase,
      color: 'from-blue-600 to-blue-500',
      items: ['4 tabs', '21 default items']
    },
    {
      title: 'Services',
      description: 'Categories and tags for services',
      href: '/dashboard/settings/services',
      icon: Rocket,
      color: 'from-purple-600 to-purple-500',
      items: ['2 tabs', '10 default items']
    },
    {
      title: 'Products',
      description: 'Categories, tags, brands, and units',
      href: '/dashboard/settings/products',
      icon: Package,
      color: 'from-green-600 to-green-500',
      items: ['4 tabs', '15 default items']
    },
    {
      title: 'Clients',
      description: 'Sources, industries, and tags',
      href: '/dashboard/settings/clients',
      icon: Users,
      color: 'from-pink-600 to-pink-500',
      items: ['3 tabs', '12 default items']
    },
    {
      title: 'Candidates',
      description: 'Sources and skills library',
      href: '/dashboard/settings/candidates',
      icon: UserCheck,
      color: 'from-indigo-600 to-indigo-500',
      items: ['2 tabs', '11 default items']
    },
    {
      title: 'Courses',
      description: 'Categories and difficulty levels',
      href: '/dashboard/settings/courses',
      icon: GraduationCap,
      color: 'from-yellow-600 to-yellow-500',
      items: ['2 tabs', '9 default items']
    },
    {
      title: 'Help & Support',
      description: 'Ticket categories and priorities',
      href: '/dashboard/settings/help',
      icon: HelpCircle,
      color: 'from-teal-600 to-teal-500',
      items: ['2 tabs', '9 default items']
    },
    {
      title: 'Invoices',
      description: 'Payment terms and defaults',
      href: '/dashboard/settings/invoices',
      icon: FileText,
      color: 'from-orange-600 to-orange-500',
      items: ['1 tab', '5 default items']
    },
    {
      title: 'Visits',
      description: 'Visit types and purposes',
      href: '/dashboard/settings/visits',
      icon: MapPin,
      color: 'from-red-600 to-red-500',
      items: ['2 tabs', '10 default items']
    }
  ]

  const customizationSettings = [
    {
      title: 'Tags & Labels',
      description: 'Manage tags across all modules',
      href: '/dashboard/settings/tags',
      icon: Tag,
      color: 'from-violet-600 to-purple-600'
    },
    {
      title: 'Custom Fields',
      description: 'Define custom fields for entities',
      href: '/dashboard/settings/custom-fields',
      icon: Database,
      color: 'from-blue-600 to-cyan-600',
      badge: 'Coming Soon'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings Overview</h1>
          <p className="text-gray-400 mt-1">Manage your platform configuration and preferences</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Settings</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalSettings}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Database className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Active Settings</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.activeSettings}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Module Settings</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.moduleCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Settings className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-300 text-sm font-medium">Customizations</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.customizationCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/20">
              <TrendingUp className="h-6 w-6 text-pink-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Configure Your Platform</p>
            <p className="text-blue-400/80 text-sm mt-1">
              Customize tags, categories, statuses, and more for each module. All changes take effect immediately and are stored locally.
            </p>
          </div>
        </div>
      </div>

      {/* Team & Access Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Team & Access Management</h2>
        <div className="grid grid-cols-2 gap-4">
          {teamAccessSettings.map((setting) => {
            const Icon = setting.icon

            return (
              <Link
                key={setting.href}
                href={setting.href}
                className="group rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 p-6 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${setting.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{setting.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{setting.description}</p>

                <div className="flex items-center space-x-3">
                  {setting.items.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-gray-800/50 text-xs text-gray-400">
                      {item}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Module Settings Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Module Settings</h2>
        <div className="grid grid-cols-3 gap-4">
          {moduleSettings.map((module) => {
            const Icon = module.icon

            return (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 p-6 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${module.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{module.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{module.description}</p>

                <div className="flex items-center space-x-3">
                  {module.items.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-gray-800/50 text-xs text-gray-400">
                      {item}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Customization Settings Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Customization</h2>
        <div className="grid grid-cols-3 gap-4">
          {customizationSettings.map((setting) => {
            const Icon = setting.icon

            return (
              <Link
                key={setting.href}
                href={setting.href}
                className={`group rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 p-6 transition-all ${
                  setting.badge ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'
                }`}
                {...(setting.badge ? { onClick: (e) => e.preventDefault() } : {})}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${setting.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {setting.badge ? (
                    <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                      {setting.badge}
                    </span>
                  ) : (
                    <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{setting.title}</h3>
                <p className="text-sm text-gray-400">{setting.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export All Settings</span>
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white transition-colors flex items-center justify-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import Settings</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Reset all settings to defaults? This cannot be undone.')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
            className="px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  )
}
