/**
 * MasHub V2 - Finance Module Type Definitions
 *
 * Comprehensive type system for multi-currency finance management
 * Based on FinanceModule.md specifications
 */

// ==================== CURRENCY TYPES ====================

export interface Currency {
  id: string
  code: string // ISO 4217 (USD, EUR, EGP, etc.)
  name: string // US Dollar, Euro, Egyptian Pound
  symbol: string // $, €, £, E£
  symbolPosition: 'before' | 'after' // $100 or 100€
  decimalPlaces: number // 2 for most, 0 for JPY
  isDefault: boolean // One default currency for reporting
  isActive: boolean // Can be disabled without deleting
  createdAt: Date
  updatedAt: Date
}

export interface ExchangeRate {
  id: string
  baseCurrency: string // Currency code (e.g., USD)
  targetCurrency: string // Currency code (e.g., EGP)
  rate: number // Conversion rate (e.g., 1 USD = 30.95 EGP)
  source: ExchangeRateSource // Where the rate came from
  timestamp: Date // When the rate was fetched
  isManualOverride: boolean // True if manually set
  createdAt: Date
  // IMMUTABLE: Once a transaction uses this rate, it's frozen in history
}

export type ExchangeRateSource =
  | 'exchangerate-api'
  | 'open-exchange-rates'
  | 'fixer-io'
  | 'manual'
  | 'central-bank'

export interface FXSnapshot {
  // Embedded in transactions - preserves exact rate used
  baseCurrency: string
  targetCurrency: string
  rate: number
  source: ExchangeRateSource
  timestamp: Date
}

// ==================== ACCOUNT TYPES ====================

export interface Account {
  id: string
  tenantId: string
  name: string // "CIB - EGP Main Account", "Stripe USD", "Cash - Cairo Office"
  description?: string
  type: AccountType
  currency: string // SINGLE CURRENCY per account (enforced)
  balance: number // Current balance in account's currency
  initialBalance: number // Starting balance (for reconciliation)
  bankDetails?: BankDetails // For bank accounts
  pspDetails?: PSPDetails // For payment service providers
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastReconciledAt?: Date
  lastReconciledBalance?: number
}

export type AccountType =
  | 'bank' // Bank account
  | 'cash' // Physical cash
  | 'psp-stripe' // Payment Service Provider - Stripe
  | 'psp-paymob' // Payment Service Provider - Paymob
  | 'wallet' // Digital wallet
  | 'investment' // Investment account
  | 'loan' // Loan account
  | 'credit-card' // Credit card

export interface BankDetails {
  bankName: string
  accountNumber: string
  iban?: string
  swiftCode?: string
  branch?: string
  accountHolder: string
}

export interface PSPDetails {
  provider: 'stripe' | 'paymob' | 'paypal' | 'other'
  accountId: string // Stripe account ID, Paymob merchant ID, etc.
  apiKeyId?: string // Reference to encrypted API key
  webhookSecret?: string // Encrypted webhook secret
  isLive: boolean // Production vs Test mode
}

// ==================== PAYMENT METHOD TYPES ====================

export interface PaymentMethod {
  id: string
  tenantId: string
  name: string // "Stripe Credit Card", "Bank Transfer - CIB", "Cash Payment"
  description?: string // Client-facing instructions
  type: PaymentMethodType
  logo?: string // URL to logo image
  isActive: boolean
  isAutomated: boolean // Can auto-post via webhook
  displayOrder: number // For client-facing ordering

  // API Configuration (encrypted)
  apiConfig?: PaymentMethodAPIConfig

  // Settlement Account Mapping
  // One method can settle to different accounts by currency
  accountMappings: AccountMapping[]

  // Client-facing details
  instructions?: {
    en: string // English instructions
    ar?: string // Arabic instructions
  }

  createdAt: Date
  updatedAt: Date
}

export type PaymentMethodType =
  | 'stripe'
  | 'paymob'
  | 'bank-transfer'
  | 'cash'
  | 'check'
  | 'wallet'
  | 'crypto'
  | 'paypal'
  | 'other'

export interface PaymentMethodAPIConfig {
  provider: string
  apiKeyId: string // Reference to encrypted API key in secure storage
  webhookEndpoint?: string
  webhookSecretId?: string
  isLive: boolean
}

export interface AccountMapping {
  currency: string // USD, EUR, EGP, etc.
  accountId: string // Which account receives funds in this currency
  accountName: string // For display (denormalized)
}

// ==================== CONTACT TYPES ====================

export interface Contact {
  id: string
  tenantId: string
  type: ContactType
  name: string
  displayName?: string // Nickname or short name
  email?: string
  phone?: string
  website?: string

  // Address
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }

  // Financial Details
  taxId?: string // VAT number, EIN, etc.
  paymentTerms: PaymentTerms
  preferredPaymentMethodId?: string
  currency: string // Default currency for this contact

  // Balances
  outstandingBalance: number // Amount owed (positive) or prepaid (negative)
  creditLimit?: number

  // Relationships
  linkedClientId?: string // If this contact is also a client
  linkedVendorId?: string // If this contact is also a vendor

  // Metadata
  tags: string[]
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ContactType =
  | 'vendor' // Supplier, service provider
  | 'client' // Customer (can link to existing Client record)
  | 'partner' // Business partner
  | 'employee' // For reimbursements
  | 'landlord' // Property owner
  | 'government' // Tax authorities, regulators
  | 'other'

export type PaymentTerms =
  | 'due-on-receipt'
  | 'net-15'
  | 'net-30'
  | 'net-45'
  | 'net-60'
  | 'net-90'
  | 'custom'

// ==================== CATEGORY TYPES ====================

export interface Category {
  id: string
  tenantId: string
  name: string
  description?: string
  type: CategoryType

  // Nested Structure
  parentId?: string // null for root categories
  path: string // Materialized path: "Expense/Office/Rent/Cairo HQ"
  level: number // Depth in tree (0 for root)
  order: number // For manual sorting within same parent

  // Budgeting
  budgetAmount?: number // Monthly/annual budget
  budgetPeriod?: 'monthly' | 'quarterly' | 'annually'

  // Metadata
  color?: string // For charts and visualization
  icon?: string // Icon name (lucide-react)
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Computed (not stored)
  children?: Category[] // Populated when fetching tree
  totalSpent?: number // Calculated from transactions
}

export type CategoryType = 'income' | 'expense'

// ==================== TRANSACTION TYPES ====================

export interface FinanceTransaction {
  id: string
  tenantId: string

  // Core Fields
  type: TransactionType
  amount: number // In transaction currency (always positive)
  currency: string // Currency of this transaction

  // FX Handling
  fxSnapshot?: FXSnapshot // IMMUTABLE: Locked rate at time of posting
  amountInDefaultCurrency?: number // Converted amount for reporting

  // Accounts
  accountId: string // Where money arrives (income) or leaves (expense)
  accountName: string // Denormalized for quick display

  // For Transfers
  sourceAccountId?: string // Transfer from
  destinationAccountId?: string // Transfer to
  feeAmount?: number // Transfer fee (separate expense)
  feeAccountId?: string // Account where fee is charged

  // Classification
  categoryId?: string
  categoryPath?: string // Denormalized: "Expense/Office/Rent"
  contactId?: string
  contactName?: string // Denormalized

  // Payment Method (optional - for client/vendor payments)
  paymentMethodId?: string
  paymentMethodName?: string // Denormalized

  // Description & References
  description: string
  notes?: string
  reference?: string // Invoice #, receipt #, PO #, etc.

  // Linked Records
  projectId?: string // Link to project
  invoiceId?: string // Link to invoice
  purchaseId?: string // Link to purchase order

  // State Management
  state: TransactionState
  postedAt?: Date // When it was posted (affects reports)
  dueDate?: Date // For scheduled/future transactions

  // Approval Workflow
  requiresApproval: boolean
  approvedBy?: string // User ID
  approvedAt?: Date
  rejectedBy?: string // User ID
  rejectedAt?: Date
  rejectionReason?: string

  // Void/Reversal
  voidedAt?: Date
  voidedBy?: string // User ID
  voidReason?: string
  voidedTransactionId?: string // Points to reversal transaction

  // Attachments
  attachments: TransactionAttachment[]

  // Tax (basic)
  taxRate?: number // VAT % or withholding %
  taxAmount?: number
  isWithholdingTax?: boolean

  // Reconciliation
  reconciledAt?: Date
  reconciliationId?: string

  // Audit
  createdBy: string // User ID
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
}

export type TransactionType = 'income' | 'expense' | 'transfer'

export type TransactionState =
  | 'draft' // Saved but not posted (doesn't affect reports)
  | 'pending-approval' // Submitted for approval
  | 'approved' // Approved but not posted yet
  | 'posted' // Posted to accounts (affects balances & reports)
  | 'void' // Cancelled (reason required)
  | 'rejected' // Approval rejected

export interface TransactionAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string // mime type
  fileSize: number // bytes
  uploadedBy: string // User ID
  uploadedAt: Date
}

// ==================== RECURRING TRANSACTION TYPES ====================

export interface RecurringItem {
  id: string
  tenantId: string

  // Template (matches FinanceTransaction fields)
  templateData: Omit<FinanceTransaction, 'id' | 'state' | 'postedAt' | 'createdAt' | 'updatedAt'>

  // Schedule
  frequency: RecurringFrequency
  interval: number // e.g., every 2 weeks, every 3 months
  startDate: Date
  endDate?: Date // null = indefinite
  nextOccurrence: Date
  lastGenerated?: Date

  // Behavior
  autoCreate: boolean // Create draft automatically vs notify
  advanceNoticeDays: number // Notify X days before due

  // State
  isActive: boolean
  isPaused: boolean
  pausedAt?: Date
  pausedBy?: string

  // Metadata
  name: string // "Monthly Office Rent", "Quarterly AWS Bill"
  description?: string

  // History
  generatedTransactions: string[] // Transaction IDs
  createdBy: string
  createdAt: Date
  updatedAt?: Date
}

export type RecurringFrequency =
  | 'daily'
  | 'weekly'
  | 'bi-weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi-annually'
  | 'annually'
  | 'custom' // Use interval field

// ==================== RECONCILIATION TYPES ====================

export interface Reconciliation {
  id: string
  tenantId: string
  accountId: string
  accountName: string // Denormalized

  // Period
  startDate: Date
  endDate: Date

  // Balances
  openingBalance: number // From last reconciliation or statement
  closingBalance: number // From bank statement
  systemCalculatedBalance: number // MasHub calculated balance
  difference: number // closingBalance - systemCalculatedBalance

  // Status
  status: ReconciliationStatus

  // Transactions
  totalTransactions: number
  reconciledTransactions: number
  unmatchedTransactions: string[] // Transaction IDs not marked as reconciled

  // Notes
  notes?: string
  discrepancyReason?: string

  // Audit
  performedBy: string // User ID
  startedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt?: Date
}

export type ReconciliationStatus =
  | 'in-progress' // Being worked on
  | 'completed' // Finished and balanced
  | 'completed-with-discrepancy' // Finished but has unexplained difference
  | 'abandoned' // Started but not completed

// ==================== ROLE & PERMISSION TYPES ====================

export interface FinanceRole {
  id: string
  tenantId: string
  name: FinanceRoleName
  displayName: string
  description: string
  permissions: FinancePermission[]
  isSystemRole: boolean // Cannot be deleted
  userIds: string[] // Users assigned this role
  createdAt: Date
  updatedAt?: Date
}

export type FinanceRoleName =
  | 'finance-admin' // Full access
  | 'accountant' // Post, reconcile, view
  | 'approver' // Review and approve
  | 'viewer' // Read-only

export type FinancePermission =
  // Transactions
  | 'transactions:create'
  | 'transactions:edit'
  | 'transactions:post'
  | 'transactions:void'
  | 'transactions:approve'
  | 'transactions:view'
  | 'transactions:view-all' // View other users' transactions

  // Accounts
  | 'accounts:create'
  | 'accounts:edit'
  | 'accounts:delete'
  | 'accounts:view'

  // Categories
  | 'categories:create'
  | 'categories:edit'
  | 'categories:delete'
  | 'categories:view'

  // Contacts
  | 'contacts:create'
  | 'contacts:edit'
  | 'contacts:delete'
  | 'contacts:view'

  // Payment Methods
  | 'payment-methods:create'
  | 'payment-methods:edit'
  | 'payment-methods:delete'
  | 'payment-methods:view'

  // Reconciliation
  | 'reconciliation:perform'
  | 'reconciliation:view'

  // Reports
  | 'reports:view'
  | 'reports:export'
  | 'reports:create-custom'

  // Settings
  | 'settings:currencies'
  | 'settings:roles'
  | 'settings:fx-provider'

  // Admin
  | 'admin:full-access'

// ==================== REPORT TYPES ====================

export interface FinanceReport {
  id: string
  tenantId: string
  type: ReportType
  name: string
  parameters: ReportParameters
  generatedBy: string // User ID
  generatedAt: Date
  fileUrl?: string // PDF/Excel export
}

export type ReportType =
  | 'balance-sheet'
  | 'profit-loss'
  | 'cash-flow'
  | 'budget-variance'
  | 'fx-exposure'
  | 'account-statement'
  | 'transaction-log'
  | 'category-breakdown'
  | 'contact-statement'
  | 'project-pl'
  | 'custom'

export interface ReportParameters {
  startDate?: Date
  endDate?: Date
  currency?: string // View in specific currency
  accountIds?: string[]
  categoryIds?: string[]
  contactIds?: string[]
  projectIds?: string[]
  includeVoided?: boolean
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'category' | 'contact' | 'project'
}

// ==================== DASHBOARD TYPES ====================

export interface FinanceDashboardData {
  // Summary Metrics
  totalBalance: number // In default currency
  totalBalanceByCurrency: Record<string, number>
  monthlyRevenue: number
  monthlyExpenses: number
  monthlyProfit: number
  cashFlow: number

  // Trends
  revenueChange: number // % vs last period
  expenseChange: number
  profitChange: number
  cashFlowChange: number

  // Recent Activity
  recentTransactions: FinanceTransaction[]
  upcomingPayments: FinanceTransaction[]
  pendingApprovals: FinanceTransaction[]

  // Health Indicators
  accountsNeedingReconciliation: Account[]
  overduePayments: FinanceTransaction[]
  budgetAlerts: CategoryBudgetAlert[]

  // FX Exposure
  fxExposure: {
    currency: string
    amount: number
    percentOfTotal: number
  }[]
}

export interface CategoryBudgetAlert {
  categoryId: string
  categoryName: string
  budgetAmount: number
  spent: number
  remaining: number
  percentUsed: number
  status: 'healthy' | 'warning' | 'exceeded'
}

// ==================== UTILITY TYPES ====================

export interface MoneyAmount {
  amount: number
  currency: string
  amountInDefaultCurrency?: number
}

export interface DateRange {
  start: Date
  end: Date
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// ==================== FILTER TYPES ====================

export interface TransactionFilters {
  type?: TransactionType[]
  state?: TransactionState[]
  accountIds?: string[]
  categoryIds?: string[]
  contactIds?: string[]
  projectIds?: string[]
  paymentMethodIds?: string[]
  dateRange?: DateRange
  amountRange?: {
    min: number
    max: number
  }
  currency?: string
  searchText?: string
  requiresApproval?: boolean
  isReconciled?: boolean
}

// ==================== API RESPONSE TYPES ====================

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: Date
    requestId: string
  }
}

// ==================== VALIDATION TYPES ====================

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}
