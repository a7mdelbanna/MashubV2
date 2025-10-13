import { User, Team } from '@/types/settings'
import { saveUsers, getUsers, DEFAULT_ROLES } from './team-utils'

// Mock team data
export const MOCK_TEAMS: Team[] = [
  {
    id: 'team_dev',
    name: 'Development Team',
    description: 'Software development and engineering',
    memberIds: [],
    leadId: '',
    permissions: [],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'team_sales',
    name: 'Sales Team',
    description: 'Sales and business development',
    memberIds: [],
    leadId: '',
    permissions: [],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'team_support',
    name: 'Support Team',
    description: 'Customer support and help desk',
    memberIds: [],
    leadId: '',
    permissions: [],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'team_finance',
    name: 'Finance Team',
    description: 'Accounting and financial management',
    memberIds: [],
    leadId: '',
    permissions: [],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
]

// Mock user data
export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    tenantId: 'tenant_default',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ef4444&color=fff',
    role: 'super_admin',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'super_admin')?.permissions || [],
    teamIds: ['team_dev', 'team_sales', 'team_support', 'team_finance'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_2',
    tenantId: 'tenant_default',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=8b5cf6&color=fff',
    role: 'admin',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'admin')?.permissions || [],
    teamIds: ['team_dev', 'team_sales'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_3',
    tenantId: 'tenant_default',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3b82f6&color=fff',
    role: 'manager',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'manager')?.permissions || [],
    teamIds: ['team_dev'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_4',
    tenantId: 'tenant_default',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff',
    role: 'manager',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'manager')?.permissions || [],
    teamIds: ['team_sales'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_5',
    tenantId: 'tenant_default',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=10b981&color=fff',
    role: 'employee',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'employee')?.permissions || [],
    teamIds: ['team_dev'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_6',
    tenantId: 'tenant_default',
    firstName: 'Jessica',
    lastName: 'Williams',
    email: 'jessica.williams@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Jessica+Williams&background=f59e0b&color=fff',
    role: 'employee',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'employee')?.permissions || [],
    teamIds: ['team_dev'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_7',
    tenantId: 'tenant_default',
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'robert.martinez@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Robert+Martinez&background=06b6d4&color=fff',
    role: 'employee',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'employee')?.permissions || [],
    teamIds: ['team_sales'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_8',
    tenantId: 'tenant_default',
    firstName: 'Amanda',
    lastName: 'Taylor',
    email: 'amanda.taylor@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Amanda+Taylor&background=a855f7&color=fff',
    role: 'employee',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'employee')?.permissions || [],
    teamIds: ['team_support'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_9',
    tenantId: 'tenant_default',
    firstName: 'James',
    lastName: 'Anderson',
    email: 'james.anderson@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=James+Anderson&background=14b8a6&color=fff',
    role: 'employee',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'employee')?.permissions || [],
    teamIds: ['team_finance'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_10',
    tenantId: 'tenant_default',
    firstName: 'Lisa',
    lastName: 'Brown',
    email: 'lisa.brown@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Brown&background=f43f5e&color=fff',
    role: 'employee',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'employee')?.permissions || [],
    teamIds: ['team_support'],
    status: 'suspended',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_11',
    tenantId: 'tenant_default',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acmecorp.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=6366f1&color=fff',
    role: 'client',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'client')?.permissions || [],
    teamIds: [],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_12',
    tenantId: 'tenant_default',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@techsupplies.com',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=84cc16&color=fff',
    role: 'vendor',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'vendor')?.permissions || [],
    teamIds: [],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_13',
    tenantId: 'tenant_default',
    firstName: 'Tom',
    lastName: 'Wilson',
    email: 'tom.wilson@consultant.com',
    avatar: 'https://ui-avatars.com/api/?name=Tom+Wilson&background=64748b&color=fff',
    role: 'guest',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'guest')?.permissions || [],
    teamIds: [],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_14',
    tenantId: 'tenant_default',
    firstName: 'Rachel',
    lastName: 'Lee',
    email: 'rachel.lee@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Rachel+Lee&background=eab308&color=fff',
    role: 'manager',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'manager')?.permissions || [],
    teamIds: ['team_support'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    createdAt: '2024-02-12T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user_15',
    tenantId: 'tenant_default',
    firstName: 'Kevin',
    lastName: 'Thomas',
    email: 'kevin.thomas@mashub.com',
    avatar: 'https://ui-avatars.com/api/?name=Kevin+Thomas&background=0ea5e9&color=fff',
    role: 'manager',
    permissions: DEFAULT_ROLES.find(r => r.slug === 'manager')?.permissions || [],
    teamIds: ['team_finance'],
    status: 'active',
    isEmailVerified: true,
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
]

/**
 * Initialize mock data for team management
 * Call this function once to populate localStorage with sample data
 */
export function initializeMockTeamData(): void {
  const existingUsers = getUsers()

  // Only initialize if no users exist
  if (existingUsers.length === 0) {
    saveUsers(MOCK_USERS)
    localStorage.setItem('mashub_teams', JSON.stringify(MOCK_TEAMS))
    console.log('✅ Mock team data initialized:', {
      users: MOCK_USERS.length,
      teams: MOCK_TEAMS.length
    })
  } else {
    console.log('ℹ️ Users already exist, skipping mock data initialization')
  }
}

/**
 * Reset all team data and reinitialize with mock data
 * Useful for testing and development
 */
export function resetTeamData(): void {
  localStorage.removeItem('mashub_users')
  localStorage.removeItem('mashub_teams')
  localStorage.removeItem('mashub_roles')
  localStorage.removeItem('mashub_permissions')
  saveUsers(MOCK_USERS)
  localStorage.setItem('mashub_teams', JSON.stringify(MOCK_TEAMS))
  console.log('🔄 Team data reset and reinitialized')
}

/**
 * Get statistics about mock data
 */
export function getMockDataStats() {
  return {
    totalUsers: MOCK_USERS.length,
    activeUsers: MOCK_USERS.filter(u => u.status === 'active').length,
    suspendedUsers: MOCK_USERS.filter(u => u.status === 'suspended').length,
    totalTeams: MOCK_TEAMS.length,
    roleDistribution: {
      super_admin: MOCK_USERS.filter(u => u.role === 'super_admin').length,
      admin: MOCK_USERS.filter(u => u.role === 'admin').length,
      manager: MOCK_USERS.filter(u => u.role === 'manager').length,
      employee: MOCK_USERS.filter(u => u.role === 'employee').length,
      client: MOCK_USERS.filter(u => u.role === 'client').length,
      vendor: MOCK_USERS.filter(u => u.role === 'vendor').length,
      guest: MOCK_USERS.filter(u => u.role === 'guest').length
    }
  }
}
