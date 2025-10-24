import { SelectOption } from '@/components/ui/select'

/**
 * Common dropdown options used across the application
 * Centralized for consistency and easy maintenance
 */

// Currency Options
export const currencyOptions: SelectOption[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' }
]

// Payment Terms
export const paymentTermsOptions: SelectOption[] = [
  { value: 'due-on-receipt', label: 'Due on Receipt' },
  { value: 'net-15', label: 'Net 15' },
  { value: 'net-30', label: 'Net 30' },
  { value: 'net-45', label: 'Net 45' },
  { value: 'net-60', label: 'Net 60' },
  { value: 'net-90', label: 'Net 90' },
  { value: 'custom', label: 'Custom' }
]

// Billing Cycles
export const billingCycleOptions: SelectOption[] = [
  { value: 'one-time', label: 'One-time Payment' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi-annually', label: 'Semi-annually' },
  { value: 'annually', label: 'Annually' }
]

// Time Unit Options
export const timeUnitOptions: SelectOption[] = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' }
]

// Duration Units (subset of time units)
export const durationUnitOptions: SelectOption[] = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' }
]

// Status Options - Generic
export const statusOptions: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Invoice Status
export const invoiceStatusOptions: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Project Status
export const projectStatusOptions: SelectOption[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'review', label: 'Under Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Priority Levels
export const priorityOptions: SelectOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
]

// Industries
export const industryOptions: SelectOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'construction', label: 'Construction' },
  { value: 'logistics', label: 'Logistics & Transportation' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'non-profit', label: 'Non-profit' },
  { value: 'other', label: 'Other' }
]

// Company Size
export const companySizeOptions: SelectOption[] = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
]

// Communication Methods
export const communicationMethodOptions: SelectOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'video-call', label: 'Video Call' },
  { value: 'in-person', label: 'In-person' },
  { value: 'slack', label: 'Slack' },
  { value: 'teams', label: 'Microsoft Teams' }
]

// Languages
export const languageOptions: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' }
]

// Timezones (Common ones)
export const timezoneOptions: SelectOption[] = [
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' }
]

// Service Categories
export const serviceCategoryOptions: SelectOption[] = [
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Content Creation', label: 'Content Creation' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Cloud Services', label: 'Cloud Services' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Custom Software', label: 'Custom Software' }
]

// Service Types
export const serviceTypeOptions: SelectOption[] = [
  { value: 'project', label: 'One-time Project' },
  { value: 'recurring', label: 'Recurring Service' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'retainer', label: 'Retainer' },
  { value: 'support', label: 'Support & Maintenance' }
]

// Pricing Models
export const pricingModelOptions: SelectOption[] = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'milestone', label: 'Milestone-based' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'usage-based', label: 'Usage-based' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'custom', label: 'Custom' }
]

// Product Categories
export const productCategoryOptions: SelectOption[] = [
  { value: 'saas', label: 'SaaS Product' },
  { value: 'software', label: 'Software License' },
  { value: 'plugin', label: 'Plugin/Extension' },
  { value: 'template', label: 'Template/Theme' },
  { value: 'api', label: 'API Access' },
  { value: 'service', label: 'Service' },
  { value: 'physical', label: 'Physical Product' },
  { value: 'digital', label: 'Digital Download' }
]

// Discount Types
export const discountTypeOptions: SelectOption[] = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed Amount' }
]

// Date Range Filters
export const dateRangeOptions: SelectOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'this-year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
]

// Sort Orders
export const sortOrderOptions: SelectOption[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'amount-high', label: 'Amount (High to Low)' },
  { value: 'amount-low', label: 'Amount (Low to High)' }
]

// Visit Duration Options
export const visitDurationOptions: SelectOption[] = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' },
  { value: '240', label: '4 hours' },
  { value: '480', label: 'Half day (4-5 hours)' },
  { value: '960', label: 'Full day (8 hours)' }
]

// Notification Frequencies
export const notificationFrequencyOptions: SelectOption[] = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Hourly Digest' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Digest' },
  { value: 'never', label: 'Never' }
]

// ==========================================================
// FINANCE MODULE OPTIONS
// ==========================================================

// Account Types
export const accountTypeOptions: SelectOption[] = [
  { value: 'bank', label: 'Bank Account' },
  { value: 'cash', label: 'Cash' },
  { value: 'psp-stripe', label: 'Stripe' },
  { value: 'psp-paymob', label: 'Paymob' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'investment', label: 'Investment Account' },
  { value: 'loan', label: 'Loan Account' },
  { value: 'credit-card', label: 'Credit Card' }
]

// Payment Method Types
export const paymentMethodTypeOptions: SelectOption[] = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paymob', label: 'Paymob' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Other' }
]

// Contact Types
export const contactTypeOptions: SelectOption[] = [
  { value: 'vendor', label: 'Vendor / Supplier' },
  { value: 'client', label: 'Client / Customer' },
  { value: 'partner', label: 'Business Partner' },
  { value: 'employee', label: 'Employee' },
  { value: 'landlord', label: 'Landlord' },
  { value: 'government', label: 'Government / Tax Authority' },
  { value: 'other', label: 'Other' }
]

// Transaction Types
export const transactionTypeOptions: SelectOption[] = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' }
]

// Transaction States
export const transactionStateOptions: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending-approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'posted', label: 'Posted' },
  { value: 'void', label: 'Void' },
  { value: 'rejected', label: 'Rejected' }
]

// Category Types
export const categoryTypeOptions: SelectOption[] = [
  { value: 'income', label: 'Income Category' },
  { value: 'expense', label: 'Expense Category' }
]

// Recurring Frequencies
export const recurringFrequencyOptions: SelectOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly (Every 2 weeks)' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly (Every 3 months)' },
  { value: 'semi-annually', label: 'Semi-annually (Every 6 months)' },
  { value: 'annually', label: 'Annually (Yearly)' },
  { value: 'custom', label: 'Custom Interval' }
]

// Reconciliation Status
export const reconciliationStatusOptions: SelectOption[] = [
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed (Balanced)' },
  { value: 'completed-with-discrepancy', label: 'Completed with Discrepancy' },
  { value: 'abandoned', label: 'Abandoned' }
]

// Finance Roles
export const financeRoleOptions: SelectOption[] = [
  { value: 'finance-admin', label: 'Finance Admin' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'approver', label: 'Approver' },
  { value: 'viewer', label: 'Viewer (Read-only)' }
]

// Report Types
export const reportTypeOptions: SelectOption[] = [
  { value: 'balance-sheet', label: 'Balance Sheet' },
  { value: 'profit-loss', label: 'Profit & Loss Statement' },
  { value: 'cash-flow', label: 'Cash Flow Statement' },
  { value: 'budget-variance', label: 'Budget vs Actual' },
  { value: 'fx-exposure', label: 'FX Exposure Report' },
  { value: 'account-statement', label: 'Account Statement' },
  { value: 'transaction-log', label: 'Transaction Log' },
  { value: 'category-breakdown', label: 'Category Breakdown' },
  { value: 'contact-statement', label: 'Contact Statement' },
  { value: 'project-pl', label: 'Project P&L' },
  { value: 'custom', label: 'Custom Report' }
]

// Budget Period
export const budgetPeriodOptions: SelectOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' }
]

// Symbol Position
export const symbolPositionOptions: SelectOption[] = [
  { value: 'before', label: 'Before amount ($100)' },
  { value: 'after', label: 'After amount (100€)' }
]

// FX Rate Sources
export const fxRateSourceOptions: SelectOption[] = [
  { value: 'exchangerate-api', label: 'ExchangeRate-API' },
  { value: 'open-exchange-rates', label: 'Open Exchange Rates' },
  { value: 'fixer-io', label: 'Fixer.io' },
  { value: 'central-bank', label: 'Central Bank' },
  { value: 'manual', label: 'Manual Entry' }
]

// Report Grouping
export const reportGroupByOptions: SelectOption[] = [
  { value: 'day', label: 'By Day' },
  { value: 'week', label: 'By Week' },
  { value: 'month', label: 'By Month' },
  { value: 'quarter', label: 'By Quarter' },
  { value: 'year', label: 'By Year' },
  { value: 'category', label: 'By Category' },
  { value: 'contact', label: 'By Contact' },
  { value: 'project', label: 'By Project' }
]

// Popular Currencies (for quick selection)
export const popularCurrenciesOptions: SelectOption[] = [
  { value: 'USD', label: 'USD - US Dollar ($)' },
  { value: 'EUR', label: 'EUR - Euro (€)' },
  { value: 'GBP', label: 'GBP - British Pound (£)' },
  { value: 'EGP', label: 'EGP - Egyptian Pound (E£)' },
  { value: 'SAR', label: 'SAR - Saudi Riyal (﷼)' },
  { value: 'AED', label: 'AED - UAE Dirham (د.إ)' },
  { value: 'CAD', label: 'CAD - Canadian Dollar (C$)' },
  { value: 'AUD', label: 'AUD - Australian Dollar (A$)' }
]

// All World Currencies (ISO 4217)
export const allCurrenciesOptions: SelectOption[] = [
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'AFN', label: 'AFN - Afghan Afghani' },
  { value: 'ALL', label: 'ALL - Albanian Lek' },
  { value: 'AMD', label: 'AMD - Armenian Dram' },
  { value: 'ANG', label: 'ANG - Netherlands Antillean Guilder' },
  { value: 'AOA', label: 'AOA - Angolan Kwanza' },
  { value: 'ARS', label: 'ARS - Argentine Peso' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'AWG', label: 'AWG - Aruban Florin' },
  { value: 'AZN', label: 'AZN - Azerbaijani Manat' },
  { value: 'BAM', label: 'BAM - Bosnia-Herzegovina Convertible Mark' },
  { value: 'BBD', label: 'BBD - Barbadian Dollar' },
  { value: 'BDT', label: 'BDT - Bangladeshi Taka' },
  { value: 'BGN', label: 'BGN - Bulgarian Lev' },
  { value: 'BHD', label: 'BHD - Bahraini Dinar' },
  { value: 'BIF', label: 'BIF - Burundian Franc' },
  { value: 'BMD', label: 'BMD - Bermudan Dollar' },
  { value: 'BND', label: 'BND - Brunei Dollar' },
  { value: 'BOB', label: 'BOB - Bolivian Boliviano' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'BSD', label: 'BSD - Bahamian Dollar' },
  { value: 'BTC', label: 'BTC - Bitcoin' },
  { value: 'BTN', label: 'BTN - Bhutanese Ngultrum' },
  { value: 'BWP', label: 'BWP - Botswanan Pula' },
  { value: 'BYN', label: 'BYN - Belarusian Ruble' },
  { value: 'BZD', label: 'BZD - Belize Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'CDF', label: 'CDF - Congolese Franc' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CLF', label: 'CLF - Chilean Unit of Account (UF)' },
  { value: 'CLP', label: 'CLP - Chilean Peso' },
  { value: 'CNH', label: 'CNH - Chinese Yuan (Offshore)' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'COP', label: 'COP - Colombian Peso' },
  { value: 'CRC', label: 'CRC - Costa Rican Colón' },
  { value: 'CUC', label: 'CUC - Cuban Convertible Peso' },
  { value: 'CUP', label: 'CUP - Cuban Peso' },
  { value: 'CVE', label: 'CVE - Cape Verdean Escudo' },
  { value: 'CZK', label: 'CZK - Czech Republic Koruna' },
  { value: 'DJF', label: 'DJF - Djiboutian Franc' },
  { value: 'DKK', label: 'DKK - Danish Krone' },
  { value: 'DOP', label: 'DOP - Dominican Peso' },
  { value: 'DZD', label: 'DZD - Algerian Dinar' },
  { value: 'EGP', label: 'EGP - Egyptian Pound' },
  { value: 'ERN', label: 'ERN - Eritrean Nakfa' },
  { value: 'ETB', label: 'ETB - Ethiopian Birr' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'FJD', label: 'FJD - Fijian Dollar' },
  { value: 'FKP', label: 'FKP - Falkland Islands Pound' },
  { value: 'GBP', label: 'GBP - British Pound Sterling' },
  { value: 'GEL', label: 'GEL - Georgian Lari' },
  { value: 'GGP', label: 'GGP - Guernsey Pound' },
  { value: 'GHS', label: 'GHS - Ghanaian Cedi' },
  { value: 'GIP', label: 'GIP - Gibraltar Pound' },
  { value: 'GMD', label: 'GMD - Gambian Dalasi' },
  { value: 'GNF', label: 'GNF - Guinean Franc' },
  { value: 'GTQ', label: 'GTQ - Guatemalan Quetzal' },
  { value: 'GYD', label: 'GYD - Guyanaese Dollar' },
  { value: 'HKD', label: 'HKD - Hong Kong Dollar' },
  { value: 'HNL', label: 'HNL - Honduran Lempira' },
  { value: 'HRK', label: 'HRK - Croatian Kuna' },
  { value: 'HTG', label: 'HTG - Haitian Gourde' },
  { value: 'HUF', label: 'HUF - Hungarian Forint' },
  { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
  { value: 'ILS', label: 'ILS - Israeli New Sheqel' },
  { value: 'IMP', label: 'IMP - Manx pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'IQD', label: 'IQD - Iraqi Dinar' },
  { value: 'IRR', label: 'IRR - Iranian Rial' },
  { value: 'ISK', label: 'ISK - Icelandic Króna' },
  { value: 'JEP', label: 'JEP - Jersey Pound' },
  { value: 'JMD', label: 'JMD - Jamaican Dollar' },
  { value: 'JOD', label: 'JOD - Jordanian Dinar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'KES', label: 'KES - Kenyan Shilling' },
  { value: 'KGS', label: 'KGS - Kyrgystani Som' },
  { value: 'KHR', label: 'KHR - Cambodian Riel' },
  { value: 'KMF', label: 'KMF - Comorian Franc' },
  { value: 'KPW', label: 'KPW - North Korean Won' },
  { value: 'KRW', label: 'KRW - South Korean Won' },
  { value: 'KWD', label: 'KWD - Kuwaiti Dinar' },
  { value: 'KYD', label: 'KYD - Cayman Islands Dollar' },
  { value: 'KZT', label: 'KZT - Kazakhstani Tenge' },
  { value: 'LAK', label: 'LAK - Laotian Kip' },
  { value: 'LBP', label: 'LBP - Lebanese Pound' },
  { value: 'LKR', label: 'LKR - Sri Lankan Rupee' },
  { value: 'LRD', label: 'LRD - Liberian Dollar' },
  { value: 'LSL', label: 'LSL - Lesotho Loti' },
  { value: 'LYD', label: 'LYD - Libyan Dinar' },
  { value: 'MAD', label: 'MAD - Moroccan Dirham' },
  { value: 'MDL', label: 'MDL - Moldovan Leu' },
  { value: 'MGA', label: 'MGA - Malagasy Ariary' },
  { value: 'MKD', label: 'MKD - Macedonian Denar' },
  { value: 'MMK', label: 'MMK - Myanma Kyat' },
  { value: 'MNT', label: 'MNT - Mongolian Tugrik' },
  { value: 'MOP', label: 'MOP - Macanese Pataca' },
  { value: 'MRU', label: 'MRU - Mauritanian Ouguiya' },
  { value: 'MUR', label: 'MUR - Mauritian Rupee' },
  { value: 'MVR', label: 'MVR - Maldivian Rufiyaa' },
  { value: 'MWK', label: 'MWK - Malawian Kwacha' },
  { value: 'MXN', label: 'MXN - Mexican Peso' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
  { value: 'MZN', label: 'MZN - Mozambican Metical' },
  { value: 'NAD', label: 'NAD - Namibian Dollar' },
  { value: 'NGN', label: 'NGN - Nigerian Naira' },
  { value: 'NIO', label: 'NIO - Nicaraguan Córdoba' },
  { value: 'NOK', label: 'NOK - Norwegian Krone' },
  { value: 'NPR', label: 'NPR - Nepalese Rupee' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar' },
  { value: 'OMR', label: 'OMR - Omani Rial' },
  { value: 'PAB', label: 'PAB - Panamanian Balboa' },
  { value: 'PEN', label: 'PEN - Peruvian Nuevo Sol' },
  { value: 'PGK', label: 'PGK - Papua New Guinean Kina' },
  { value: 'PHP', label: 'PHP - Philippine Peso' },
  { value: 'PKR', label: 'PKR - Pakistani Rupee' },
  { value: 'PLN', label: 'PLN - Polish Zloty' },
  { value: 'PYG', label: 'PYG - Paraguayan Guarani' },
  { value: 'QAR', label: 'QAR - Qatari Rial' },
  { value: 'RON', label: 'RON - Romanian Leu' },
  { value: 'RSD', label: 'RSD - Serbian Dinar' },
  { value: 'RUB', label: 'RUB - Russian Ruble' },
  { value: 'RWF', label: 'RWF - Rwandan Franc' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
  { value: 'SBD', label: 'SBD - Solomon Islands Dollar' },
  { value: 'SCR', label: 'SCR - Seychellois Rupee' },
  { value: 'SDG', label: 'SDG - Sudanese Pound' },
  { value: 'SEK', label: 'SEK - Swedish Krona' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'SHP', label: 'SHP - Saint Helena Pound' },
  { value: 'SLL', label: 'SLL - Sierra Leonean Leone' },
  { value: 'SOS', label: 'SOS - Somali Shilling' },
  { value: 'SRD', label: 'SRD - Surinamese Dollar' },
  { value: 'SSP', label: 'SSP - South Sudanese Pound' },
  { value: 'STD', label: 'STD - São Tomé and Príncipe Dobra' },
  { value: 'SVC', label: 'SVC - Salvadoran Colón' },
  { value: 'SYP', label: 'SYP - Syrian Pound' },
  { value: 'SZL', label: 'SZL - Swazi Lilangeni' },
  { value: 'THB', label: 'THB - Thai Baht' },
  { value: 'TJS', label: 'TJS - Tajikistani Somoni' },
  { value: 'TMT', label: 'TMT - Turkmenistani Manat' },
  { value: 'TND', label: 'TND - Tunisian Dinar' },
  { value: 'TOP', label: 'TOP - Tongan Paʻanga' },
  { value: 'TRY', label: 'TRY - Turkish Lira' },
  { value: 'TTD', label: 'TTD - Trinidad and Tobago Dollar' },
  { value: 'TWD', label: 'TWD - New Taiwan Dollar' },
  { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
  { value: 'UAH', label: 'UAH - Ukrainian Hryvnia' },
  { value: 'UGX', label: 'UGX - Ugandan Shilling' },
  { value: 'USD', label: 'USD - United States Dollar' },
  { value: 'UYU', label: 'UYU - Uruguayan Peso' },
  { value: 'UZS', label: 'UZS - Uzbekistan Som' },
  { value: 'VEF', label: 'VEF - Venezuelan Bolívar Fuerte' },
  { value: 'VND', label: 'VND - Vietnamese Dong' },
  { value: 'VUV', label: 'VUV - Vanuatu Vatu' },
  { value: 'WST', label: 'WST - Samoan Tala' },
  { value: 'XAF', label: 'XAF - CFA Franc BEAC' },
  { value: 'XAG', label: 'XAG - Silver Ounce' },
  { value: 'XAU', label: 'XAU - Gold Ounce' },
  { value: 'XCD', label: 'XCD - East Caribbean Dollar' },
  { value: 'XDR', label: 'XDR - Special Drawing Rights' },
  { value: 'XOF', label: 'XOF - CFA Franc BCEAO' },
  { value: 'XPD', label: 'XPD - Palladium Ounce' },
  { value: 'XPF', label: 'XPF - CFP Franc' },
  { value: 'XPT', label: 'XPT - Platinum Ounce' },
  { value: 'YER', label: 'YER - Yemeni Rial' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
  { value: 'ZMW', label: 'ZMW - Zambian Kwacha' },
  { value: 'ZWL', label: 'ZWL - Zimbabwean Dollar' }
]


// PSP Provider Options
export const pspProviderOptions = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'square', label: 'Square' },
  { value: 'braintree', label: 'Braintree' },
  { value: 'adyen', label: 'Adyen' },
  { value: 'authorize', label: 'Authorize.Net' },
  { value: 'worldpay', label: 'Worldpay' },
  { value: 'mollie', label: 'Mollie' },
  { value: 'checkout', label: 'Checkout.com' },
  { value: 'other', label: 'Other' }
]
