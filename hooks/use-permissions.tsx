'use client'

import { useAuth } from '@/contexts/auth-context'
import { PermissionsService, PermissionKey } from '@/lib/services/permissions-service'
import { useMemo } from 'react'

/**
 * Hook for checking permissions in components
 *
 * Usage:
 * const { hasPermission, canRead, canWrite, canDelete, isAdmin } = usePermissions()
 *
 * if (canWrite('clients')) {
 *   // Show edit button
 * }
 */
export function usePermissions() {
  const { user } = useAuth()

  const permissions = useMemo(() => {
    return {
      /**
       * Check if user has a specific permission
       */
      hasPermission: (permission: PermissionKey): boolean => {
        return PermissionsService.hasPermission(user, permission)
      },

      /**
       * Check if user has any of the specified permissions
       */
      hasAnyPermission: (permissions: PermissionKey[]): boolean => {
        return PermissionsService.hasAnyPermission(user, permissions)
      },

      /**
       * Check if user has all of the specified permissions
       */
      hasAllPermissions: (permissions: PermissionKey[]): boolean => {
        return PermissionsService.hasAllPermissions(user, permissions)
      },

      /**
       * Convenience method for checking read permissions
       */
      canRead: (resource: string): boolean => {
        const permission = `read:${resource}` as PermissionKey
        return PermissionsService.hasPermission(user, permission)
      },

      /**
       * Convenience method for checking write permissions
       */
      canWrite: (resource: string): boolean => {
        const permission = `write:${resource}` as PermissionKey
        return PermissionsService.hasPermission(user, permission)
      },

      /**
       * Convenience method for checking delete permissions
       */
      canDelete: (resource: string): boolean => {
        const permission = `delete:${resource}` as PermissionKey
        return PermissionsService.hasPermission(user, permission)
      },

      /**
       * Convenience method for checking manage permissions
       */
      canManage: (resource: string): boolean => {
        const permission = `manage:${resource}` as PermissionKey
        return PermissionsService.hasPermission(user, permission)
      },

      /**
       * Check if user can access a specific resource (with tenant isolation)
       */
      canAccessResource: (resourceTenantId: string, permission: PermissionKey): boolean => {
        return PermissionsService.canAccessResource(user, resourceTenantId, permission)
      },

      /**
       * Check if user can access their own resource
       */
      canAccessOwnResource: (resourceOwnerId: string, permission: PermissionKey): boolean => {
        return PermissionsService.canAccessOwnResource(user, resourceOwnerId, permission)
      },

      /**
       * Get all user permissions
       */
      getUserPermissions: (): PermissionKey[] => {
        return PermissionsService.getUserPermissions(user)
      },

      /**
       * Check if user is admin or higher
       */
      isAdmin: (): boolean => {
        return PermissionsService.isAdmin(user)
      },

      /**
       * Check if user is manager or higher
       */
      isManagerOrHigher: (): boolean => {
        return PermissionsService.isManagerOrHigher(user)
      },

      /**
       * Check if user can manage other users
       */
      canManageUsers: (): boolean => {
        return PermissionsService.canManageUsers(user)
      },

      /**
       * Check if user can view financial data
       */
      canViewFinance: (): boolean => {
        return PermissionsService.canViewFinance(user)
      },

      /**
       * Get current user
       */
      currentUser: user,

      /**
       * Check if user is authenticated
       */
      isAuthenticated: !!user
    }
  }, [user])

  return permissions
}
