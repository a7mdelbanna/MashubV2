/**
 * MasHub V2 - Finance Utility Functions
 *
 * Core utility functions for finance calculations, FX conversions,
 * formatting, and validation
 */

import { Currency, ExchangeRate, FXSnapshot, MoneyAmount } from '@/types/finance'

// ==================== CURRENCY FORMATTING ====================

/**
 * Format amount with currency symbol
 * @param amount - The amount to format
 * @param currency - Currency code (USD, EUR, EGP, etc.)
 * @param symbolPosition - 'before' or 'after'
 * @param symbol - Currency symbol ($, €, E£, etc.)
 * @param decimalPlaces - Number of decimal places (default: 2)
 */
export function formatCurrency(
  amount: number,
  currency: string,
  symbolPosition: 'before' | 'after' = 'before',
  symbol: string = '$',
  decimalPlaces: number = 2
): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  })

  if (symbolPosition === 'before') {
    return `${symbol}${formatted}`
  } else {
    return `${formatted}${symbol}`
  }
}

/**
 * Format amount using full currency object
 */
export function formatWithCurrency(amount: number, currency: Currency): string {
  return formatCurrency(
    amount,
    currency.code,
    currency.symbolPosition,
    currency.symbol,
    currency.decimalPlaces
  )
}

/**
 * Parse currency string to number
 * Removes currency symbols and formatting
 */
export function parseCurrencyString(value: string): number {
  // Remove all non-numeric characters except decimal point and minus sign
  const cleaned = value.replace(/[^0-9.-]/g, '')
  return parseFloat(cleaned) || 0
}

// ==================== FX CONVERSIONS ====================

/**
 * Convert amount from one currency to another using exchange rate
 * @param amount - Amount in source currency
 * @param exchangeRate - The exchange rate to use
 * @returns Converted amount in target currency
 */
export function convertCurrency(
  amount: number,
  exchangeRate: ExchangeRate | FXSnapshot
): number {
  return roundToDecimals(amount * exchangeRate.rate, 2)
}

/**
 * Convert amount to default currency using FX snapshot
 * @param amount - Amount in transaction currency
 * @param transactionCurrency - Currency of the transaction
 * @param defaultCurrency - Default currency code
 * @param fxSnapshot - FX snapshot (if different currencies)
 * @returns Amount in default currency
 */
export function toDefaultCurrency(
  amount: number,
  transactionCurrency: string,
  defaultCurrency: string,
  fxSnapshot?: FXSnapshot
): number {
  // If same currency, no conversion needed
  if (transactionCurrency === defaultCurrency) {
    return amount
  }

  // Must have FX snapshot for conversion
  if (!fxSnapshot) {
    throw new Error('FX snapshot required for currency conversion')
  }

  return convertCurrency(amount, fxSnapshot)
}

/**
 * Create FX snapshot from exchange rate
 * IMMUTABLE: Once created, this snapshot should never change
 */
export function createFXSnapshot(
  exchangeRate: ExchangeRate
): FXSnapshot {
  return {
    baseCurrency: exchangeRate.baseCurrency,
    targetCurrency: exchangeRate.targetCurrency,
    rate: exchangeRate.rate,
    source: exchangeRate.source,
    timestamp: new Date(exchangeRate.timestamp)
  }
}

// ==================== DECIMAL PRECISION ====================

/**
 * Round to specified decimal places
 * Uses banker's rounding (round half to even)
 */
export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Round to currency-specific decimal places
 */
export function roundToCurrency(value: number, currency: Currency): number {
  return roundToDecimals(value, currency.decimalPlaces)
}

// ==================== MONEY CALCULATIONS ====================

/**
 * Add multiple money amounts
 * All amounts must be in the same currency
 */
export function addAmounts(...amounts: number[]): number {
  return roundToDecimals(
    amounts.reduce((sum, amount) => sum + amount, 0),
    2
  )
}

/**
 * Subtract amount
 */
export function subtractAmounts(base: number, ...subtracts: number[]): number {
  return roundToDecimals(
    subtracts.reduce((result, amount) => result - amount, base),
    2
  )
}

/**
 * Calculate percentage of amount
 * @param amount - Base amount
 * @param percentage - Percentage (e.g., 15 for 15%)
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return roundToDecimals((amount * percentage) / 100, 2)
}

/**
 * Calculate percentage change
 * @param oldValue - Previous value
 * @param newValue - Current value
 * @returns Percentage change (positive or negative)
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100
  return roundToDecimals(((newValue - oldValue) / Math.abs(oldValue)) * 100, 1)
}

// ==================== TAX CALCULATIONS ====================

/**
 * Calculate tax amount
 * @param subtotal - Amount before tax
 * @param taxRate - Tax rate percentage (e.g., 14 for 14% VAT)
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return calculatePercentage(subtotal, taxRate)
}

/**
 * Calculate amount with tax included
 */
export function addTax(subtotal: number, taxRate: number): number {
  return addAmounts(subtotal, calculateTax(subtotal, taxRate))
}

/**
 * Calculate amount before tax (reverse calculation)
 * @param totalWithTax - Amount including tax
 * @param taxRate - Tax rate percentage
 */
export function removeTax(totalWithTax: number, taxRate: number): number {
  return roundToDecimals(totalWithTax / (1 + taxRate / 100), 2)
}

// ==================== ACCOUNT BALANCE CALCULATIONS ====================

/**
 * Calculate net balance change for a transaction
 * Positive for income, negative for expense
 */
export function getBalanceChange(
  type: 'income' | 'expense' | 'transfer',
  amount: number,
  accountType: 'source' | 'destination'
): number {
  if (type === 'income') {
    return amount // Increases balance
  } else if (type === 'expense') {
    return -amount // Decreases balance
  } else {
    // Transfer
    return accountType === 'source' ? -amount : amount
  }
}

/**
 * Calculate account balance from transactions
 * @param initialBalance - Starting balance
 * @param transactions - Array of {type, amount} objects
 */
export function calculateAccountBalance(
  initialBalance: number,
  transactions: Array<{ type: 'income' | 'expense'; amount: number }>
): number {
  const balance = transactions.reduce((acc, txn) => {
    const change = getBalanceChange(txn.type, txn.amount, 'source')
    return acc + change
  }, initialBalance)

  return roundToDecimals(balance, 2)
}

// ==================== CATEGORY PATH UTILITIES ====================

/**
 * Build materialized category path
 * Example: "Expense/Office/Rent/Cairo HQ"
 */
export function buildCategoryPath(
  categoryName: string,
  parentPath?: string
): string {
  if (!parentPath) {
    return categoryName
  }
  return `${parentPath}/${categoryName}`
}

/**
 * Parse category path into breadcrumbs
 */
export function parseCategoryPath(path: string): string[] {
  return path.split('/').filter(Boolean)
}

/**
 * Get category level from path
 * Root = 0, first level = 1, etc.
 */
export function getCategoryLevel(path: string): number {
  if (!path) return 0
  return parseCategoryPath(path).length - 1
}

/**
 * Get parent path from category path
 */
export function getParentPath(path: string): string | null {
  const parts = parseCategoryPath(path)
  if (parts.length <= 1) return null
  return parts.slice(0, -1).join('/')
}

// ==================== DATE UTILITIES ====================

/**
 * Calculate next occurrence date for recurring items
 */
export function calculateNextOccurrence(
  currentDate: Date,
  frequency: string,
  interval: number = 1
): Date {
  const next = new Date(currentDate)

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + interval)
      break
    case 'weekly':
      next.setDate(next.getDate() + (7 * interval))
      break
    case 'bi-weekly':
      next.setDate(next.getDate() + 14)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + interval)
      break
    case 'quarterly':
      next.setMonth(next.getMonth() + (3 * interval))
      break
    case 'semi-annually':
      next.setMonth(next.getMonth() + 6)
      break
    case 'annually':
      next.setFullYear(next.getFullYear() + interval)
      break
  }

  return next
}

/**
 * Check if date is within range
 */
export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date
): boolean {
  const timestamp = date.getTime()
  return timestamp >= startDate.getTime() && timestamp <= endDate.getTime()
}

/**
 * Format date for display
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// ==================== VALIDATION ====================

/**
 * Validate amount is positive
 */
export function isValidAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0 && isFinite(amount)
}

/**
 * Validate exchange rate
 */
export function isValidExchangeRate(rate: number): boolean {
  return !isNaN(rate) && rate > 0 && isFinite(rate)
}

/**
 * Validate currency code (ISO 4217)
 */
export function isValidCurrencyCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code)
}

/**
 * Validate IBAN (basic check)
 */
export function isValidIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleaned = iban.replace(/\s/g, '').toUpperCase()
  // Basic IBAN format check (2 letters + 2 digits + up to 30 chars)
  return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(cleaned)
}

// ==================== REPORTING HELPERS ====================

/**
 * Group transactions by period
 */
export function groupByPeriod(
  transactions: Array<{ date: Date; amount: number }>,
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
): Record<string, number> {
  const grouped: Record<string, number> = {}

  transactions.forEach(txn => {
    const key = getPeriodKey(txn.date, period)
    grouped[key] = (grouped[key] || 0) + txn.amount
  })

  return grouped
}

/**
 * Get period key for grouping
 */
function getPeriodKey(
  date: Date,
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  switch (period) {
    case 'day':
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    case 'week':
      const week = getWeekNumber(date)
      return `${year}-W${String(week).padStart(2, '0')}`
    case 'month':
      return `${year}-${String(month).padStart(2, '0')}`
    case 'quarter':
      const quarter = Math.floor((month - 1) / 3) + 1
      return `${year}-Q${quarter}`
    case 'year':
      return String(year)
  }
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Calculate budget utilization percentage
 */
export function calculateBudgetUtilization(
  spent: number,
  budget: number
): number {
  if (budget === 0) return 0
  return roundToDecimals((spent / budget) * 100, 1)
}

/**
 * Determine budget health status
 */
export function getBudgetStatus(
  spent: number,
  budget: number
): 'healthy' | 'warning' | 'exceeded' {
  const percentage = calculateBudgetUtilization(spent, budget)

  if (percentage > 100) return 'exceeded'
  if (percentage > 85) return 'warning'
  return 'healthy'
}

// ==================== FX EXPOSURE CALCULATIONS ====================

/**
 * Calculate FX exposure for an account in non-default currency
 */
export function calculateFXExposure(
  balance: number,
  accountCurrency: string,
  defaultCurrency: string,
  currentRate: number,
  originalRate?: number
): {
  balance: number
  balanceInDefaultCurrency: number
  exposureAmount: number // Unrealized gain/loss
  exposurePercentage: number
} {
  const balanceInDefault = roundToDecimals(balance * currentRate, 2)
  const originalBalanceInDefault = originalRate
    ? roundToDecimals(balance * originalRate, 2)
    : balanceInDefault

  const exposureAmount = balanceInDefault - originalBalanceInDefault
  const exposurePercentage = originalBalanceInDefault !== 0
    ? roundToDecimals((exposureAmount / originalBalanceInDefault) * 100, 2)
    : 0

  return {
    balance,
    balanceInDefaultCurrency: balanceInDefault,
    exposureAmount,
    exposurePercentage
  }
}

// ==================== PAYMENT TERMS ====================

/**
 * Calculate due date based on payment terms
 */
export function calculateDueDate(
  invoiceDate: Date,
  paymentTerms: string
): Date {
  const dueDate = new Date(invoiceDate)

  switch (paymentTerms) {
    case 'due-on-receipt':
      // Due immediately
      break
    case 'net-15':
      dueDate.setDate(dueDate.getDate() + 15)
      break
    case 'net-30':
      dueDate.setDate(dueDate.getDate() + 30)
      break
    case 'net-45':
      dueDate.setDate(dueDate.getDate() + 45)
      break
    case 'net-60':
      dueDate.setDate(dueDate.getDate() + 60)
      break
    case 'net-90':
      dueDate.setDate(dueDate.getDate() + 90)
      break
  }

  return dueDate
}

/**
 * Check if payment is overdue
 */
export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate
}

/**
 * Calculate days overdue (negative if not yet due)
 */
export function getDaysOverdue(dueDate: Date): number {
  const today = new Date()
  const diffMs = today.getTime() - dueDate.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

// ==================== EXPORT/IMPORT HELPERS ====================

/**
 * Format money amount for CSV export
 */
export function formatForCSV(amount: number, decimals: number = 2): string {
  return amount.toFixed(decimals)
}

/**
 * Generate transaction reference number
 */
export function generateTransactionReference(
  type: 'INC' | 'EXP' | 'TRF',
  date: Date,
  sequence: number
): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const seq = String(sequence).padStart(4, '0')
  return `${type}-${year}${month}-${seq}`
}

// ==================== RECONCILIATION HELPERS ====================

/**
 * Calculate reconciliation difference
 */
export function calculateReconciliationDifference(
  statementBalance: number,
  systemBalance: number
): number {
  return roundToDecimals(statementBalance - systemBalance, 2)
}

/**
 * Check if reconciliation is balanced
 */
export function isReconciliationBalanced(
  difference: number,
  tolerance: number = 0.01
): boolean {
  return Math.abs(difference) <= tolerance
}

/**
 * Calculate reconciliation match rate
 */
export function calculateMatchRate(
  matched: number,
  total: number
): number {
  if (total === 0) return 100
  return roundToDecimals((matched / total) * 100, 1)
}
