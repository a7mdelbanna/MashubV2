'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Settings, Building, User, Bell, Shield, Zap, Key, CreditCard,
  Briefcase, Rocket, Package, Users, UserCheck, GraduationCap,
  HelpCircle, FileText, MapPin, Tag, Mail, Database, ChevronDown, ChevronRight
} from 'lucide-react'

interface NavGroup {
  title: string
  icon: any
  items: NavItem[]
}

interface NavItem {
  label: string
  href: string
  icon: any
}

export default function SettingsLayout({ children }: { children: React.Node }) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['General', 'Team & Access', 'Module Settings'])

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const navigationGroups: NavGroup[] = [
    {
      title: 'General',
      icon: Settings,
      items: [
        { label: 'Overview', href: '/dashboard/settings', icon: Settings },
        { label: 'Company Profile', href: '/dashboard/settings#company', icon: Building },
        { label: 'User Preferences', href: '/dashboard/settings#user', icon: User },
        { label: 'Notifications', href: '/dashboard/settings#notifications', icon: Bell }
      ]
    },
    {
      title: 'Team & Access',
      icon: Shield,
      items: [
        { label: 'Team Members', href: '/dashboard/settings/team', icon: Users },
        { label: 'Roles & Permissions', href: '/dashboard/settings/roles', icon: Shield }
      ]
    },
    {
      title: 'Module Settings',
      icon: Database,
      items: [
        { label: 'Projects', href: '/dashboard/settings/projects', icon: Briefcase },
        { label: 'Services', href: '/dashboard/settings/services', icon: Rocket },
        { label: 'Products', href: '/dashboard/settings/products', icon: Package },
        { label: 'Clients', href: '/dashboard/settings/clients', icon: Users },
        { label: 'Candidates', href: '/dashboard/settings/candidates', icon: UserCheck },
        { label: 'Courses', href: '/dashboard/settings/courses', icon: GraduationCap },
        { label: 'Help & Support', href: '/dashboard/settings/help', icon: HelpCircle },
        { label: 'Invoices', href: '/dashboard/settings/invoices', icon: FileText },
        { label: 'Visits', href: '/dashboard/settings/visits', icon: MapPin }
      ]
    },
    {
      title: 'Customization',
      icon: Tag,
      items: [
        { label: 'Tags & Labels', href: '/dashboard/settings/tags', icon: Tag },
        { label: 'Custom Fields', href: '/dashboard/settings/custom-fields', icon: Database },
        { label: 'Email Templates', href: '/dashboard/settings/email-templates', icon: Mail }
      ]
    },
    {
      title: 'System',
      icon: Shield,
      items: [
        { label: 'Security & Privacy', href: '/dashboard/settings#security', icon: Shield },
        { label: 'Integrations', href: '/dashboard/settings#integrations', icon: Zap },
        { label: 'API & Webhooks', href: '/dashboard/settings#api', icon: Key },
        { label: 'Billing & Plans', href: '/dashboard/settings#billing', icon: CreditCard }
      ]
    }
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard/settings') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-72 flex-shrink-0">
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4 sticky top-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </h2>
              <p className="text-sm text-gray-400 mt-1">Manage your preferences and data</p>
            </div>

            <nav className="space-y-1">
              {navigationGroups.map((group) => {
                const isExpanded = expandedGroups.includes(group.title)
                const GroupIcon = group.icon

                return (
                  <div key={group.title}>
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <GroupIcon className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {group.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {/* Group Items */}
                    {isExpanded && (
                      <div className="mt-1 space-y-1 ml-2">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon
                          const active = isActive(item.href)

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                                active
                                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                              }`}
                            >
                              <ItemIcon className="h-4 w-4" />
                              <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mb-3">
                Quick Actions
              </p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                  Export Settings
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                  Import Settings
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
