'use client'

import { useState, useEffect } from 'react'
import {
  Shield, Users, Plus, Edit, Trash2, Eye, Lock, Unlock,
  AlertCircle, Crown, Settings, Briefcase, UserCheck
} from 'lucide-react'
import { Role } from '@/types/settings'
import {
  getRoles,
  DEFAULT_ROLES,
  countUsersByRole,
  getRoleColor,
  getRoleIcon
} from '@/lib/team-utils'
import CreateRoleModal from '@/components/team/CreateRoleModal'
import RoleDetailsModal from '@/components/team/RoleDetailsModal'

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [systemRoles, setSystemRoles] = useState<Role[]>([])
  const [customRoles, setCustomRoles] = useState<Role[]>([])
  const [userCounts, setUserCounts] = useState<Record<string, number>>({})

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = () => {
    // Get all roles (default + custom)
    const allRoles = getRoles()
    setRoles(allRoles)

    // Separate system roles and custom roles
    const system = DEFAULT_ROLES
    const custom = allRoles.filter(r => !DEFAULT_ROLES.find(dr => dr.id === r.id))

    setSystemRoles(system)
    setCustomRoles(custom)

    // Get user counts for each role
    const counts: Record<string, number> = {}
    allRoles.forEach(role => {
      counts[role.slug] = countUsersByRole(role.slug)
    })
    setUserCounts(counts)
  }

  const getRoleIcon = (roleSlug: string) => {
    const icons: Record<string, any> = {
      super_admin: Crown,
      admin: Shield,
      manager: Briefcase,
      employee: UserCheck,
      client: Users,
      vendor: Settings,
      guest: Eye
    }
    return icons[roleSlug] || Shield
  }

  const getRoleStats = (role: Role) => {
    const userCount = userCounts[role.slug] || 0
    const permissionCount = role.permissions?.length || 0
    const moduleCount = new Set(role.permissions?.map(p => p.resource)).size

    return { userCount, permissionCount, moduleCount }
  }

  const getRoleDescription = (roleSlug: string) => {
    const descriptions: Record<string, string> = {
      super_admin: 'Full system access including platform management',
      admin: 'Almost full access, tenant-level management',
      manager: 'Team-level access and operational management',
      employee: 'Personal workspace and assigned tasks',
      client: 'External user with view-only project access',
      vendor: 'Supplier with purchase order management',
      guest: 'Temporary read-only access for auditors'
    }
    return descriptions[roleSlug] || 'Custom role with specific permissions'
  }

  const handleViewDetails = (role: Role) => {
    setSelectedRole(role)
    setShowDetailsModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
              <p className="text-gray-400">Define roles and their access levels</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Role</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Role-Based Access Control</p>
            <p className="text-blue-400/80 text-sm mt-1">
              System roles are pre-configured and cannot be deleted. Create custom roles for specific team needs with fine-grained permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Total Roles</p>
              <p className="text-3xl font-bold text-white mt-2">{systemRoles.length + customRoles.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">System Roles</p>
              <p className="text-3xl font-bold text-white mt-2">{systemRoles.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-300 text-sm font-medium">Custom Roles</p>
              <p className="text-3xl font-bold text-white mt-2">{customRoles.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/20">
              <Unlock className="h-6 w-6 text-pink-400" />
            </div>
          </div>
        </div>
      </div>

      {/* System Roles Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Lock className="h-5 w-5 text-gray-400" />
          <h2 className="text-xl font-bold text-white">System Roles</h2>
          <span className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs">
            Pre-configured
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {systemRoles.map((role) => {
            const Icon = getRoleIcon(role.slug)
            const stats = getRoleStats(role)
            const color = role.color || getRoleColor(role.slug)

            return (
              <div
                key={role.id}
                className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 p-6 transition-all"
              >
                {/* Role Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{role.name}</span>
                        {role.slug === 'super_admin' && (
                          <Crown className="h-4 w-4 text-yellow-400" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">{getRoleDescription(role.slug)}</p>
                    </div>
                  </div>
                </div>

                {/* Role Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="px-3 py-2 rounded-lg bg-gray-800/50">
                    <p className="text-xs text-gray-400">Users</p>
                    <p className="text-lg font-bold text-white">{stats.userCount}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-gray-800/50">
                    <p className="text-xs text-gray-400">Modules</p>
                    <p className="text-lg font-bold text-white">{stats.moduleCount}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-gray-800/50">
                    <p className="text-xs text-gray-400">Permissions</p>
                    <p className="text-lg font-bold text-white">{stats.permissionCount}</p>
                  </div>
                </div>

                {/* Permission Preview */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Key Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions?.slice(0, 3).map((perm, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-gray-800 text-xs text-gray-300"
                      >
                        {perm.resource === '*' ? 'All Modules' : perm.resource}
                      </span>
                    ))}
                    {role.permissions && role.permissions.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-gray-800 text-xs text-gray-400">
                        +{role.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewDetails(role)}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  {role.slug !== 'super_admin' && (
                    <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Roles Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Unlock className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-bold text-white">Custom Roles</h2>
            {customRoles.length > 0 && (
              <span className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs">
                {customRoles.length} role{customRoles.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Custom Role</span>
          </button>
        </div>

        {customRoles.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {customRoles.map((role) => {
              const stats = getRoleStats(role)
              const color = role.color || '#6366f1'

              return (
                <div
                  key={role.id}
                  className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 p-6 transition-all"
                >
                  {/* Role Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Shield className="h-6 w-6" style={{ color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{role.name}</h3>
                        <p className="text-sm text-gray-400">{role.description || 'Custom role'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Role Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="px-3 py-2 rounded-lg bg-gray-800/50">
                      <p className="text-xs text-gray-400">Users</p>
                      <p className="text-lg font-bold text-white">{stats.userCount}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-gray-800/50">
                      <p className="text-xs text-gray-400">Modules</p>
                      <p className="text-lg font-bold text-white">{stats.moduleCount}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-gray-800/50">
                      <p className="text-xs text-gray-400">Permissions</p>
                      <p className="text-lg font-bold text-white">{stats.permissionCount}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(role)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12 text-center">
            <Shield className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No custom roles yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create custom roles tailored to your organization's needs
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Custom Role</span>
            </button>
          </div>
        )}
      </div>

      {/* Role Templates */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Role Templates</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: 'Accountant',
              description: 'Full access to finance and invoicing',
              icon: '💰',
              color: '#10b981'
            },
            {
              name: 'Sales Representative',
              description: 'Client and project management',
              icon: '📈',
              color: '#3b82f6'
            },
            {
              name: 'Support Agent',
              description: 'Help desk and ticket management',
              icon: '🎧',
              color: '#8b5cf6'
            }
          ].map((template) => (
            <button
              key={template.name}
              className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 p-6 transition-all text-left"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="p-3 rounded-xl text-2xl"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  {template.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{template.name}</h3>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Use Template</span>
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateRoleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={() => loadRoles()}
      />

      <RoleDetailsModal
        isOpen={showDetailsModal}
        role={selectedRole}
        userCount={selectedRole ? (userCounts[selectedRole.slug] || 0) : 0}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedRole(null)
        }}
      />
    </div>
  )
}
