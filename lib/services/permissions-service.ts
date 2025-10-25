import { User, UserRole } from '@/types'

// ===========================================
// PERMISSION DEFINITIONS
// ===========================================

/**
 * Available system permissions
 * Format: "action:resource" (e.g., "read:clients", "write:projects")
 */
export const PERMISSIONS = {
  // Client Management
  'read:clients': 'View clients',
  'write:clients': 'Create/edit clients',
  'delete:clients': 'Delete clients',
  'export:clients': 'Export client data',

  // Project Management
  'read:projects': 'View projects',
  'write:projects': 'Create/edit projects',
  'delete:projects': 'Delete projects',
  'manage:projects': 'Manage project team and settings',

  // Agile & Tasks
  'read:tasks': 'View tasks',
  'write:tasks': 'Create/edit tasks',
  'delete:tasks': 'Delete tasks',
  'assign:tasks': 'Assign tasks to team members',

  // Apps
  'read:apps': 'View apps',
  'write:apps': 'Create/edit apps',
  'delete:apps': 'Delete apps',
  'manage:apps': 'Manage app credentials and environments',

  // Finance
  'read:invoices': 'View invoices',
  'write:invoices': 'Create/edit invoices',
  'delete:invoices': 'Delete invoices',
  'approve:invoices': 'Approve invoices for sending',
  'read:transactions': 'View transactions',
  'write:transactions': 'Create/edit transactions',
  'read:reports': 'View financial reports',

  // Products
  'read:products': 'View products',
  'write:products': 'Create/edit products',
  'delete:products': 'Delete products',
  'manage:inventory': 'Manage inventory',

  // Users & Team
  'read:users': 'View users',
  'write:users': 'Create/edit users',
  'delete:users': 'Delete users',
  'manage:roles': 'Manage user roles and permissions',
  'read:team': 'View team',
  'write:team': 'Manage team',

  // Documents & Files
  'read:documents': 'View documents',
  'write:documents': 'Upload/edit documents',
  'delete:documents': 'Delete documents',
  'share:documents': 'Share documents externally',

  // Settings
  'read:settings': 'View settings',
  'write:settings': 'Modify settings',
  'manage:integrations': 'Manage third-party integrations',
  'manage:billing': 'Manage billing and subscription',

  // System (Admin only)
  'read:logs': 'View activity logs',
  'manage:tenant': 'Manage tenant settings',
  'impersonate:users': 'Impersonate other users',

  // Special permissions
  'all.read': 'Read access to all resources',
  'all.write': 'Write access to all resources',
  'all.manage': 'Full management access'
} as const

export type PermissionKey = keyof typeof PERMISSIONS

// ===========================================
// ROLE DEFINITIONS
// ===========================================

/**
 * Default permissions for each role
 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: ['all.read', 'all.write', 'all.manage'],

  admin: [
    'read:clients', 'write:clients', 'delete:clients', 'export:clients',
    'read:projects', 'write:projects', 'delete:projects', 'manage:projects',
    'read:tasks', 'write:tasks', 'delete:tasks', 'assign:tasks',
    'read:apps', 'write:apps', 'delete:apps', 'manage:apps',
    'read:invoices', 'write:invoices', 'delete:invoices', 'approve:invoices',
    'read:transactions', 'write:transactions', 'read:reports',
    'read:products', 'write:products', 'delete:products', 'manage:inventory',
    'read:users', 'write:users', 'delete:users', 'manage:roles',
    'read:team', 'write:team',
    'read:documents', 'write:documents', 'delete:documents', 'share:documents',
    'read:settings', 'write:settings', 'manage:integrations', 'manage:billing',
    'read:logs', 'manage:tenant'
  ],

  manager: [
    'read:clients', 'write:clients', 'export:clients',
    'read:projects', 'write:projects', 'manage:projects',
    'read:tasks', 'write:tasks', 'assign:tasks',
    'read:apps', 'write:apps',
    'read:invoices', 'write:invoices', 'approve:invoices',
    'read:transactions', 'read:reports',
    'read:products', 'write:products', 'manage:inventory',
    'read:users', 'read:team',
    'read:documents', 'write:documents', 'share:documents',
    'read:settings'
  ],

  employee: [
    'read:clients',
    'read:projects',
    'read:tasks', 'write:tasks',
    'read:apps',
    'read:invoices',
    'read:transactions',
    'read:products',
    'read:users', 'read:team',
    'read:documents', 'write:documents'
  ],

  client: [
    'read:projects',
    'read:invoices',
    'read:documents'
  ],

  candidate: [
    'read:documents'
  ]
}

// ===========================================
// PERMISSIONS SERVICE
// ===========================================

export class PermissionsService {
  /**
   * Check if user has a specific permission
   */
  static hasPermission(user: User | null, permission: PermissionKey): boolean {
    if (!user) return false

    // SuperAdmin has all permissions
    if (user.isSuperAdmin) return true

    // Check for wildcard permissions
    if (user.permissions.includes('all.read') || user.permissions.includes('all.write') || user.permissions.includes('all.manage')) {
      return true
    }

    // Check for specific permission
    if (user.permissions.includes(permission)) return true

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    return rolePermissions.includes(permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(user: User | null, permissions: PermissionKey[]): boolean {
    if (!user) return false
    return permissions.some(permission => this.hasPermission(user, permission))
  }

  /**
   * Check if user has all of the specified permissions
   */
  static hasAllPermissions(user: User | null, permissions: PermissionKey[]): boolean {
    if (!user) return false
    return permissions.every(permission => this.hasPermission(user, permission))
  }

  /**
   * Get all permissions for a user (from role + custom permissions)
   */
  static getUserPermissions(user: User | null): PermissionKey[] {
    if (!user) return []

    // SuperAdmin has all permissions
    if (user.isSuperAdmin) {
      return Object.keys(PERMISSIONS) as PermissionKey[]
    }

    // Combine role permissions with custom permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    const customPermissions = user.permissions as PermissionKey[]

    // Merge and deduplicate
    return [...new Set([...rolePermissions, ...customPermissions])]
  }

  /**
   * Check if user can access a specific resource (with tenant isolation)
   */
  static canAccessResource(user: User | null, resourceTenantId: string, permission: PermissionKey): boolean {
    if (!user) return false

    // SuperAdmin can access all tenants
    if (user.isSuperAdmin) return true

    // Check tenant isolation
    if (user.tenantId !== resourceTenantId) return false

    // Check permission
    return this.hasPermission(user, permission)
  }

  /**
   * Check if user can perform action on own resources only
   */
  static canAccessOwnResource(user: User | null, resourceOwnerId: string, permission: PermissionKey): boolean {
    if (!user) return false

    // Check if user is the owner
    if (user.id !== resourceOwnerId) {
      // If not owner, check if they have general permission
      return this.hasPermission(user, permission)
    }

    // Owner can always access their own resources (for read operations)
    if (permission.startsWith('read:')) return true

    // For write/delete, still check permissions
    return this.hasPermission(user, permission)
  }

  /**
   * Get permission label
   */
  static getPermissionLabel(permission: PermissionKey): string {
    return PERMISSIONS[permission] || permission
  }

  /**
   * Get all available permissions grouped by category
   */
  static getGroupedPermissions(): Record<string, { key: PermissionKey; label: string }[]> {
    const groups: Record<string, { key: PermissionKey; label: string }[]> = {
      'Clients': [],
      'Projects': [],
      'Agile & Tasks': [],
      'Apps': [],
      'Finance': [],
      'Products': [],
      'Users & Team': [],
      'Documents': [],
      'Settings': [],
      'System': [],
      'Special': []
    }

    Object.entries(PERMISSIONS).forEach(([key, label]) => {
      const permissionKey = key as PermissionKey

      if (key.includes('client')) {
        groups['Clients'].push({ key: permissionKey, label })
      } else if (key.includes('project')) {
        groups['Projects'].push({ key: permissionKey, label })
      } else if (key.includes('task')) {
        groups['Agile & Tasks'].push({ key: permissionKey, label })
      } else if (key.includes('app')) {
        groups['Apps'].push({ key: permissionKey, label })
      } else if (key.includes('invoice') || key.includes('transaction') || key.includes('report')) {
        groups['Finance'].push({ key: permissionKey, label })
      } else if (key.includes('product') || key.includes('inventory')) {
        groups['Products'].push({ key: permissionKey, label })
      } else if (key.includes('user') || key.includes('team') || key.includes('role')) {
        groups['Users & Team'].push({ key: permissionKey, label })
      } else if (key.includes('document')) {
        groups['Documents'].push({ key: permissionKey, label })
      } else if (key.includes('setting') || key.includes('integration') || key.includes('billing')) {
        groups['Settings'].push({ key: permissionKey, label })
      } else if (key.includes('log') || key.includes('tenant') || key.includes('impersonate')) {
        groups['System'].push({ key: permissionKey, label })
      } else if (key.includes('all.')) {
        groups['Special'].push({ key: permissionKey, label })
      }
    })

    return groups
  }

  /**
   * Validate if a permission key is valid
   */
  static isValidPermission(permission: string): permission is PermissionKey {
    return permission in PERMISSIONS
  }

  /**
   * Check if user can manage other users (create, edit, delete)
   */
  static canManageUsers(user: User | null): boolean {
    return this.hasPermission(user, 'write:users')
  }

  /**
   * Check if user can view financial data
   */
  static canViewFinance(user: User | null): boolean {
    return this.hasAnyPermission(user, ['read:invoices', 'read:transactions', 'read:reports'])
  }

  /**
   * Check if user is admin or higher
   */
  static isAdmin(user: User | null): boolean {
    if (!user) return false
    return user.isSuperAdmin || user.role === 'admin'
  }

  /**
   * Check if user is manager or higher
   */
  static isManagerOrHigher(user: User | null): boolean {
    if (!user) return false
    return user.isSuperAdmin || user.role === 'admin' || user.role === 'manager'
  }
}

// Export convenience instance
export const permissions = PermissionsService
