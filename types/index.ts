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

  // Completion tracking
  completed: boolean
  completedAt?: Date
  completedBy?: string
  notes?: string
}

// Project Types (Updated to remove direct client, add apps/catalog)
export interface Project {
  id: string
  tenantId: string
  name: string
  description?: string

  // Note: Project no longer has direct client relationship
  // Clients are linked through Apps

  type: ProjectType
  status: ProjectStatus
  budget: number
  spent: number
  startDate: Date
  dueDate: Date
  manager: {
    id: string
    name: string
  }
  team: TeamMember[]
  progress: number

  // New: Apps (deliverables)
  apps: App[]

  // New: Pricing Catalog (migrated from Services)
  pricingCatalog: PricingCatalogItem[]

  // New: Checklist Templates
  checklistTemplates: ChecklistTemplate[]

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
    startDate: Date
    endDate: Date
    committed: number
    completed: number
  }

  createdAt: Date
  updatedAt: Date
}

export type ProjectType = 'fixed_price' | 'time_material' | 'retainer' | 'agile' | 'custom'
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'

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