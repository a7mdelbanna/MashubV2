'use client'

import { useState, useEffect } from 'react'
import { X, Shield, Check, Minus, Lock, Unlock, Save } from 'lucide-react'
import { User, Permission } from '@/types/settings'
import { updateUser, DEFAULT_ROLES } from '@/lib/team-utils'

interface PermissionEditorModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onUpdate: () => void
}

const MODULES = [
  { id: 'projects', name: 'Projects', description: 'Project management and tracking' },
  { id: 'clients', name: 'Clients', description: 'Client relationship management' },
  { id: 'invoices', name: 'Invoices', description: 'Billing and invoicing' },
  { id: 'finance', name: 'Finance', description: 'Financial management' },
  { id: 'services', name: 'Services', description: 'Service offerings' },
  { id: 'products', name: 'Products', description: 'Product catalog' },
  { id: 'candidates', name: 'Candidates', description: 'Recruitment pipeline' },
  { id: 'courses', name: 'Courses', description: 'Learning management' },
  { id: 'help', name: 'Help & Support', description: 'Support tickets' },
  { id: 'visits', name: 'Visits', description: 'Client visits' },
  { id: 'settings', name: 'Settings', description: 'System configuration' }
]

const ACTIONS = [
  { id: 'read', name: 'View', icon: '👁️' },
  { id: 'create', name: 'Create', icon: '➕' },
  { id: 'update', name: 'Edit', icon: '✏️' },
  { id: 'delete', name: 'Delete', icon: '🗑️' },
  { id: 'export', name: 'Export', icon: '📤' },
  { id: 'approve', name: 'Approve', icon: '✅' }
]

const SCOPES = [
  { id: 'global', name: 'All Data', description: 'Access to all data across the platform' },
  { id: 'tenant', name: 'Organization', description: 'Access to organization-wide data' },
  { id: 'team', name: 'Team', description: 'Access to team member data only' },
  { id: 'personal', name: 'Own', description: 'Access to own data only' }
]

export default function PermissionEditorModal({ isOpen, user, onClose, onUpdate }: PermissionEditorModalProps) {
  const [customPermissions, setCustomPermissions] = useState<Permission[]>([])
  const [useRoleDefaults, setUseRoleDefaults] = useState(true)

  useEffect(() => {
    if (user) {
      setCustomPermissions(user.permissions || [])
      // Check if user has custom permissions
      const rolePermissions = DEFAULT_ROLES.find(r => r.slug === user.role)?.permissions || []
      const hasCustom = JSON.stringify(user.permissions) !== JSON.stringify(rolePermissions)
      setUseRoleDefaults(!hasCustom)
    }
  }, [user])

  if (!isOpen || !user) return null

  const rolePermissions = DEFAULT_ROLES.find(r => r.slug === user.role)?.permissions || []
  const activePermissions = useRoleDefaults ? rolePermissions : customPermissions

  const hasPermission = (module: string, action: string) => {
    return activePermissions.some(p =>
      (p.resource === '*' || p.resource === module) &&
      (p.actions.includes('*' as any) || p.actions.includes(action as any))
    )
  }

  const getPermissionScope = (module: string) => {
    const perm = activePermissions.find(p => p.resource === module || p.resource === '*')
    return perm?.scope || 'personal'
  }

  const togglePermission = (module: string, action: string) => {
    if (useRoleDefaults) return

    setCustomPermissions(prev => {
      const existingIndex = prev.findIndex(p => p.resource === module)

      if (existingIndex >= 0) {
        const updated = [...prev]
        const existing = updated[existingIndex]
        const actions = existing.actions.filter(a => a !== '*')

        if (actions.includes(action as any)) {
          // Remove action
          updated[existingIndex] = {
            ...existing,
            actions: actions.filter(a => a !== action) as any
          }
          // Remove permission if no actions left
          if (updated[existingIndex].actions.length === 0) {
            return updated.filter((_, i) => i !== existingIndex)
          }
        } else {
          // Add action
          updated[existingIndex] = {
            ...existing,
            actions: [...actions, action] as any
          }
        }
        return updated
      } else {
        // Add new permission
        return [
          ...prev,
          {
            resource: module,
            actions: [action] as any,
            scope: 'team'
          }
        ]
      }
    })
  }

  const setModuleScope = (module: string, scope: string) => {
    if (useRoleDefaults) return

    setCustomPermissions(prev => {
      const existingIndex = prev.findIndex(p => p.resource === module)

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          scope: scope as any
        }
        return updated
      } else {
        return [
          ...prev,
          {
            resource: module,
            actions: ['read'] as any,
            scope: scope as any
          }
        ]
      }
    })
  }

  const handleSubmit = () => {
    updateUser(user.id, {
      permissions: useRoleDefaults ? rolePermissions : customPermissions
    })

    onUpdate()
    onClose()
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
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Permissions Editor</h2>
              <p className="text-sm text-gray-400">
                {user.firstName} {user.lastName} ({user.role})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700">
            <div className="flex items-center space-x-3">
              {useRoleDefaults ? (
                <Lock className="h-5 w-5 text-blue-400" />
              ) : (
                <Unlock className="h-5 w-5 text-purple-400" />
              )}
              <div>
                <p className="text-white font-medium">
                  {useRoleDefaults ? 'Using Role Defaults' : 'Custom Permissions'}
                </p>
                <p className="text-sm text-gray-400">
                  {useRoleDefaults
                    ? 'User inherits permissions from their role'
                    : 'User has custom permission overrides'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setUseRoleDefaults(!useRoleDefaults)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                useRoleDefaults
                  ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                  : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
              }`}
            >
              {useRoleDefaults ? 'Customize' : 'Use Defaults'}
            </button>
          </div>

          {/* Permissions Grid */}
          <div className="space-y-4">
            {MODULES.map((module) => {
              const scope = getPermissionScope(module.id)

              return (
                <div
                  key={module.id}
                  className="rounded-xl bg-gray-800/30 border border-gray-700 overflow-hidden"
                >
                  {/* Module Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50">
                    <div>
                      <h4 className="text-white font-medium">{module.name}</h4>
                      <p className="text-xs text-gray-400">{module.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Scope:</span>
                      <select
                        value={scope}
                        onChange={(e) => setModuleScope(module.id, e.target.value)}
                        disabled={useRoleDefaults}
                        className="px-3 py-1.5 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {SCOPES.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-6 gap-2 p-4">
                    {ACTIONS.map((action) => {
                      const hasAccess = hasPermission(module.id, action.id)

                      return (
                        <button
                          key={action.id}
                          onClick={() => togglePermission(module.id, action.id)}
                          disabled={useRoleDefaults}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            hasAccess
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-gray-700 bg-gray-800/30'
                          } ${useRoleDefaults ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-600'}`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{action.icon}</div>
                            <div className="text-xs text-gray-400">{action.name}</div>
                            {hasAccess && (
                              <Check className="h-3 w-3 text-green-400 mx-auto mt-1" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Permissions</span>
          </button>
        </div>
      </div>
    </div>
  )
}
