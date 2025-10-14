'use client'

import { useState } from 'react'
import { X, Shield, Save, Check, Info } from 'lucide-react'
import { Permission } from '@/types/settings'
import { addRole } from '@/lib/team-utils'

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: () => void
}

const MODULES = [
  { id: 'projects', name: 'Projects', description: 'Project management' },
  { id: 'clients', name: 'Clients', description: 'Client management' },
  { id: 'invoices', name: 'Invoices', description: 'Billing' },
  { id: 'finance', name: 'Finance', description: 'Financial data' },
  { id: 'services', name: 'Services', description: 'Service offerings' },
  { id: 'products', name: 'Products', description: 'Product catalog' },
  { id: 'candidates', name: 'Candidates', description: 'Recruitment' },
  { id: 'courses', name: 'Courses', description: 'Learning' },
  { id: 'help', name: 'Help', description: 'Support tickets' },
  { id: 'visits', name: 'Visits', description: 'Client visits' },
  { id: 'settings', name: 'Settings', description: 'Configuration' }
]

const ACTIONS = ['read', 'create', 'update', 'delete', 'export', 'approve']
const SCOPES = [
  { id: 'global', name: 'All Data' },
  { id: 'tenant', name: 'Organization' },
  { id: 'team', name: 'Team' },
  { id: 'personal', name: 'Own' }
]

const COLORS = [
  '#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
]

export default function CreateRoleModal({ isOpen, onClose, onCreate }: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    icon: '👤'
  })

  const [permissions, setPermissions] = useState<Record<string, { actions: string[], scope: string }>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required'
    }

    if (Object.keys(permissions).length === 0) {
      newErrors.permissions = 'Select at least one permission'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Convert permissions to proper format
    const rolePermissions: Permission[] = Object.entries(permissions).map(([resource, config]) => ({
      resource,
      actions: config.actions as any,
      scope: config.scope as any
    }))

    // Create new role
    addRole({
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '_'),
      description: formData.description,
      permissions: rolePermissions,
      isSystemRole: false,
      isCustomRole: true,
      usersCount: 0,
      color: formData.color,
      icon: formData.icon
    })

    onCreate()

    // Reset form
    setFormData({
      name: '',
      description: '',
      color: '#6366f1',
      icon: '👤'
    })
    setPermissions({})
    setErrors({})
    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const toggleModuleAction = (moduleId: string, action: string) => {
    setPermissions(prev => {
      const current = prev[moduleId] || { actions: [], scope: 'team' }
      const actions = current.actions.includes(action)
        ? current.actions.filter(a => a !== action)
        : [...current.actions, action]

      if (actions.length === 0) {
        const newPerms = { ...prev }
        delete newPerms[moduleId]
        return newPerms
      }

      return {
        ...prev,
        [moduleId]: { ...current, actions }
      }
    })

    if (errors.permissions) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.permissions
        return newErrors
      })
    }
  }

  const setModuleScope = (moduleId: string, scope: string) => {
    setPermissions(prev => {
      const current = prev[moduleId] || { actions: ['read'], scope: 'team' }
      return {
        ...prev,
        [moduleId]: { ...current, scope }
      }
    })
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
              <h2 className="text-xl font-bold text-white">Create Custom Role</h2>
              <p className="text-sm text-gray-400">Define a new role with specific permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Role Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                  placeholder="e.g., Accountant, Sales Manager"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                  placeholder="Brief description of this role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-2xl text-center placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="👤"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange('color', color)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Permissions</h3>
              {errors.permissions && (
                <p className="text-xs text-red-400">{errors.permissions}</p>
              )}
            </div>

            <div className="space-y-3">
              {MODULES.map(module => {
                const modulePerms = permissions[module.id] || { actions: [], scope: 'team' }

                return (
                  <div
                    key={module.id}
                    className="rounded-lg bg-gray-800/50 border border-gray-700 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{module.name}</h4>
                        <p className="text-xs text-gray-400">{module.description}</p>
                      </div>
                      <select
                        value={modulePerms.scope}
                        onChange={(e) => setModuleScope(module.id, e.target.value)}
                        disabled={modulePerms.actions.length === 0}
                        className="px-3 py-1.5 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {SCOPES.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ACTIONS.map(action => {
                        const isActive = modulePerms.actions.includes(action)

                        return (
                          <button
                            key={action}
                            type="button"
                            onClick={() => toggleModuleAction(module.id, action)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-green-500/20 text-green-300 border-2 border-green-500'
                                : 'bg-gray-700 text-gray-400 border-2 border-transparent hover:border-gray-600'
                            }`}
                          >
                            {isActive && <Check className="h-3 w-3 inline mr-1" />}
                            {action}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-medium">Permission Guidelines</p>
                <p className="text-blue-400/80 text-xs mt-1">
                  - <strong>Read</strong>: View data<br />
                  - <strong>Create</strong>: Add new records<br />
                  - <strong>Update</strong>: Modify existing data<br />
                  - <strong>Delete</strong>: Remove records<br />
                  - <strong>Export</strong>: Download data<br />
                  - <strong>Approve</strong>: Workflow approvals
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Create Role</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
