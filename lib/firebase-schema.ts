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
