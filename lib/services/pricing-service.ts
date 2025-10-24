import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  PricingPlan,
  CreatePricingPlanInput,
  UpdatePricingPlanInput,
  DEFAULT_PLAN_FEATURES
} from '@/types/pricing'

/**
 * Pricing Service
 * Manage pricing plans in Firestore
 */
export const pricingService = {
  /**
   * Get all pricing plans (active only by default)
   */
  async getAllPlans(includeInactive = false): Promise<PricingPlan[]> {
    try {
      let q = query(
        collection(db, 'pricing_plans'),
        orderBy('sortOrder', 'asc')
      )

      if (!includeInactive) {
        q = query(
          collection(db, 'pricing_plans'),
          where('status', '==', 'active'),
          orderBy('sortOrder', 'asc')
        )
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as PricingPlan))
    } catch (error) {
      console.error('Error getting pricing plans:', error)
      throw error
    }
  },

  /**
   * Get single pricing plan by ID
   */
  async getPlan(planId: string): Promise<PricingPlan | null> {
    try {
      const docRef = doc(db, 'pricing_plans', planId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return null

      return {
        ...docSnap.data(),
        id: docSnap.id
      } as PricingPlan
    } catch (error) {
      console.error('Error getting pricing plan:', error)
      throw error
    }
  },

  /**
   * Create new pricing plan
   */
  async createPlan(
    data: CreatePricingPlanInput,
    createdBy: string
  ): Promise<string> {
    try {
      const now = Timestamp.now()

      const plan: Omit<PricingPlan, 'id'> = {
        name: data.name,
        description: data.description || '',
        price: data.price,
        yearlyPrice: data.yearlyPrice,
        billingPeriod: data.billingPeriod,
        features: data.features,
        trialDays: data.trialDays,
        isPopular: data.isPopular || false,
        sortOrder: data.sortOrder || 0,
        badgeColor: data.badgeColor || '#8b5cf6',
        status: 'active',
        createdAt: now,
        updatedAt: now,
        createdBy
      }

      const docRef = await addDoc(collection(db, 'pricing_plans'), plan)
      return docRef.id
    } catch (error) {
      console.error('Error creating pricing plan:', error)
      throw error
    }
  },

  /**
   * Update pricing plan
   */
  async updatePlan(
    planId: string,
    data: UpdatePricingPlanInput
  ): Promise<void> {
    try {
      const docRef = doc(db, 'pricing_plans', planId)

      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error updating pricing plan:', error)
      throw error
    }
  },

  /**
   * Delete pricing plan (soft delete - set status to archived)
   */
  async deletePlan(planId: string): Promise<void> {
    try {
      await this.updatePlan(planId, {
        status: 'archived'
      })
    } catch (error) {
      console.error('Error deleting pricing plan:', error)
      throw error
    }
  },

  /**
   * Hard delete pricing plan (permanent)
   */
  async hardDeletePlan(planId: string): Promise<void> {
    try {
      const docRef = doc(db, 'pricing_plans', planId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error hard deleting pricing plan:', error)
      throw error
    }
  },

  /**
   * Reorder pricing plans
   */
  async reorderPlans(planIds: string[]): Promise<void> {
    try {
      const updates = planIds.map((planId, index) =>
        this.updatePlan(planId, { sortOrder: index })
      )

      await Promise.all(updates)
    } catch (error) {
      console.error('Error reordering plans:', error)
      throw error
    }
  },

  /**
   * Seed initial pricing plans (run once during setup)
   */
  async seedDefaultPlans(createdBy: string): Promise<void> {
    try {
      const existingPlans = await this.getAllPlans(true)

      if (existingPlans.length > 0) {
        console.log('Pricing plans already exist, skipping seed')
        return
      }

      // Create default plans
      const plans: CreatePricingPlanInput[] = [
        {
          name: 'Free',
          description: 'Perfect for testing and small teams',
          price: 0,
          billingPeriod: 'monthly',
          features: DEFAULT_PLAN_FEATURES.free,
          trialDays: 0, // No trial for free plan
          sortOrder: 0,
          badgeColor: '#6b7280'
        },
        {
          name: 'Starter',
          description: 'For growing businesses',
          price: 49,
          yearlyPrice: 490, // ~2 months free
          billingPeriod: 'monthly',
          features: DEFAULT_PLAN_FEATURES.starter,
          trialDays: 14,
          isPopular: true,
          sortOrder: 1,
          badgeColor: '#8b5cf6'
        },
        {
          name: 'Growth',
          description: 'For established companies',
          price: 199,
          yearlyPrice: 1990,
          billingPeriod: 'monthly',
          features: DEFAULT_PLAN_FEATURES.growth,
          trialDays: 14,
          sortOrder: 2,
          badgeColor: '#3b82f6'
        },
        {
          name: 'Enterprise',
          description: 'Unlimited everything',
          price: 999,
          yearlyPrice: 9990,
          billingPeriod: 'monthly',
          features: DEFAULT_PLAN_FEATURES.enterprise,
          trialDays: 30,
          sortOrder: 3,
          badgeColor: '#f59e0b'
        }
      ]

      for (const plan of plans) {
        await this.createPlan(plan, createdBy)
      }

      console.log('✅ Default pricing plans seeded successfully')
    } catch (error) {
      console.error('Error seeding pricing plans:', error)
      throw error
    }
  }
}
