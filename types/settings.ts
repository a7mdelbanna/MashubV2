// ==========================================
// SETTINGS TYPES & INTERFACES
// ==========================================

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'employee' | 'client' | 'vendor' | 'guest'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification'
export type PermissionScope = 'global' | 'tenant' | 'team' | 'personal'

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app' | 'webhook'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'
export type NotificationFrequency = 'instant' | 'hourly' | 'daily' | 'weekly'

export type IntegrationType = 'payment' | 'email' | 'sms' | 'calendar' | 'storage' | 'crm' | 'accounting' | 'analytics' | 'custom'
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending_setup'

export type SecurityLevel = 'low' | 'medium' | 'high' | 'critical'
export type MFAMethod = 'none' | 'sms' | 'email' | 'authenticator' | 'biometric'

export type BillingPlan = 'free' | 'starter' | 'professional' | 'enterprise' | 'custom'
export type BillingCycle = 'monthly' | 'quarterly' | 'annual' | 'lifetime'
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal' | 'crypto'

export type APIAccessLevel = 'read' | 'write' | 'admin'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface User {
  id: string
  tenantId: string

  // Basic Info
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  avatar?: string

  // Role & Permissions
  role: UserRole
  customRole?: string
  permissions: Permission[]
  teams: string[]
  departments: string[]

  // Status
  status: UserStatus
  isEmailVerified: boolean
  isPhoneVerified: boolean

  // Security
  lastLoginAt?: string
  lastLoginIP?: string
  mfaEnabled: boolean
  mfaMethod?: MFAMethod
  passwordLastChangedAt?: string
  failedLoginAttempts: number

  // Preferences
  preferences: UserPreferences
  notificationSettings: NotificationSettings

  // Activity
  lastActiveAt?: string
  sessionsCount: number

  // Metadata
  timezone: string
  language: string
  dateFormat: string
  timeFormat: '12h' | '24h'

  // Custom Fields
  customFields?: Record<string, any>

  // Timestamps
  createdAt: string
  updatedAt: string
  invitedAt?: string
  activatedAt?: string
  suspendedAt?: string
  suspensionReason?: string
}

export interface UserPreferences {
  // Dashboard
  defaultDashboard: string
  dashboardWidgets: string[]

  // Display
  theme: 'light' | 'dark' | 'auto'
  colorScheme?: string
  density: 'compact' | 'comfortable' | 'spacious'
  sidebarCollapsed: boolean

  // Accessibility
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  reduceMotion: boolean

  // Workflow
  autoSave: boolean
  confirmOnDelete: boolean
  defaultPageSize: number

  // Calendar
  weekStartDay: 'sunday' | 'monday'
  workingHours: WorkingHours

  // Custom
  customPreferences?: Record<string, any>
}

export interface WorkingHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  enabled: boolean
  start?: string // HH:mm format
  end?: string // HH:mm format
  breaks?: TimeRange[]
}

export interface TimeRange {
  start: string
  end: string
}

export interface Permission {
  resource: string // e.g., "projects", "invoices", "users"
  actions: PermissionAction[]
  scope: PermissionScope
  conditions?: PermissionCondition[]
}

export interface PermissionAction {
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import' | 'approve' | 'custom'
  allowed: boolean
}

export interface PermissionCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'in' | 'not_in'
  value: any
}

export interface Role {
  id: string
  tenantId?: string // null for system roles

  name: string
  slug: string
  description?: string

  // Permissions
  permissions: Permission[]
  inheritsFrom?: string[] // role IDs to inherit from

  // Type
  isSystemRole: boolean
  isCustomRole: boolean
  isDefault: boolean

  // Users
  usersCount: number

  // Metadata
  color?: string
  icon?: string

  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  tenantId: string

  name: string
  description?: string

  // Members
  members: TeamMember[]
  leaderId?: string

  // Permissions (team-level override)
  permissions?: Permission[]

  // Metadata
  color?: string
  avatar?: string
  email?: string

  // Stats
  totalMembers: number
  activeProjects: number

  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  role: 'member' | 'lead' | 'admin'
  joinedAt: string
}

export interface NotificationSettings {
  // Global
  enabled: boolean
  channels: NotificationChannel[]
  frequency: NotificationFrequency
  quietHours?: QuietHours

  // Categories
  categories: NotificationCategory[]
}

export interface QuietHours {
  enabled: boolean
  start: string // HH:mm
  end: string // HH:mm
  timezone: string
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
}

export interface NotificationCategory {
  category: string
  enabled: boolean
  channels: NotificationChannel[]
  priority: NotificationPriority
}

export interface NotificationTemplate {
  id: string
  tenantId?: string

  name: string
  slug: string
  description?: string

  // Category
  category: string
  type: 'system' | 'custom'

  // Content
  subject: string
  body: string // HTML or plain text
  variables: TemplateVariable[]

  // Channels
  channels: NotificationChannel[]

  // Email Specific
  emailFrom?: string
  emailReplyTo?: string
  emailCC?: string[]
  emailBCC?: string[]

  // SMS Specific
  smsFrom?: string

  // Status
  isActive: boolean
  isDefault: boolean

  // Usage
  usageCount: number

  createdAt: string
  updatedAt: string
}

export interface TemplateVariable {
  key: string
  label: string
  description?: string
  defaultValue?: string
  isRequired: boolean
}

export interface TenantSettings {
  tenantId: string

  // Company Info
  companyName: string
  companyLegalName?: string
  companyLogo?: string
  companyEmail: string
  companyPhone?: string
  companyWebsite?: string

  // Address
  address?: Address

  // Tax Info
  taxId?: string
  vatNumber?: string
  taxRate?: number

  // Business
  industry?: string
  companySize: 'solo' | 'small' | 'medium' | 'large' | 'enterprise'
  fiscalYearStart: string // MM-DD format

  // Regional
  timezone: string
  currency: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  language: string
  locale: string

  // Branding
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl?: string
  faviconUrl?: string

  // Features (enable/disable modules)
  enabledModules: string[]

  // Limits
  maxUsers: number
  maxStorage: number // GB
  maxProjects: number
  customLimits?: Record<string, number>

  // Subscription
  plan: BillingPlan
  planStartDate: string
  planEndDate?: string
  isTrialActive: boolean
  trialEndsAt?: string

  // Custom Fields
  customSettings?: Record<string, any>

  updatedAt: string
}

export interface Address {
  street?: string
  street2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface Integration {
  id: string
  tenantId: string

  // Integration Info
  name: string
  slug: string
  type: IntegrationType
  provider: string
  description?: string

  // Status
  status: IntegrationStatus
  isActive: boolean

  // Configuration
  config: IntegrationConfig
  credentials: IntegrationCredentials

  // Metadata
  logoUrl?: string
  webhookUrl?: string
  callbackUrl?: string

  // Usage
  lastSyncAt?: string
  syncFrequency?: 'realtime' | 'hourly' | 'daily' | 'manual'
  totalRequests: number
  failedRequests: number

  // Error Handling
  lastError?: string
  lastErrorAt?: string
  retryCount: number

  createdAt: string
  updatedAt: string
  activatedAt?: string
}

export interface IntegrationConfig {
  apiUrl?: string
  apiVersion?: string
  timeout?: number
  rateLimitPerHour?: number
  customSettings?: Record<string, any>
}

export interface IntegrationCredentials {
  apiKey?: string
  apiSecret?: string
  accessToken?: string
  refreshToken?: string
  tokenExpiry?: string
  username?: string
  password?: string
  clientId?: string
  clientSecret?: string
  customCredentials?: Record<string, string>
}

export interface EmailSettings {
  // Provider
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'postmark' | 'custom'

  // SMTP Settings
  smtpHost?: string
  smtpPort?: number
  smtpUsername?: string
  smtpPassword?: string
  smtpEncryption?: 'tls' | 'ssl' | 'none'

  // API Settings
  apiKey?: string
  apiSecret?: string

  // Sender Info
  fromName: string
  fromEmail: string
  replyToEmail?: string

  // Features
  trackOpens: boolean
  trackClicks: boolean
  enableUnsubscribe: boolean

  // Limits
  dailyLimit?: number
  hourlyLimit?: number

  // Testing
  testMode: boolean
  testEmail?: string

  updatedAt: string
}

export interface SMSSettings {
  // Provider
  provider: 'twilio' | 'nexmo' | 'plivo' | 'custom'

  // API Settings
  accountSid?: string
  authToken?: string
  apiKey?: string
  apiSecret?: string

  // Sender Info
  fromNumber: string
  messagingServiceSid?: string

  // Features
  enableDeliveryStatus: boolean

  // Limits
  dailyLimit?: number
  monthlyLimit?: number

  // Testing
  testMode: boolean
  testNumber?: string

  updatedAt: string
}

export interface SecuritySettings {
  // Password Policy
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSpecialChars: boolean
  passwordExpiryDays?: number
  passwordHistoryCount: number

  // MFA
  mfaEnabled: boolean
  mfaRequired: boolean
  mfaMethods: MFAMethod[]

  // Session
  sessionTimeout: number // minutes
  maxConcurrentSessions: number
  rememberMeDays: number

  // Login Security
  maxFailedLoginAttempts: number
  lockoutDuration: number // minutes
  requireEmailVerification: boolean

  // IP Restrictions
  ipWhitelist?: string[]
  ipBlacklist?: string[]

  // Security Level
  securityLevel: SecurityLevel

  // Audit
  logAllActions: boolean
  logSensitiveActions: boolean
  retainLogsForDays: number

  updatedAt: string
}

export interface APIKey {
  id: string
  tenantId: string
  userId?: string

  name: string
  key: string // hashed
  prefix: string // visible prefix for identification

  // Permissions
  accessLevel: APIAccessLevel
  scopes: string[]
  permissions: Permission[]

  // Usage
  lastUsedAt?: string
  totalRequests: number
  requestsThisMonth: number

  // Rate Limiting
  rateLimit?: number // requests per hour
  rateLimitRemaining?: number

  // Restrictions
  ipWhitelist?: string[]
  allowedDomains?: string[]

  // Expiry
  expiresAt?: string
  isExpired: boolean

  // Status
  isActive: boolean
  isRevoked: boolean
  revokedAt?: string
  revokedReason?: string

  createdAt: string
  updatedAt: string
}

export interface Webhook {
  id: string
  tenantId: string

  name: string
  url: string
  description?: string

  // Events
  events: string[]
  allEvents: boolean

  // Status
  isActive: boolean

  // Security
  secret: string
  signatureMethod: 'hmac_sha256' | 'hmac_sha512'

  // Headers
  customHeaders?: Record<string, string>

  // Retry Policy
  maxRetries: number
  retryBackoff: 'linear' | 'exponential'
  timeout: number // seconds

  // Status
  totalDeliveries: number
  successfulDeliveries: number
  failedDeliveries: number
  lastDeliveryAt?: string
  lastDeliveryStatus?: 'success' | 'failed'
  lastError?: string

  createdAt: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  tenantId: string

  // Actor
  userId?: string
  userName?: string
  userEmail?: string
  userRole?: UserRole

  // Action
  action: string
  resource: string
  resourceId?: string
  resourceName?: string

  // Details
  description: string
  changes?: AuditChange[]

  // Context
  ipAddress?: string
  userAgent?: string
  method?: string
  endpoint?: string

  // Result
  status: 'success' | 'failed'
  errorMessage?: string

  // Metadata
  metadata?: Record<string, any>

  timestamp: string
}

export interface AuditChange {
  field: string
  oldValue: any
  newValue: any
}

export interface BillingSettings {
  tenantId: string

  // Current Plan
  plan: BillingPlan
  planName: string
  planPrice: number
  billingCycle: BillingCycle
  currency: string

  // Status
  status: 'active' | 'past_due' | 'cancelled' | 'trialing'
  isTrialActive: boolean
  trialEndsAt?: string

  // Dates
  currentPeriodStart: string
  currentPeriodEnd: string
  nextBillingDate?: string
  cancelAt?: string
  cancelledAt?: string

  // Payment
  paymentMethod?: PaymentMethodInfo
  billingEmail: string
  invoicePrefix: string

  // Usage
  currentUsage: UsageMetrics
  usageLimits: UsageLimits

  // Invoices
  totalInvoices: number
  totalRevenue: number
  outstandingBalance: number

  updatedAt: string
}

export interface PaymentMethodInfo {
  type: PaymentMethod
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface UsageMetrics {
  users: number
  projects: number
  storage: number // GB
  apiCalls: number
  customMetrics?: Record<string, number>
}

export interface UsageLimits {
  maxUsers: number
  maxProjects: number
  maxStorage: number // GB
  maxAPICallsPerMonth: number
  customLimits?: Record<string, number>
}

export interface SystemSettings {
  // Maintenance
  maintenanceMode: boolean
  maintenanceMessage?: string
  maintenanceScheduledAt?: string

  // Registration
  allowRegistration: boolean
  requireInvite: boolean
  defaultRole: UserRole
  autoVerifyEmail: boolean

  // Features
  enablePublicAPI: boolean
  enableWebhooks: boolean
  enableIntegrations: boolean

  // Storage
  storageProvider: 'local' | 's3' | 'gcs' | 'azure' | 'cloudinary'
  maxFileSize: number // MB
  allowedFileTypes: string[]

  // Performance
  cacheEnabled: boolean
  cacheTTL: number // seconds
  enableCDN: boolean
  cdnUrl?: string

  // Analytics
  analyticsProvider?: 'google' | 'mixpanel' | 'amplitude' | 'custom'
  analyticsId?: string
  enableTracking: boolean

  // SEO
  siteName: string
  siteDescription?: string
  siteKeywords?: string[]

  updatedAt: string
}

export interface BackupSettings {
  // Schedule
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  backupTime: string // HH:mm format
  backupDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

  // Retention
  retentionDays: number
  maxBackups: number

  // Storage
  storageLocation: 'local' | 's3' | 'gcs' | 'azure'
  storageConfig?: Record<string, any>

  // Notification
  notifyOnSuccess: boolean
  notifyOnFailure: boolean
  notificationEmails: string[]

  // Last Backup
  lastBackupAt?: string
  lastBackupStatus?: 'success' | 'failed'
  lastBackupSize?: number // MB

  updatedAt: string
}

export interface CustomField {
  id: string
  tenantId: string

  // Field Info
  name: string
  slug: string
  description?: string

  // Type
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi_select' | 'url' | 'email' | 'phone' | 'textarea' | 'file'
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'

  // Applies To
  entityType: 'client' | 'project' | 'product' | 'service' | 'ticket' | 'visit' | 'user'

  // Validation
  isRequired: boolean
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  pattern?: string
  options?: string[] // for select/multi_select

  // Display
  placeholder?: string
  helpText?: string
  defaultValue?: any
  order: number

  // Visibility
  isVisible: boolean
  isEditable: boolean

  createdAt: string
  updatedAt: string
}
