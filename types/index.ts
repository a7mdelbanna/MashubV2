// User & Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId: string
  department?: Department
  permissions: Permission[]
  portalAccess: Portal[]
  photoURL?: string
  createdAt: Date
  lastLogin?: Date
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'employee' | 'client' | 'candidate'
export type Department = 'tech' | 'hr' | 'finance' | 'support' | 'marketing' | 'sales'
export type Portal = 'employee' | 'client' | 'candidate' | 'admin' | 'superadmin'
export type Permission = string // e.g., 'read:projects', 'write:invoices'

// Tenant Types
export interface Tenant {
  id: string
  name: string
  domain: string
  customDomain?: string
  subscription: SubscriptionPlan
  status: TenantStatus
  trialEndsAt?: Date
  createdAt: Date
  owner: {
    id: string
    email: string
    name: string
  }
  branding?: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  }
  limits: TenantLimits
  usage: TenantUsage
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export type TenantStatus = 'active' | 'trial' | 'suspended' | 'cancelled'
export type SubscriptionPlan = 'trial' | 'starter' | 'pro' | 'enterprise'

export interface TenantLimits {
  users: number
  projects: number
  storage: number // in GB
  clientPortals: number
  apiCalls?: number
}

export interface TenantUsage {
  users: number
  projects: number
  storage: number
  clientPortals: number
  apiCalls?: number
}

// App Types (formerly Service types - refactored to App-centric model)
export type AppType = 'pos' | 'mobile_app' | 'website' | 'advertising' | 'crm' | 'erp' | 'custom'

export interface App {
  id: string
  tenantId: string
  projectId: string // Parent project

  // Identity & Type
  type: AppType
  nameEn: string // Required: English name
  nameAr: string // Required: Arabic name
  descriptionEn?: string
  descriptionAr?: string

  // Client Relationship (ONE client per app)
  client: {
    id: string
    name: string
    logo?: string
  }

  // Branding & Assets
  branding: {
    primaryColor: string
    secondaryColor: string
    accentColor?: string
    logo?: string
    logoUrl?: string
    splashScreen?: string
    animations?: string[] // Lottie files, etc.
    storeGraphics?: string[] // App store screenshots, etc.
  }

  // Store & Environment Configuration
  storeId?: string // Tenant/Store identifier
  environments: {
    dev?: EnvironmentConfig
    staging?: EnvironmentConfig
    production?: EnvironmentConfig
  }

  // Important URLs
  urls: {
    admin?: string
    storefront?: string
    apiBase?: string
    statusPage?: string
    documentation?: string
  }

  // Security & Credentials (vaulted)
  credentials: AppCredential[]

  // Features & Flags
  features: {
    enabled: string[] // Feature flags
    modules: string[] // Enabled modules/widgets
  }

  // Pricing & Package
  pricing?: {
    catalogItemId: string // Reference to PricingCatalogItem
    customOverrides?: Partial<PricingCatalogItem> // App-specific modifications
    appliedAt: Date
    appliedBy: string
  }

  // Release & Versioning
  releases: {
    current: AppVersion
    upcoming?: PlannedRelease
    history: ReleaseHistoryEntry[]
  }

  // Status & Health
  status: 'development' | 'staging' | 'production' | 'maintenance' | 'deprecated'
  health: {
    uptime?: number // percentage
    lastChecked?: Date
    issues: number // count of open issues
  }

  // Metadata
  createdAt: Date
  updatedAt: Date
  lastDeployedAt?: Date
}

export interface EnvironmentConfig {
  url: string
  apiEndpoint?: string
  version?: string
  lastDeployed?: Date
  status: 'active' | 'inactive' | 'maintenance'
}

export interface AppCredential {
  id: string
  label: string // e.g., "Admin Login", "API Key", "Database Password"
  type: 'login' | 'api_key' | 'database' | 'certificate' | 'other'
  username?: string
  value: string // Encrypted/masked in UI
  owner?: string // Team member responsible
  expiresAt?: Date
  notes?: string
  attachments?: string[] // For encrypted keyfiles
  createdAt: Date
  lastAccessedAt?: Date
}

export interface AppVersion {
  version: string // e.g., "1.2.3"
  buildNumber?: number
  releaseDate: Date
  releaseChannel: 'dev' | 'staging' | 'production'
  notes?: string
}

export interface PlannedRelease {
  version: string
  targetDate: Date
  features: string[]
  status: 'planned' | 'in_progress' | 'qa' | 'approved'
}

export interface ReleaseHistoryEntry {
  version: string
  releaseDate: Date
  releaseChannel: 'dev' | 'staging' | 'production'
  status: 'shipped' | 'rolled_back'
  notes?: string
  releasedBy?: string
}

// Pricing Catalog (migrated from Services)
export interface PricingCatalogItem {
  id: string
  projectId: string // Belongs to project
  name: string
  description?: string
  category: string // e.g., "POS Plans", "Website Packages"

  // Pricing model
  pricing: {
    model: 'subscription' | 'one_time' | 'usage_based' | 'custom'
    amount: number
    currency: string
    interval?: 'month' | 'year' // For subscriptions
  }

  // Features included
  features: string[]

  // Limits
  limits?: {
    users?: number
    storage?: number
    apiCalls?: number
    transactions?: number
    [key: string]: number | undefined
  }

  // Source tracking (from legacy Services migration)
  migratedFrom?: {
    serviceId: string
    serviceName: string
    migratedAt: Date
  }

  // Usage
  appsUsing: number // Count of apps using this package

  createdAt: Date
  updatedAt: Date
}

// Feature Addons (Can be added to pricing packages or apps)
export interface FeatureAddon {
  id: string
  projectId: string // Belongs to project
  name: string
  description?: string
  category: string // e.g., "Features", "Integrations", "Modules"

  // Pricing (optional - some addons may be free)
  pricing?: {
    model: 'subscription' | 'one_time' | 'usage_based'
    amount: number
    currency: string
    interval?: 'month' | 'year'
  }

  // Technical details
  technicalName: string // e.g., 'inventory_management', 'dark_mode'
  requiredAddons?: string[] // Addon IDs that this depends on

  // Usage tracking
  appsUsing: number // Count of apps using this addon

  createdAt: Date
  updatedAt: Date
}

// Checklist Template Types
export interface ChecklistTemplate {
  id: string
  projectId?: string // If project-specific, otherwise global
  name: string
  description?: string
  appTypes: AppType[] // Which app types this applies to

  items: ChecklistItem[]

  // Default assignments (copied when creating project instance)
  defaultAssignments?: ChecklistItemAssignment[]

  createdAt: Date
  updatedAt: Date
}

export interface ChecklistItem {
  id: string
  title: string
  description?: string
  category: 'branding' | 'technical' | 'legal' | 'qa' | 'deployment' | 'documentation' | 'other'
  required: boolean
  order: number

  // Assignment (can be userId or team/role string)
  assignedTo?: string // userId or role name (e.g., 'user_123' or 'QA Team')
  assignedType?: 'user' | 'team' // Track assignment type

  // Agile integration
  linkedTaskId?: string // Reference to Task in agile system

  // Completion tracking
  completed: boolean
  completedAt?: Date
  completedBy?: string
  notes?: string
}

export interface ChecklistItemAssignment {
  checklistItemId: string
  assignedTo: string // userId or role name
  assignedType: 'user' | 'team'
}

// Checklist Instance (project-level instantiation of template)
export interface ChecklistInstance {
  id: string
  projectId: string
  templateId: string
  templateName: string
  appTypes: AppType[]

  items: ChecklistItem[] // Copy of template items with instance-specific data

  // Progress tracking
  totalItems: number
  completedItems: number
  requiredItems: number
  completedRequiredItems: number

  // Status
  status: 'not_started' | 'in_progress' | 'completed'
  isProductionReady: boolean // All required items completed

  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

/**
 * Project - Main project entity representing a software development project
 *
 * FIREBASE vs FRONTEND MODEL:
 * - In Firestore: Stored WITHOUT embedded arrays (apps, pricingCatalog, etc.)
 * - In Frontend: Populated WITH arrays for easy access
 * - Query pattern: Fetch project, then query related collections and populate arrays
 *
 * RELATIONSHIPS:
 * - Project → Apps (One-to-Many): A project can have multiple apps
 * - App → Client (Many-to-One): Each app belongs to one client
 * - Multiple clients can collaborate on same project through their apps
 *
 * EXAMPLE:
 * Project "Retail Suite" might have:
 *   - App 1: "TechCorp POS" (Client: TechCorp)
 *   - App 2: "RetailChain Shop" (Client: RetailChain)
 *   → This project serves 2 different clients
 */
export interface Project {
  id: string
  tenantId: string
  name: string
  slug: string
  description?: string

  // Client & Business
  clientId?: string
  clientName?: string
  contractValue?: number
  currency?: string

  // Status & Dates
  type: ProjectType
  status: ProjectStatus
  priority: ProjectPriority
  visibility: ProjectVisibility
  startDate?: string
  dueDate?: string
  endDate?: string // Alternative field name for compatibility
  estimatedHours?: number
  actualHours?: number

  // Team
  ownerId: string
  ownerName?: string
  manager: {
    id: string
    name: string
  }
  managerId?: string // Alternative field for compatibility
  managerName?: string
  team: TeamMember[]
  teamSize?: number

  // Progress
  progress: number
  completionPercentage: number // Alternative field name for compatibility
  tasksTotal: number
  tasksCompleted: number
  milestonesTotal: number
  milestonesCompleted: number

  // Budget
  budget: number
  spent: number
  budgetAllocated?: number // Alternative field name for compatibility
  budgetSpent?: number // Alternative field name for compatibility

  // Metadata
  tags: string[]
  color?: string
  iconUrl?: string

  /**
   * Apps (Project Deliverables)
   * FIREBASE: Query apps by projectId, populate this array in frontend
   * RELATIONSHIP: One Project → Many Apps
   */
  apps: App[]

  /**
   * Pricing Catalog (Migrated from Services)
   * FIREBASE: Query pricing items by projectId
   * Contains pricing packages/plans available for this project's apps
   */
  pricingCatalog: PricingCatalogItem[]

  /**
   * Checklist Templates
   * FIREBASE: Store as subcollection or query by projectId
   * Reusable checklist templates for apps of different types
   */
  checklistTemplates: ChecklistTemplate[]

  /**
   * Checklist Instances
   * FIREBASE: Store as subcollection
   * Actual checklist instances with completion status and assignments
   */
  checklistInstances: ChecklistInstance[]

  // Health indicators
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
  createdAt: string
  updatedAt: string
  completedAt?: string
  archivedAt?: string
}

export type ProjectType = 'fixed_price' | 'time_material' | 'retainer' | 'agile' | 'custom'
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled' | 'draft' | 'archived'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical'
export type ProjectVisibility = 'private' | 'team' | 'client' | 'public'

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  capacity?: number // hours per sprint
}

// Task Types (Updated for App-level scoping)
export type TicketScope = 'project' | 'app'

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: TeamMember
  dueDate?: Date
  tags?: string[]
  attachments?: Attachment[]
  dependencies?: string[] // task IDs

  // New: Scoping support
  scope: TicketScope // 'project' or 'app'
  appId?: string // If scope is 'app', which app does this belong to
  appName?: string // Denormalized for quick display

  // Epic/Story relationship
  epicId?: string
  storyId?: string
  sprintId?: string

  // Checklist integration
  checklistItemId?: string // If created from checklist item
  checklistInstanceId?: string // Parent checklist instance

  createdAt: Date
  updatedAt: Date
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskType = 'bug' | 'feature' | 'task' | 'improvement' | 'documentation'

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

// Agile Types
export interface Epic {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled'
  priority: TaskPriority
  owner?: TeamMember
  stories: Story[]
  progress: number // 0-100
  startDate?: Date
  targetDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Story {
  id: string
  epicId?: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  storyPoints?: number
  assignee?: TeamMember
  tasks: Task[]
  acceptanceCriteria?: string[]

  // Scoping
  scope: TicketScope
  appId?: string

  createdAt: Date
  updatedAt: Date
}

export interface Sprint {
  id: string
  projectId: string
  name: string
  goal: string
  startDate: Date
  endDate: Date
  status: 'planned' | 'active' | 'completed' | 'cancelled'

  // Capacity & Planning
  capacity: number // Total story points/hours
  committed: number // Committed story points
  completed: number // Completed story points

  // Definition of Done
  definitionOfDone: string[]

  // Associated work
  stories: Story[]
  tasks: Task[]

  // Metrics
  velocity?: number
  burndown?: number[]

  createdAt: Date
  updatedAt: Date
}

// File & Document Types
export type FileType = 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other'

export interface ProjectFile {
  id: string
  projectId: string
  name: string
  type: FileType
  extension: string
  size: number
  uploadedBy: string
  uploadedAt: string
  version: number
  versions: FileVersion[]
  folder: string
  tags: string[]
  isStarred: boolean
  downloads: number
  lastAccessed?: string

  // App assignment (multiple apps can use same file)
  assignedApps: string[] // App IDs that have access to this file
}

export interface FileVersion {
  version: number
  uploadedBy: string
  uploadedAt: string
  size: number
  changes?: string
}

export interface FolderStructure {
  name: string
  path: string
  fileCount: number
  subfolders?: FolderStructure[]

  // App assignment for entire folder
  assignedApps?: string[] // App IDs
}

// App-level file view (reference to project files)
export interface AppFile {
  id: string
  appId: string
  projectFileId: string // Reference to ProjectFile
  purpose: 'config' | 'secret' | 'resource' | 'documentation' | 'asset' | 'other'
  required: boolean
  lastAccessedBy?: string
  lastAccessedAt?: Date
  notes?: string
}

// Finance Types (Updated for App-level billing)
export interface Invoice {
  id: string
  tenantId: string
  number: string
  client: {
    id: string
    name: string
  }
  projectId?: string
  appId?: string // New: Link invoice to specific app
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: InvoiceStatus
  dueDate: Date
  paidAt?: Date
  createdAt: Date
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Transaction {
  id: string
  tenantId: string
  type: TransactionType
  category: string
  amount: number
  account: string
  projectId?: string
  description?: string
  date: Date
  createdAt: Date
}

export type TransactionType = 'income' | 'expense'

// Subscription Plans
export interface PricingPlan {
  id: SubscriptionPlan
  name: string
  price: number | 'custom'
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: TenantLimits
  stripePriceId?: string
  popular?: boolean
}