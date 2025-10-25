import { db, auth } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
  orderBy as firestoreOrderBy
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { User, UserRole, Department } from '@/types'
import { ROLE_PERMISSIONS, PermissionKey } from './permissions-service'

// ===========================================
// USER SERVICE
// ===========================================

export class UserService {
  /**
   * Get all users for a tenant
   */
  static async getUsers(tenantId: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('tenantId', '==', tenantId)
      )

      const snapshot = await getDocs(q)
      const users = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as User))

      // Sort in memory to avoid composite index
      return users.sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() :
                      a.createdAt?.toMillis?.() || 0
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() :
                      b.createdAt?.toMillis?.() || 0
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  }

  /**
   * Get single user by ID
   */
  static async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } as User : null
    } catch (error) {
      console.error('Error getting user:', error)
      throw error
    }
  }

  /**
   * Create new user (requires secondary auth to avoid logging out current user)
   */
  static async createUser(data: {
    email: string
    password: string
    name: string
    role: UserRole
    tenantId: string
    department?: Department
    permissions?: PermissionKey[]
    portalAccess?: string[]
    createdBy: string
  }): Promise<string> {
    try {
      // Dynamically import secondary auth
      const { getSecondaryAuth } = await import('@/lib/firebase')
      const secondaryAuth = getSecondaryAuth()

      if (!secondaryAuth) {
        throw new Error('Secondary auth not available')
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        data.email,
        data.password
      )

      // Sign out from secondary auth
      await signOut(secondaryAuth)

      // Determine default permissions if not provided
      const permissions = data.permissions || ROLE_PERMISSIONS[data.role] || []

      // Determine default portal access if not provided
      let portalAccess = data.portalAccess || []
      if (portalAccess.length === 0) {
        switch (data.role) {
          case 'admin':
          case 'manager':
            portalAccess = ['admin', 'employee']
            break
          case 'employee':
            portalAccess = ['employee']
            break
          case 'client':
            portalAccess = ['client']
            break
          case 'candidate':
            portalAccess = ['candidate']
            break
          default:
            portalAccess = ['employee']
        }
      }

      // Create Firestore user document
      const newUser = {
        id: userCredential.user.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        tenantId: data.tenantId,
        department: data.department || null,
        permissions,
        portalAccess,
        isSuperAdmin: false,
        status: 'active',
        avatar: null,
        phone: null,
        photoURL: null,
        createdAt: Timestamp.now(),
        lastLogin: null
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser)

      return userCredential.user.uid
    } catch (error: any) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  /**
   * Update user
   */
  static async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId)

      // Remove undefined values and id field
      const cleanUpdates: any = {}
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          cleanUpdates[key] = value
        }
      })

      await updateDoc(docRef, cleanUpdates)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  /**
   * Update user role and permissions
   */
  static async updateUserRole(
    userId: string,
    role: UserRole,
    customPermissions?: PermissionKey[]
  ): Promise<void> {
    try {
      const permissions = customPermissions || ROLE_PERMISSIONS[role] || []

      await this.updateUser(userId, {
        role,
        permissions
      })
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  /**
   * Update user permissions
   */
  static async updateUserPermissions(
    userId: string,
    permissions: PermissionKey[]
  ): Promise<void> {
    try {
      await this.updateUser(userId, { permissions })
    } catch (error) {
      console.error('Error updating user permissions:', error)
      throw error
    }
  }

  /**
   * Suspend user
   */
  static async suspendUser(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, { status: 'suspended' })
    } catch (error) {
      console.error('Error suspending user:', error)
      throw error
    }
  }

  /**
   * Activate user
   */
  static async activateUser(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, { status: 'active' })
    } catch (error) {
      console.error('Error activating user:', error)
      throw error
    }
  }

  /**
   * Delete user (soft delete by setting status)
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await this.updateUser(userId, { status: 'deleted' })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  /**
   * Hard delete user (remove from database - use with caution)
   */
  static async hardDeleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId))
    } catch (error) {
      console.error('Error hard deleting user:', error)
      throw error
    }
  }

  /**
   * Search users by name or email
   */
  static async searchUsers(
    tenantId: string,
    searchTerm: string
  ): Promise<User[]> {
    try {
      const users = await this.getUsers(tenantId)

      if (!searchTerm.trim()) {
        return users
      }

      const term = searchTerm.toLowerCase()
      return users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      )
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }

  /**
   * Filter users by role
   */
  static async filterUsersByRole(
    tenantId: string,
    role: UserRole
  ): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('tenantId', '==', tenantId),
        where('role', '==', role)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as User))
    } catch (error) {
      console.error('Error filtering users by role:', error)
      throw error
    }
  }

  /**
   * Get user statistics for a tenant
   */
  static async getUserStats(tenantId: string): Promise<{
    total: number
    active: number
    suspended: number
    inactive: number
    byRole: Record<UserRole, number>
    byDepartment: Record<string, number>
  }> {
    try {
      const users = await this.getUsers(tenantId)

      const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        inactive: users.filter(u => !u.lastLogin).length,
        byRole: {} as Record<UserRole, number>,
        byDepartment: {} as Record<string, number>
      }

      // Count by role
      users.forEach(user => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1
      })

      // Count by department
      users.forEach(user => {
        if (user.department) {
          stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1
        }
      })

      return stats
    } catch (error) {
      console.error('Error getting user stats:', error)
      throw error
    }
  }

  /**
   * Bulk suspend users
   */
  static async bulkSuspendUsers(userIds: string[]): Promise<void> {
    try {
      await Promise.all(userIds.map(id => this.suspendUser(id)))
    } catch (error) {
      console.error('Error bulk suspending users:', error)
      throw error
    }
  }

  /**
   * Bulk activate users
   */
  static async bulkActivateUsers(userIds: string[]): Promise<void> {
    try {
      await Promise.all(userIds.map(id => this.activateUser(id)))
    } catch (error) {
      console.error('Error bulk activating users:', error)
      throw error
    }
  }

  /**
   * Bulk delete users
   */
  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    try {
      await Promise.all(userIds.map(id => this.deleteUser(id)))
    } catch (error) {
      console.error('Error bulk deleting users:', error)
      throw error
    }
  }

  /**
   * Update user portal access
   */
  static async updateUserPortalAccess(
    userId: string,
    portalAccess: string[]
  ): Promise<void> {
    try {
      await this.updateUser(userId, { portalAccess })
    } catch (error) {
      console.error('Error updating user portal access:', error)
      throw error
    }
  }
}

// Export convenience instance
export const userService = UserService
