'use client'

import { X, Shield, Users, Check, Lock } from 'lucide-react'
import { Role } from '@/types/settings'

interface RoleDetailsModalProps {
  isOpen: boolean
  role: Role | null
  userCount: number
  onClose: () => void
}

const MODULES = [
  { id: 'projects', name: 'Projects' },
  { id: 'clients', name: 'Clients' },
  { id: 'invoices', name: 'Invoices' },
  { id: 'finance', name: 'Finance' },
  { id: 'services', name: 'Services' },
  { id: 'products', name: 'Products' },
  { id: 'candidates', name: 'Candidates' },
  { id: 'courses', name: 'Courses' },
  { id: 'help', name: 'Help & Support' },
  { id: 'visits', name: 'Visits' },
  { id: 'settings', name: 'Settings' }
]

const ACTIONS = [
  { id: 'read', name: 'View', color: 'blue' },
  { id: 'create', name: 'Create', color: 'green' },
  { id: 'update', name: 'Edit', color: 'yellow' },
  { id: 'delete', name: 'Delete', color: 'red' },
  { id: 'export', name: 'Export', color: 'purple' },
  { id: 'approve', name: 'Approve', color: 'pink' }
]

export default function RoleDetailsModal({ isOpen, role, userCount, onClose }: RoleDetailsModalProps) {
  if (!isOpen || !role) return null

  const hasPermission = (resource: string, action: string) => {
    return role.permissions.some(p =>
      (p.resource === '*' || p.resource === resource) &&
      (p.actions.includes('*' as any) || p.actions.includes(action as any))
    )
  }

  const getModuleScope = (resource: string) => {
    const perm = role.permissions.find(p => p.resource === resource || p.resource === '*')
    return perm?.scope || 'personal'
  }

  const getScopeColor = (scope: string) => {
    const colors: Record<string, string> = {
      global: 'text-red-400 bg-red-500/10 border-red-500/20',
      tenant: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      team: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      personal: 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
    return colors[scope] || colors.personal
  }

  const getScopeName = (scope: string) => {
    const names: Record<string, string> = {
      global: 'All Data',
      tenant: 'Organization',
      team: 'Team',
      personal: 'Own'
    }
    return names[scope] || scope
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl mx-4 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center space-x-4">
            <div
              className="p-3 rounded-xl text-2xl"
              style={{ backgroundColor: `${role.color}20` }}
            >
              {role.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{role.name}</h2>
              <p className="text-sm text-gray-400">{role.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{userCount}</div>
            <div className="text-sm text-gray-400 mt-1 flex items-center justify-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {new Set(role.permissions.map(p => p.resource === '*' ? MODULES.length : 1)).size}
            </div>
            <div className="text-sm text-gray-400 mt-1">Modules</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{role.permissions.length}</div>
            <div className="text-sm text-gray-400 mt-1">Permissions</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
              role.isSystemRole
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}>
              {role.isSystemRole ? <Lock className="h-3 w-3 mr-1" /> : null}
              {role.isSystemRole ? 'System' : 'Custom'}
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Detailed Permissions</h3>
          <div className="space-y-3">
            {MODULES.map(module => {
              const scope = getModuleScope(module.id)
              const hasAnyPermission = ACTIONS.some(action => hasPermission(module.id, action.id))

              if (!hasAnyPermission && role.permissions.every(p => p.resource !== '*')) {
                return null
              }

              return (
                <div
                  key={module.id}
                  className="rounded-xl bg-gray-800/30 border border-gray-700 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-800/50">
                    <h4 className="text-white font-medium">{module.name}</h4>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getScopeColor(scope)}`}>
                      {getScopeName(scope)}
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-3 p-4">
                    {ACTIONS.map(action => {
                      const hasAccess = hasPermission(module.id, action.id)

                      return (
                        <div
                          key={action.id}
                          className={`p-3 rounded-lg border-2 text-center ${
                            hasAccess
                              ? `border-${action.color}-500 bg-${action.color}-500/10`
                              : 'border-gray-700 bg-gray-800/30 opacity-40'
                          }`}
                        >
                          <div className="text-sm font-medium text-white mb-1">
                            {action.name}
                          </div>
                          {hasAccess && (
                            <Check className={`h-4 w-4 text-${action.color}-400 mx-auto`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
