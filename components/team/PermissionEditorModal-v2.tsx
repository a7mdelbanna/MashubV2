'use client'

import { useState, useEffect } from 'react'
import { X, Shield, Check, Lock, Unlock, Save } from 'lucide-react'
import { User } from '@/types'
import { userService } from '@/lib/services/user-service'
import {
  PermissionsService,
  PermissionKey,
  PERMISSIONS,
  ROLE_PERMISSIONS
} from '@/lib/services/permissions-service'
import toast from 'react-hot-toast'

interface PermissionEditorModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onUpdate: () => void
}

export default function PermissionEditorModalV2({
  isOpen,
  user,
  onClose,
  onUpdate
}: PermissionEditorModalProps) {
  const [customPermissions, setCustomPermissions] = useState<PermissionKey[]>([])
  const [useRoleDefaults, setUseRoleDefaults] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      const userPermissions = user.permissions as PermissionKey[]
      setCustomPermissions(userPermissions || [])

      // Check if user has custom permissions
      const rolePermissions = ROLE_PERMISSIONS[user.role] || []
      const hasCustom =
        JSON.stringify([...userPermissions].sort()) !==
        JSON.stringify([...rolePermissions].sort())
      setUseRoleDefaults(!hasCustom)
    }
  }, [user])

  if (!isOpen || !user) return null

  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  const activePermissions = useRoleDefaults ? rolePermissions : customPermissions

  const hasPermission = (permission: PermissionKey) => {
    // Check for wildcard permissions
    if (
      activePermissions.includes('all.read') ||
      activePermissions.includes('all.write') ||
      activePermissions.includes('all.manage')
    ) {
      return true
    }
    return activePermissions.includes(permission)
  }

  const togglePermission = (permission: PermissionKey) => {
    if (useRoleDefaults) return

    setCustomPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission)
      } else {
        return [...prev, permission]
      }
    })
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      setLoading(true)

      const permissionsToSave = useRoleDefaults ? rolePermissions : customPermissions

      await userService.updateUserPermissions(user.id, permissionsToSave)

      toast.success('Permissions updated successfully!')
      onUpdate()
      onClose()
    } catch (error: any) {
      console.error('Error updating permissions:', error)
      toast.error(error.message || 'Failed to update permissions')
    } finally {
      setLoading(false)
    }
  }

  // Group permissions by category
  const groupedPermissions = PermissionsService.getGroupedPermissions()

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
                {user.name} ({user.role})
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

          {/* Permissions by Category */}
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(([category, permissions]) => {
              if (permissions.length === 0) return null

              return (
                <div
                  key={category}
                  className="rounded-xl bg-gray-800/30 border border-gray-700 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                    <h4 className="text-white font-medium">{category}</h4>
                  </div>

                  {/* Permissions Grid */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissions.map(({ key, label }) => {
                      const hasAccess = hasPermission(key)

                      return (
                        <button
                          key={key}
                          onClick={() => togglePermission(key)}
                          disabled={useRoleDefaults}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                            hasAccess
                              ? 'border-green-500/30 bg-green-500/10'
                              : 'border-gray-700 bg-gray-800/30'
                          } ${
                            useRoleDefaults
                              ? 'cursor-not-allowed opacity-50'
                              : 'hover:border-gray-600'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="text-sm text-white font-medium">{label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{key}</div>
                          </div>
                          {hasAccess && (
                            <Check className="h-4 w-4 text-green-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Permission Count */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 font-medium">Total Permissions Granted</p>
                <p className="text-xs text-gray-400 mt-1">
                  {useRoleDefaults ? 'Based on role defaults' : 'Custom configuration'}
                </p>
              </div>
              <div className="text-3xl font-bold text-blue-400">
                {activePermissions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Permissions'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
