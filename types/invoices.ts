/**
 * MasHub V2 - Invoices Module Type Definitions
 *
 * Comprehensive type system for invoice management with multi-currency support,
 * recurring invoices, templates, and integration with Finance, Services, and Products modules
 */

// ==================== STATUS & ENUM TYPES ====================

export type InvoiceStatus =
  | 'draft'        // Being created, not sent
  | 'sent'         // Sent to client
  | 'viewed'       // Client viewed the invoice
  | 'partial'      // Partially paid
  | 'paid'         // Fully paid
  | 'overdue'      // Past due date
  | 'cancelled'    // Cancelled
  | 'refunded'     // Payment refunded

export type InvoiceType =
  | 'standard'     // Regular invoice
  | 'recurring'    // Part of recurring series
  | 'credit_note'  // Credit note/refund
  | 'proforma'     // Proforma/quote
  | 'milestone'    // Project milestone invoice
  | 'retainer'     // Retainer invoice

export type LineItemType =
  | 'service'      // Service item
  | 'product'      // Product item
  | 'expense'      // Reimbursable expense
  | 'discount'     // Discount line
  | 'fee'          // Additional fee
  | 'custom'       // Custom line item

export type PaymentTerms =
  | 'due_on_receipt'
  | 'net_7'
  | 'net_15'
  | 'net_30'
  | 'net_45'
  | 'net_60'
  | 'net_90'
  | 'custom'

export type RecurringFrequency =
  | 'weekly'
  | 'bi_weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual'
  | 'custom'

export type TaxType =
  | 'vat'          // Value Added Tax
  | 'gst'          // Goods and Services Tax
  | 'sales_tax'    // Sales Tax
  | 'withholding'  // Withholding Tax
  | 'none'

// ==================== MAIN INVOICE INTERFACE ====================

export interface Invoice {
  id: string
  tenantId: string

  // Invoice Identification
  invoiceNumber: string              // INV-2024-001
  displayNumber?: string             // Custom display number
  type: InvoiceType
  status: InvoiceStatus

  // Client Information
  clientId: string
  clientName: string
  clientEmail?: string
  clientAddress?: Address
  clientTaxId?: string

  // Billing & Shipping
  billingAddress: Address
  shippingAddress?: Address

  // References
  projectId?: string
  projectName?: string
  serviceDeliveryId?: string         // Link to service delivery
  productOrderId?: string            // Link to product order
  subscriptionId?: string            // Link to subscription
  purchaseOrderNumber?: string       // Client's PO number
  referenceNumber?: string           // Custom reference

  // Dates
  issueDate: string
  dueDate: string
  paidDate?: string
  cancelledDate?: string
  sentDate?: string
  viewedDate?: string
  lastReminderDate?: string

  // Line Items
  items: InvoiceLineItem[]

  // Financial Calculations
  subtotal: number                   // Sum of all line items before tax/discount
  discountAmount: number             // Total discount amount
  discountPercentage?: number        // Discount percentage if applicable
  taxAmount: number                  // Total tax amount
  shippingAmount: number             // Shipping/delivery charges
  adjustmentAmount: number           // Manual adjustments (+ or -)
  total: number                      // Final amount due

  // Currency
  currency: string                   // ISO 4217 (USD, EUR, EGP, etc.)
  exchangeRate?: number              // Exchange rate to default currency
  totalInDefaultCurrency?: number    // Converted amount

  // Payments
  paidAmount: number                 // Total amount paid
  remainingAmount: number            // Amount still due
  payments: InvoicePayment[]         // Payment history

  // Payment Terms
  paymentTerms: PaymentTerms
  customPaymentTermsDays?: number    // If payment terms is 'custom'
  lateFeePercentage?: number         // Late payment fee %
  lateFeeAmount?: number             // Calculated late fee

  // Tax Details
  taxType: TaxType
  taxRate: number                    // Tax percentage
  taxName?: string                   // Custom tax name
  isTaxInclusive: boolean            // Tax included in prices?

  // Notes & Instructions
  notes?: string                     // Public notes (shown to client)
  internalNotes?: string             // Private notes (internal only)
  termsAndConditions?: string        // T&C text
  paymentInstructions?: string       // How to pay

  // Template & Branding
  templateId?: string                // Invoice template used
  logoUrl?: string
  brandColor?: string

  // Recurring Information (if recurring invoice)
  recurringInvoiceId?: string        // Parent recurring invoice
  isRecurring: boolean
  recurringSequence?: number         // 1st, 2nd, 3rd invoice in series

  // Attachments & Documents
  attachments: InvoiceAttachment[]
  pdfUrl?: string                    // Generated PDF URL

  // Tracking & Analytics
  viewCount: number                  // Times viewed by client
  remindersSent: number              // Number of reminders sent

  // Approval Workflow
  requiresApproval: boolean
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string

  // Audit
  createdBy: string
  createdByName: string
  updatedBy?: string
  updatedByName?: string
  createdAt: string
  updatedAt: string
}

// ==================== LINE ITEM INTERFACE ====================

export interface InvoiceLineItem {
  id: string
  invoiceId: string

  // Item Details
  type: LineItemType
  description: string
  longDescription?: string

  // Product/Service Reference
  productId?: string
  productName?: string
  productSku?: string
  serviceId?: string
  serviceName?: string

  // Quantity & Pricing
  quantity: number
  unitPrice: number
  unit?: string                      // 'hours', 'units', 'items', etc.

  // Discount (item-level)
  discountAmount?: number
  discountPercentage?: number

  // Tax (item-level)
  taxable: boolean
  taxRate?: number
  taxAmount?: number

  // Calculated
  subtotal: number                   // quantity * unitPrice
  total: number                      // subtotal - discount + tax

  // Additional Info
  order: number                      // Display order
  notes?: string
}

// ==================== PAYMENT INTERFACE ====================

export interface InvoicePayment {
  id: string
  invoiceId: string
  tenantId: string

  // Payment Details
  amount: number
  currency: string
  paymentDate: string

  // Payment Method
  paymentMethod: string              // 'credit_card', 'bank_transfer', 'cash', etc.
  paymentMethodDetails?: string      // Last 4 digits, check number, etc.

  // Transaction Reference
  transactionId?: string             // Payment processor transaction ID
  financeTransactionId?: string      // Link to Finance module transaction
  receiptNumber?: string

  // Notes
  notes?: string
  internalNotes?: string

  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded'

  // Audit
  recordedBy: string
  recordedByName: string
  createdAt: string
  updatedAt?: string
}

// ==================== RECURRING INVOICE INTERFACE ====================

export interface RecurringInvoice {
  id: string
  tenantId: string

  // Template Info
  templateName: string
  description?: string

  // Client
  clientId: string
  clientName: string

  // Schedule
  frequency: RecurringFrequency
  customFrequencyDays?: number       // If frequency is 'custom'
  startDate: string
  endDate?: string                   // null = indefinite
  nextInvoiceDate: string
  lastInvoiceDate?: string

  // Generation Settings
  autoSend: boolean                  // Automatically send when generated
  autoCharge: boolean                // Automatically charge (if payment method on file)
  generateDaysBefore: number         // Generate X days before due

  // Invoice Template
  items: InvoiceLineItem[]           // Template line items
  paymentTerms: PaymentTerms
  currency: string
  taxRate: number
  taxType: TaxType
  notes?: string
  termsAndConditions?: string

  // Status
  isActive: boolean
  isPaused: boolean
  pausedAt?: string
  pausedReason?: string

  // History
  totalInvoicesGenerated: number
  generatedInvoices: string[]        // Invoice IDs
  totalRevenue: number

  // Audit
  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt?: string
}

// ==================== INVOICE TEMPLATE INTERFACE ====================

export interface InvoiceTemplate {
  id: string
  tenantId: string

  // Template Info
  name: string
  description?: string
  isDefault: boolean

  // Design Settings
  logoUrl?: string
  brandColor?: string
  headerText?: string
  footerText?: string

  // Layout Settings
  showItemThumbnails: boolean
  showItemSku: boolean
  showItemNotes: boolean
  columnLayout: 'description-price' | 'item-quantity-price' | 'detailed'

  // Default Content
  defaultPaymentTerms: PaymentTerms
  defaultNotes?: string
  defaultTermsAndConditions?: string
  defaultPaymentInstructions?: string

  // Default Tax Settings
  defaultTaxRate: number
  defaultTaxType: TaxType

  // Features
  showPaymentLink: boolean
  showDownloadLink: boolean
  enableOnlinePayment: boolean

  // Usage
  timesUsed: number
  lastUsedAt?: string

  // Status
  isActive: boolean

  // Audit
  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt?: string
}

// ==================== SUPPORT INTERFACES ====================

export interface Address {
  street?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface InvoiceAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number                   // in bytes
  fileUrl: string
  uploadedBy: string
  uploadedAt: string
}

export interface InvoiceReminder {
  id: string
  invoiceId: string

  sentDate: string
  sentBy: string
  sentTo: string                     // Email address

  reminderType: 'before_due' | 'on_due' | 'after_due' | 'custom'
  daysOffset: number                 // Days before/after due date

  subject: string
  message: string

  wasSent: boolean
  sentAt?: string
  error?: string
}

// ==================== ANALYTICS INTERFACES ====================

export interface InvoiceAnalytics {
  tenantId: string
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
  startDate: string
  endDate: string

  // Totals
  totalInvoices: number
  totalRevenue: number
  totalPaid: number
  totalOutstanding: number
  totalOverdue: number

  // By Status
  invoicesByStatus: {
    draft: number
    sent: number
    paid: number
    overdue: number
    cancelled: number
  }

  // Financial Metrics
  averageInvoiceValue: number
  averagePaymentTime: number         // Days
  collectionRate: number             // Percentage of invoices paid
  onTimePaymentRate: number          // Percentage paid by due date

  // Top Clients
  topClientsByRevenue: {
    clientId: string
    clientName: string
    revenue: number
    invoiceCount: number
  }[]

  // Trends
  revenueByMonth: {
    month: string
    revenue: number
    invoiceCount: number
  }[]

  outstandingByAge: {
    current: number                  // 0-30 days
    days30to60: number
    days60to90: number
    over90days: number
  }
}

export interface InvoiceReport {
  id: string
  tenantId: string

  reportType: 'aging' | 'revenue' | 'client_statement' | 'tax_summary' | 'custom'
  name: string
  description?: string

  // Filters
  filters: {
    startDate?: string
    endDate?: string
    clientIds?: string[]
    projectIds?: string[]
    status?: InvoiceStatus[]
    currency?: string
  }

  // Report Data
  data: any                          // Flexible data structure
  summary: ReportSummary

  // Generation
  generatedBy: string
  generatedByName: string
  generatedAt: string
  fileUrl?: string                   // PDF/Excel export
}

export interface ReportSummary {
  totalInvoices: number
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
  currency: string
}

// ==================== FILTER & SEARCH TYPES ====================

export interface InvoiceFilters {
  search?: string                    // Search in invoice number, client name
  status?: InvoiceStatus[]
  type?: InvoiceType[]
  clientIds?: string[]
  projectIds?: string[]
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  currency?: string
  isOverdue?: boolean
  isPaid?: boolean
  hasDueDate?: boolean
}

export interface InvoiceSortOptions {
  sortBy: 'invoiceNumber' | 'issueDate' | 'dueDate' | 'total' | 'status' | 'clientName'
  sortOrder: 'asc' | 'desc'
}

// ==================== UTILITY TYPES ====================

export interface InvoiceSummary {
  id: string
  invoiceNumber: string
  clientName: string
  total: number
  currency: string
  status: InvoiceStatus
  dueDate: string
  isOverdue: boolean
}

export interface InvoiceCalculation {
  subtotal: number
  discountAmount: number
  taxAmount: number
  shippingAmount: number
  adjustmentAmount: number
  total: number
  paidAmount: number
  remainingAmount: number
}

export interface InvoiceValidation {
  isValid: boolean
  errors: {
    field: string
    message: string
  }[]
  warnings: {
    field: string
    message: string
  }[]
}

// ==================== INTEGRATION TYPES ====================

export interface ServiceDeliveryInvoiceData {
  deliveryId: string
  serviceId: string
  serviceName: string
  clientId: string
  hoursSpent?: number
  costPerHour?: number
  fixedPrice?: number
  description: string
}

export interface ProductOrderInvoiceData {
  orderId: string
  clientId: string
  items: {
    productId: string
    productName: string
    productSku: string
    quantity: number
    unitPrice: number
  }[]
  shippingAmount: number
}

export interface SubscriptionInvoiceData {
  subscriptionId: string
  serviceId: string
  serviceName: string
  clientId: string
  billingCycle: string
  amount: number
  periodStart: string
  periodEnd: string
}

export interface ProjectInvoiceData {
  projectId: string
  projectName: string
  clientId: string
  milestoneId?: string
  milestoneName?: string
  timeEntries?: {
    userId: string
    userName: string
    hours: number
    rate: number
  }[]
  expenses?: {
    description: string
    amount: number
  }[]
}
