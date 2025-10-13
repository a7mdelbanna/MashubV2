// ==========================================
// SETTINGS DATA MANAGEMENT
// For managing configurable data (tags, categories, statuses, etc.)
// ==========================================

import { SettingsItem } from '@/components/settings/SettingsItemList'

// ==========================================
// LOCAL STORAGE KEYS
// ==========================================

export const STORAGE_KEYS = {
  // Module Settings
  PROJECT_STATUSES: 'settings_project_statuses',
  PROJECT_PRIORITIES: 'settings_project_priorities',
  PROJECT_TAGS: 'settings_project_tags',
  TASK_TYPES: 'settings_task_types',

  SERVICE_CATEGORIES: 'settings_service_categories',
  SERVICE_TAGS: 'settings_service_tags',
  SERVICE_TYPES: 'settings_service_types',
  PRICING_MODELS: 'settings_pricing_models',

  PRODUCT_CATEGORIES: 'settings_product_categories',
  PRODUCT_TAGS: 'settings_product_tags',
  PRODUCT_BRANDS: 'settings_product_brands',
  PRODUCT_UNITS: 'settings_product_units',

  CLIENT_SOURCES: 'settings_client_sources',
  CLIENT_TAGS: 'settings_client_tags',
  CLIENT_INDUSTRIES: 'settings_client_industries',
  CLIENT_STAGES: 'settings_client_stages',

  CANDIDATE_SOURCES: 'settings_candidate_sources',
  CANDIDATE_SKILLS: 'settings_candidate_skills',
  JOB_POSITIONS: 'settings_job_positions',
  INTERVIEW_TYPES: 'settings_interview_types',
  HIRING_STAGES: 'settings_hiring_stages',

  COURSE_CATEGORIES: 'settings_course_categories',
  COURSE_DIFFICULTY_LEVELS: 'settings_course_difficulty_levels',
  COURSE_CONTENT_TYPES: 'settings_course_content_types',

  TICKET_CATEGORIES: 'settings_ticket_categories',
  TICKET_PRIORITIES: 'settings_ticket_priorities',
  TICKET_TYPES: 'settings_ticket_types',
  ARTICLE_CATEGORIES: 'settings_article_categories',

  INVOICE_PAYMENT_TERMS: 'settings_invoice_payment_terms',
  INVOICE_DISCOUNT_TYPES: 'settings_invoice_discount_types',

  VISIT_TYPES: 'settings_visit_types',
  VISIT_PURPOSES: 'settings_visit_purposes',
  VISIT_OUTCOMES: 'settings_visit_outcomes',

  // Global Settings
  GLOBAL_TAGS: 'settings_global_tags',
  CUSTOM_FIELDS: 'settings_custom_fields',
  EMAIL_TEMPLATES: 'settings_email_templates'
} as const

// ==========================================
// DEFAULT DATA
// ==========================================

export const DEFAULT_SETTINGS = {
  // Project Settings
  projectStatuses: [
    { id: '1', name: 'Draft', slug: 'draft', color: '#6b7280', isActive: true, isDefault: true },
    { id: '2', name: 'Planning', slug: 'planning', color: '#3b82f6', isActive: true, isDefault: true },
    { id: '3', name: 'In Progress', slug: 'in_progress', color: '#8b5cf6', isActive: true, isDefault: true },
    { id: '4', name: 'On Hold', slug: 'on_hold', color: '#f59e0b', isActive: true, isDefault: true },
    { id: '5', name: 'Completed', slug: 'completed', color: '#22c55e', isActive: true, isDefault: true },
    { id: '6', name: 'Cancelled', slug: 'cancelled', color: '#ef4444', isActive: true, isDefault: true }
  ],

  projectPriorities: [
    { id: '1', name: 'Low', slug: 'low', color: '#6b7280', isActive: true, isDefault: true },
    { id: '2', name: 'Medium', slug: 'medium', color: '#3b82f6', isActive: true, isDefault: true },
    { id: '3', name: 'High', slug: 'high', color: '#f59e0b', isActive: true, isDefault: true },
    { id: '4', name: 'Critical', slug: 'critical', color: '#ef4444', isActive: true, isDefault: true }
  ],

  projectTags: [
    { id: '1', name: 'Web Development', slug: 'web-development', color: '#6366f1', isActive: true },
    { id: '2', name: 'Mobile App', slug: 'mobile-app', color: '#8b5cf6', isActive: true },
    { id: '3', name: 'UI/UX Design', slug: 'ui-ux-design', color: '#ec4899', isActive: true },
    { id: '4', name: 'Backend', slug: 'backend', color: '#10b981', isActive: true },
    { id: '5', name: 'DevOps', slug: 'devops', color: '#f59e0b', isActive: true }
  ],

  taskTypes: [
    { id: '1', name: 'Task', slug: 'task', icon: '📋', color: '#6366f1', isActive: true, isDefault: true },
    { id: '2', name: 'Bug', slug: 'bug', icon: '🐛', color: '#ef4444', isActive: true, isDefault: true },
    { id: '3', name: 'Feature', slug: 'feature', icon: '✨', color: '#22c55e', isActive: true, isDefault: true },
    { id: '4', name: 'Epic', slug: 'epic', icon: '🎯', color: '#8b5cf6', isActive: true, isDefault: true },
    { id: '5', name: 'Story', slug: 'story', icon: '📖', color: '#3b82f6', isActive: true, isDefault: true }
  ],

  // Service Settings
  serviceCategories: [
    { id: '1', name: 'Consulting', slug: 'consulting', color: '#6366f1', isActive: true },
    { id: '2', name: 'Development', slug: 'development', color: '#8b5cf6', isActive: true },
    { id: '3', name: 'Design', slug: 'design', color: '#ec4899', isActive: true },
    { id: '4', name: 'Marketing', slug: 'marketing', color: '#f59e0b', isActive: true },
    { id: '5', name: 'Support', slug: 'support', color: '#10b981', isActive: true },
    { id: '6', name: 'Training', slug: 'training', color: '#3b82f6', isActive: true }
  ],

  serviceTags: [
    { id: '1', name: 'Monthly Subscription', slug: 'monthly-subscription', color: '#6366f1', isActive: true },
    { id: '2', name: 'One-time', slug: 'one-time', color: '#10b981', isActive: true },
    { id: '3', name: 'Premium', slug: 'premium', color: '#f59e0b', isActive: true },
    { id: '4', name: 'Enterprise', slug: 'enterprise', color: '#8b5cf6', isActive: true }
  ],

  // Product Settings
  productCategories: [
    { id: '1', name: 'Electronics', slug: 'electronics', color: '#6366f1', isActive: true },
    { id: '2', name: 'Software', slug: 'software', color: '#8b5cf6', isActive: true },
    { id: '3', name: 'Hardware', slug: 'hardware', color: '#10b981', isActive: true },
    { id: '4', name: 'Accessories', slug: 'accessories', color: '#f59e0b', isActive: true },
    { id: '5', name: 'Services', slug: 'services', color: '#3b82f6', isActive: true }
  ],

  productBrands: [
    { id: '1', name: 'Dell', slug: 'dell', isActive: true },
    { id: '2', name: 'HP', slug: 'hp', isActive: true },
    { id: '3', name: 'Lenovo', slug: 'lenovo', isActive: true },
    { id: '4', name: 'Apple', slug: 'apple', isActive: true },
    { id: '5', name: 'Microsoft', slug: 'microsoft', isActive: true }
  ],

  productUnits: [
    { id: '1', name: 'Piece', slug: 'pcs', isActive: true, isDefault: true },
    { id: '2', name: 'Kilogram', slug: 'kg', isActive: true },
    { id: '3', name: 'Liter', slug: 'l', isActive: true },
    { id: '4', name: 'Meter', slug: 'm', isActive: true },
    { id: '5', name: 'Box', slug: 'box', isActive: true }
  ],

  // Client Settings
  clientSources: [
    { id: '1', name: 'Website', slug: 'website', icon: '🌐', color: '#6366f1', isActive: true },
    { id: '2', name: 'Referral', slug: 'referral', icon: '👥', color: '#10b981', isActive: true },
    { id: '3', name: 'LinkedIn', slug: 'linkedin', icon: '💼', color: '#0077b5', isActive: true },
    { id: '4', name: 'Facebook', slug: 'facebook', icon: '📘', color: '#1877f2', isActive: true },
    { id: '5', name: 'Google Ads', slug: 'google-ads', icon: '📢', color: '#4285f4', isActive: true },
    { id: '6', name: 'Cold Call', slug: 'cold-call', icon: '📞', color: '#f59e0b', isActive: true }
  ],

  clientIndustries: [
    { id: '1', name: 'Technology', slug: 'technology', isActive: true },
    { id: '2', name: 'Healthcare', slug: 'healthcare', isActive: true },
    { id: '3', name: 'Finance', slug: 'finance', isActive: true },
    { id: '4', name: 'Retail', slug: 'retail', isActive: true },
    { id: '5', name: 'Education', slug: 'education', isActive: true },
    { id: '6', name: 'Manufacturing', slug: 'manufacturing', isActive: true }
  ],

  // Candidate Settings
  candidateSources: [
    { id: '1', name: 'LinkedIn', slug: 'linkedin', icon: '💼', color: '#0077b5', isActive: true },
    { id: '2', name: 'Indeed', slug: 'indeed', icon: '🔍', color: '#2164f3', isActive: true },
    { id: '3', name: 'Referral', slug: 'referral', icon: '👥', color: '#10b981', isActive: true },
    { id: '4', name: 'Company Website', slug: 'website', icon: '🌐', color: '#6366f1', isActive: true },
    { id: '5', name: 'Job Fair', slug: 'job-fair', icon: '🎪', color: '#f59e0b', isActive: true }
  ],

  candidateSkills: [
    { id: '1', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', isActive: true },
    { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178c6', isActive: true },
    { id: '3', name: 'React', slug: 'react', color: '#61dafb', isActive: true },
    { id: '4', name: 'Node.js', slug: 'nodejs', color: '#339933', isActive: true },
    { id: '5', name: 'Python', slug: 'python', color: '#3776ab', isActive: true },
    { id: '6', name: 'UI/UX Design', slug: 'ui-ux-design', color: '#ec4899', isActive: true }
  ],

  // Course Settings
  courseCategories: [
    { id: '1', name: 'Programming', slug: 'programming', color: '#6366f1', isActive: true },
    { id: '2', name: 'Design', slug: 'design', color: '#ec4899', isActive: true },
    { id: '3', name: 'Business', slug: 'business', color: '#f59e0b', isActive: true },
    { id: '4', name: 'Marketing', slug: 'marketing', color: '#10b981', isActive: true },
    { id: '5', name: 'Data Science', slug: 'data-science', color: '#8b5cf6', isActive: true }
  ],

  courseDifficultyLevels: [
    { id: '1', name: 'Beginner', slug: 'beginner', color: '#22c55e', isActive: true },
    { id: '2', name: 'Intermediate', slug: 'intermediate', color: '#3b82f6', isActive: true },
    { id: '3', name: 'Advanced', slug: 'advanced', color: '#f59e0b', isActive: true },
    { id: '4', name: 'Expert', slug: 'expert', color: '#ef4444', isActive: true }
  ],

  // Help/Support Settings
  ticketCategories: [
    { id: '1', name: 'Technical Issue', slug: 'technical-issue', color: '#ef4444', isActive: true },
    { id: '2', name: 'Billing Question', slug: 'billing-question', color: '#f59e0b', isActive: true },
    { id: '3', name: 'Feature Request', slug: 'feature-request', color: '#6366f1', isActive: true },
    { id: '4', name: 'Account Issue', slug: 'account-issue', color: '#8b5cf6', isActive: true },
    { id: '5', name: 'General Inquiry', slug: 'general-inquiry', color: '#10b981', isActive: true }
  ],

  ticketPriorities: [
    { id: '1', name: 'Low', slug: 'low', color: '#6b7280', isActive: true },
    { id: '2', name: 'Normal', slug: 'normal', color: '#3b82f6', isActive: true },
    { id: '3', name: 'High', slug: 'high', color: '#f59e0b', isActive: true },
    { id: '4', name: 'Urgent', slug: 'urgent', color: '#ef4444', isActive: true }
  ],

  // Invoice Settings
  invoicePaymentTerms: [
    { id: '1', name: 'Due on Receipt', slug: 'due-on-receipt', description: 'Payment due immediately', isActive: true },
    { id: '2', name: 'Net 15', slug: 'net-15', description: 'Payment due in 15 days', isActive: true },
    { id: '3', name: 'Net 30', slug: 'net-30', description: 'Payment due in 30 days', isActive: true, isDefault: true },
    { id: '4', name: 'Net 60', slug: 'net-60', description: 'Payment due in 60 days', isActive: true },
    { id: '5', name: 'Net 90', slug: 'net-90', description: 'Payment due in 90 days', isActive: true }
  ],

  // Visit Settings
  visitTypes: [
    { id: '1', name: 'Sales Meeting', slug: 'sales-meeting', icon: '💼', color: '#6366f1', isActive: true },
    { id: '2', name: 'Support Visit', slug: 'support-visit', icon: '🛠️', color: '#10b981', isActive: true },
    { id: '3', name: 'Demo', slug: 'demo', icon: '📺', color: '#8b5cf6', isActive: true },
    { id: '4', name: 'Training', slug: 'training', icon: '📚', color: '#3b82f6', isActive: true },
    { id: '5', name: 'Consultation', slug: 'consultation', icon: '💡', color: '#f59e0b', isActive: true }
  ],

  visitPurposes: [
    { id: '1', name: 'New Business', slug: 'new-business', isActive: true },
    { id: '2', name: 'Follow-up', slug: 'follow-up', isActive: true },
    { id: '3', name: 'Issue Resolution', slug: 'issue-resolution', isActive: true },
    { id: '4', name: 'Contract Renewal', slug: 'contract-renewal', isActive: true },
    { id: '5', name: 'Feedback Collection', slug: 'feedback-collection', isActive: true }
  ]
}

// ==========================================
// STORAGE FUNCTIONS
// ==========================================

export function getSettings<T extends SettingsItem>(key: string): T[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }

    // Return default data if available
    const defaultKey = key.replace('settings_', '').replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    const defaults = (DEFAULT_SETTINGS as any)[defaultKey]

    if (defaults) {
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }

    return []
  } catch (error) {
    console.error(`Error loading settings for ${key}:`, error)
    return []
  }
}

export function saveSettings<T extends SettingsItem>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (error) {
    console.error(`Error saving settings for ${key}:`, error)
  }
}

export function addSettingsItem<T extends SettingsItem>(key: string, item: Omit<T, 'id'>): T {
  const items = getSettings<T>(key)
  const newItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString()
  } as T

  saveSettings(key, [...items, newItem])
  return newItem
}

export function updateSettingsItem<T extends SettingsItem>(key: string, id: string, updates: Partial<T>): T | null {
  const items = getSettings<T>(key)
  const index = items.findIndex(item => item.id === id)

  if (index === -1) return null

  const updatedItem = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  items[index] = updatedItem
  saveSettings(key, items)
  return updatedItem
}

export function deleteSettingsItem(key: string, id: string): boolean {
  const items = getSettings(key)
  const filtered = items.filter(item => item.id !== id)

  if (filtered.length === items.length) return false

  saveSettings(key, filtered)
  return true
}

export function toggleSettingsItemActive(key: string, id: string): boolean {
  const items = getSettings(key)
  const item = items.find(item => item.id === id)

  if (!item) return false

  return updateSettingsItem(key, id, { isActive: !item.isActive }) !== null
}

export function reorderSettings<T extends SettingsItem>(key: string, newOrder: T[]): void {
  const itemsWithOrder = newOrder.map((item, index) => ({
    ...item,
    order: index
  }))
  saveSettings(key, itemsWithOrder)
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function resetSettingsToDefaults(key: string): void {
  const defaultKey = key.replace('settings_', '').replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  const defaults = (DEFAULT_SETTINGS as any)[defaultKey]

  if (defaults) {
    saveSettings(key, defaults)
  }
}

export function exportSettings(): string {
  const allSettings: Record<string, any> = {}

  Object.values(STORAGE_KEYS).forEach(key => {
    const settings = getSettings(key)
    if (settings.length > 0) {
      allSettings[key] = settings
    }
  })

  return JSON.stringify(allSettings, null, 2)
}

export function importSettings(jsonData: string): boolean {
  try {
    const settings = JSON.parse(jsonData)

    Object.entries(settings).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        saveSettings(key, value)
      }
    })

    return true
  } catch (error) {
    console.error('Error importing settings:', error)
    return false
  }
}

// ==========================================
// GETTER FUNCTIONS (Convenience)
// ==========================================

export const getProjectStatuses = () => getSettings(STORAGE_KEYS.PROJECT_STATUSES)
export const getProjectPriorities = () => getSettings(STORAGE_KEYS.PROJECT_PRIORITIES)
export const getProjectTags = () => getSettings(STORAGE_KEYS.PROJECT_TAGS)
export const getTaskTypes = () => getSettings(STORAGE_KEYS.TASK_TYPES)

export const getServiceCategories = () => getSettings(STORAGE_KEYS.SERVICE_CATEGORIES)
export const getServiceTags = () => getSettings(STORAGE_KEYS.SERVICE_TAGS)

export const getProductCategories = () => getSettings(STORAGE_KEYS.PRODUCT_CATEGORIES)
export const getProductTags = () => getSettings(STORAGE_KEYS.PRODUCT_TAGS)
export const getProductBrands = () => getSettings(STORAGE_KEYS.PRODUCT_BRANDS)

export const getClientSources = () => getSettings(STORAGE_KEYS.CLIENT_SOURCES)
export const getClientIndustries = () => getSettings(STORAGE_KEYS.CLIENT_INDUSTRIES)
export const getClientTags = () => getSettings(STORAGE_KEYS.CLIENT_TAGS)

export const getCandidateSources = () => getSettings(STORAGE_KEYS.CANDIDATE_SOURCES)
export const getCandidateSkills = () => getSettings(STORAGE_KEYS.CANDIDATE_SKILLS)

export const getCourseCategories = () => getSettings(STORAGE_KEYS.COURSE_CATEGORIES)
export const getCourseDifficultyLevels = () => getSettings(STORAGE_KEYS.COURSE_DIFFICULTY_LEVELS)

export const getTicketCategories = () => getSettings(STORAGE_KEYS.TICKET_CATEGORIES)
export const getTicketPriorities = () => getSettings(STORAGE_KEYS.TICKET_PRIORITIES)

export const getInvoicePaymentTerms = () => getSettings(STORAGE_KEYS.INVOICE_PAYMENT_TERMS)

export const getVisitTypes = () => getSettings(STORAGE_KEYS.VISIT_TYPES)
export const getVisitPurposes = () => getSettings(STORAGE_KEYS.VISIT_PURPOSES)
