import { db, auth } from '@/lib/firebase'
import {
  collection,
  query,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  where,
  orderBy,
  setDoc,
  limit as firestoreLimit
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Tenant, User } from '@/types'

// ===========================================
// TYPES
// ===========================================

export interface TenantFeatures {
  clients: boolean
  projects: boolean
  finance: boolean
  candidates: boolean
  courses: boolean
  maxUsers: number
  maxClients: number
  maxProjects: number
  storage: number // in GB
}

export interface TenantSubscription {
  plan: 'free' | 'starter' | 'growth' | 'enterprise'
  status: 'trial' | 'active' | 'suspended' | 'cancelled'
  seats: number
  seatsUsed: number
  billingEmail: string
  trialEndsAt?: any
  currentPeriodStart: any
  currentPeriodEnd: any
}

// ===========================================
// SUPERADMIN SERVICE
// ===========================================

export const superadminService = {
  // ============= TENANTS =============

  /**
   * Get all tenants
   */
  async getAllTenants(): Promise<Tenant[]> {
    try {
      const q = query(collection(db, 'tenants'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Tenant))
    } catch (error) {
      console.error('Error getting tenants:', error)
      throw error
    }
  },

  /**
   * Get single tenant by ID
   */
  async getTenant(tenantId: string): Promise<Tenant | null> {
    try {
      const docRef = doc(db, 'tenants', tenantId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } as Tenant : null
    } catch (error) {
      console.error('Error getting tenant:', error)
      throw error
    }
  },

  /**
   * Create new tenant
   */
  async createTenant(data: {
    name: string
    legalName?: string
    slug: string
    logo?: string
    domain?: string
    plan: 'free' | 'starter' | 'growth' | 'enterprise'
    billingEmail: string
    createdBy: string
  }): Promise<string> {
    try {
      const features = this.getFeaturesForPlan(data.plan)
      const now = Timestamp.now()
      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + 14) // 14 days trial
      const periodEnd = new Date()
      periodEnd.setDate(periodEnd.getDate() + 30) // 30 days period

      const tenant = {
        name: data.name,
        legalName: data.legalName || data.name,
        slug: data.slug,
        logo: data.logo || null,
        domain: data.domain || null,
        subscription: {
          plan: data.plan,
          status: 'trial',
          seats: features.maxUsers,
          seatsUsed: 0,
          billingEmail: data.billingEmail,
          trialEndsAt: Timestamp.fromDate(trialEnd),
          currentPeriodStart: now,
          currentPeriodEnd: Timestamp.fromDate(periodEnd)
        },
        features,
        settings: {
          timezone: 'UTC',
          currency: 'USD',
          language: 'en',
          dateFormat: 'MM/DD/YYYY'
        },
        createdBy: data.createdBy,
        createdAt: now,
        updatedAt: now,
        status: 'active'
      }

      const docRef = await addDoc(collection(db, 'tenants'), tenant)

      // Log action
      await this.logAction('tenant_created', data.createdBy, {
        tenantId: docRef.id,
        tenantName: data.name,
        plan: data.plan
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating tenant:', error)
      throw error
    }
  },

  /**
   * Update tenant
   */
  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<void> {
    try {
      await updateDoc(doc(db, 'tenants', tenantId), {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error updating tenant:', error)
      throw error
    }
  },

  /**
   * Suspend tenant
   */
  async suspendTenant(tenantId: string, reason: string, performedBy: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'tenants', tenantId), {
        status: 'suspended',
        'subscription.status': 'suspended',
        updatedAt: Timestamp.now()
      })

      await this.logAction('tenant_suspended', performedBy, {
        tenantId,
        reason
      })
    } catch (error) {
      console.error('Error suspending tenant:', error)
      throw error
    }
  },

  /**
   * Reactivate tenant
   */
  async reactivateTenant(tenantId: string, performedBy: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'tenants', tenantId), {
        status: 'active',
        'subscription.status': 'active',
        updatedAt: Timestamp.now()
      })

      await this.logAction('tenant_reactivated', performedBy, {
        tenantId
      })
    } catch (error) {
      console.error('Error reactivating tenant:', error)
      throw error
    }
  },

  /**
   * Delete tenant (soft delete)
   */
  async deleteTenant(tenantId: string, performedBy: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'tenants', tenantId), {
        status: 'cancelled',
        'subscription.status': 'cancelled',
        updatedAt: Timestamp.now()
      })

      await this.logAction('tenant_deleted', performedBy, {
        tenantId
      })
    } catch (error) {
      console.error('Error deleting tenant:', error)
      throw error
    }
  },

  // ============= USERS =============

  /**
   * Get all users (optionally filtered by tenant)
   */
  async getAllUsers(tenantId?: string): Promise<User[]> {
    try {
      let q
      if (tenantId) {
        q = query(
          collection(db, 'users'),
          where('tenantId', '==', tenantId),
          orderBy('createdAt', 'desc')
        )
      } else {
        q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      }
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User))
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  },

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } as User : null
    } catch (error) {
      console.error('Error getting user:', error)
      throw error
    }
  },

  /**
   * Create tenant admin (first user for a new tenant)
   */
  async createTenantAdmin(data: {
    email: string
    password: string
    name: string
    tenantId: string
    createdBy: string
  }): Promise<string> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      // Create Firestore user document
      const newUser = {
        id: userCredential.user.uid,
        email: data.email,
        name: data.name,
        role: 'admin',
        tenantId: data.tenantId,
        isSuperAdmin: false,
        portalAccess: ['admin', 'employee'],
        permissions: ['all.read', 'all.write'],
        department: 'Management',
        status: 'active',
        avatar: null,
        phone: null,
        createdAt: Timestamp.now(),
        lastLogin: null
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser)

      // Update tenant seats
      const tenant = await this.getTenant(data.tenantId)
      if (tenant) {
        await updateDoc(doc(db, 'tenants', data.tenantId), {
          'subscription.seatsUsed': (tenant.subscription.seatsUsed || 0) + 1,
          updatedAt: Timestamp.now()
        })
      }

      // Log action
      await this.logAction('admin_created', data.createdBy, {
        tenantId: data.tenantId,
        userId: userCredential.user.uid,
        userEmail: data.email
      })

      return userCredential.user.uid
    } catch (error) {
      console.error('Error creating tenant admin:', error)
      throw error
    }
  },

  /**
   * Update user
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), updates)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  /**
   * Suspend user
   */
  async suspendUser(userId: string, performedBy: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'suspended'
      })

      await this.logAction('user_suspended', performedBy, {
        userId
      })
    } catch (error) {
      console.error('Error suspending user:', error)
      throw error
    }
  },

  // ============= UTILITIES =============

  /**
   * Get features for a specific plan
   */
  getFeaturesForPlan(plan: string): TenantFeatures {
    const plans: Record<string, TenantFeatures> = {
      free: {
        clients: true,
        projects: true,
        finance: false,
        candidates: false,
        courses: false,
        maxUsers: 3,
        maxClients: 10,
        maxProjects: 5,
        storage: 1
      },
      starter: {
        clients: true,
        projects: true,
        finance: true,
        candidates: false,
        courses: false,
        maxUsers: 10,
        maxClients: 50,
        maxProjects: 25,
        storage: 10
      },
      growth: {
        clients: true,
        projects: true,
        finance: true,
        candidates: true,
        courses: true,
        maxUsers: 50,
        maxClients: 500,
        maxProjects: 100,
        storage: 100
      },
      enterprise: {
        clients: true,
        projects: true,
        finance: true,
        candidates: true,
        courses: true,
        maxUsers: 999,
        maxClients: 99999,
        maxProjects: 99999,
        storage: 1000
      }
    }
    return plans[plan] || plans.free
  },

  /**
   * Log system action for audit trail
   */
  async logAction(action: string, userId: string, metadata: any): Promise<void> {
    try {
      // Get user name
      const user = await this.getUser(userId)

      await addDoc(collection(db, 'system_logs'), {
        action,
        performedBy: userId,
        performedByName: user?.name || 'Unknown',
        metadata,
        timestamp: Timestamp.now()
      })
    } catch (error) {
      console.error('Error logging action:', error)
      // Don't throw - logging should not break the main flow
    }
  },

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<{
    totalTenants: number
    activeTenants: number
    suspendedTenants: number
    totalUsers: number
    mrr: number
  }> {
    try {
      const tenants = await this.getAllTenants()
      const users = await this.getAllUsers()

      const stats = {
        totalTenants: tenants.length,
        activeTenants: tenants.filter(t => t.status === 'active').length,
        suspendedTenants: tenants.filter(t => t.status === 'suspended').length,
        totalUsers: users.length,
        mrr: this.calculateMRR(tenants)
      }

      return stats
    } catch (error) {
      console.error('Error getting system stats:', error)
      throw error
    }
  },

  /**
   * Calculate Monthly Recurring Revenue
   */
  calculateMRR(tenants: Tenant[]): number {
    const pricing = {
      free: 0,
      starter: 49,
      growth: 199,
      enterprise: 999
    }

    return tenants
      .filter(t => t.status === 'active' && t.subscription.status !== 'trial')
      .reduce((sum, tenant) => {
        return sum + (pricing[tenant.subscription.plan] || 0)
      }, 0)
  }
}
