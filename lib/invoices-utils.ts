/**
 * MasHub V2 - Invoice Utility Functions
 *
 * Comprehensive utility functions for invoice calculations, formatting,
 * status management, and business logic
 */

import type {
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
  InvoiceCalculation,
  InvoiceFilters,
  InvoicePayment,
  RecurringInvoice,
  PaymentTerms
} from '@/types/invoices'

// ==================== CALCULATION FUNCTIONS ====================

/**
 * Calculate line item total
 */
export function calculateLineItemTotal(item: InvoiceLineItem): number {
  const subtotal = item.quantity * item.unitPrice
  const discountAmount = item.discountAmount || (subtotal * (item.discountPercentage || 0) / 100)
  const afterDiscount = subtotal - discountAmount
  const taxAmount = item.taxable && item.taxRate ? (afterDiscount * item.taxRate / 100) : 0

  return afterDiscount + taxAmount
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(invoice: Pick<Invoice, 'items' | 'discountPercentage' | 'discountAmount' | 'taxRate' | 'shippingAmount' | 'adjustmentAmount' | 'isTaxInclusive'>): InvoiceCalculation {
  // Calculate subtotal from line items
  const subtotal = invoice.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice)
  }, 0)

  // Calculate discount
  let discountAmount = invoice.discountAmount || 0
  if (invoice.discountPercentage) {
    discountAmount = subtotal * (invoice.discountPercentage / 100)
  }

  const afterDiscount = subtotal - discountAmount

  // Calculate tax
  const taxableAmount = invoice.isTaxInclusive ? afterDiscount / (1 + invoice.taxRate / 100) : afterDiscount
  const taxAmount = invoice.isTaxInclusive ? afterDiscount - taxableAmount : taxableAmount * (invoice.taxRate / 100)

  // Calculate total
  const shippingAmount = invoice.shippingAmount || 0
  const adjustmentAmount = invoice.adjustmentAmount || 0

  const total = invoice.isTaxInclusive
    ? afterDiscount + shippingAmount + adjustmentAmount
    : afterDiscount + taxAmount + shippingAmount + adjustmentAmount

  return {
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    adjustmentAmount,
    total,
    paidAmount: 0,
    remainingAmount: total
  }
}

/**
 * Calculate remaining amount after payments
 */
export function calculateRemainingAmount(total: number, payments: InvoicePayment[]): number {
  const paidAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return Math.max(0, total - paidAmount)
}

/**
 * Calculate payment status
 */
export function calculatePaymentStatus(total: number, paidAmount: number): 'unpaid' | 'partial' | 'paid' {
  if (paidAmount === 0) return 'unpaid'
  if (paidAmount >= total) return 'paid'
  return 'partial'
}

/**
 * Calculate late fee
 */
export function calculateLateFee(
  total: number,
  dueDate: string,
  lateFeePercentage: number = 0
): number {
  if (!lateFeePercentage || lateFeePercentage === 0) return 0

  const now = new Date()
  const due = new Date(dueDate)

  if (now <= due) return 0

  return total * (lateFeePercentage / 100)
}

// ==================== STATUS & VALIDATION FUNCTIONS ====================

/**
 * Determine invoice status
 */
export function determineInvoiceStatus(
  currentStatus: InvoiceStatus,
  dueDate: string,
  total: number,
  paidAmount: number,
  sentDate?: string
): InvoiceStatus {
  // Manual statuses that override auto-calculation
  if (currentStatus === 'cancelled' || currentStatus === 'refunded' || currentStatus === 'draft') {
    return currentStatus
  }

  // Check payment status
  if (paidAmount >= total) {
    return 'paid'
  }

  if (paidAmount > 0 && paidAmount < total) {
    // Check if overdue
    if (new Date() > new Date(dueDate)) {
      return 'overdue'
    }
    return 'partial'
  }

  // Check if overdue
  if (new Date() > new Date(dueDate)) {
    return 'overdue'
  }

  // Check if sent/viewed
  if (sentDate) {
    return currentStatus === 'viewed' ? 'viewed' : 'sent'
  }

  return 'draft'
}

/**
 * Check if invoice is overdue
 */
export function isInvoiceOverdue(dueDate: string, status: InvoiceStatus): boolean {
  if (status === 'paid' || status === 'cancelled' || status === 'refunded') {
    return false
  }

  return new Date() > new Date(dueDate)
}

/**
 * Get days until due (negative if overdue)
 */
export function getDaysUntilDue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = due.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Get days overdue (0 if not overdue)
 */
export function getDaysOverdue(dueDate: string, status: InvoiceStatus): number {
  if (!isInvoiceOverdue(dueDate, status)) return 0

  const days = getDaysUntilDue(dueDate)
  return Math.abs(days)
}

/**
 * Validate invoice data
 */
export function validateInvoice(invoice: Partial<Invoice>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!invoice.clientId) errors.push('Client is required')
  if (!invoice.issueDate) errors.push('Issue date is required')
  if (!invoice.dueDate) errors.push('Due date is required')
  if (!invoice.items || invoice.items.length === 0) errors.push('At least one line item is required')
  if (invoice.items?.some(item => item.quantity <= 0)) errors.push('All items must have quantity > 0')
  if (invoice.items?.some(item => item.unitPrice < 0)) errors.push('Unit prices cannot be negative')
  if (!invoice.currency) errors.push('Currency is required')

  // Validate dates
  if (invoice.issueDate && invoice.dueDate) {
    if (new Date(invoice.dueDate) < new Date(invoice.issueDate)) {
      errors.push('Due date cannot be before issue date')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// ==================== FORMATTING FUNCTIONS ====================

/**
 * Format invoice number
 */
export function formatInvoiceNumber(number: number, prefix: string = 'INV', year?: number): string {
  const y = year || new Date().getFullYear()
  return `${prefix}-${y}-${String(number).padStart(4, '0')}`
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date: string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format short date
 */
export function formatShortDate(date: string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get status display info
 */
export function getStatusDisplay(status: InvoiceStatus): { color: string; label: string; bgColor: string } {
  const displays = {
    draft: { color: 'text-gray-400', bgColor: 'bg-gray-500/20', label: 'Draft' },
    sent: { color: 'text-blue-400', bgColor: 'bg-blue-500/20', label: 'Sent' },
    viewed: { color: 'text-purple-400', bgColor: 'bg-purple-500/20', label: 'Viewed' },
    partial: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', label: 'Partially Paid' },
    paid: { color: 'text-green-400', bgColor: 'bg-green-500/20', label: 'Paid' },
    overdue: { color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'Overdue' },
    cancelled: { color: 'text-gray-400', bgColor: 'bg-gray-500/20', label: 'Cancelled' },
    refunded: { color: 'text-orange-400', bgColor: 'bg-orange-500/20', label: 'Refunded' }
  }

  return displays[status] || displays.draft
}

/**
 * Format payment terms
 */
export function formatPaymentTerms(terms: PaymentTerms, customDays?: number): string {
  const termsLabels: Record<PaymentTerms, string> = {
    due_on_receipt: 'Due on Receipt',
    net_7: 'Net 7 Days',
    net_15: 'Net 15 Days',
    net_30: 'Net 30 Days',
    net_45: 'Net 45 Days',
    net_60: 'Net 60 Days',
    net_90: 'Net 90 Days',
    custom: customDays ? `Net ${customDays} Days` : 'Custom Terms'
  }

  return termsLabels[terms]
}

// ==================== FILTER & SORT FUNCTIONS ====================

/**
 * Filter invoices
 */
export function filterInvoices(invoices: Invoice[], filters: InvoiceFilters): Invoice[] {
  return invoices.filter(invoice => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(search) ||
        invoice.clientName.toLowerCase().includes(search) ||
        invoice.projectName?.toLowerCase().includes(search)

      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(invoice.status)) return false
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(invoice.type)) return false
    }

    // Client filter
    if (filters.clientIds && filters.clientIds.length > 0) {
      if (!filters.clientIds.includes(invoice.clientId)) return false
    }

    // Project filter
    if (filters.projectIds && filters.projectIds.length > 0) {
      if (!invoice.projectId || !filters.projectIds.includes(invoice.projectId)) return false
    }

    // Date range filter
    if (filters.startDate) {
      if (new Date(invoice.issueDate) < new Date(filters.startDate)) return false
    }
    if (filters.endDate) {
      if (new Date(invoice.issueDate) > new Date(filters.endDate)) return false
    }

    // Amount range filter
    if (filters.minAmount !== undefined) {
      if (invoice.total < filters.minAmount) return false
    }
    if (filters.maxAmount !== undefined) {
      if (invoice.total > filters.maxAmount) return false
    }

    // Currency filter
    if (filters.currency) {
      if (invoice.currency !== filters.currency) return false
    }

    // Overdue filter
    if (filters.isOverdue !== undefined) {
      const overdue = isInvoiceOverdue(invoice.dueDate, invoice.status)
      if (filters.isOverdue !== overdue) return false
    }

    // Paid filter
    if (filters.isPaid !== undefined) {
      const paid = invoice.status === 'paid'
      if (filters.isPaid !== paid) return false
    }

    return true
  })
}

/**
 * Sort invoices
 */
export function sortInvoices(invoices: Invoice[], sortBy: string, sortOrder: 'asc' | 'desc'): Invoice[] {
  const sorted = [...invoices].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'invoiceNumber':
        comparison = a.invoiceNumber.localeCompare(b.invoiceNumber)
        break
      case 'issueDate':
        comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
        break
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        break
      case 'total':
        comparison = a.total - b.total
        break
      case 'clientName':
        comparison = a.clientName.localeCompare(b.clientName)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      default:
        comparison = 0
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sorted
}

// ==================== RECURRING INVOICE FUNCTIONS ====================

/**
 * Calculate next invoice date for recurring invoice
 */
export function calculateNextInvoiceDate(lastDate: string, frequency: RecurringInvoice['frequency'], customDays?: number): string {
  const date = new Date(lastDate)

  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'bi_weekly':
      date.setDate(date.getDate() + 14)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'quarterly':
      date.setMonth(date.getMonth() + 3)
      break
    case 'semi_annual':
      date.setMonth(date.getMonth() + 6)
      break
    case 'annual':
      date.setFullYear(date.getFullYear() + 1)
      break
    case 'custom':
      if (customDays) {
        date.setDate(date.getDate() + customDays)
      }
      break
  }

  return date.toISOString().split('T')[0]
}

/**
 * Check if recurring invoice should generate next invoice
 */
export function shouldGenerateRecurringInvoice(recurring: RecurringInvoice, currentDate: Date = new Date()): boolean {
  if (!recurring.isActive || recurring.isPaused) return false

  if (recurring.endDate && new Date(recurring.endDate) < currentDate) return false

  const nextDate = new Date(recurring.nextInvoiceDate)
  const generateDate = new Date(nextDate)
  generateDate.setDate(generateDate.getDate() - recurring.generateDaysBefore)

  return currentDate >= generateDate
}

// ==================== STATISTICS & ANALYTICS FUNCTIONS ====================

/**
 * Calculate invoice statistics
 */
export function calculateInvoiceStatistics(invoices: Invoice[]) {
  const total = invoices.length
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0)
  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0)
  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.remainingAmount, 0)

  const byStatus = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const averageValue = total > 0 ? totalRevenue / total : 0

  const paidInvoices = invoices.filter(inv => inv.paidDate)
  const averagePaymentTime = paidInvoices.length > 0
    ? paidInvoices.reduce((sum, inv) => {
        const issued = new Date(inv.issueDate).getTime()
        const paid = new Date(inv.paidDate!).getTime()
        return sum + (paid - issued) / (1000 * 60 * 60 * 24)
      }, 0) / paidInvoices.length
    : 0

  return {
    total,
    totalRevenue,
    totalPaid,
    totalOutstanding,
    totalOverdue,
    byStatus,
    averageValue,
    averagePaymentTime: Math.round(averagePaymentTime)
  }
}

/**
 * Get aging buckets for outstanding invoices
 */
export function getAgingBuckets(invoices: Invoice[]) {
  const outstanding = invoices.filter(inv =>
    inv.status !== 'paid' && inv.status !== 'cancelled' && inv.status !== 'refunded'
  )

  const buckets = {
    current: 0,      // 0-30 days
    days30to60: 0,   // 30-60 days
    days60to90: 0,   // 60-90 days
    over90days: 0    // 90+ days
  }

  outstanding.forEach(inv => {
    const daysOld = Math.abs(getDaysUntilDue(inv.dueDate))
    const amount = inv.remainingAmount

    if (daysOld <= 30) {
      buckets.current += amount
    } else if (daysOld <= 60) {
      buckets.days30to60 += amount
    } else if (daysOld <= 90) {
      buckets.days60to90 += amount
    } else {
      buckets.over90days += amount
    }
  })

  return buckets
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(lastNumber: number, prefix: string = 'INV'): string {
  return formatInvoiceNumber(lastNumber + 1, prefix)
}

/**
 * Calculate due date based on payment terms
 */
export function calculateDueDate(issueDate: string, paymentTerms: PaymentTerms, customDays?: number): string {
  const date = new Date(issueDate)

  const daysMap: Record<PaymentTerms, number> = {
    due_on_receipt: 0,
    net_7: 7,
    net_15: 15,
    net_30: 30,
    net_45: 45,
    net_60: 60,
    net_90: 90,
    custom: customDays || 30
  }

  date.setDate(date.getDate() + daysMap[paymentTerms])
  return date.toISOString().split('T')[0]
}

/**
 * Get invoice summary for quick display
 */
export function getInvoiceSummary(invoice: Invoice): string {
  const status = getStatusDisplay(invoice.status)
  const amount = formatCurrency(invoice.total, invoice.currency)
  const dueIn = getDaysUntilDue(invoice.dueDate)

  if (invoice.status === 'paid') {
    return `${amount} - Paid`
  }

  if (invoice.status === 'overdue') {
    return `${amount} - Overdue by ${Math.abs(dueIn)} days`
  }

  return `${amount} - Due in ${dueIn} days`
}
