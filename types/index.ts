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

// Project Types
export interface Project {
  id: string
  tenantId: string
  name: string
  description?: string
  client: {
    id: string
    name: string
    logo?: string
  }
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
  createdAt: Date
  updatedAt: Date
}

export type ProjectType = 'pos' | 'mobile_app' | 'web_app' | 'hybrid' | 'custom'
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
}

// Task Types
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
  createdAt: Date
  updatedAt: Date
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

// Finance Types
export interface Invoice {
  id: string
  tenantId: string
  number: string
  client: {
    id: string
    name: string
  }
  projectId?: string
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