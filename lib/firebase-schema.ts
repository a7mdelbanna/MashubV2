/**
 * Firebase/Firestore Schema Documentation
 *
 * This file documents the complete Firestore database structure for MasHub.
 * It includes collection paths, required indexes, and security rules.
 *
 * IMPORTANT PRINCIPLES:
 * 1. Query-based relationships (not embedded arrays)
 * 2. Multi-tenancy via tenantId field
 * 3. Denormalized data for performance where needed
 * 4. Subcollections for one-to-many relationships
 */

// ============================================================================
// COLLECTION STRUCTURE
// ============================================================================

/**
 * ROOT COLLECTIONS
 * /tenants/{tenantId}              - Tenant/Company data
 * /users/{userId}                   - User accounts (global)
 */

/**
 * TENANT SUBCOLLECTIONS (Multi-tenant architecture)
 * All business data is scoped to tenants
 *
 * /tenants/{tenantId}/projects/{projectId}
 * /tenants/{tenantId}/apps/{appId}
 * /tenants/{tenantId}/clients/{clientId}
 * /tenants/{tenantId}/pricingCatalog/{catalogId}
 * /tenants/{tenantId}/featureAddons/{addonId}
 * /tenants/{tenantId}/checklistTemplates/{templateId}
 */

/**
 * PROJECT SUBCOLLECTIONS
 * /tenants/{tenantId}/projects/{projectId}/tasks/{taskId}
 * /tenants/{tenantId}/projects/{projectId}/sprints/{sprintId}
 * /tenants/{tenantId}/projects/{projectId}/milestones/{milestoneId}
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}
 * /tenants/{tenantId}/projects/{projectId}/documents/{documentId}
 * /tenants/{tenantId}/projects/{projectId}/timeEntries/{entryId}
 * /tenants/{tenantId}/projects/{projectId}/team/{memberId}
 * /tenants/{tenantId}/projects/{projectId}/timeline/{eventId}
 * /tenants/{tenantId}/projects/{projectId}/checklistInstances/{instanceId}
 */

/**
 * APP SUBCOLLECTIONS
 * /tenants/{tenantId}/apps/{appId}/releases/{releaseId}
 * /tenants/{tenantId}/apps/{appId}/credentials/{credentialId}
 * /tenants/{tenantId}/apps/{appId}/environments/{envId}
 */

// ============================================================================
// DOCUMENT SCHEMAS
// ============================================================================

/**
 * PROJECTS COLLECTION
 * Path: /tenants/{tenantId}/projects/{projectId}
 *
 * Stored Fields (NOT including populated arrays):
 */
export interface FirestoreProject {
  // Identity
  id: string
  tenantId: string
  name: string
  slug: string
  description?: string

  // Client & Business
  clientId?: string // Deprecated - use Apps for client relationships
  clientName?: string
  contractValue?: number
  currency?: string

  // Status & Dates
  type: 'fixed_price' | 'time_material' | 'retainer' | 'agile' | 'custom'
  status: 'draft' | 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  visibility: 'private' | 'team' | 'client' | 'public'
  startDate?: string // ISO string
  dueDate?: string
  endDate?: string
  estimatedHours?: number
  actualHours?: number

  // Team
  ownerId: string
  ownerName?: string
  manager: {
    id: string
    name: string
  }
  managerId?: string
  managerName?: string
  teamSize?: number
  // NOTE: team array NOT stored - query team subcollection

  // Progress (denormalized for quick display)
  progress: number
  completionPercentage: number
  tasksTotal: number
  tasksCompleted: number
  milestonesTotal: number
  milestonesCompleted: number

  // Budget
  budget: number
  spent: number
  budgetAllocated?: number
  budgetSpent?: number

  // Metadata
  tags: string[]
  color?: string
  iconUrl?: string

  // Health indicators (computed fields - can be calculated)
  health: {
    delivery: 'on_track' | 'at_risk' | 'delayed'
    budget: 'under' | 'on_budget' | 'over'
    timing: 'early' | 'on_time' | 'delayed'
  }

  // Agile metrics
  velocity?: number
  currentSprint?: {
    id: string
    name: string
    goal: string
    startDate: string
    endDate: string
    committed: number
    completed: number
  }

  // Timestamps
  createdAt: string // ISO string (Firestore Timestamp converted)
  updatedAt: string
  completedAt?: string
  archivedAt?: string

  // IMPORTANT: These fields are NOT stored in Firestore
  // They are populated by queries when fetching:
  // - apps: App[] (query apps where projectId == this.id)
  // - pricingCatalog: PricingCatalogItem[] (query catalog where projectId == this.id)
  // - checklistTemplates: ChecklistTemplate[] (query templates where projectId == this.id)
  // - checklistInstances: ChecklistInstance[] (query subcollection)
  // - team: TeamMember[] (query subcollection)
}

/**
 * APPS COLLECTION
 * Path: /tenants/{tenantId}/apps/{appId}
 *
 * Apps are the deliverables of projects.
 * Each app belongs to ONE project and ONE client.
 */
export interface FirestoreApp {
  // Identity
  id: string
  tenantId: string
  projectId: string // Parent project reference

  // Type & Names
  type: 'pos' | 'mobile_app' | 'website' | 'advertising' | 'crm' | 'erp' | 'custom'
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string

  // Client Relationship
  client: {
    id: string
    name: string
    logo?: string
  }

  // Branding
  branding: {
    primaryColor: string
    secondaryColor: string
    accentColor?: string
    logo?: string
    logoUrl?: string
    splashScreen?: string
    animations?: string[]
    storeGraphics?: string[]
  }

  // Configuration
  storeId?: string
  environments: {
    dev?: {
      url: string
      apiEndpoint?: string
      version?: string
      lastDeployed?: string
      status: 'active' | 'inactive' | 'maintenance'
    }
    staging?: {
      url: string
      apiEndpoint?: string
      version?: string
      lastDeployed?: string
      status: 'active' | 'inactive' | 'maintenance'
    }
    production?: {
      url: string
      apiEndpoint?: string
      version?: string
      lastDeployed?: string
      status: 'active' | 'inactive' | 'maintenance'
    }
  }

  // URLs
  urls: {
    admin?: string
    storefront?: string
    apiBase?: string
    statusPage?: string
    documentation?: string
  }

  // Features
  features: {
    enabled: string[]
    modules: string[]
  }

  // Pricing
  pricing?: {
    catalogItemId: string
    customOverrides?: any
    appliedAt: string
    appliedBy: string
  }

  // Releases
  releases: {
    current: {
      version: string
      buildNumber?: number
      releaseDate: string
      releaseChannel: 'dev' | 'staging' | 'production'
      notes?: string
    }
    upcoming?: {
      version: string
      targetDate: string
      features: string[]
      status: 'planned' | 'in_progress' | 'qa' | 'approved'
    }
    history: Array<{
      version: string
      releaseDate: string
      releaseChannel: 'dev' | 'staging' | 'production'
      status: 'shipped' | 'rolled_back'
      notes?: string
      releasedBy?: string
    }>
  }

  // Status & Health
  status: 'development' | 'staging' | 'production' | 'maintenance' | 'deprecated'
  health: {
    uptime?: number
    lastChecked?: string
    issues: number
  }

  // Timestamps
  createdAt: string
  updatedAt: string
  lastDeployedAt?: string

  // NOTE: credentials stored in subcollection for security
  // - credentials: AppCredential[] (subcollection)
}

/**
 * CLIENTS COLLECTION
 * Path: /tenants/{tenantId}/clients/{clientId}
 */
export interface FirestoreClient {
  id: string
  tenantId: string

  // Basic Info
  name: string
  legalName?: string
  type: 'individual' | 'company' | 'enterprise' | 'government'
  taxId?: string

  // Status & Classification
  status: 'lead' | 'prospect' | 'active' | 'inactive' | 'churned'
  priority: 'low' | 'medium' | 'high' | 'vip'
  source: 'referral' | 'marketing' | 'sales' | 'website' | 'social' | 'event' | 'other'
  tags: string[]
  industry?: string
  size?: string

  // Contact Details
  email: string
  phone?: string
  website?: string

  // Address
  address?: {
    street?: string
    street2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    formatted?: string
  }

  // Primary Contact
  primaryContactId?: string
  primaryContact?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    jobTitle?: string
  }

  // Logo & Branding
  logo?: string
  color?: string

  // Business Metrics
  totalRevenue: number
  lifetimeValue: number
  averageInvoiceValue: number
  outstandingBalance: number

  // Project Metrics
  totalProjects: number
  activeProjects: number
  completedProjects: number

  // Billing
  currency?: string
  paymentTerms?: number
  defaultBillingMethod?: string
  creditLimit?: number

  // Relationships
  assignedToUserId?: string
  assignedToUserName?: string
  accountManagerId?: string
  accountManagerName?: string

  // Activity
  lastContactDate?: string
  lastProjectDate?: string
  lastInvoiceDate?: string
  lastPaymentDate?: string

  // Custom Fields
  customFields?: Record<string, any>

  // Timestamps
  createdAt: string
  updatedAt: string
  onboardedAt?: string
  churnedAt?: string

  // NOTE: Relationships fetched via queries:
  // - contacts: ContactPerson[] (subcollection)
  // - communications: Communication[] (subcollection)
  // - activities: ClientActivity[] (subcollection)
  // - notes: ClientNote[] (subcollection)
  // - documents: ClientDocument[] (subcollection)
  // - apps: query apps where client.id == this.id
  // - projects: query apps where client.id == this.id, then get unique projectIds
}

/**
 * PRICING CATALOG COLLECTION
 * Path: /tenants/{tenantId}/pricingCatalog/{catalogId}
 */
export interface FirestorePricingCatalogItem {
  id: string
  tenantId: string
  projectId: string // Which project this catalog item belongs to
  name: string
  description?: string
  category: string

  pricing: {
    model: 'subscription' | 'one_time' | 'usage_based' | 'custom'
    amount: number
    currency: string
    interval?: 'month' | 'year'
  }

  features: string[]

  limits?: {
    [key: string]: number
  }

  appsUsing: number // Count - updated via Cloud Function

  createdAt: string
  updatedAt: string
}

/**
 * FEATURE ADDONS COLLECTION
 * Path: /tenants/{tenantId}/featureAddons/{addonId}
 */
export interface FirestoreFeatureAddon {
  id: string
  tenantId: string
  projectId: string
  name: string
  description?: string
  category: string
  technicalName: string

  pricing?: {
    model: 'subscription' | 'one_time' | 'usage_based'
    amount: number
    currency: string
    interval?: 'month' | 'year'
  }

  requiredAddons?: string[]
  appsUsing: number

  createdAt: string
  updatedAt: string
}

/**
 * TASKS SUBCOLLECTION
 * Path: /tenants/{tenantId}/projects/{projectId}/tasks/{taskId}
 */
export interface FirestoreTask {
  id: string
  projectId: string

  // Scope (Project-level or App-specific)
  scope: 'project' | 'app'
  appId?: string // Required if scope is 'app'
  appName?: string // Denormalized for quick display

  // Agile Hierarchy
  epicId?: string
  storyId?: string
  sprintId?: string

  // Checklist Integration
  checklistItemId?: string

  // Task Details
  title: string
  description?: string
  type: 'feature' | 'bug' | 'improvement' | 'task' | 'epic' | 'story'
  status: 'todo' | 'in_progress' | 'review' | 'testing' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'

  // Assignment
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  reporter?: {
    id: string
    name: string
  }

  // Effort & Time
  estimatedHours?: number
  actualHours?: number
  storyPoints?: number

  // Dates
  startDate?: string
  dueDate?: string
  completedDate?: string

  // Labels & Tags
  labels: string[]
  tags: string[]

  // Attachments & Links
  attachments?: string[]
  relatedTasks?: string[]
  blockedBy?: string[]
  blocks?: string[]

  // Comments count (denormalized)
  commentsCount?: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * SPRINTS SUBCOLLECTION
 * Path: /tenants/{tenantId}/projects/{projectId}/sprints/{sprintId}
 */
export interface FirestoreSprint {
  id: string
  projectId: string
  name: string
  goal: string

  // Duration
  startDate: string
  endDate: string
  status: 'planned' | 'active' | 'completed' | 'cancelled'

  // Capacity & Planning
  capacity: number // Total story points/hours
  committed: number // Committed story points
  completed: number // Completed story points

  // Definition of Done
  definitionOfDone: string[]

  // Metrics
  velocity?: number
  burndown?: number[] // Daily progress tracking

  // NOTE: stories and tasks NOT stored as arrays
  // Query by: tasks WHERE sprintId == this.id
  // Query by: stories WHERE sprintId == this.id (if stories have sprintId field)

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * MILESTONES SUBCOLLECTION
 * Path: /tenants/{tenantId}/projects/{projectId}/milestones/{milestoneId}
 */
export interface FirestoreMilestone {
  id: string
  projectId: string
  name: string
  description?: string
  dueDate: string
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue'

  // Deliverables & Outcomes
  deliverables: string[]

  // Progress Tracking
  progress: number // 0-100
  tasksLinked?: string[] // Task IDs associated with this milestone

  // Dependencies
  dependencies?: string[] // Other milestone IDs this depends on

  // Team & Ownership
  owner?: string // User ID

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * EPICS SUBCOLLECTION
 * Path: /tenants/{tenantId}/projects/{projectId}/epics/{epicId}
 */
export interface FirestoreEpic {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled'

  // Scope (Project-level or App-specific)
  scope?: 'project' | 'app'
  appId?: string

  // Effort
  estimatedPoints?: number
  actualPoints?: number

  // Dates
  startDate?: string
  targetDate?: string
  completedDate?: string

  // Labels
  labels: string[]

  // NOTE: stories NOT stored as array
  // Query by: stories WHERE epicId == this.id

  // Owner
  owner?: {
    id: string
    name: string
  }

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * STORIES SUBCOLLECTION
 * Path: /tenants/{tenantId}/projects/{projectId}/stories/{storyId}
 */
export interface FirestoreStory {
  id: string
  projectId: string
  epicId?: string // Links to parent epic
  sprintId?: string // Links to sprint if planned

  // Scope (Project-level or App-specific)
  scope: 'project' | 'app'
  appId?: string

  // Story Details
  title: string
  description?: string
  acceptanceCriteria: string[]
  status: 'backlog' | 'planned' | 'in_progress' | 'review' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'

  // Effort
  storyPoints?: number
  estimatedHours?: number

  // Assignment
  assignee?: {
    id: string
    name: string
  }

  // Labels
  labels: string[]

  // NOTE: tasks NOT stored as array
  // Query by: tasks WHERE storyId == this.id

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * EMPLOYEES COLLECTION
 * Path: /tenants/{tenantId}/employees/{employeeId}
 *
 * Central employee database for the entire company/tenant
 */
export interface FirestoreEmployee {
  id: string
  tenantId: string
  userId?: string // Link to User account (for authentication)

  // Personal Information
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  avatar?: string

  // Employment Details
  employeeId?: string // Company employee ID/badge number
  role: string
  customRole?: string
  department: string
  title: string

  status: 'active' | 'on_leave' | 'inactive' | 'terminated'
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern' | 'freelance'

  // Dates
  hireDate: string
  terminationDate?: string
  dateOfBirth?: string

  // Capacity & Availability
  weeklyHours: number
  hourlyRate?: number
  sprintCapacity?: number

  // Skills & Expertise
  skills: string[]
  expertiseLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  certifications?: string[]

  // Reporting Structure
  managerId?: string
  managerName?: string

  // Project Assignments (denormalized for overview)
  activeProjects: Array<{
    projectId: string
    projectName: string
    role: string
    allocation: number
  }>

  // Contact & Address
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zip?: string
  }
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }

  // Performance & Notes
  performanceRating?: number
  notes?: string

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy?: string
  lastModifiedBy?: string
}

/**
 * PROJECT TEAM MEMBERS SUBCOLLECTION
 * Path: /tenants/{tenantId}/projects/{projectId}/team/{memberId}
 *
 * Detailed project team assignment linking Employee to Project
 */
export interface FirestoreProjectTeamMember {
  id: string
  projectId: string
  employeeId: string

  // Employee Info (denormalized)
  employee: {
    id: string
    fullName: string
    email: string
    avatar?: string
    title: string
    department: string
  }

  // Role in Project
  projectRole: string
  responsibilities?: string[]

  // Allocation & Capacity
  allocation: number // 0-100 percentage
  hoursPerWeek: number
  sprintCapacity: number

  // Assignment Period
  startDate: string
  endDate?: string
  status: 'active' | 'on_hold' | 'completed'

  // Performance Tracking
  tasksAssigned: number
  tasksCompleted: number
  hoursLogged: number
  performanceScore?: number

  // Permissions (project-specific)
  permissions: string[]

  // Metadata
  assignedAt: string
  assignedBy: string
  updatedAt: string
  lastActiveAt?: string
}

// ============================================================================
// REQUIRED INDEXES
// ============================================================================

/**
 * FIRESTORE INDEXES REQUIRED
 *
 * These must be created in Firebase Console or via firebase.indexes.json
 */
export const REQUIRED_INDEXES = [
  // Apps by project
  {
    collectionGroup: 'apps',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  // Apps by client
  {
    collectionGroup: 'apps',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'client.id', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' }
    ]
  },
  // Projects by status
  {
    collectionGroup: 'projects',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'updatedAt', order: 'DESCENDING' }
    ]
  },
  // Projects by priority
  {
    collectionGroup: 'projects',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'priority', order: 'ASCENDING' },
      { fieldPath: 'dueDate', order: 'ASCENDING' }
    ]
  },
  // Pricing catalog by project
  {
    collectionGroup: 'pricingCatalog',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'category', order: 'ASCENDING' }
    ]
  },
  // Tasks by project and status
  {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'priority', order: 'DESCENDING' }
    ]
  },
  // Milestones by project
  {
    collectionGroup: 'milestones',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'dueDate', order: 'ASCENDING' }
    ]
  },
  // Tasks by sprint
  {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'sprintId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' }
    ]
  },
  // Tasks by epic
  {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'epicId', order: 'ASCENDING' },
      { fieldPath: 'priority', order: 'DESCENDING' }
    ]
  },
  // Tasks by story
  {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'storyId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' }
    ]
  },
  // Tasks by app (app-scoped tasks)
  {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'scope', order: 'ASCENDING' },
      { fieldPath: 'appId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' }
    ]
  },
  // Tasks by assignee
  {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'assignee.id', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' }
    ]
  },
  // Sprints by project and status
  {
    collectionGroup: 'sprints',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'startDate', order: 'DESCENDING' }
    ]
  },
  // Stories by epic
  {
    collectionGroup: 'stories',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'epicId', order: 'ASCENDING' },
      { fieldPath: 'priority', order: 'DESCENDING' }
    ]
  },
  // Stories by sprint
  {
    collectionGroup: 'stories',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'sprintId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' }
    ]
  },
  // Stories by project and status
  {
    collectionGroup: 'stories',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'priority', order: 'DESCENDING' }
    ]
  },
  // Epics by project and status
  {
    collectionGroup: 'epics',
    fields: [
      { fieldPath: 'projectId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  }
]

// ============================================================================
// SECURITY RULES STRUCTURE
// ============================================================================

/**
 * FIRESTORE SECURITY RULES
 *
 * Basic structure - to be implemented in firestore.rules
 */
export const SECURITY_RULES_TEMPLATE = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isTenantMember(tenantId) {
      return isAuthenticated() &&
             request.auth.token.tenantId == tenantId;
    }

    function hasPermission(tenantId, permission) {
      return isTenantMember(tenantId) &&
             permission in request.auth.token.permissions;
    }

    // Tenants collection
    match /tenants/{tenantId} {
      allow read: if isTenantMember(tenantId);
      allow write: if hasPermission(tenantId, 'admin:tenants');

      // Projects subcollection
      match /projects/{projectId} {
        allow read: if isTenantMember(tenantId);
        allow create: if hasPermission(tenantId, 'create:projects');
        allow update: if hasPermission(tenantId, 'update:projects');
        allow delete: if hasPermission(tenantId, 'delete:projects');

        // Project subcollections
        match /{subcollection}/{docId} {
          allow read: if isTenantMember(tenantId);
          allow write: if hasPermission(tenantId, 'update:projects');
        }
      }

      // Apps subcollection
      match /apps/{appId} {
        allow read: if isTenantMember(tenantId);
        allow create: if hasPermission(tenantId, 'create:apps');
        allow update: if hasPermission(tenantId, 'update:apps');
        allow delete: if hasPermission(tenantId, 'delete:apps');

        // App credentials - restricted access
        match /credentials/{credId} {
          allow read: if hasPermission(tenantId, 'read:credentials');
          allow write: if hasPermission(tenantId, 'admin:apps');
        }
      }

      // Clients subcollection
      match /clients/{clientId} {
        allow read: if isTenantMember(tenantId);
        allow create: if hasPermission(tenantId, 'create:clients');
        allow update: if hasPermission(tenantId, 'update:clients');
        allow delete: if hasPermission(tenantId, 'delete:clients');
      }

      // Pricing catalog
      match /pricingCatalog/{catalogId} {
        allow read: if isTenantMember(tenantId);
        allow write: if hasPermission(tenantId, 'admin:pricing');
      }

      // Feature addons
      match /featureAddons/{addonId} {
        allow read: if isTenantMember(tenantId);
        allow write: if hasPermission(tenantId, 'admin:features');
      }
    }
  }
}
`

// ============================================================================
// QUERY PATTERNS
// ============================================================================

/**
 * Common query patterns for reference
 */
export const QUERY_PATTERNS = {
  // Get all apps for a project
  getProjectApps: `
    db.collection('tenants/{tenantId}/apps')
      .where('projectId', '==', projectId)
      .orderBy('createdAt', 'desc')
  `,

  // Get all apps for a client
  getClientApps: `
    db.collection('tenants/{tenantId}/apps')
      .where('client.id', '==', clientId)
      .orderBy('status', 'asc')
  `,

  // Get all projects (with pagination)
  getProjects: `
    db.collection('tenants/{tenantId}/projects')
      .where('status', 'in', ['planning', 'in_progress'])
      .orderBy('updatedAt', 'desc')
      .limit(20)
  `,

  // Get pricing catalog for a project
  getPricingCatalog: `
    db.collection('tenants/{tenantId}/pricingCatalog')
      .where('projectId', '==', projectId)
      .orderBy('category', 'asc')
  `,

  // Get project clients (via apps)
  getProjectClients: `
    // 1. Get all apps for the project
    const apps = await db.collection('tenants/{tenantId}/apps')
      .where('projectId', '==', projectId)
      .get()

    // 2. Extract unique client IDs
    const clientIds = [...new Set(apps.docs.map(doc => doc.data().client.id))]

    // 3. Fetch client details (if needed)
    const clients = await Promise.all(
      clientIds.map(id =>
        db.doc('tenants/{tenantId}/clients/' + id).get()
      )
    )
  `
}
