import { Timestamp } from 'firebase/firestore'

/**
 * Pricing Plan Type Definitions
 */

export type BillingPeriod = 'monthly' | 'yearly'
export type PlanStatus = 'active' | 'inactive' | 'archived'

export interface PricingPlan {
  id: string
  name: string
  description?: string
  price: number // Monthly price in USD
  yearlyPrice?: number // Optional yearly pricing
  billingPeriod: BillingPeriod

  // Feature Limits
  features: PlanFeatures

  // Trial Configuration
  trialDays: number // Default trial duration for this plan

  // Display & Ordering
  isPopular?: boolean
  sortOrder: number
  badgeColor?: string // For UI badge styling
  status: PlanStatus

  // Stripe Integration (future)
  stripePriceId?: string
  stripeYearlyPriceId?: string

  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy?: string
}

export interface PlanFeatures {
  // Core Limits
  maxUsers: number // -1 for unlimited
  maxClients: number
  maxProjects: number
  maxStorage: number // In GB

  // Advanced Features
  customDomain: boolean
  apiAccess: boolean
  advancedReports: boolean
  prioritySupport: boolean
  whiteLabel: boolean

  // Module Access
  modules: {
    crm: boolean
    projects: boolean
    finance: boolean
    hr: boolean
    timeTracking: boolean
    inventory: boolean
  }
}

/**
 * Create Pricing Plan Input (for forms)
 */
export interface CreatePricingPlanInput {
  name: string
  description?: string
  price: number
  yearlyPrice?: number
  billingPeriod: BillingPeriod
  features: PlanFeatures
  trialDays: number
  isPopular?: boolean
  sortOrder?: number
  badgeColor?: string
}

/**
 * Update Pricing Plan Input
 */
export interface UpdatePricingPlanInput extends Partial<CreatePricingPlanInput> {
  status?: PlanStatus
}

/**
 * Default Plan Presets
 */
export const DEFAULT_PLAN_FEATURES: Record<string, PlanFeatures> = {
  free: {
    maxUsers: 2,
    maxClients: 10,
    maxProjects: 3,
    maxStorage: 1,
    customDomain: false,
    apiAccess: false,
    advancedReports: false,
    prioritySupport: false,
    whiteLabel: false,
    modules: {
      crm: true,
      projects: true,
      finance: false,
      hr: false,
      timeTracking: false,
      inventory: false
    }
  },
  starter: {
    maxUsers: 10,
    maxClients: 50,
    maxProjects: 25,
    maxStorage: 10,
    customDomain: false,
    apiAccess: true,
    advancedReports: false,
    prioritySupport: false,
    whiteLabel: false,
    modules: {
      crm: true,
      projects: true,
      finance: true,
      hr: false,
      timeTracking: true,
      inventory: false
    }
  },
  growth: {
    maxUsers: 50,
    maxClients: 500,
    maxProjects: 100,
    maxStorage: 100,
    customDomain: true,
    apiAccess: true,
    advancedReports: true,
    prioritySupport: true,
    whiteLabel: false,
    modules: {
      crm: true,
      projects: true,
      finance: true,
      hr: true,
      timeTracking: true,
      inventory: true
    }
  },
  enterprise: {
    maxUsers: -1, // Unlimited
    maxClients: -1,
    maxProjects: -1,
    maxStorage: 1000,
    customDomain: true,
    apiAccess: true,
    advancedReports: true,
    prioritySupport: true,
    whiteLabel: true,
    modules: {
      crm: true,
      projects: true,
      finance: true,
      hr: true,
      timeTracking: true,
      inventory: true
    }
  }
}
