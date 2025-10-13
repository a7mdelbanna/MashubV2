// ==========================================
// TEAM & USER MANAGEMENT UTILITIES
// ==========================================

import { User, Role, Team, Permission, UserRole } from '@/types/settings'

// ==========================================
// STORAGE KEYS
// ==========================================

export const TEAM_STORAGE_KEYS = {
  USERS: 'mashub_users',
  ROLES: 'mashub_roles',
  TEAMS: 'mashub_teams',
  PERMISSIONS: 'mashub_permissions'
} as const

// ==========================================
// DEFAULT ROLES WITH PERMISSIONS
// ==========================================

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'role_super_admin',
    tenantId: null,
    name: 'Super Admin',
    slug: 'super_admin',
    description: 'Full access to everything including system settings',
    permissions: [
      {
        resource: '*',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true },
          { action: 'update', allowed: true },
          { action: 'delete', allowed: true },
          { action: 'export', allowed: true },
          { action: 'import', allowed: true },
          { action: 'approve', allowed: true }
        ],
        scope: 'global'
      }
    ],
    isSystemRole: true,
    isCustomRole: false,
    isDefault: false,
    usersCount: 0,
    color: '#ef4444',
    icon: '👑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role_admin',
    tenantId: null,
    name: 'Admin',
    slug: 'admin',
    description: 'Almost full access, can manage users and most settings',
    permissions: [
      {
        resource: 'projects',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true },
          { action: 'update', allowed: true },
          { action: 'delete', allowed: true },
          { action: 'export', allowed: true },
          { action: 'approve', allowed: true }
        ],
        scope: 'tenant'
      },
      {
        resource: 'clients',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true },
          { action: 'update', allowed: true },
          { action: 'delete', allowed: true },
          { action: 'export', allowed: true }
        ],
        scope: 'tenant'
      },
      {
        resource: 'finance',
        actions: [
          { action: 'read', allowed: true },
          { action: 'create', allowed: true },
          { action: 'update', allowed: true },
          { action: 'approve', allowed: true },
          { action: 'export', allowed: true }
        ],
        scope: 'tenant'
      },
      {
        resource: 'settings',
        actions: [
          { action: 'read', allowed: true },
          { action: 'update', allowed: true }
        ],
        scope: 'tenant'
      },
      {
        resource: 'team',
        actions: [
          { action: 'read', allowed: true },
          { action: 'create', allowed: true },
          { action: 'update', allowed: true }
        ],
        scope: 'tenant'
      }
    ],
    isSystemRole: true,
    isCustomRole: false,
    isDefault: false,
    usersCount: 0,
    color: '#f59e0b',
    icon: '⭐',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role_manager',
    tenantId: null,
    name: 'Manager',
    slug: 'manager',
    description: 'Team-level management, can approve and oversee team work',
    permissions: [
      {
        resource: 'projects',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true },
          { action: 'update', allowed: true },
          { action: 'approve', allowed: true },
          { action: 'export', allowed: true }
        ],
        scope: 'team'
      },
      {
        resource: 'clients',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true },
          { action: 'update', allowed: true }
        ],
        scope: 'team'
      },
      {
        resource: 'invoices',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true },
          { action: 'approve', allowed: true }
        ],
        scope: 'team',
        conditions: [
          { field: 'amount', operator: 'not_equals', value: 10000 }
        ]
      },
      {
        resource: 'finance',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'team'
      },
      {
        resource: 'team',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'team'
      }
    ],
    isSystemRole: true,
    isCustomRole: false,
    isDefault: false,
    usersCount: 0,
    color: '#8b5cf6',
    icon: '👔',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role_employee',
    tenantId: null,
    name: 'Employee',
    slug: 'employee',
    description: 'Standard team member, can work on assigned tasks',
    permissions: [
      {
        resource: 'projects',
        actions: [
          { action: 'read', allowed: true },
          { action: 'update', allowed: true }
        ],
        scope: 'personal'
      },
      {
        resource: 'clients',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'personal'
      },
      {
        resource: 'courses',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'global'
      },
      {
        resource: 'help',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true }
        ],
        scope: 'personal'
      }
    ],
    isSystemRole: true,
    isCustomRole: false,
    isDefault: true,
    usersCount: 0,
    color: '#3b82f6',
    icon: '👤',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role_client',
    tenantId: null,
    name: 'Client',
    slug: 'client',
    description: 'External client, can view own projects and invoices',
    permissions: [
      {
        resource: 'projects',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'personal'
      },
      {
        resource: 'invoices',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'personal'
      },
      {
        resource: 'help',
        actions: [
          { action: 'create', allowed: true },
          { action: 'read', allowed: true }
        ],
        scope: 'personal'
      }
    ],
    isSystemRole: true,
    isCustomRole: false,
    isDefault: false,
    usersCount: 0,
    color: '#10b981',
    icon: '🤝',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role_vendor',
    tenantId: null,
    name: 'Vendor',
    slug: 'vendor',
    description: 'External vendor/supplier, can manage purchase orders',
    permissions: [
      {
        resource: 'purchases',
        actions: [
          { action: 'read', allowed: true },
          { action: 'update', allowed: true }
        ],
        scope: 'personal'
      },
      {
        resource: 'products',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'global'
      }
    ],
    isSystemRole: true,
    isCustomRole: false,
    isDefault: false,
    usersCount: 0,
    color: '#f59e0b',
    icon: '📦',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'role_guest',
    tenantId: null,
    name: 'Guest',
    slug: 'guest',
    description: 'Read-only access, for temporary or auditor access',
    permissions: [
      {
        resource: 'projects',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'personal'
      },
      {
        resource: 'help',
        actions: [
          { action: 'read', allowed: true }
        ],
        scope: 'global'
      }
    ],
    isSystemRole: true,
    isCustomRole: false,
    isDefault: false,
    usersCount: 0,
    color: '#6b7280',
    icon: '👁️',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// ==========================================
// USER CRUD OPERATIONS
// ==========================================

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(TEAM_STORAGE_KEYS.USERS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(TEAM_STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find(u => u.id === id) || null
}

export function addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  saveUsers([...users, newUser])
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers()
  const index = users.findIndex(u => u.id === id)

  if (index === -1) return null

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  saveUsers(users)
  return users[index]
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filtered = users.filter(u => u.id !== id)

  if (filtered.length === users.length) return false

  saveUsers(filtered)
  return true
}

export function suspendUser(id: string, reason: string): User | null {
  return updateUser(id, {
    status: 'suspended',
    suspendedAt: new Date().toISOString(),
    suspensionReason: reason
  })
}

export function activateUser(id: string): User | null {
  return updateUser(id, {
    status: 'active',
    suspendedAt: undefined,
    suspensionReason: undefined
  })
}

// ==========================================
// ROLE CRUD OPERATIONS
// ==========================================

export function getRoles(): Role[] {
  if (typeof window === 'undefined') return DEFAULT_ROLES

  try {
    const stored = localStorage.getItem(TEAM_STORAGE_KEYS.ROLES)
    if (stored) {
      return JSON.parse(stored)
    }

    // Initialize with default roles
    localStorage.setItem(TEAM_STORAGE_KEYS.ROLES, JSON.stringify(DEFAULT_ROLES))
    return DEFAULT_ROLES
  } catch (error) {
    console.error('Error loading roles:', error)
    return DEFAULT_ROLES
  }
}

export function saveRoles(roles: Role[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(TEAM_STORAGE_KEYS.ROLES, JSON.stringify(roles))
  } catch (error) {
    console.error('Error saving roles:', error)
  }
}

export function getRoleById(id: string): Role | null {
  const roles = getRoles()
  return roles.find(r => r.id === id) || null
}

export function getRoleBySlug(slug: string): Role | null {
  const roles = getRoles()
  return roles.find(r => r.slug === slug) || null
}

export function addRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Role {
  const roles = getRoles()
  const newRole: Role = {
    ...role,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  saveRoles([...roles, newRole])
  return newRole
}

export function updateRole(id: string, updates: Partial<Role>): Role | null {
  const roles = getRoles()
  const index = roles.findIndex(r => r.id === id)

  if (index === -1) return null

  // Can't update system roles
  if (roles[index].isSystemRole) {
    console.warn('Cannot update system role')
    return null
  }

  roles[index] = {
    ...roles[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  saveRoles(roles)
  return roles[index]
}

export function deleteRole(id: string): boolean {
  const roles = getRoles()
  const role = roles.find(r => r.id === id)

  // Can't delete system roles
  if (role?.isSystemRole) {
    console.warn('Cannot delete system role')
    return false
  }

  const filtered = roles.filter(r => r.id !== id)
  saveRoles(filtered)
  return true
}

// ==========================================
// PERMISSION CHECKING
// ==========================================

export function hasPermission(
  user: User,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import' | 'approve'
): boolean {
  // Super admin has all permissions
  if (user.role === 'super_admin') return true

  // Check user's permissions
  const permission = user.permissions.find(p =>
    p.resource === resource || p.resource === '*'
  )

  if (!permission) return false

  const actionPermission = permission.actions.find(a =>
    a.action === action || a.action === 'custom'
  )

  return actionPermission?.allowed || false
}

export function canAccessModule(user: User, module: string): boolean {
  // Super admin can access everything
  if (user.role === 'super_admin') return true

  // Check if user has any permission for this module
  return user.permissions.some(p => p.resource === module || p.resource === '*')
}

export function getModulePermissions(user: User, module: string): Permission | null {
  if (user.role === 'super_admin') {
    return {
      resource: module,
      actions: [
        { action: 'create', allowed: true },
        { action: 'read', allowed: true },
        { action: 'update', allowed: true },
        { action: 'delete', allowed: true },
        { action: 'export', allowed: true },
        { action: 'import', allowed: true },
        { action: 'approve', allowed: true }
      ],
      scope: 'global'
    }
  }

  return user.permissions.find(p => p.resource === module) || null
}

// ==========================================
// TEAM OPERATIONS
// ==========================================

export function getTeams(): Team[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(TEAM_STORAGE_KEYS.TEAMS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading teams:', error)
    return []
  }
}

export function saveTeams(teams: Team[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(TEAM_STORAGE_KEYS.TEAMS, JSON.stringify(teams))
  } catch (error) {
    console.error('Error saving teams:', error)
  }
}

export function addUserToTeam(userId: string, teamId: string): boolean {
  const user = getUserById(userId)
  if (!user) return false

  if (!user.teams.includes(teamId)) {
    user.teams.push(teamId)
    updateUser(userId, { teams: user.teams })
  }

  return true
}

export function removeUserFromTeam(userId: string, teamId: string): boolean {
  const user = getUserById(userId)
  if (!user) return false

  user.teams = user.teams.filter(t => t !== teamId)
  updateUser(userId, { teams: user.teams })

  return true
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getRoleColor(role: UserRole): string {
  const roleObj = getRoleBySlug(role)
  return roleObj?.color || '#6b7280'
}

export function getRoleIcon(role: UserRole): string {
  const roleObj = getRoleBySlug(role)
  return roleObj?.icon || '👤'
}

export function countUsersByRole(): Record<UserRole, number> {
  const users = getUsers()
  const counts: Record<string, number> = {
    super_admin: 0,
    admin: 0,
    manager: 0,
    employee: 0,
    client: 0,
    vendor: 0,
    guest: 0
  }

  users.forEach(user => {
    counts[user.role] = (counts[user.role] || 0) + 1
  })

  return counts as Record<UserRole, number>
}

export function getActiveUsers(): User[] {
  return getUsers().filter(u => u.status === 'active')
}

export function getInactiveUsers(): User[] {
  return getUsers().filter(u => u.status !== 'active')
}

export function searchUsers(query: string): User[] {
  const users = getUsers()
  const lowercaseQuery = query.toLowerCase()

  return users.filter(user =>
    user.fullName.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery) ||
    user.firstName.toLowerCase().includes(lowercaseQuery) ||
    user.lastName.toLowerCase().includes(lowercaseQuery)
  )
}

export function filterUsersByRole(role: UserRole): User[] {
  return getUsers().filter(u => u.role === role)
}

export function filterUsersByTeam(teamId: string): User[] {
  return getUsers().filter(u => u.teams.includes(teamId))
}

// ==========================================
// STATISTICS
// ==========================================

export function getUserStats() {
  const users = getUsers()
  const active = users.filter(u => u.status === 'active').length
  const inactive = users.filter(u => u.status === 'inactive').length
  const suspended = users.filter(u => u.status === 'suspended').length
  const pending = users.filter(u => u.status === 'pending_verification').length

  return {
    total: users.length,
    active,
    inactive,
    suspended,
    pending,
    byRole: countUsersByRole()
  }
}

export function getRoleStats() {
  const roles = getRoles()
  const system = roles.filter(r => r.isSystemRole).length
  const custom = roles.filter(r => r.isCustomRole).length

  return {
    total: roles.length,
    system,
    custom
  }
}
